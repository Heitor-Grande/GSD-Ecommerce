import { NextRequest } from "next/server";
import { consultarBancoDados } from "@/services/database";
import { validarCodigoNumerico } from "@/utils/codigos";
import { criarHash } from "@/utils/criptografia";
import { obterPayloadVerificacaoCadastroContaJWT } from "@/utils/jwt";
import { normalizarSomenteDigitos } from "@/utils/normalizadores";
import { verificarRateLimitPorIp } from "@/utils/rateLimit";
import { criarRespostaApi } from "@/utils/respostaApi";
import {
    validarComplexidadeSenha,
    validarDataNascimento,
    validarEmail,
    validarStringComConteudo,
} from "@/utils/validacoes";

type CadastroContaBody = {
    nome?: unknown;
    documento?: unknown;
    dataNascimento?: unknown;
    celular?: unknown;
    email?: unknown;
    senha?: unknown;
    confirmarSenha?: unknown;
    tokenVerificacao?: unknown;
    codigoVerificacao?: unknown;
};

type RegistroId = {
    id: number;
};

const ERRO_PERFIL_CLIENTE_NAO_ENCONTRADO = "PERFIL_CLIENTE_NAO_ENCONTRADO";
const ERRO_EMPRESA_NAO_ENCONTRADA = "EMPRESA_NAO_ENCONTRADA";

/** Cadastra publicamente um cliente e cria seu vínculo com a empresa da loja. */
export async function POST(request: NextRequest) {
    try {
        const respostaRateLimit = verificarRateLimitPorIp({
            request: request,
            identificador: "cadastro-conta-cliente",
            limite: 5,
            janelaMs: 60 * 60 * 1000,
        });

        if (respostaRateLimit) {
            return respostaRateLimit;
        }

        const body = await request.json() as CadastroContaBody;
        const nome = validarStringComConteudo(body.nome) ? body.nome.trim() : "";
        const email = validarStringComConteudo(body.email) ? body.email.trim().toLowerCase() : "";
        const senha = validarStringComConteudo(body.senha) ? body.senha : "";
        const confirmarSenha = validarStringComConteudo(body.confirmarSenha) ? body.confirmarSenha : "";
        const tokenVerificacao = validarStringComConteudo(body.tokenVerificacao)
            ? body.tokenVerificacao
            : "";
        const codigoVerificacao = validarStringComConteudo(body.codigoVerificacao)
            ? body.codigoVerificacao.trim()
            : "";
        const dataNascimento = validarStringComConteudo(body.dataNascimento)
            ? body.dataNascimento.trim()
            : "";
        const documento = normalizarSomenteDigitos(body.documento);
        const celular = normalizarSomenteDigitos(body.celular);

        if (!nome || nome.length > 120) {
            return criarRespostaApi(false, "Informe um nome válido com até 120 caracteres.", null, 400);
        }

        if (!validarEmail(email) || email.length > 180) {
            return criarRespostaApi(false, "Informe um e-mail válido.", null, 400);
        }

        if (documento.length !== 11 && documento.length !== 14) {
            return criarRespostaApi(false, "Informe um CPF ou CNPJ completo.", null, 400);
        }

        if (celular.length !== 11) {
            return criarRespostaApi(false, "Informe um número de celular com DDD.", null, 400);
        }

        if (!validarDataNascimento(dataNascimento)) {
            return criarRespostaApi(false, "Informe uma data de nascimento válida.", null, 400);
        }

        const resultadoValidacaoSenha = validarComplexidadeSenha(senha);

        if (!resultadoValidacaoSenha.valida) {
            return criarRespostaApi(false, resultadoValidacaoSenha.mensagem, null, 400);
        }

        if (senha !== confirmarSenha) {
            return criarRespostaApi(false, "A confirmação da senha deve ser igual à senha.", null, 400);
        }

        if (!validarCodigoNumerico(codigoVerificacao, 5)) {
            return criarRespostaApi(false, "Informe um código de verificação válido.", null, 400);
        }

        const payloadVerificacao = obterPayloadVerificacaoCadastroContaJWT(tokenVerificacao);

        if (!payloadVerificacao) {
            return criarRespostaApi(false, "A verificação do e-mail expirou ou é inválida.", null, 401);
        }

        if (payloadVerificacao.email !== email || payloadVerificacao.codigo !== codigoVerificacao) {
            return criarRespostaApi(false, "A verificação do e-mail não confere.", null, 400);
        }

        const senhaCriptografada = criarHash(senha);

        const resultadoPerfil = await consultarBancoDados<RegistroId>(
            `
                select id
                from perfil
                where lower(nome) = lower($1)
                    and ativo = true
                limit 1
            `,
            ["Cliente"]
        );
        const perfilCliente = resultadoPerfil.rows[0];

        if (!perfilCliente) {
            throw new Error(ERRO_PERFIL_CLIENTE_NAO_ENCONTRADO);
        }

        const resultadoEmpresa = await consultarBancoDados<RegistroId>(
            `
                select id
                from empresas
                where ativo = true
                order by id
                limit 1
            `
        );
        const empresa = resultadoEmpresa.rows[0];

        if (!empresa) {
            throw new Error(ERRO_EMPRESA_NAO_ENCONTRADA);
        }

        const resultadoUsuario = await consultarBancoDados<RegistroId>(
            `
                insert into usuarios (
                    nome,
                    email,
                    senha_hash,
                    salt,
                    telefone,
                    documento,
                    data_nascimento,
                    perfil_id,
                    empresa_padrao
                )
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                returning id
            `,
            [
                nome,
                email,
                senhaCriptografada.hash,
                senhaCriptografada.salt,
                celular,
                documento,
                dataNascimento,
                perfilCliente.id,
                empresa.id,
            ]
        );
        const usuarioCriado = resultadoUsuario.rows[0];

        if (!usuarioCriado) {
            return criarRespostaApi(false, "Não foi possível criar a conta.", null, 500);
        }

        await consultarBancoDados(
            `
                insert into usuarios_empresas (
                    usuario_id,
                    empresa_id,
                    criado_por
                )
                values ($1, $2, $3)
            `,
            [usuarioCriado.id, empresa.id, usuarioCriado.id]
        );

        return criarRespostaApi(true, "Conta criada com sucesso.", null, 201);
    } catch (erro) {
        if (erro instanceof SyntaxError) {
            return criarRespostaApi(false, "Requisição inválida.", null, 400);
        }

        if (erro instanceof Error && erro.message === ERRO_PERFIL_CLIENTE_NAO_ENCONTRADO) {
            return criarRespostaApi(false, "O perfil Cliente não está cadastrado ou está inativo.", null, 500);
        }

        if (erro instanceof Error && erro.message === ERRO_EMPRESA_NAO_ENCONTRADA) {
            return criarRespostaApi(false, "Nenhuma empresa ativa foi encontrada para o cadastro.", null, 500);
        }

        if (erro instanceof Error && "code" in erro && erro.code === "23505") {
            return criarRespostaApi(false, "Já existe uma conta cadastrada com este e-mail.", null, 409);
        }

        return criarRespostaApi(false, "Não foi possível criar a conta.", null, 500);
    }
}

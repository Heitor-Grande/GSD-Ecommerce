import { NextRequest } from "next/server";
import { registrarAuditoria } from "@/utils/auditoria";
import { consultarBancoDados } from "@/services/database";
import { obterIdUsuarioAutenticado } from "@/utils/autenticacao";
import { verificarEmpresaPertenceAoUsuario } from "@/utils/empresaUsuario";
import { normalizarIdEmpresa, normalizarImagemIlustrativa, normalizarQuantidadeEstoque, normalizarValorMonetario, obterBooleano } from "@/utils/normalizadores";
import { verificarPermissaoAPI } from "@/utils/permissoes";
import { criarRespostaApi } from "@/utils/respostaApi";
import { validarStringComConteudo } from "@/utils/validacoes";

type ProdutoCadastrado = {
    id: number;
    id_empresa: number;
    nome: string;
    categoria: string;
    valorporunidade: number | string;
    quantidadeestoque: number;
    ativo: boolean;
    valorpromocional: boolean;
    frete_gratis: boolean;
    imagemilustrativa: string | null;
    criacao_em: Date;
    atualizado_em: Date;
    criado_por: number;
    atualizado_por: number | null;
};

type CadastroProdutoBody = {
    idEmpresa?: unknown;
    nome?: unknown;
    categoria?: unknown;
    valorPorUnidade?: unknown;
    quantidadeEstoque?: unknown;
    ativo?: unknown;
    valorPromocional?: unknown;
    freteGratis?: unknown;
    imagemIlustrativa?: unknown;
};

const categoriasProduto = [
    "flores",
    "buques",
    "plantas",
    "gramas",
    "jardim",
    "presentes",
    "vasos",
    "acessorios",
] as const;

function normalizarCategoria(valor: unknown): string {
    return validarStringComConteudo(valor) ? valor.trim().toLowerCase() : "";
}

/**
 * Endpoint POST de produtos do catalogo.
 * Valida os dados obrigatorios e cadastra o produto vinculado a uma empresa do usuario autenticado.
 */
export async function POST(request: NextRequest) {
    try {
        const respostaPermissao = await verificarPermissaoAPI({
            request: request,
            recurso: "catalogo",
            acao: "criar",
        });

        if (respostaPermissao) {
            return respostaPermissao;
        }

        const idUsuario = obterIdUsuarioAutenticado(request);

        if (!idUsuario) {
            return criarRespostaApi(false, "Sessao invalida ou expirada.", null, 401);
        }

        const body = await request.json() as CadastroProdutoBody;
        const idEmpresa = normalizarIdEmpresa(body.idEmpresa);
        const nome = validarStringComConteudo(body.nome) ? body.nome.trim() : "";
        const categoria = normalizarCategoria(body.categoria);
        const valorPorUnidade = normalizarValorMonetario(body.valorPorUnidade);
        const quantidadeEstoque = normalizarQuantidadeEstoque(body.quantidadeEstoque);
        const valorPromocional = obterBooleano(body.valorPromocional, false);
        const freteGratis = obterBooleano(body.freteGratis, false);
        const imagemIlustrativa = normalizarImagemIlustrativa(body.imagemIlustrativa);
        const ativoInformado = obterBooleano(body.ativo, true);
        const ativo = quantidadeEstoque === 0 ? false : ativoInformado;

        if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
            return criarRespostaApi(false, "Informe uma empresa valida para o produto.", null, 400);
        }

        if (!nome || nome.length > 40) {
            return criarRespostaApi(false, "Informe o nome do produto com ate 40 caracteres.", null, 400);
        }

        if (!categoriasProduto.includes(categoria as typeof categoriasProduto[number])) {
            return criarRespostaApi(false, "Informe uma categoria valida para o produto.", null, 400);
        }

        if (valorPorUnidade === null || valorPorUnidade <= 0) {
            return criarRespostaApi(false, "Informe o valor por unidade do produto.", null, 400);
        }

        if (quantidadeEstoque === null || quantidadeEstoque < 0) {
            return criarRespostaApi(false, "Informe a quantidade em estoque do produto.", null, 400);
        }

        const empresaPertenceAoUsuario = await verificarEmpresaPertenceAoUsuario({
            request: request,
            idEmpresa: idEmpresa,
        });

        if (!empresaPertenceAoUsuario) {
            return criarRespostaApi(false, "A empresa informada nao pertence ao usuario autenticado.", null, 403);
        }

        const resultado = await consultarBancoDados<ProdutoCadastrado>(
            `
                insert into produtos (
                    id_empresa,
                    nome,
                    categoria,
                    valorporunidade,
                    quantidadeestoque,
                    ativo,
                    valorpromocional,
                    frete_gratis,
                    imagemilustrativa,
                    criado_por
                )
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                returning id,
                    id_empresa,
                    nome,
                    categoria,
                    valorporunidade,
                    quantidadeestoque,
                    ativo,
                    valorpromocional,
                    frete_gratis,
                    imagemilustrativa,
                    criacao_em,
                    atualizado_em,
                    criado_por,
                    atualizado_por
            `,
            [
                idEmpresa,
                nome,
                categoria,
                valorPorUnidade,
                quantidadeEstoque,
                ativo,
                valorPromocional,
                freteGratis,
                imagemIlustrativa,
                idUsuario,
            ]
        );

        await registrarAuditoria({
            acao: "CRIAR",
            usuarioId: idUsuario,
            empresaId: idEmpresa,
            dadosAntes: null,
            dadosDepois: resultado.rows[0],
            metodoHttp: "POST",
            rota: request.nextUrl.pathname,
        });

        return criarRespostaApi(true, "Produto cadastrado com sucesso.", resultado.rows[0], 201);
    } catch (erro) {
        if (erro instanceof SyntaxError) {
            return criarRespostaApi(false, "Requisicao invalida.", null, 400);
        }

        return criarRespostaApi(false, "Nao foi possivel cadastrar o produto.", null, 500);
    }
}

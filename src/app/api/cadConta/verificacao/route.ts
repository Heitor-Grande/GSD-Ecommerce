import { NextRequest } from "next/server";
import { consultarBancoDados } from "@/services/database";
import { enviarEmail } from "@/services/email";
import { gerarCodigoNumerico, validarCodigoNumerico } from "@/utils/codigos";
import { criarJWTVerificacaoCadastroConta, obterPayloadVerificacaoCadastroContaJWT } from "@/utils/jwt";
import { verificarRateLimitPorIp } from "@/utils/rateLimit";
import { criarRespostaApi } from "@/utils/respostaApi";
import { validarEmail, validarStringComConteudo } from "@/utils/validacoes";

type DadosTokenVerificacao = {
    token: string;
};

type ValidacaoCodigoBody = {
    token?: unknown;
    codigo?: unknown;
};

type RegistroId = {
    id: number;
};

/** Monta o e-mail com o código temporário do cadastro público. */
function montarHtmlVerificacaoCadastro(codigo: string): string {
    const nomeEmpresa = process.env.NOME_EMPRESA || "Nossa loja";

    return `
        <div style="margin:0;padding:32px;background-color:#f7f2e8;font-family:Arial,sans-serif;color:#2d241c;">
            <div style="max-width:520px;margin:0 auto;background-color:#fffdf7;border:1px solid #d8c5a5;border-radius:8px;overflow:hidden;">
                <div style="padding:24px;background-color:#1f4d2c;color:#ffffff;">
                    <h1 style="margin:0;font-size:22px;line-height:1.3;">Verificação de e-mail</h1>
                    <p style="margin:8px 0 0;color:#fff1b8;font-size:14px;">${nomeEmpresa}</p>
                </div>
                <div style="padding:28px 24px;">
                    <p style="margin:0 0 18px;font-size:16px;line-height:1.5;">
                        Use o código abaixo para confirmar seu e-mail e concluir a criação da conta.
                    </p>
                    <div style="margin:0 0 20px;padding:18px;border:1px solid #d8c5a5;border-radius:8px;background-color:#efe4cf;text-align:center;">
                        <strong style="display:block;color:#1f4d2c;font-size:32px;letter-spacing:8px;line-height:1;">
                            ${codigo}
                        </strong>
                    </div>
                    <p style="margin:0;color:#6f5b45;font-size:13px;line-height:1.5;">
                        Este código é válido por 3 minutos. Se você não solicitou o cadastro, ignore este e-mail.
                    </p>
                </div>
            </div>
        </div>
    `;
}

/** Envia por e-mail um código de cinco dígitos e retorna seu JWT temporário. */
export async function GET(request: NextRequest) {
    try {
        const respostaRateLimit = verificarRateLimitPorIp({
            request: request,
            identificador: "cadastro-conta-envio-codigo",
            limite: 3,
            janelaMs: 15 * 60 * 1000,
        });

        if (respostaRateLimit) {
            return respostaRateLimit;
        }

        const emailInformado = request.nextUrl.searchParams.get("email");
        const email = emailInformado?.trim().toLowerCase() ?? "";

        if (!validarEmail(email)) {
            return criarRespostaApi(false, "Informe um e-mail válido.", null, 400);
        }

        const resultadoUsuario = await consultarBancoDados<RegistroId>(
            `
                select id
                from usuarios
                where lower(email) = $1
                limit 1
            `,
            [email]
        );

        if (resultadoUsuario.rows[0]) {
            return criarRespostaApi(false, "Já existe uma conta cadastrada com este e-mail.", null, 409);
        }

        const codigo = gerarCodigoNumerico(5);
        const token = criarJWTVerificacaoCadastroConta(email, codigo);

        await enviarEmail({
            to: email,
            subject: "Código de verificação",
            html: montarHtmlVerificacaoCadastro(codigo),
        });

        return criarRespostaApi<DadosTokenVerificacao>(
            true,
            "Código de verificação enviado para o e-mail informado.",
            { token: token }
        );
    } catch (erro) {

        console.log(erro);
        return criarRespostaApi(false, "Não foi possível enviar o código de verificação.", null, 500);
    }
}

/** Valida o código informado contra o JWT temporário assinado. */
export async function PUT(request: NextRequest) {
    try {
        const respostaRateLimit = verificarRateLimitPorIp({
            request: request,
            identificador: "cadastro-conta-validacao-codigo",
            limite: 5,
            janelaMs: 15 * 60 * 1000,
        });

        if (respostaRateLimit) {
            return respostaRateLimit;
        }

        const body = await request.json() as ValidacaoCodigoBody;
        const token = validarStringComConteudo(body.token) ? body.token : "";
        const codigo = validarStringComConteudo(body.codigo) ? body.codigo.trim() : "";

        if (!validarCodigoNumerico(codigo, 5)) {
            return criarRespostaApi(false, "Informe os 5 dígitos do código de verificação.", null, 400);
        }

        const payload = obterPayloadVerificacaoCadastroContaJWT(token);

        if (!payload) {
            return criarRespostaApi(false, "O código expirou. Solicite um novo código.", null, 401);
        }

        if (payload.codigo !== codigo) {
            return criarRespostaApi(false, "O código informado não confere.", null, 400);
        }

        return criarRespostaApi(true, "E-mail verificado com sucesso.", null);
    } catch (erro) {
        if (erro instanceof SyntaxError) {
            return criarRespostaApi(false, "Requisição inválida.", null, 400);
        }

        return criarRespostaApi(false, "Não foi possível verificar o código.", null, 500);
    }
}

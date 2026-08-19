import { NextRequest } from "next/server";
import { registrarAuditoria } from "@/utils/auditoria";
import { consultarBancoDados } from "@/services/database";
import { obterIdUsuarioAutenticado } from "@/utils/autenticacao";
import { verificarEmpresaPertenceAoUsuario } from "@/utils/empresaUsuario";
import { montarUrlImagemProduto, salvarImagemProduto } from "@/utils/imagens";
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

type ProdutoListado = ProdutoCadastrado & {
    imagem_url: string | null;
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

type DadosProdutoNormalizados = CadastroProdutoBody & {
    imagemIlustrativaArquivo: File | null;
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

async function obterDadosProdutoRequest(request: NextRequest): Promise<DadosProdutoNormalizados> {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        const arquivo = formData.get("imagemIlustrativaArquivo");

        return {
            idEmpresa: formData.get("idEmpresa"),
            nome: formData.get("nome"),
            categoria: formData.get("categoria"),
            valorPorUnidade: formData.get("valorPorUnidade"),
            quantidadeEstoque: formData.get("quantidadeEstoque"),
            ativo: formData.get("ativo") === "true",
            valorPromocional: formData.get("valorPromocional") === "true",
            freteGratis: formData.get("freteGratis") === "true",
            imagemIlustrativa: formData.get("imagemIlustrativa"),
            imagemIlustrativaArquivo: arquivo instanceof File ? arquivo : null,
        };
    }

    const body = await request.json() as CadastroProdutoBody;

    return {
        ...body,
        imagemIlustrativaArquivo: null,
    };
}

/**
 * Endpoint GET de produtos do catalogo.
 * Lista produtos vinculados a empresa de navegacao do usuario autenticado.
 */
export async function GET(request: NextRequest) {
    try {
        const respostaPermissao = await verificarPermissaoAPI({
            request: request,
            recurso: "catalogo",
            acao: "visualizar",
        });

        if (respostaPermissao) {
            return respostaPermissao;
        }

        const idUsuario = obterIdUsuarioAutenticado(request);

        if (!idUsuario) {
            return criarRespostaApi(false, "Sessao invalida ou expirada.", null, 401);
        }

        const idEmpresa = normalizarIdEmpresa(request.nextUrl.searchParams.get("idEmpresa"));

        if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
            return criarRespostaApi(false, "Informe uma empresa valida para listar os produtos.", null, 400);
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
                select
                    id,
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
                from produtos
                where id_empresa = $1
                order by valorpromocional desc,
                    criacao_em desc
            `,
            [idEmpresa]
        );
        const produtos: ProdutoListado[] = resultado.rows.map((produto) => ({
            ...produto,
            imagem_url: montarUrlImagemProduto(produto.imagemilustrativa, produto.atualizado_em),
        }));

        return criarRespostaApi(true, "Produtos listados com sucesso.", produtos);
    } catch {
        return criarRespostaApi<ProdutoListado[]>(false, "Nao foi possivel listar os produtos.", [], 500);
    }
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

        const body = await obterDadosProdutoRequest(request);
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

        if (!body.imagemIlustrativaArquivo) {
            return criarRespostaApi(false, "Informe a imagem ilustrativa do produto.", null, 400);
        }

        const empresaPertenceAoUsuario = await verificarEmpresaPertenceAoUsuario({
            request: request,
            idEmpresa: idEmpresa,
        });

        if (!empresaPertenceAoUsuario) {
            return criarRespostaApi(false, "A empresa informada nao pertence ao usuario autenticado.", null, 403);
        }

        const resultadoCadastro = await consultarBancoDados<ProdutoCadastrado>(
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
        const produtoCadastrado = resultadoCadastro.rows[0];
        const imagemProduto = await salvarImagemProduto({
            idProduto: produtoCadastrado.id,
            arquivo: body.imagemIlustrativaArquivo,
        });
        const resultado = await consultarBancoDados<ProdutoCadastrado>(
            `
                update produtos
                set
                    imagemilustrativa = $1::text
                where id = $2::bigint
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
            [imagemProduto, produtoCadastrado.id]
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

        if (erro instanceof Error && erro.message === "EXTENSAO_IMAGEM_INVALIDA") {
            return criarRespostaApi(false, "Informe uma imagem nos formatos jpg, png ou webp.", null, 400);
        }

        return criarRespostaApi(false, "Nao foi possivel cadastrar o produto.", null, 500);
    }
}

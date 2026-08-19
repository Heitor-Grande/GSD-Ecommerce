import { NextRequest } from "next/server";
import { registrarAuditoria } from "@/utils/auditoria";
import { consultarBancoDados } from "@/services/database";
import { obterIdUsuarioAutenticado } from "@/utils/autenticacao";
import { verificarEmpresaPertenceAoUsuario } from "@/utils/empresaUsuario";
import { montarUrlImagemProduto, salvarImagemProduto } from "@/utils/imagens";
import { normalizarImagemIlustrativa, normalizarQuantidadeEstoque, normalizarValorMonetario, obterBooleano } from "@/utils/normalizadores";
import { verificarPermissaoAPI } from "@/utils/permissoes";
import { criarRespostaApi } from "@/utils/respostaApi";
import { validarStringComConteudo } from "@/utils/validacoes";

type ProdutoCatalogo = {
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
    imagem_url: string | null;
    criacao_em: Date;
    atualizado_em: Date;
    criado_por: number;
    atualizado_por: number | null;
};

type CadastroProdutoBody = {
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

function normalizarIdProduto(valor: unknown): number {
    return typeof valor === "number" ? valor : Number(valor);
}

function normalizarCategoria(valor: unknown): string {
    return validarStringComConteudo(valor) ? valor.trim().toLowerCase() : "";
}

async function obterDadosProdutoRequest(request: NextRequest): Promise<DadosProdutoNormalizados> {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        const arquivo = formData.get("imagemIlustrativaArquivo");

        return {
            nome: formData.get("nome"),
            categoria: formData.get("categoria"),
            valorPorUnidade: formData.get("valorPorUnidade"),
            quantidadeEstoque: formData.get("quantidadeEstoque"),
            ativo: formData.get("ativo") === "true",
            valorPromocional: formData.get("valorPromocional") === "true",
            freteGratis: formData.get("freteGratis") === "true",
            imagemIlustrativa: formData.get("imagemIlustrativa"),
            imagemIlustrativaArquivo: arquivo instanceof File && arquivo.size > 0 ? arquivo : null,
        };
    }

    const body = await request.json() as CadastroProdutoBody;

    return {
        ...body,
        imagemIlustrativaArquivo: null,
    };
}

function montarProdutoCatalogo(produto: Omit<ProdutoCatalogo, "imagem_url">): ProdutoCatalogo {
    return {
        ...produto,
        imagem_url: montarUrlImagemProduto(produto.imagemilustrativa),
    };
}

async function buscarProdutoPorId(idProduto: number) {
    const resultado = await consultarBancoDados<Omit<ProdutoCatalogo, "imagem_url">>(
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
            where id = $1
            limit 1
        `,
        [idProduto]
    );

    return resultado.rows[0] ?? null;
}

/**
 * Endpoint GET de produto do catalogo.
 * Carrega um produto individual para preenchimento do formulario de edicao.
 */
export async function GET(
    request: NextRequest,
    contexto: { params: Promise<{ idproduto: string }> }
) {
    try {
        const respostaPermissao = await verificarPermissaoAPI({
            request: request,
            recurso: "catalogo",
            acao: "visualizar",
        });

        if (respostaPermissao) {
            return respostaPermissao;
        }

        const idProduto = normalizarIdProduto((await contexto.params).idproduto);

        if (!Number.isInteger(idProduto) || idProduto <= 0) {
            return criarRespostaApi(false, "Informe um produto valido.", null, 400);
        }

        const produto = await buscarProdutoPorId(idProduto);

        if (!produto) {
            return criarRespostaApi(false, "Produto nao encontrado.", null, 404);
        }

        const empresaPertenceAoUsuario = await verificarEmpresaPertenceAoUsuario({
            request: request,
            idEmpresa: produto.id_empresa,
        });

        if (!empresaPertenceAoUsuario) {
            return criarRespostaApi(false, "A empresa do produto nao pertence ao usuario autenticado.", null, 403);
        }

        return criarRespostaApi(true, "Produto carregado com sucesso.", montarProdutoCatalogo(produto));
    } catch {
        return criarRespostaApi(false, "Nao foi possivel carregar o produto.", null, 500);
    }
}

/**
 * Endpoint PUT de produto do catalogo.
 * Atualiza os dados do produto informado e opcionalmente substitui sua imagem.
 */
export async function PUT(
    request: NextRequest,
    contexto: { params: Promise<{ idproduto: string }> }
) {
    try {
        const respostaPermissao = await verificarPermissaoAPI({
            request: request,
            recurso: "catalogo",
            acao: "atualizar",
        });

        if (respostaPermissao) {
            return respostaPermissao;
        }

        const idUsuario = obterIdUsuarioAutenticado(request);

        if (!idUsuario) {
            return criarRespostaApi(false, "Sessao invalida ou expirada.", null, 401);
        }

        const idProduto = normalizarIdProduto((await contexto.params).idproduto);

        if (!Number.isInteger(idProduto) || idProduto <= 0) {
            return criarRespostaApi(false, "Informe um produto valido.", null, 400);
        }

        const produtoAtual = await buscarProdutoPorId(idProduto);

        if (!produtoAtual) {
            return criarRespostaApi(false, "Produto nao encontrado.", null, 404);
        }

        const empresaPertenceAoUsuario = await verificarEmpresaPertenceAoUsuario({
            request: request,
            idEmpresa: produtoAtual.id_empresa,
        });

        if (!empresaPertenceAoUsuario) {
            return criarRespostaApi(false, "A empresa do produto nao pertence ao usuario autenticado.", null, 403);
        }

        const body = await obterDadosProdutoRequest(request);
        const nome = validarStringComConteudo(body.nome) ? body.nome.trim() : "";
        const categoria = normalizarCategoria(body.categoria);
        const valorPorUnidade = normalizarValorMonetario(body.valorPorUnidade);
        const quantidadeEstoque = normalizarQuantidadeEstoque(body.quantidadeEstoque);
        const valorPromocional = obterBooleano(body.valorPromocional, false);
        const freteGratis = obterBooleano(body.freteGratis, false);
        const imagemIlustrativa = normalizarImagemIlustrativa(body.imagemIlustrativa);
        const ativoInformado = obterBooleano(body.ativo, true);
        const ativo = quantidadeEstoque === 0 ? false : ativoInformado;

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

        const imagemProduto = body.imagemIlustrativaArquivo
            ? await salvarImagemProduto({
                idProduto: idProduto,
                arquivo: body.imagemIlustrativaArquivo,
            })
            : imagemIlustrativa ?? produtoAtual.imagemilustrativa;
        const resultado = await consultarBancoDados<Omit<ProdutoCatalogo, "imagem_url">>(
            `
                update produtos
                set
                    nome = $1,
                    categoria = $2,
                    valorporunidade = $3,
                    quantidadeestoque = $4,
                    ativo = $5,
                    valorpromocional = $6,
                    frete_gratis = $7,
                    imagemilustrativa = $8::text,
                    atualizado_em = now(),
                    atualizado_por = $9
                where id = $10
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
                nome,
                categoria,
                valorPorUnidade,
                quantidadeEstoque,
                ativo,
                valorPromocional,
                freteGratis,
                imagemProduto,
                idUsuario,
                idProduto,
            ]
        );
        const produtoAtualizado = montarProdutoCatalogo(resultado.rows[0]);

        await registrarAuditoria({
            acao: "ATUALIZAR",
            usuarioId: idUsuario,
            empresaId: produtoAtual.id_empresa,
            dadosAntes: produtoAtual,
            dadosDepois: produtoAtualizado,
            metodoHttp: "PUT",
            rota: request.nextUrl.pathname,
        });

        return criarRespostaApi(true, "Produto atualizado com sucesso.", produtoAtualizado);
    } catch (erro) {
        if (erro instanceof SyntaxError) {
            return criarRespostaApi(false, "Requisicao invalida.", null, 400);
        }

        if (erro instanceof Error && erro.message === "EXTENSAO_IMAGEM_INVALIDA") {
            return criarRespostaApi(false, "Informe uma imagem nos formatos jpg, png ou webp.", null, 400);
        }

        return criarRespostaApi(false, "Nao foi possivel atualizar o produto.", null, 500);
    }
}

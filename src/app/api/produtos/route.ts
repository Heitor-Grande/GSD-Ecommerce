import { consultarBancoDados } from "@/services/database";
import { montarUrlImagemProduto } from "@/utils/imagens";
import { criarRespostaApi } from "@/utils/respostaApi";

type ProdutoPublicoBanco = {
    id: number;
    nome: string;
    categoria: string;
    valorporunidade: number | string;
    quantidadeestoque: number;
    valorpromocional: boolean;
    frete_gratis: boolean;
    imagemilustrativa: string | null;
    atualizado_em: Date;
};

type ProdutoPublico = Omit<ProdutoPublicoBanco, "imagemilustrativa" | "atualizado_em"> & {
    imagem_url: string | null;
};

/** Lista os produtos ativos disponíveis na vitrine pública do ecommerce. */
export async function GET() {
    try {
        const resultado = await consultarBancoDados<ProdutoPublicoBanco>(
            `
                select
                    p.id,
                    p.nome,
                    p.categoria,
                    p.valorporunidade,
                    p.quantidadeestoque,
                    p.valorpromocional,
                    p.frete_gratis,
                    p.imagemilustrativa,
                    p.atualizado_em
                from produtos p
                inner join empresas e on e.id = p.id_empresa
                where p.ativo = true
                    and e.ativo = true
                order by p.valorpromocional desc,
                    p.criacao_em desc
            `
        );
        const produtos: ProdutoPublico[] = resultado.rows.map((produto) => ({
            id: produto.id,
            nome: produto.nome,
            categoria: produto.categoria,
            valorporunidade: produto.valorporunidade,
            quantidadeestoque: produto.quantidadeestoque,
            valorpromocional: produto.valorpromocional,
            frete_gratis: produto.frete_gratis,
            imagem_url: montarUrlImagemProduto(produto.imagemilustrativa, produto.atualizado_em),
        }));

        return criarRespostaApi(true, "Produtos listados com sucesso.", produtos);
    } catch {
        return criarRespostaApi<ProdutoPublico[]>(false, "Não foi possível listar os produtos.", [], 500);
    }
}

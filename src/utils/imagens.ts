import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";

/**
 * Extrai e valida a extensao de uma imagem recebida por upload.
 * Retorna null quando a extensao nao estiver entre os formatos permitidos.
 */
export function obterExtensaoImagem(arquivo: File): string | null {
    const extensaoArquivo = path.extname(arquivo.name).replace(".", "").toLowerCase();
    const extensaoMime = arquivo.type.split("/")[1]?.toLowerCase() ?? "";
    const extensao = extensaoArquivo || extensaoMime;
    const extensoesPermitidas = ["jpg", "jpeg", "png", "webp"];

    if (!extensoesPermitidas.includes(extensao)) {
        return null;
    }

    return extensao === "jpeg" ? "jpg" : extensao;
}

/**
 * Salva a imagem de um produto em src/images usando o padrao id.extensao.
 * Retorna o caminho que deve ser gravado no banco.
 */
export async function salvarImagemProduto({
    idProduto,
    arquivo,
}: {
    idProduto: number;
    arquivo: File;
}): Promise<string> {
    const extensao = obterExtensaoImagem(arquivo);

    if (!extensao) {
        throw new Error("EXTENSAO_IMAGEM_INVALIDA");
    }

    const nomeArquivo = `${idProduto}.${extensao}`;
    const diretorioImagens = path.join(process.cwd(), "src", "images");
    const caminhoArquivo = path.join(diretorioImagens, nomeArquivo);

    await mkdir(diretorioImagens, { recursive: true });
    await writeFile(caminhoArquivo, Buffer.from(await arquivo.arrayBuffer()));

    return `src/images/${nomeArquivo}`;
}

/**
 * Remove uma imagem de produto salva em src/images.
 * Ignora arquivo inexistente para permitir substituicao segura durante atualizacoes.
 */
export async function apagarImagemProduto(caminhoImagem: string | null): Promise<void> {
    if (!caminhoImagem) {
        return;
    }

    const nomeArquivo = path.basename(caminhoImagem);
    const caminhoArquivo = path.join(process.cwd(), "src", "images", nomeArquivo);

    try {
        await unlink(caminhoArquivo);
    } catch (erro) {
        if (!(erro instanceof Error) || !("code" in erro) || erro.code !== "ENOENT") {
            throw erro;
        }
    }
}

/**
 * Le uma imagem de produto salva em src/images pelo nome do arquivo.
 * Use em rotas server-side que precisam servir imagens armazenadas localmente.
 */
export async function lerImagemProduto(nomeArquivo: string): Promise<Buffer> {
    const nomeSeguro = path.basename(nomeArquivo);
    const caminhoArquivo = path.join(process.cwd(), "src", "images", nomeSeguro);

    return readFile(caminhoArquivo);
}

/**
 * Monta a URL publica da API que serve uma imagem local do produto.
 * Use versao para invalidar cache do navegador quando a imagem for atualizada.
 * Retorna null quando nao houver caminho de imagem gravado.
 */
export function montarUrlImagemProduto(caminhoImagem: string | null, versao?: string | Date | null): string | null {
    if (!caminhoImagem) {
        return null;
    }

    const nomeArquivo = path.basename(caminhoImagem);
    const parametroVersao = versao ? `?v=${encodeURIComponent(String(versao))}` : "";

    return `/api/catalogo/imagem/${encodeURIComponent(nomeArquivo)}${parametroVersao}`;
}

import { mkdir, writeFile } from "fs/promises";
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
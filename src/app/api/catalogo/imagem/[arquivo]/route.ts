import { NextRequest } from "next/server";
import path from "path";
import { lerImagemProduto } from "@/utils/imagens";

const contentTypesImagem: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
};

/**
 * Endpoint GET de imagem do produto.
 * Serve arquivos salvos em src/images sem expor acesso arbitrario ao filesystem.
 */
export async function GET(
    _request: NextRequest,
    contexto: { params: Promise<{ arquivo: string }> }
) {
    const { arquivo } = await contexto.params;
    const nomeArquivo = path.basename(arquivo);
    const extensao = path.extname(nomeArquivo).toLowerCase();
    const contentType = contentTypesImagem[extensao];

    if (!contentType || nomeArquivo !== arquivo) {
        return new Response(null, { status: 404 });
    }

    try {
        const imagem = await lerImagemProduto(nomeArquivo);

        return new Response(new Uint8Array(imagem), {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return new Response(null, { status: 404 });
    }
}

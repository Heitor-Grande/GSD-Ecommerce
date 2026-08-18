import { validarStringComConteudo } from "@/utils/validacoes";

/**
 * Normaliza um identificador de empresa recebido em payloads de API.
 * Use antes de validar se o id e inteiro positivo.
 */
export function normalizarIdEmpresa(valor: unknown): number {
    return typeof valor === "number" ? valor : Number(valor);
}

/**
 * Normaliza valores monetarios recebidos como numero ou texto formatado.
 * Use em APIs que recebem valores em reais vindos de formularios.
 */
export function normalizarValorMonetario(valor: unknown): number | null {
    if (valor === null || typeof valor === "undefined" || valor === "") {
        return 0;
    }

    if (typeof valor === "number") {
        return Number.isFinite(valor) ? valor : 0;
    }

    const texto = String(valor).trim();
    const valorNormalizado = texto.includes(",")
        ? texto.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".")
        : texto.replace(/[^\d.-]/g, "");
    const numero = Number(valorNormalizado);

    return Number.isFinite(numero) ? numero : 0;
}

/**
 * Normaliza quantidade inteira recebida como numero ou texto.
 * Retorna 0 quando o valor estiver vazio ou nao representar um inteiro valido.
 */
export function normalizarQuantidadeEstoque(valor: unknown): number | null {
    if (valor === null || typeof valor === "undefined" || valor === "") {
        return 0;
    }

    if (typeof valor === "number") {
        return Number.isInteger(valor) ? valor : 0;
    }

    const digitos = String(valor).replace(/\D/g, "");

    if (!digitos) {
        return 0;
    }

    const quantidade = Number(digitos);

    return Number.isInteger(quantidade) ? quantidade : 0;
}

/**
 * Normaliza quantidade inteira recebida como numero ou texto.
 * Retorna 0 quando o valor estiver vazio ou nao representar um inteiro valido.
 */
export function normalizarQuantidadeEstoque(valor: unknown): number | null {
    if (valor === null || typeof valor === "undefined" || valor === "") {
        return 0;
    }

    if (typeof valor === "number") {
        return Number.isInteger(valor) ? valor : 0;
    }

    const digitos = String(valor).replace(/\D/g, "");

    if (!digitos) {
        return 0;
    }

    const quantidade = Number(digitos);

    return Number.isInteger(quantidade) ? quantidade : 0;
}

/**
 * Normaliza campos booleanos com valor padrao quando o payload nao enviar boolean.
 * Use para preservar defaults de formulario sem aceitar tipos ambiguos.
 */
export function obterBooleano(valor: unknown, padrao: boolean): boolean {
    return typeof valor === "boolean" ? valor : padrao;
}

/**
 * Normaliza a referencia textual da imagem ilustrativa enviada por uma API.
 * Retorna null quando o campo vier vazio ou invalido.
 */
export function normalizarImagemIlustrativa(valor: unknown): string | null {
    return validarStringComConteudo(valor) ? valor.trim() : null;
}

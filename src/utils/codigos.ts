import { randomInt } from "crypto";

/**
 * Gera um código numérico criptograficamente seguro com a quantidade informada de dígitos.
 */
export function gerarCodigoNumerico(quantidadeDigitos: number): string {
    if (!Number.isInteger(quantidadeDigitos) || quantidadeDigitos < 1 || quantidadeDigitos > 9) {
        throw new Error("QUANTIDADE_DIGITOS_INVALIDA");
    }

    const valorMinimo = quantidadeDigitos === 1 ? 0 : 10 ** (quantidadeDigitos - 1);
    const valorMaximo = 10 ** quantidadeDigitos;

    return String(randomInt(valorMinimo, valorMaximo)).padStart(quantidadeDigitos, "0");
}

/**
 * Confirma se um código contém exatamente a quantidade esperada de dígitos numéricos.
 */
export function validarCodigoNumerico(codigo: string, quantidadeDigitos: number): boolean {
    if (!Number.isInteger(quantidadeDigitos) || quantidadeDigitos < 1) {
        return false;
    }

    return new RegExp("^\\d{" + quantidadeDigitos + "}$").test(codigo);
}

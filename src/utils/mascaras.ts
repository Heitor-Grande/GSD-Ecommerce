/**
 * Formata um texto livre como moeda em reais usando os dígitos como centavos.
 * Exemplo: "1" vira "R$ 0,01", "10" vira "R$ 0,10" e "100" vira "R$ 1,00".
 */
export function aplicarMascaraMoedaRealPorCentavos(valor: string): string {
    const digitos = valor.replace(/\D/g, "");

    if (!digitos) {
        return "";
    }

    const valorEmCentavos = Number(digitos);
    const valorEmReais = valorEmCentavos / 100;

    return `R$ ${valorEmReais.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

/**
 * Converte uma moeda formatada em reais para número decimal.
 * Use antes de enviar valores monetários para APIs que esperam número.
 */
export function converterMoedaRealFormatadaParaNumero(valor: string): number | null {
    const digitos = valor.replace(/\D/g, "");

    if (!digitos) {
        return null;
    }

    return Number(digitos) / 100;
}

/**
 * Mantem apenas digitos inteiros em campos numericos simples.
 * Use em inputs que precisam aceitar somente quantidade inteira.
 */
export function aplicarMascaraNumeroInteiro(valor: string): string {
    return valor.replace(/\D/g, "");
}

/**
 * Formata um valor numérico já convertido para exibição em reais.
 * Use em textos, tabelas e cards; não use como máscara de digitação.
 */
export function formatarValorComoMoedaReal(valor: number | string): string {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return "R$ 0,00";
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

/**
 * Formata uma quantidade inteira para exibição usando separadores brasileiros.
 */
export function formatarNumeroInteiroParaExibicao(valor: number | string): string {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return "0";
    }

    return Math.trunc(numero).toLocaleString("pt-BR");
}

/**
 * Formata a categoria de um produto para exibição em cards e listagens.
 * Retorna um texto padrão quando a categoria não estiver preenchida.
 */
export function formatarCategoria(categoria: string): string {
    if (!categoria) {
        return "Sem categoria";
    }

    return categoria.charAt(0).toUpperCase() + categoria.slice(1);
}

/**
 * Formata progressivamente um documento brasileiro como CPF ou CNPJ.
 * Use em campos que aceitam os dois tipos de documento no mesmo input.
 */
export function aplicarMascaraCpfCnpj(valor: string): string {
    const digitos = valor.replace(/\D/g, "").slice(0, 14);

    if (digitos.length <= 11) {
        return digitos
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2");
    }

    return digitos
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
}

/**
 * Formata progressivamente um número de celular brasileiro com DDD.
 * Limita o valor a 11 dígitos no padrão (00) 00000-0000.
 */
export function aplicarMascaraCelular(valor: string): string {
    const digitos = valor.replace(/\D/g, "").slice(0, 11);

    return digitos
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
}

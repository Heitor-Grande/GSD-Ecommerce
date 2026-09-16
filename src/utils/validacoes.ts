/**
 * Confirma se um valor desconhecido é uma string com conteúdo.
 * Use para campos obrigatorios recebidos de formularios, APIs ou JSON externo antes de chamar trim(), toLowerCase() ou salvar no banco.
 * Não use para campos opcionais quando string vazia deve virar null; nesse caso, use normalizarCampoOpcional.
 */
export function validarStringComConteudo(valor: unknown): valor is string {
    return typeof valor === "string" && valor.trim().length > 0;
}

/**
 * Valida o formato basico de um e-mail.
 * Use depois de confirmar que o valor e string, em fluxos de cadastro, login e recuperacao de senha.
 * Não use como única validação de existência de usuário; ela valida apenas formato.
 */
export function validarEmail(valor: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

/**
 * Normaliza campos opcionais para salvar no banco.
 * Use quando o campo pode ficar vazio, como telefone, documento, complemento ou observacao.
 * Retorna a string sem espaços quando preenchida, ou null quando estiver vazia ou vier em tipo inválido.
 */
export function normalizarCampoOpcional(valor: unknown): string | null {
    return validarStringComConteudo(valor) ? valor.trim() : null;
}

export type ResultadoValidacaoSenha = {
    valida: boolean;
    mensagem: string;
};

/**
 * Valida a complexidade mínima de uma senha da aplicação.
 * Exige 11 caracteres, pelo menos 3 números e ao menos 1 caractere especial.
 */
export function validarComplexidadeSenha(senha: string): ResultadoValidacaoSenha {
    if (senha.length < 11) {
        return {
            valida: false,
            mensagem: "A senha deve possuir pelo menos 11 caracteres.",
        };
    }

    const quantidadeNumeros = (senha.match(/\d/g) ?? []).length;

    if (quantidadeNumeros < 3) {
        return {
            valida: false,
            mensagem: "A senha deve possuir pelo menos 3 números.",
        };
    }

    if (!/[^\p{L}\p{N}\s]/u.test(senha)) {
        return {
            valida: false,
            mensagem: "A senha deve possuir pelo menos 1 caractere especial, como @, $ ou <.",
        };
    }

    return {
        valida: true,
        mensagem: "",
    };
}

import type { Metadata } from "next";
import { FormularioCadastroConta } from "./formularioCadastroConta";

export const metadata: Metadata = {
    title: "Criar minha conta",
    description: "Cadastre-se para acessar a área do cliente.",
};

/** Página pública de cadastro de clientes do ecommerce. */
export default function PaginaCadastroConta() {
    const nomeEmpresa = process.env.NOME_EMPRESA || "Nossa loja";

    return <FormularioCadastroConta nomeEmpresa={nomeEmpresa} />;
}

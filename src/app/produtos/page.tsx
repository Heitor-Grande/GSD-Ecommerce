import type { Metadata } from "next";
import VitrineProdutos from "./vitrineProdutos";

export const metadata: Metadata = {
    title: "Produtos",
    description: "Conheça os produtos disponíveis para jardinagem e paisagismo.",
};

/** Página pública de produtos do ecommerce. */
export default function PaginaProdutos() {
    const nomeEmpresa = process.env.NOME_EMPRESA || "Nossa loja";

    return <VitrineProdutos nomeEmpresa={nomeEmpresa} />;
}

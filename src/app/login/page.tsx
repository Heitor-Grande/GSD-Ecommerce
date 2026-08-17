import { FormularioLogin } from "./formularioLogin";

/**
 * Página de login do ecommerce.
 * Lê o nome da empresa no servidor e repassa para o formulário client-side.
 */
export default function PaginaLogin() {
  const nomeEmpresa = process.env.NOME_EMPRESA || "";

  return <FormularioLogin nomeEmpresa={nomeEmpresa} />;
}
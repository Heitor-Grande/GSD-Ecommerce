"use client";

import { Botao } from "@/components/inputs/button";
import { CampoTexto } from "@/components/inputs/input";
import { ModalCarregamento } from "@/components/modals/loading";
import ModalResposta from "@/components/modals/responseModal";
import { requisitarAPI } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaLeaf } from "react-icons/fa";
import ModalRecSenha from "../components/modalRecSenha";

type FormularioLoginProps = {
  nomeEmpresa: string;
};

/**
 * Formulário client-side de login.
 * Recebe o nome da empresa do server component para preservar variáveis privadas do ambiente.
 */
export function FormularioLogin({ nomeEmpresa }: FormularioLoginProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [modalRecSenhaAberto, setModalRecSenhaAberto] = useState(false);

  /**
   * Envia as credenciais para a API de login e redireciona o usuário autenticado.
   */
  async function enviarFormularioLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setLoginMessage("");

    try {
      await requisitarAPI("/api/auth/login", {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      setPassword("");
      router.push("/menuPrincipal");
    } catch (erro) {
      const mensagemErro = erro instanceof Error
        ? erro.message
        : "Não foi possível conectar ao servidor.";

      setLoginMessage(mensagemErro);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--cor-fundo)] px-4 py-10 text-[var(--cor-texto)]">
      <section className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="inline-flex items-center gap-3 text-decoration-none">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--cor-verde-escuro)] text-[var(--cor-amarelo)]">
              <FaLeaf aria-hidden="true" />
            </span>
            <span className="text-xl font-bold text-[var(--cor-marrom)]">{nomeEmpresa}</span>
          </Link>
        </div>

        <div className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-6 shadow-lg shadow-[rgba(75,47,31,0.12)] sm:p-8">
          <div className="mb-6 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--cor-verde)]">
              Área do cliente
            </p>
            <h1 className="mb-2 text-2xl font-bold text-[var(--cor-marrom)]">Entrar na minha conta</h1>
            <p className="mb-0 text-sm leading-6 text-[var(--cor-texto-secundario)]">
              Acesse para acompanhar seus dados e pedidos.
            </p>
          </div>

          <form onSubmit={enviarFormularioLogin}>
            <CampoTexto
              id="email"
              label="E-mail"
              type="email"
              value={email}
              placeholder="email@empresa.com"
              onChange={(event) => {
                setEmail(event.target.value);
                setLoginMessage("");
              }}
              disabled={loading}
              required
              className="mb-4"
            />

            <CampoTexto
              id="password"
              label="Senha"
              type="password"
              value={password}
              placeholder="Digite sua senha"
              onChange={(event) => {
                setPassword(event.target.value);
                setLoginMessage("");
              }}
              disabled={loading}
              required
              className="mb-2"
            />

            <div className="mb-4 flex justify-end">
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-sm font-semibold text-[var(--cor-verde)] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setModalRecSenhaAberto(true)}
                disabled={loading}
              >
                Esqueci minha senha
              </button>
            </div>

            <Botao
              size="lg"
              label="Entrar"
              onClick={() => undefined}
              disabled={loading}
              loading={false}
              variant="primary"
              type="submit"
              className="w-full !border-[var(--cor-verde)] !bg-[var(--cor-verde)] hover:!border-[var(--cor-verde-escuro)] hover:!bg-[var(--cor-verde-escuro)] focus-visible:!outline-[var(--cor-amarelo)]"
            />
          </form>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm font-semibold text-[var(--cor-texto-secundario)] text-decoration-none transition hover:text-[var(--cor-verde)]"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </section>

      <ModalResposta
        isOpen={Boolean(loginMessage)}
        message={loginMessage}
        onClose={() => setLoginMessage("")}
      />

      <ModalCarregamento
        show={loading}
        text="Validando suas credenciais..."
      />

      <ModalRecSenha
        isOpen={modalRecSenhaAberto}
        onClose={() => setModalRecSenhaAberto(false)}
      />
    </main>
  );
}

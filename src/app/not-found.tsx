import Link from "next/link";
import { FaHome, FaLeaf } from "react-icons/fa";

/**
 * Página exibida quando uma rota não existe.
 * Mantém uma saída clara para o usuário voltar à página inicial pública.
 */
export default function PaginaNaoEncontrada() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--cor-fundo)] px-4 py-10 text-[var(--cor-texto)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,253,247,0.94),rgba(223,234,211,0.82)),url('/images/homeimage.png')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(240,189,61,0.2),transparent_34%)]" />

            <section className="relative z-10 w-full max-w-xl rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)]/95 p-6 text-center shadow-2xl shadow-[rgba(75,47,31,0.16)] backdrop-blur sm:p-8">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--cor-verde-escuro)] text-2xl text-[var(--cor-amarelo)]">
                    <FaLeaf aria-hidden="true" />
                </span>

                <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[var(--cor-verde)]">
                    Página não encontrada
                </p>

                <h1 className="mb-3 text-3xl font-bold text-[var(--cor-marrom)] sm:text-4xl">
                    Não encontramos esse caminho.
                </h1>

                <p className="mx-auto mb-6 max-w-md leading-7 text-[var(--cor-texto-secundario)]">
                    A página acessada pode ter mudado de endereço ou ainda não estar disponível.
                    Volte para a página inicial para continuar navegando.
                </p>

                <Link
                    href="/"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--cor-verde)] px-5 py-3 font-semibold text-white text-decoration-none shadow-sm transition hover:bg-[var(--cor-verde-escuro)]"
                >
                    <FaHome aria-hidden="true" />
                    Voltar para a página inicial
                </Link>
            </section>
        </main>
    );
}

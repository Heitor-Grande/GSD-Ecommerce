import Link from "next/link";
import { FaLeaf, FaRulerCombined, FaShieldAlt, FaTruck } from "react-icons/fa";

/**
 * Pagina inicial pública do ecommerce de gramas.
 * Apresenta a proposta da loja sem listar produtos diretamente na home.
 */
export default function PaginaInicial() {
  const nomeEmpresa = process.env.NOME_EMPRESA || "Gramas Premium";

  return (
    <main className="min-h-screen bg-[var(--cor-fundo)] text-[var(--cor-texto)]">
      <nav className="sticky top-0 z-20 border-b border-[var(--cor-borda)] bg-[var(--cor-superficie)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link href="/" className="flex w-full min-w-0 items-center gap-3 text-decoration-none sm:w-auto">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--cor-verde-escuro)] text-[var(--cor-amarelo)]">
              <FaLeaf aria-hidden="true" />
            </span>
            <span className="min-w-0 truncate text-lg font-bold text-[var(--cor-marrom)]">{nomeEmpresa}</span>
          </Link>

          <div className="grid w-full grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:flex sm:w-auto sm:items-center sm:gap-3">
            <Link
              href="/gramas"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] px-3 py-2 text-center text-sm font-semibold text-[var(--cor-marrom)] text-decoration-none transition hover:border-[var(--cor-verde)] hover:text-[var(--cor-verde)] sm:px-4"
            >
              Nossas Gramas
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--cor-verde)] px-3 py-2 text-center text-sm font-semibold text-white text-decoration-none shadow-sm transition hover:bg-[var(--cor-verde-escuro)] sm:px-4"
            >
              Entrar na minha conta
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-[var(--cor-borda)] bg-[var(--cor-superficie)]">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(135deg,rgba(240,189,61,0.18),rgba(75,47,31,0.1)),repeating-linear-gradient(115deg,rgba(47,107,63,0.22)_0,rgba(47,107,63,0.22)_8px,rgba(31,77,44,0.12)_8px,rgba(31,77,44,0.12)_18px)] lg:block" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-[var(--cor-verde)]">
              Ecommerce especializado em gramas
            </p>
            <h1 className="mb-5 text-4xl font-bold leading-tight text-[var(--cor-marrom)] sm:text-5xl lg:text-6xl">
              Grama de qualidade para transformar áreas externas.
            </h1>
            <p className="mb-8 text-lg leading-8 text-[var(--cor-texto-secundario)]">
              Encontre a grama ideal para jardins, obras, condomínios e áreas
              comerciais com uma jornada de compra simples, atendimento direto
              e entrega organizada.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/gramas"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--cor-verde)] px-5 py-3 font-semibold text-white text-decoration-none shadow-sm transition hover:bg-[var(--cor-verde-escuro)]"
              >
                Conhecer nossas gramas
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] px-5 py-3 font-semibold text-[var(--cor-marrom)] text-decoration-none transition hover:border-[var(--cor-verde)] hover:text-[var(--cor-verde)]"
              >
                Acessar minha conta
              </Link>
            </div>
          </div>

          <div className="flex items-end lg:justify-end">
            <div className="w-full rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie-suave)] p-5 shadow-sm lg:max-w-md">
              <div className="mb-4 h-56 rounded-lg border border-[var(--cor-borda)] bg-[linear-gradient(180deg,var(--cor-superficie)_0%,var(--cor-amarelo-claro)_100%),repeating-linear-gradient(90deg,var(--cor-verde)_0,var(--cor-verde)_9px,var(--cor-verde-escuro)_9px,var(--cor-verde-escuro)_18px)] bg-blend-overlay" />
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-[var(--cor-texto-secundario)]">
                Compra orientada
              </p>
              <p className="mb-0 text-base leading-7 text-[var(--cor-texto)]">
                O ecommerce organiza o pedido para facilitar escolha, cálculo
                de necessidade, dados de entrega e acompanhamento pelo cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
          <FaRulerCombined className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
          <h2 className="mb-2 text-xl font-bold text-[var(--cor-marrom)]">Escolha com clareza</h2>
          <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
            Estrutura preparada para orientar o cliente por tipo de uso, metragem
            e necessidade do terreno.
          </p>
        </article>

        <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
          <FaTruck className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
          <h2 className="mb-2 text-xl font-bold text-[var(--cor-marrom)]">Entrega planejada</h2>
          <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
            Base visual voltada para pedidos com endereço, disponibilidade e
            acompanhamento de compra.
          </p>
        </article>

        <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
          <FaShieldAlt className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
          <h2 className="mb-2 text-xl font-bold text-[var(--cor-marrom)]">Conta do cliente</h2>
          <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
            Acesso separado para o cliente consultar dados, histórico e próximas
            etapas do atendimento.
          </p>
        </article>
      </section>
    </main>
  );
}

import Link from "next/link";
import { FaHome, FaLeaf, FaRulerCombined, FaSeedling, FaStore, FaTruck } from "react-icons/fa";

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
              Paisagismo, floricultura e gramas
            </p>
            <h1 className="mb-5 text-4xl font-bold leading-tight text-[var(--cor-marrom)] sm:text-5xl lg:text-6xl">
              Ambientes mais verdes, bonitos e prontos para viver.
            </h1>
            <p className="mb-8 text-lg leading-8 text-[var(--cor-texto-secundario)]">
              A {nomeEmpresa} conecta paisagismo, floricultura e venda de gramas
              em uma experiência simples para quem quer cuidar de jardins, áreas
              externas, condomínios, obras e espaços comerciais.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/gramas"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--cor-verde)] px-5 py-3 font-semibold text-white text-decoration-none shadow-sm transition hover:bg-[var(--cor-verde-escuro)]"
              >
              Ver opções para meu jardim
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
                Atendimento completo
              </p>
              <p className="mb-0 text-base leading-7 text-[var(--cor-texto)]">
                Uma vitrine digital para escolher gramas, plantas e soluções
                para paisagismo com suporte desde a decisão até a entrega.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--cor-borda)] bg-[var(--cor-fundo)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[var(--cor-verde)]">
              Sobre a empresa
            </p>
            <h2 className="mb-4 text-3xl font-bold leading-tight text-[var(--cor-marrom)]">
              Do cuidado com a planta ao acabamento do jardim.
            </h2>
            <p className="mb-0 leading-8 text-[var(--cor-texto-secundario)]">
              A proposta da {nomeEmpresa} é reunir em um só ecommerce as soluções
              que deixam áreas externas mais bonitas: gramas, plantas, itens de
              floricultura e apoio para decisões de paisagismo.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
              <FaSeedling className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
              <h3 className="mb-2 text-lg font-bold text-[var(--cor-marrom)]">Curadoria verde</h3>
              <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
                Uma comunicação comercial voltada para qualidade, origem e uso
                correto de cada solução para o jardim.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
              <FaHome className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
              <h3 className="mb-2 text-lg font-bold text-[var(--cor-marrom)]">Ambientes completos</h3>
              <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
                Ideal para clientes que querem gramado, plantas e acabamento
                visual em uma compra mais simples e bem orientada.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
          <FaRulerCombined className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
          <h2 className="mb-2 text-xl font-bold text-[var(--cor-marrom)]">Paisagismo para cada espaço</h2>
          <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
            Apresentação pensada para orientar escolhas por tipo de área,
            incidência de sol, circulação e estilo do ambiente.
          </p>
        </article>

        <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
          <FaStore className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
          <h2 className="mb-2 text-xl font-bold text-[var(--cor-marrom)]">Floricultura selecionada</h2>
          <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
            Espaço comercial para valorizar plantas, vasos, insumos e itens que
            completam jardins residenciais e comerciais.
          </p>
        </article>

        <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
          <FaTruck className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
          <h2 className="mb-2 text-xl font-bold text-[var(--cor-marrom)]">Compra com entrega organizada</h2>
          <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
            Jornada preparada para pedidos com dados de entrega, acompanhamento
            e comunicação clara com o cliente.
          </p>
        </article>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-verde-escuro)] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--cor-amarelo)]">
              Pronto para começar
            </p>
            <h2 className="mb-0 text-2xl font-bold">
              Escolha o melhor caminho para transformar seu espaço externo.
            </h2>
          </div>

          <Link
            href="/gramas"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--cor-amarelo)] px-5 py-3 text-center font-semibold text-[var(--cor-marrom)] text-decoration-none transition hover:bg-[var(--cor-amarelo-claro)]"
          >
            Conhecer soluções
          </Link>
        </div>
      </section>
    </main>
  );
}

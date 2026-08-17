import Link from "next/link";
import Image from "next/image";
import { FaDraftingCompass, FaHome, FaLeaf, FaSeedling, FaTruck } from "react-icons/fa";

/**
 * Pagina inicial pública do ecommerce de gramas.
 * Apresenta a proposta da loja sem listar produtos diretamente na home.
 */
export default function PaginaInicial() {
  const nomeEmpresa = process.env.NOME_EMPRESA || "";

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

          <div className="grid w-full grid-cols-1 gap-2 min-[420px]:grid-cols-3 sm:flex sm:w-auto sm:items-center sm:gap-3">
            <Link
              href="/produtos"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] px-3 py-2 text-center text-sm font-semibold text-[var(--cor-marrom)] text-decoration-none transition hover:border-[var(--cor-verde)] hover:text-[var(--cor-verde)] sm:px-4"
            >
              Produtos
            </Link>
            <Link
              href="/servicos"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] px-3 py-2 text-center text-sm font-semibold text-[var(--cor-marrom)] text-decoration-none transition hover:border-[var(--cor-verde)] hover:text-[var(--cor-verde)] sm:px-4"
            >
              Serviços
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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,247,0.96)_0%,rgba(255,253,247,0.86)_48%,rgba(47,107,63,0.38)_100%),url('/images/homeimage.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(240,189,61,0.22),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-[var(--cor-verde)]">
              Gramas, plantas e paisagismo em São Paulo
            </p>
            <h1 className="mb-5 text-4xl font-bold leading-tight text-[var(--cor-marrom)] sm:text-5xl lg:text-6xl">
              Gramas e plantas para todo o estado de São Paulo.
            </h1>
            <p className="mb-8 text-lg leading-8 text-[var(--cor-texto-secundario)]">
              A {nomeEmpresa} vende gramas e plantas para jardinagem com entrega
              em todo o estado de São Paulo e também presta serviço de paisagismo
              para residências, condomínios, obras e empresas.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/gramas"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--cor-verde)] px-5 py-3 font-semibold text-white text-decoration-none shadow-sm transition hover:bg-[var(--cor-verde-escuro)]"
              >
              Conhecer produtos e serviços
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
              <div className="relative mb-4 h-64 overflow-hidden rounded-lg border border-[var(--cor-borda)]">
                <Image
                  src="/images/foto1.png"
                  alt="Gramado verde em destaque para paisagismo"
                  fill
                  priority
                  sizes="(min-width: 1024px) 28rem, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-[var(--cor-texto-secundario)]">
                Atendimento completo
              </p>
              <p className="mb-0 text-base leading-7 text-[var(--cor-texto)]">
                Atendimento para compra de gramas e plantas, orientação para
                jardinagem e apoio em projetos de paisagismo do orçamento à entrega.
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
              Venda, entrega e projeto para áreas verdes.
            </h2>
            <p className="mb-0 leading-8 text-[var(--cor-texto-secundario)]">
              A proposta da {nomeEmpresa} é facilitar a compra de gramas e plantas
              para jardinagem em todo o estado de São Paulo, unindo atendimento
              comercial, entrega organizada e execução de paisagismo quando o
              cliente precisa de um projeto completo.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative min-h-64 overflow-hidden rounded-lg border border-[var(--cor-borda)] sm:col-span-2">
              <Image
                src="/images/foto2.png"
                alt="Detalhe de grama natural para jardins e áreas externas"
                fill
                sizes="(min-width: 1024px) 42rem, 100vw"
                className="object-cover"
              />
            </div>

            <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
              <FaSeedling className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
              <h3 className="mb-2 text-lg font-bold text-[var(--cor-marrom)]">Gramas e plantas selecionadas</h3>
              <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
                Opções para jardins, quintais, áreas comerciais, condomínios e
                obras que precisam de acabamento verde com boa orientação.
              </p>
            </article>

            <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
              <FaHome className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
              <h3 className="mb-2 text-lg font-bold text-[var(--cor-marrom)]">Paisagismo sob medida</h3>
              <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
                Serviço para planejar e transformar áreas externas com gramado,
                plantas, composição visual e implantação profissional.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
          <FaTruck className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
          <h2 className="mb-2 text-xl font-bold text-[var(--cor-marrom)]">Entrega em todo São Paulo</h2>
          <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
            Venda de gramas e plantas para clientes em diferentes regiões do
            estado, com pedido organizado e atendimento direto.
          </p>
        </article>

        <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
          <FaSeedling className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
          <h2 className="mb-2 text-xl font-bold text-[var(--cor-marrom)]">Jardinagem e floricultura</h2>
          <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
            Plantas, vasos e soluções para complementar jardins residenciais,
            comerciais e áreas verdes de condomínios.
          </p>
        </article>

        <article className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5">
          <FaDraftingCompass className="mb-4 text-2xl text-[var(--cor-verde)]" aria-hidden="true" />
          <h2 className="mb-2 text-xl font-bold text-[var(--cor-marrom)]">Serviço de paisagismo</h2>
          <p className="mb-0 leading-7 text-[var(--cor-texto-secundario)]">
            Projetos e execução para transformar espaços externos com escolha
            adequada de gramas, plantas e composição do jardim.
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
              Fale com a gente para comprar gramas, plantas ou iniciar seu projeto de paisagismo.
            </h2>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href="/produtos"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--cor-amarelo)] px-5 py-3 text-center font-semibold text-[var(--cor-marrom)] text-decoration-none transition hover:bg-[var(--cor-amarelo-claro)]"
            >
              Produtos
            </Link>
            <Link
              href="/servicos"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 py-3 text-center font-semibold text-white text-decoration-none transition hover:bg-white/20"
            >
              Serviços
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

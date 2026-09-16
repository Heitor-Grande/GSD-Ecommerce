"use client";

import ModalResposta from "@/components/modals/responseModal";
import { requisitarAPI, type RespostaApi } from "@/utils/api";
import { formatarCategoria, formatarNumeroInteiroParaExibicao, formatarValorComoMoedaReal } from "@/utils/mascaras";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaBoxOpen, FaChevronLeft, FaChevronRight, FaImage, FaLeaf, FaTruck } from "react-icons/fa";

const QUANTIDADE_PRODUTOS_POR_PAGINA = 12;

type ProdutoPublico = {
    id: number;
    nome: string;
    categoria: string;
    valorporunidade: number | string;
    quantidadeestoque: number;
    valorpromocional: boolean;
    frete_gratis: boolean;
    imagem_url: string | null;
};

type VitrineProdutosProps = {
    nomeEmpresa: string;
};

/** Vitrine pública paginada dos produtos disponíveis para venda. */
export default function VitrineProdutos({ nomeEmpresa }: VitrineProdutosProps) {
    const [produtos, setProdutos] = useState<ProdutoPublico[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [carregando, setCarregando] = useState(true);
    const [mensagemResposta, setMensagemResposta] = useState("");

    const totalPaginas = Math.max(1, Math.ceil(produtos.length / QUANTIDADE_PRODUTOS_POR_PAGINA));
    const paginaAtualLimitada = Math.min(paginaAtual, totalPaginas);
    const produtosPaginados = useMemo(() => {
        const inicio = (paginaAtualLimitada - 1) * QUANTIDADE_PRODUTOS_POR_PAGINA;

        return produtos.slice(inicio, inicio + QUANTIDADE_PRODUTOS_POR_PAGINA);
    }, [paginaAtualLimitada, produtos]);

    useEffect(() => {
        let componenteAtivo = true;

        /** Carrega os produtos liberados para a vitrine pública. */
        async function carregarProdutos() {
            try {
                setCarregando(true);
                const resposta = await requisitarAPI("/api/produtos", {
                    method: "GET",
                }) as RespostaApi<ProdutoPublico[]>;

                if (componenteAtivo) {
                    setProdutos(resposta.dados ?? []);
                }
            } catch (erro) {
                if (componenteAtivo) {
                    setMensagemResposta(
                        erro instanceof Error ? erro.message : "Não foi possível carregar os produtos."
                    );
                }
            } finally {
                if (componenteAtivo) {
                    setCarregando(false);
                }
            }
        }

        void carregarProdutos();

        return () => {
            componenteAtivo = false;
        };
    }, []);

    return (
        <main className="min-h-screen bg-[var(--cor-fundo)] text-[var(--cor-texto)]">
            <nav className="sticky top-0 z-20 border-b border-[var(--cor-borda)] bg-[var(--cor-superficie)]/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <Link href="/" className="flex min-w-0 items-center gap-3 text-decoration-none">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--cor-verde-escuro)] text-[var(--cor-amarelo)]">
                            <FaLeaf aria-hidden="true" />
                        </span>
                        <span className="truncate text-lg font-bold text-[var(--cor-marrom)]">{nomeEmpresa}</span>
                    </Link>

                    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                        <Link
                            href="/servicos"
                            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] px-4 py-2 text-sm font-semibold text-[var(--cor-marrom)] text-decoration-none transition hover:border-[var(--cor-verde)] hover:text-[var(--cor-verde)]"
                        >
                            Serviços
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--cor-verde)] px-4 py-2 text-center text-sm font-semibold text-white text-decoration-none transition hover:bg-[var(--cor-verde-escuro)]"
                        >
                            Minha conta
                        </Link>
                    </div>
                </div>
            </nav>

            <header className="border-b border-[var(--cor-borda)] bg-[var(--cor-superficie)]">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                    <p className="mb-3 text-sm font-bold uppercase text-[var(--cor-verde)]">Nossa loja</p>
                    <h1 className="mb-4 max-w-3xl text-3xl font-bold leading-tight text-[var(--cor-marrom)] sm:text-4xl">
                        Produtos para transformar seu jardim
                    </h1>
                    <p className="mb-0 max-w-3xl text-base leading-7 text-[var(--cor-texto-secundario)] sm:text-lg">
                        Encontre gramas, plantas, flores e itens para jardinagem com entrega em todo o estado de São Paulo.
                    </p>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="mb-1 text-2xl font-bold text-[var(--cor-marrom)]">Produtos disponíveis</h2>
                        <p className="mb-0 text-sm text-[var(--cor-texto-secundario)]">
                            {carregando ? "Carregando produtos..." : `${produtos.length} produto(s) encontrado(s)`}
                        </p>
                    </div>

                    {!carregando && produtos.length > 0 && (
                        <span className="text-sm font-semibold text-[var(--cor-texto-secundario)]">
                            Página {paginaAtualLimitada} de {totalPaginas}
                        </span>
                    )}
                </div>

                {!carregando && produtos.length === 0 && (
                    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-8 text-center">
                        <FaBoxOpen className="mb-4 text-4xl text-[var(--cor-verde)]" aria-hidden="true" />
                        <h2 className="mb-2 text-xl font-bold text-[var(--cor-marrom)]">Nenhum produto disponível</h2>
                        <p className="mb-0 max-w-md text-[var(--cor-texto-secundario)]">
                            Nossa vitrine está sendo atualizada. Volte em breve para conferir as novidades.
                        </p>
                    </div>
                )}

                {produtos.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {produtosPaginados.map((produto) => (
                            <article
                                key={produto.id}
                                className={`relative overflow-hidden rounded-lg border bg-[var(--cor-superficie)] ${
                                    produto.valorpromocional
                                        ? "border-[var(--cor-amarelo)] shadow-lg shadow-amber-900/10"
                                        : "border-[var(--cor-borda)] shadow-sm"
                                }`}
                            >
                                <div className="relative aspect-[4/3] bg-[var(--cor-superficie-suave)]">
                                    {produto.imagem_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={produto.imagem_url}
                                            alt={produto.nome}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[var(--cor-texto-secundario)]">
                                            <FaImage size={36} aria-hidden="true" />
                                        </div>
                                    )}

                                    {produto.valorpromocional && (
                                        <span className="absolute left-3 top-3 rounded-md bg-[var(--cor-amarelo)] px-3 py-1 text-xs font-bold uppercase text-[var(--cor-marrom)] shadow-sm">
                                            Promoção
                                        </span>
                                    )}
                                </div>

                                <div className="p-4">
                                    <p className="mb-1 text-xs font-bold uppercase text-[var(--cor-verde)]">
                                        {formatarCategoria(produto.categoria)}
                                    </p>
                                    <h3 className="mb-3 min-h-12 text-lg font-bold leading-6 text-[var(--cor-marrom)]">
                                        {produto.nome}
                                    </h3>

                                    <div className="mb-4">
                                        <strong className={`text-2xl ${produto.valorpromocional ? "text-amber-700" : "text-[var(--cor-verde-escuro)]"}`}>
                                            {formatarValorComoMoedaReal(produto.valorporunidade)}
                                        </strong>
                                        <span className="ml-1 text-xs text-[var(--cor-texto-secundario)]">/ un.</span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 border-t border-[var(--cor-borda)] pt-3 text-xs font-semibold">
                                        <span className="rounded-md bg-[var(--cor-verde-claro)] px-2.5 py-1 text-[var(--cor-verde-escuro)]">
                                            Estoque: {formatarNumeroInteiroParaExibicao(produto.quantidadeestoque)}
                                        </span>
                                        {produto.frete_gratis && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-[var(--cor-amarelo-claro)] px-2.5 py-1 text-[var(--cor-marrom)]">
                                                <FaTruck aria-hidden="true" />
                                                Frete grátis
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {totalPaginas > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-3 border-t border-[var(--cor-borda)] pt-6">
                        <button
                            type="button"
                            aria-label="Página anterior"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] text-[var(--cor-marrom)] disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={() => setPaginaAtual((pagina) => Math.max(1, pagina - 1))}
                            disabled={paginaAtualLimitada === 1}
                        >
                            <FaChevronLeft aria-hidden="true" />
                        </button>
                        <span className="min-w-24 text-center text-sm font-semibold text-[var(--cor-texto-secundario)]">
                            {paginaAtualLimitada} de {totalPaginas}
                        </span>
                        <button
                            type="button"
                            aria-label="Próxima página"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] text-[var(--cor-marrom)] disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={() => setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1))}
                            disabled={paginaAtualLimitada === totalPaginas}
                        >
                            <FaChevronRight aria-hidden="true" />
                        </button>
                    </div>
                )}
            </section>

            <ModalResposta
                isOpen={!!mensagemResposta}
                onClose={() => setMensagemResposta("")}
                title="Produtos"
                message={mensagemResposta}
            />
        </main>
    );
}

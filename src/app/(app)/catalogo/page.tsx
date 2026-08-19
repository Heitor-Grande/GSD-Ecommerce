"use client";

import { Botao } from "@/components/inputs/button";
import ModalResposta from "@/components/modals/responseModal";
import { requisitarAPI, type RespostaApi } from "@/utils/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaBoxOpen, FaChevronLeft, FaChevronRight, FaImage, FaPlus, FaTags } from "react-icons/fa";
import ModalCadastroProduto from "./components/modalCadastroProduto";

const CHAVE_EMPRESA_NAVEGACAO = "empresaNavegacaoId";
const QUANTIDADE_PRODUTOS_POR_PAGINA = 12;

type ProdutoCatalogo = {
    id: number;
    nome: string;
    categoria: string;
    valorporunidade: number | string;
    quantidadeestoque: number;
    ativo: boolean;
    valorpromocional: boolean;
    frete_gratis: boolean;
    imagem_url: string | null;
};

function formatarMoeda(valor: number | string): string {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return "R$ 0,00";
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatarCategoria(categoria: string): string {
    if (!categoria) {
        return "Sem categoria";
    }

    return categoria.charAt(0).toUpperCase() + categoria.slice(1);
}

/**
 * Pagina de catalogo administrativo.
 * Lista produtos em formato de vitrine com paginacao local de 12 itens por pagina.
 */
export default function PaginaCatalogo() {
    const [produtos, setProdutos] = useState<ProdutoCatalogo[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [carregando, setCarregando] = useState(true);
    const [mensagemResposta, setMensagemResposta] = useState("");
    const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
    const [idProdutoSelecionado, setIdProdutoSelecionado] = useState<number | null>(null);

    const totalPaginas = Math.max(1, Math.ceil(produtos.length / QUANTIDADE_PRODUTOS_POR_PAGINA));
    const paginaAtualLimitada = Math.min(paginaAtual, totalPaginas);

    const produtosPaginados = useMemo(() => {
        const inicio = (paginaAtualLimitada - 1) * QUANTIDADE_PRODUTOS_POR_PAGINA;

        return produtos.slice(inicio, inicio + QUANTIDADE_PRODUTOS_POR_PAGINA);
    }, [paginaAtualLimitada, produtos]);

    const carregarProdutosCadastrados = useCallback(async () => {
        try {
            setCarregando(true);
            setMensagemResposta("");

            const idEmpresaNavegacao = localStorage.getItem(CHAVE_EMPRESA_NAVEGACAO);

            if (!idEmpresaNavegacao) {
                setProdutos([]);
                setMensagemResposta("Selecione uma empresa de navegacao para visualizar o catalogo.");
                return;
            }

            const resposta = await requisitarAPI(`/api/catalogo?idEmpresa=${idEmpresaNavegacao}`, {
                method: "GET",
            }) as RespostaApi<ProdutoCatalogo[]>;

            if (!resposta.sucesso) {
                setProdutos([]);
                setMensagemResposta(resposta.msg || "Nao foi possivel carregar os produtos.");
                return;
            }

            setProdutos(resposta.dados ?? []);
            setPaginaAtual(1);
        } catch {
            setProdutos([]);
            setMensagemResposta("Nao foi possivel carregar os produtos.");
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            void carregarProdutosCadastrados();
        }, 0);

        return () => window.clearTimeout(timeout);
    }, [carregarProdutosCadastrados]);

    function irParaPaginaAnterior() {
        setPaginaAtual((pagina) => Math.max(1, pagina - 1));
    }

    function irParaProximaPagina() {
        setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1));
    }

    return (
        <div className="w-full">
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
                <div className="grid gap-4 md:grid-cols-12 md:items-center">
                    <div className="md:col-span-8 lg:col-span-9">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase text-blue-600">
                            <FaTags size={12} />
                            Catalogo
                        </span>
                        <h1 className="mb-2 text-2xl font-bold text-slate-900">Cadastro de produtos do ecommerce</h1>
                        <p className="mb-0 max-w-3xl text-sm leading-6 text-slate-500">
                            Gerencie a vitrine comercial com fotos, precos, estoque e destaques promocionais dos produtos.
                        </p>
                    </div>

                    <div className="md:col-span-4 lg:col-span-3">
                        <Botao
                            size="sm"
                            label="Novo produto"
                            icon={<FaPlus size={14} />}
                            onClick={() => {
                                setIdProdutoSelecionado(null);
                                setModalCadastroAberto(true);
                            }}
                            disabled={carregando}
                            loading={carregando}
                            variant="primary"
                            type="button"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 sm:p-6">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="mb-1 text-lg font-bold text-slate-900">Produtos cadastrados</h2>
                        <p className="mb-0 text-sm text-slate-500">
                            {carregando ? "Carregando produtos..." : `${produtos.length} produto(s) cadastrado(s)`}
                        </p>
                    </div>

                    <span className="inline-flex w-fit items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                        Pagina {paginaAtualLimitada} de {totalPaginas}
                    </span>
                </div>

                {!carregando && produtos.length === 0 && (
                    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                        <FaBoxOpen className="mb-3 text-slate-400" size={36} />
                        <h3 className="mb-2 text-base font-bold text-slate-800">Nenhum produto cadastrado</h3>
                        <p className="mb-0 max-w-md text-sm leading-6 text-slate-500">
                            Cadastre produtos para montar a vitrine do ecommerce e acompanhar os itens disponiveis para venda.
                        </p>
                    </div>
                )}

                {produtos.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {produtosPaginados.map((produto) => (
                            <button
                                type="button"
                                key={produto.id}
                                className={`cursor-pointer overflow-hidden rounded-xl border bg-white text-left shadow-md ${
                                    produto.valorpromocional
                                        ? "border-amber-300 shadow-amber-100"
                                        : "border-slate-200 shadow-slate-200/60"
                                }`}
                                onClick={() => {
                                   
                                    setIdProdutoSelecionado(parseInt(produto.id.toString()));
                                    setModalCadastroAberto(true);
                                }}
                            >
                                <div className="relative aspect-[4/3] bg-slate-100">
                                    {produto.imagem_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={produto.imagem_url}
                                            alt={produto.nome}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                            <FaImage size={34} />
                                        </div>
                                    )}

                                    {produto.valorpromocional && (
                                        <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase text-slate-950 shadow-sm">
                                            Promocao
                                        </span>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="mb-1 truncate text-base font-bold text-slate-900" title={produto.nome}>
                                                {produto.nome}
                                            </h3>
                                            <p className="mb-0 text-xs font-semibold uppercase text-slate-500">
                                                {formatarCategoria(produto.categoria)}
                                            </p>
                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${
                                                produto.ativo
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            {produto.ativo ? "Ativo" : "Inativo"}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <span
                                            className={`text-2xl font-black ${
                                                produto.valorpromocional ? "text-amber-600" : "text-blue-700"
                                            }`}
                                        >
                                            {formatarMoeda(produto.valorporunidade)}
                                        </span>
                                        <span className="ml-1 text-xs font-semibold text-slate-500">/ un.</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                            Estoque: {produto.quantidadeestoque}
                                        </span>
                                        {produto.frete_gratis && (
                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                Frete gratis
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {produtos.length > QUANTIDADE_PRODUTOS_POR_PAGINA && (
                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <Botao
                            size="sm"
                            label="Anterior"
                            icon={<FaChevronLeft size={12} />}
                            onClick={irParaPaginaAnterior}
                            disabled={paginaAtualLimitada === 1}
                            loading={false}
                            variant="outline-primary"
                            type="button"
                            className="w-full sm:w-auto"
                        />

                        <span className="text-center text-sm font-semibold text-slate-500">
                            Mostrando {produtosPaginados.length} de {produtos.length} produto(s)
                        </span>

                        <Botao
                            size="sm"
                            label="Proxima"
                            icon={<FaChevronRight size={12} />}
                            onClick={irParaProximaPagina}
                            disabled={paginaAtualLimitada === totalPaginas}
                            loading={false}
                            variant="outline-primary"
                            type="button"
                            className="w-full sm:w-auto"
                        />
                    </div>
                )}
            </div>

            {modalCadastroAberto && (
                <ModalCadastroProduto
                    aberto={modalCadastroAberto}
                    idProduto={idProdutoSelecionado}
                    aoFechar={() => {
                        setModalCadastroAberto(false);
                        setIdProdutoSelecionado(null);
                        void carregarProdutosCadastrados();
                    }}
                />
            )}

            <ModalResposta
                isOpen={!!mensagemResposta}
                onClose={() => setMensagemResposta("")}
                title="Catalogo"
                message={mensagemResposta}
            />
        </div>
    );
}

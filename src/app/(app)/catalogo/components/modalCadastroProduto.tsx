"use client";

import { Botao } from "@/components/inputs/button";
import { CampoTexto } from "@/components/inputs/input";
import { Seletor } from "@/components/inputs/select";
import ModalConfirmacao from "@/components/modals/confirmModal";
import { ModalCarregamento } from "@/components/modals/loading";
import ModalResposta from "@/components/modals/responseModal";
import { aplicarMascaraMoedaRealPorCentavos, aplicarMascaraNumeroInteiro, converterMoedaRealFormatadaParaNumero } from "@/utils/mascaras";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaExclamationTriangle, FaImage, FaSave, FaTimes, FaTrash, FaUpload } from "react-icons/fa";

type ModalCadastroProdutoProps = {
    aberto: boolean;
    idProduto?: number | null;
    aoFechar: () => void;
};

type DadosCadastroProduto = {
    nome: string;
    categoria: OpcaoCategoria | null;
    valorPorUnidade: string;
    ativo: boolean;
    valorPromocional: boolean;
    freteGratis: boolean;
    quantidadeEstoque: string;
    imagemIlustrativa: File | null;
    nomeImagemIlustrativa: string;
};

type OpcaoCategoria = {
    label: string;
    value: string;
};

const opcoesCategoria: OpcaoCategoria[] = [
    { label: "Flores", value: "flores" },
    { label: "Buques", value: "buques" },
    { label: "Plantas", value: "plantas" },
    { label: "Gramas", value: "gramas" },
    { label: "Jardim", value: "jardim" },
    { label: "Presentes", value: "presentes" },
    { label: "Vasos", value: "vasos" },
    { label: "Acessorios", value: "acessorios" },
];

const estadoInicialFormulario: DadosCadastroProduto = {
    nome: "",
    categoria: null,
    valorPorUnidade: "",
    ativo: true,
    valorPromocional: false,
    freteGratis: false,
    quantidadeEstoque: "",
    imagemIlustrativa: null,
    nomeImagemIlustrativa: "",
};

/**
 * Modal local de cadastro e edição de produto.
 * Use no fluxo de catálogo para cadastrar, atualizar e excluir produtos do ecommerce.
 */
export default function ModalCadastroProduto({
    aberto,
    idProduto,
    aoFechar,
}: ModalCadastroProdutoProps) {
    const [carregando] = useState(false);
    const [formulario, setFormulario] = useState<DadosCadastroProduto>(estadoInicialFormulario);
    const [imagemPreviewUrl, setImagemPreviewUrl] = useState("");
    const [mensagemResposta, setMensagemResposta] = useState("");
    const [modalConfirmacaoExclusaoAberto, setModalConfirmacaoExclusaoAberto] = useState(false);

    const estaEditandoProduto = typeof idProduto === "number" && idProduto > 0;
    const textoCarregamento = estaEditandoProduto ? "Atualizando produto..." : "Salvando produto...";
    const produtoSemEstoque = formulario.quantidadeEstoque !== "" && Number(formulario.quantidadeEstoque) === 0;

    function atualizarCampoFormulario(campo: keyof DadosCadastroProduto, valor: string | boolean) {
        setFormulario((estadoAtual) => {
            const valorNormalizado = campo === "nome" && typeof valor === "string"
                ? valor.slice(0, 40)
                : campo === "valorPorUnidade" && typeof valor === "string"
                    ? aplicarMascaraMoedaRealPorCentavos(valor)
                    : campo === "quantidadeEstoque" && typeof valor === "string"
                        ? aplicarMascaraNumeroInteiro(valor)
                        : valor;

            const estoqueNormalizado = campo === "quantidadeEstoque" && typeof valorNormalizado === "string"
                ? valorNormalizado
                : estadoAtual.quantidadeEstoque;

            return {
                ...estadoAtual,
                [campo]: valorNormalizado,
                ativo: campo === "quantidadeEstoque" && estoqueNormalizado !== "" && Number(estoqueNormalizado) === 0
                    ? false
                    : campo === "quantidadeEstoque" && Number(estoqueNormalizado) > 0
                        ? true
                        : estadoAtual.ativo,
            };
        });
    }

    useEffect(() => {
        return () => {
            if (imagemPreviewUrl) {
                URL.revokeObjectURL(imagemPreviewUrl);
            }
        };
    }, [imagemPreviewUrl]);

    function atualizarImagemIlustrativa(event: ChangeEvent<HTMLInputElement>) {
        const arquivo = event.target.files?.[0] ?? null;

        if (imagemPreviewUrl) {
            URL.revokeObjectURL(imagemPreviewUrl);
        }

        setFormulario((estadoAtual) => ({
            ...estadoAtual,
            imagemIlustrativa: arquivo,
            nomeImagemIlustrativa: arquivo?.name ?? "",
        }));
        setImagemPreviewUrl(arquivo ? URL.createObjectURL(arquivo) : "");
    }

    function fecharModalCadastroProduto() {
        if (carregando) {
            return;
        }

        setMensagemResposta("");
        setModalConfirmacaoExclusaoAberto(false);
        aoFechar();
    }

    function salvarProduto(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!formulario.categoria) {
            setMensagemResposta("Selecione a categoria do produto.");
            return;
        }

        const valorUnidadeNumerico = converterMoedaRealFormatadaParaNumero(formulario.valorPorUnidade);

        if (valorUnidadeNumerico === null || valorUnidadeNumerico <= 0) {
            
            setMensagemResposta("Informe o valor por unidade do produto.");
            return;
        }

        setMensagemResposta("Os campos do produto ainda serão definidos.");
    }

    function deletarProduto() {
        setModalConfirmacaoExclusaoAberto(false);
        setMensagemResposta("A exclusão do produto ainda será implementada.");
    }

    return (
        <>
            <Modal
                show={aberto}
                onHide={fecharModalCadastroProduto}
                centered
                size="lg"
            >
                <form onSubmit={salvarProduto}>
                    <Modal.Header closeButton={!carregando}>
                        <Modal.Title className="text-lg font-bold text-slate-900">
                            {estaEditandoProduto ? "Editar produto" : "Novo produto"}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="max-h-[calc(100dvh-12rem)] overflow-y-auto">
                        <div className="grid gap-4 md:grid-cols-12">
                            <div className="md:col-span-12">
                                <input
                                    id="produto-imagem-ilustrativa"
                                    className="sr-only"
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    required={!estaEditandoProduto}
                                    disabled={carregando}
                                    onChange={atualizarImagemIlustrativa}
                                />
                                <label
                                    className="group flex cursor-pointer flex-col items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-blue-300 hover:bg-blue-50/60 sm:flex-row sm:text-left"
                                    htmlFor="produto-imagem-ilustrativa"
                                >
                                    <span className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                        {imagemPreviewUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={imagemPreviewUrl}
                                                alt="Imagem selecionada do produto"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <FaImage className="text-3xl text-slate-300 transition group-hover:text-blue-300" />
                                        )}
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="mb-2 inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition group-hover:border-blue-700 group-hover:bg-blue-700 group-hover:text-white">
                                            <FaUpload size={13} />
                                            Selecionar imagem
                                        </span>
                                        <span className="block truncate text-sm font-semibold text-slate-700">
                                            {formulario.nomeImagemIlustrativa || "Imagem ilustrativa do produto"}
                                        </span>
                                        <span className="mt-1 block text-sm text-slate-500">
                                            Use uma imagem clara do produto para exibição no catálogo.
                                        </span>
                                    </span>
                                </label>
                            </div>

                            <div className="md:col-span-6">
                                <CampoTexto
                                    id="produto-nome"
                                    label="Nome"
                                    type="text"
                                    value={formulario.nome}
                                    placeholder="Nome do produto"
                                    onChange={(event) => atualizarCampoFormulario("nome", event.target.value)}
                                    disabled={carregando}
                                    required
                                    className="mb-0"
                                    helpText={`${formulario.nome.length}/40 caracteres`}
                                />
                            </div>

                            <div className="md:col-span-6">
                                <Seletor
                                    id="produto-categoria"
                                    label="Categoria"
                                    options={opcoesCategoria}
                                    value={formulario.categoria}
                                    onChange={(opcao) => setFormulario((estadoAtual) => ({
                                        ...estadoAtual,
                                        categoria: opcao,
                                    }))}
                                    placeholder="Selecione a categoria"
                                    isDisabled={carregando}
                                    isClearable={false}
                                    className="mb-0"
                                />
                            </div>

                            <div className="md:col-span-6">
                                <CampoTexto
                                    id="produto-valor-por-unidade"
                                    label="Valor por unidade"
                                    type="text"
                                    value={formulario.valorPorUnidade}
                                    placeholder="R$ 0,00"
                                    onChange={(event) => atualizarCampoFormulario("valorPorUnidade", event.target.value)}
                                    disabled={carregando}
                                    required
                                    className="mb-0"
                                />
                            </div>

                            <div className="md:col-span-6">
                                <CampoTexto
                                    id="produto-quantidade-estoque"
                                    label="Quantidade em estoque"
                                    type="text"
                                    value={formulario.quantidadeEstoque}
                                    placeholder="0"
                                    onChange={(event) => atualizarCampoFormulario("quantidadeEstoque", event.target.value)}
                                    disabled={carregando}
                                    required
                                    className="mb-0"
                                />
                            </div>

                            <div className="md:col-span-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        id="produto-ativo"
                                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                        type="checkbox"
                                        checked={formulario.ativo}
                                        disabled={carregando || produtoSemEstoque}
                                        onChange={(event) => atualizarCampoFormulario("ativo", event.target.checked)}
                                    />
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="produto-ativo">
                                        Produto ativo
                                    </label>
                                </div>
                            </div>

                            <div className="md:col-span-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        id="produto-valor-promocional"
                                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                        type="checkbox"
                                        checked={formulario.valorPromocional}
                                        disabled={carregando}
                                        onChange={(event) => atualizarCampoFormulario("valorPromocional", event.target.checked)}
                                    />
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="produto-valor-promocional">
                                        Valor promocional
                                    </label>
                                </div>
                            </div>

                            <div className="md:col-span-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        id="produto-frete-gratis"
                                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                        type="checkbox"
                                        checked={formulario.freteGratis}
                                        disabled={carregando}
                                        onChange={(event) => atualizarCampoFormulario("freteGratis", event.target.checked)}
                                    />
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="produto-frete-gratis">
                                        Frete gratis para esse produto?
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="hidden">
                            Campos do produto serão definidos nas próximas etapas.
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        {estaEditandoProduto && (
                            <Botao
                                size="sm"
                                label="Deletar"
                                icon={<FaTrash />}
                                onClick={() => setModalConfirmacaoExclusaoAberto(true)}
                                disabled={carregando}
                                loading={false}
                                variant="outline-danger"
                                type="button"
                                className="mr-auto"
                            />
                        )}

                        <Botao
                            size="sm"
                            label="Cancelar"
                            icon={<FaTimes />}
                            onClick={fecharModalCadastroProduto}
                            disabled={carregando}
                            loading={false}
                            variant="outline-secondary"
                            type="button"
                            className="ocultar-mobile"
                        />

                        <Botao
                            size="sm"
                            label={estaEditandoProduto ? "Atualizar" : "Salvar"}
                            icon={<FaSave />}
                            onClick={() => undefined}
                            disabled={carregando}
                            loading={carregando}
                            variant="outline-primary"
                            type="submit"
                            className=""
                        />
                    </Modal.Footer>
                </form>
            </Modal>

            <ModalConfirmacao
                isOpen={aberto && modalConfirmacaoExclusaoAberto}
                message="Deseja realmente excluir este produto?"
                icon={<FaExclamationTriangle className="text-4xl text-red-600" />}
                onConfirm={deletarProduto}
                onCancel={() => setModalConfirmacaoExclusaoAberto(false)}
                confirmLabel="Deletar"
                cancelLabel="Cancelar"
            />

            <ModalCarregamento
                show={aberto && carregando}
                text={textoCarregamento}
            />

            <ModalResposta
                isOpen={aberto && Boolean(mensagemResposta)}
                message={mensagemResposta}
                onClose={() => setMensagemResposta("")}
            />
        </>
    );
}

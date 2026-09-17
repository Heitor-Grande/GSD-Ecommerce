"use client";

import { FormEvent, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { Botao } from "@/components/inputs/button";
import { requisitarAPI } from "@/utils/api";
import { aplicarMascaraNumeroInteiro } from "@/utils/mascaras";
import type { DadosCadastroConta } from "../formularioCadastroConta";

type ModalVerificacaoEmailProps = {
    aberto: boolean;
    email: string;
    token: string;
    dadosCadastro: DadosCadastroConta;
    aoFechar: () => void;
    aoConcluir: (mensagem: string) => void;
};

/** Verifica o código recebido por e-mail e conclui o cadastro público do cliente. */
export default function ModalVerificacaoEmail({
    aberto,
    email,
    token,
    dadosCadastro,
    aoFechar,
    aoConcluir,
}: ModalVerificacaoEmailProps) {
    const [codigo, setCodigo] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    /** Confirma o código no servidor e envia o cadastro somente após a validação. */
    async function verificarCodigo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!/^\d{5}$/.test(codigo)) {
            setMensagem("Informe os 5 dígitos enviados para o seu e-mail.");
            return;
        }

        setCarregando(true);
        setMensagem("");

        try {
            await requisitarAPI("/api/cadConta/verificacao", {
                method: "PUT",
                body: {
                    token: token,
                    codigo: codigo,
                },
            });

            const respostaCadastro = await requisitarAPI("/api/cadConta", {
                method: "POST",
                body: {
                    ...dadosCadastro,
                    tokenVerificacao: token,
                    codigoVerificacao: codigo,
                },
            });

            aoConcluir(respostaCadastro.msg);
        } catch (erro) {
            setMensagem(
                erro instanceof Error
                    ? erro.message
                    : "Não foi possível verificar o código."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <Modal
            show={aberto}
            onHide={() => {
                if (!carregando) {
                    aoFechar();
                }
            }}
            centered
            size="sm"
        >
            <Modal.Header closeButton={!carregando} className="border-b border-[var(--cor-borda)] px-5 py-4">
                <Modal.Title className="flex items-center gap-2 text-lg font-bold text-[var(--cor-marrom)]">
                    <FaShieldAlt className="text-[var(--cor-verde)]" aria-hidden="true" />
                    Verificar e-mail
                </Modal.Title>
            </Modal.Header>

            <form id="form-verificacao-email" onSubmit={verificarCodigo}>
                <Modal.Body className="px-5 py-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--cor-verde-claro)] text-xl text-[var(--cor-verde-escuro)]">
                        <FaEnvelope aria-hidden="true" />
                    </div>
                    <p className="mb-5 text-sm leading-6 text-[var(--cor-texto-secundario)]">
                        Digite o código de 5 dígitos enviado para <strong className="text-[var(--cor-marrom)]">{email}</strong>.
                    </p>

                    <label htmlFor="codigoVerificacao" className="block text-sm font-semibold text-[var(--cor-marrom)]">
                        Código de verificação
                    </label>
                    <input
                        id="codigoVerificacao"
                        type="text"
                        value={codigo}
                        onChange={(event) => {
                            setCodigo(aplicarMascaraNumeroInteiro(event.target.value).slice(0, 5));
                            setMensagem("");
                        }}
                        className="mt-1 block min-h-12 w-full rounded-lg border border-[var(--cor-borda)] bg-white px-4 py-3 text-center text-2xl font-bold tracking-[0.35em] text-[var(--cor-marrom)] outline-none focus:border-[var(--cor-verde)] focus:ring-2 focus:ring-[var(--cor-verde-claro)]"
                        placeholder="00000"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={5}
                        disabled={carregando}
                        autoFocus
                        required
                    />

                    {mensagem && (
                        <p className="mb-0 mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" role="alert">
                            {mensagem}
                        </p>
                    )}
                </Modal.Body>

                <Modal.Footer className="border-t border-[var(--cor-borda)] px-5 py-4">
                    <Botao
                        size="sm"
                        label="Cancelar"
                        onClick={aoFechar}
                        disabled={carregando}
                        loading={false}
                        variant="outline-secondary"
                        type="button"
                        className="ocultar-mobile"
                    />
                    <Botao
                        size="sm"
                        label="Verificar"
                        icon={<FaShieldAlt aria-hidden="true" />}
                        onClick={() => undefined}
                        disabled={codigo.length !== 5 || carregando}
                        loading={carregando}
                        variant="primary"
                        type="submit"
                        form="form-verificacao-email"
                        className="w-full !border-[var(--cor-verde)] !bg-[var(--cor-verde)] hover:!bg-[var(--cor-verde-escuro)] sm:w-auto"
                    />
                </Modal.Footer>
            </form>
        </Modal>
    );
}

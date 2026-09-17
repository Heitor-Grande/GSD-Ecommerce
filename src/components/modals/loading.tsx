"use client";

import { Modal } from "react-bootstrap";

interface LoadingModalProps {
    show: boolean;
    text?: string;
}

/**
 * Modal bloqueante de carregamento.
 * Use durante chamadas de API ou processos assincronos para impedir nova interacao ate a conclusao.
 */
export function ModalCarregamento({
    show,
    text = "Processando solicitacao...",
}: LoadingModalProps) {
    return (
        <Modal
            show={show}
            centered
            backdrop="static"
            keyboard={false}
            size="sm"
            contentClassName="loading-modal border-0 rounded-xl shadow-2xl"
        >
            <Modal.Body className="px-6 py-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--cor-verde-claro)] text-[var(--cor-verde)]">
                    <span className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--cor-borda)] border-t-[var(--cor-verde)]" role="status" aria-hidden="true" />
                </div>

                <p className="mb-1 text-lg font-bold text-[var(--cor-texto)]">Aguarde</p>
                <p className="mb-0 text-sm leading-relaxed text-[var(--cor-texto-secundario)]">{text}</p>
            </Modal.Body>
        </Modal>
    );
}

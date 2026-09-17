"use client";

import { Botao } from "@/components/inputs/button";
import { ModalCarregamento } from "@/components/modals/loading";
import ModalResposta from "@/components/modals/responseModal";
import { requisitarAPI } from "@/utils/api";
import { aplicarMascaraCelular, aplicarMascaraCpfCnpj } from "@/utils/mascaras";
import { validarComplexidadeSenha } from "@/utils/validacoes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaLeaf, FaUserPlus } from "react-icons/fa";

type FormularioCadastroContaProps = {
    nomeEmpresa: string;
};

type DadosCadastroConta = {
    nome: string;
    documento: string;
    dataNascimento: string;
    celular: string;
    email: string;
    senha: string;
    confirmarSenha: string;
};

const DADOS_INICIAIS: DadosCadastroConta = {
    nome: "",
    documento: "",
    dataNascimento: "",
    celular: "",
    email: "",
    senha: "",
    confirmarSenha: "",
};

const CLASSE_INPUT = "mt-1 block min-h-11 w-full rounded-lg border border-[var(--cor-borda)] bg-white px-3 py-2.5 text-sm text-[var(--cor-texto)] shadow-sm outline-none transition placeholder:text-[var(--cor-texto-secundario)]/65 focus:border-[var(--cor-verde)] focus:ring-2 focus:ring-[var(--cor-verde-claro)]";
const CLASSE_LABEL = "block text-sm font-semibold text-[var(--cor-marrom)]";

/** Formulário client-side de cadastro da conta do cliente. */
export function FormularioCadastroConta({ nomeEmpresa }: FormularioCadastroContaProps) {
    const router = useRouter();
    const [dados, setDados] = useState<DadosCadastroConta>(DADOS_INICIAIS);
    const [mensagemFormulario, setMensagemFormulario] = useState("");
    const [mensagemResposta, setMensagemResposta] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [cadastroConcluido, setCadastroConcluido] = useState(false);

    /** Atualiza um campo e limpa o retorno da validação anterior. */
    function atualizarCampo(campo: keyof DadosCadastroConta, valor: string) {
        setDados((dadosAtuais) => ({
            ...dadosAtuais,
            [campo]: valor,
        }));
        setMensagemFormulario("");
    }

    /** Valida os dados e solicita a criação pública da conta do cliente. */
    async function validarFormulario(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const quantidadeDigitosDocumento = dados.documento.replace(/\D/g, "").length;
        const quantidadeDigitosCelular = dados.celular.replace(/\D/g, "").length;

        if (quantidadeDigitosDocumento !== 11 && quantidadeDigitosDocumento !== 14) {
            setMensagemFormulario("Informe um CPF ou CNPJ completo.");
            return;
        }

        if (quantidadeDigitosCelular !== 11) {
            setMensagemFormulario("Informe um número de celular com DDD.");
            return;
        }

        const resultadoValidacaoSenha = validarComplexidadeSenha(dados.senha);

        if (!resultadoValidacaoSenha.valida) {
            setMensagemFormulario(resultadoValidacaoSenha.mensagem);
            return;
        }

        if (dados.senha !== dados.confirmarSenha) {
            setMensagemFormulario("A confirmação da senha deve ser igual à senha.");
            return;
        }

        setCarregando(true);
        setMensagemFormulario("");
        setMensagemResposta("");
        setCadastroConcluido(false);

        try {
            const resposta = await requisitarAPI("/api/cadConta", {
                method: "POST",
                body: dados,
            });

            setDados(DADOS_INICIAIS);
            setCadastroConcluido(true);
            setMensagemResposta(resposta.msg);
        } catch (erro) {
            const mensagemErro = erro instanceof Error
                ? erro.message
                : "Não foi possível criar a conta.";

            setMensagemResposta(mensagemErro);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="min-h-screen bg-[var(--cor-fundo)] text-[var(--cor-texto)]">
            <nav className="border-b border-[var(--cor-borda)] bg-[var(--cor-superficie)]">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex min-w-0 items-center gap-3 text-decoration-none">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--cor-verde-escuro)] text-[var(--cor-amarelo)]">
                            <FaLeaf aria-hidden="true" />
                        </span>
                        <span className="truncate text-lg font-bold text-[var(--cor-marrom)]">{nomeEmpresa}</span>
                    </Link>

                    <Link
                        href="/login"
                        className="shrink-0 text-sm font-semibold text-[var(--cor-verde)] text-decoration-none hover:text-[var(--cor-verde-escuro)]"
                    >
                        Já tenho uma conta
                    </Link>
                </div>
            </nav>

            <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:px-8 lg:py-14">
                <div className="lg:sticky lg:top-8">
                    <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--cor-verde)] text-xl text-white">
                        <FaUserPlus aria-hidden="true" />
                    </span>
                    <p className="mb-2 text-sm font-bold uppercase text-[var(--cor-verde)]">Área do cliente</p>
                    <h1 className="mb-4 text-3xl font-bold leading-tight text-[var(--cor-marrom)] sm:text-4xl">
                        Criar minha conta
                    </h1>
                    <p className="mb-0 max-w-md leading-7 text-[var(--cor-texto-secundario)]">
                        Preencha seus dados para criar seu acesso e acompanhar seus pedidos.
                    </p>
                </div>

                <div className="rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-superficie)] p-5 shadow-lg shadow-[rgba(75,47,31,0.08)] sm:p-8">
                    <form onSubmit={validarFormulario}>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="nome" className={CLASSE_LABEL}>Nome completo</label>
                                <input
                                    id="nome"
                                    type="text"
                                    value={dados.nome}
                                    onChange={(event) => atualizarCampo("nome", event.target.value)}
                                    className={CLASSE_INPUT}
                                    placeholder="Digite seu nome completo"
                                    autoComplete="name"
                                    maxLength={120}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="documento" className={CLASSE_LABEL}>CPF/CNPJ</label>
                                <input
                                    id="documento"
                                    type="text"
                                    value={dados.documento}
                                    onChange={(event) => atualizarCampo("documento", aplicarMascaraCpfCnpj(event.target.value))}
                                    className={CLASSE_INPUT}
                                    placeholder="000.000.000-00"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    maxLength={18}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="dataNascimento" className={CLASSE_LABEL}>Data de nascimento</label>
                                <input
                                    id="dataNascimento"
                                    type="date"
                                    value={dados.dataNascimento}
                                    onChange={(event) => atualizarCampo("dataNascimento", event.target.value)}
                                    className={CLASSE_INPUT}
                                    autoComplete="bday"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="celular" className={CLASSE_LABEL}>Número de celular para contato</label>
                                <input
                                    id="celular"
                                    type="tel"
                                    value={dados.celular}
                                    onChange={(event) => atualizarCampo("celular", aplicarMascaraCelular(event.target.value))}
                                    className={CLASSE_INPUT}
                                    placeholder="(00) 00000-0000"
                                    inputMode="tel"
                                    autoComplete="tel"
                                    maxLength={15}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className={CLASSE_LABEL}>E-mail</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={dados.email}
                                    onChange={(event) => atualizarCampo("email", event.target.value)}
                                    className={CLASSE_INPUT}
                                    placeholder="seuemail@exemplo.com"
                                    autoComplete="email"
                                    maxLength={160}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="senha" className={CLASSE_LABEL}>Senha</label>
                                <input
                                    id="senha"
                                    type="password"
                                    value={dados.senha}
                                    onChange={(event) => atualizarCampo("senha", event.target.value)}
                                    className={CLASSE_INPUT}
                                    placeholder="Mínimo de 11 caracteres"
                                    autoComplete="new-password"
                                    minLength={11}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmarSenha" className={CLASSE_LABEL}>Confirmar senha</label>
                                <input
                                    id="confirmarSenha"
                                    type="password"
                                    value={dados.confirmarSenha}
                                    onChange={(event) => atualizarCampo("confirmarSenha", event.target.value)}
                                    className={CLASSE_INPUT}
                                    placeholder="Digite a senha novamente"
                                    autoComplete="new-password"
                                    minLength={11}
                                    required
                                />
                            </div>
                        </div>

                        {mensagemFormulario && (
                            <p
                                role="status"
                                className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                            >
                                {mensagemFormulario}
                            </p>
                        )}

                        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[var(--cor-borda)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                href="/"
                                className="inline-flex min-h-12 items-center justify-center px-3 font-semibold text-[var(--cor-texto-secundario)] text-decoration-none hover:text-[var(--cor-marrom)]"
                            >
                                Voltar para a página inicial
                            </Link>

                            <Botao
                                size="lg"
                                label="Criar minha conta"
                                icon={<FaUserPlus aria-hidden="true" />}
                                onClick={() => undefined}
                                disabled={carregando}
                                loading={carregando}
                                variant="primary"
                                type="submit"
                                className="w-full !border-[var(--cor-verde)] !bg-[var(--cor-verde)] hover:!border-[var(--cor-verde-escuro)] hover:!bg-[var(--cor-verde-escuro)] focus-visible:!outline-[var(--cor-amarelo)] sm:w-auto"
                            />
                        </div>
                    </form>
                </div>
            </section>

            <ModalResposta
                isOpen={Boolean(mensagemResposta)}
                title={cadastroConcluido ? "Conta criada" : "Cadastro"}
                message={mensagemResposta}
                onClose={() => {
                    setMensagemResposta("");

                    if (cadastroConcluido) {
                        router.push("/login");
                    }
                }}
            />

            <ModalCarregamento
                show={carregando}
                text="Criando sua conta..."
            />
        </main>
    );
}

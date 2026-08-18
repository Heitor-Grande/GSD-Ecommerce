create table if not exists public.produtos (
    id bigserial not null,
    id_empresa bigint not null,
    nome varchar(40) not null,
    categoria varchar(40) not null,
    valorporunidade numeric(12, 2) not null,
    quantidadeestoque integer not null,
    ativo boolean default true not null,
    valorpromocional boolean default false not null,
    frete_gratis boolean default false not null,
    imagemilustrativa text null,
    criacao_em timestamptz default now() not null,
    atualizado_em timestamptz default now() not null,
    criado_por bigint not null,
    atualizado_por bigint null,
    constraint produtos_pkey primary key (id),
    constraint produtos_id_empresa_fkey foreign key (id_empresa) references public.empresas (id),
    constraint produtos_criado_por_fkey foreign key (criado_por) references public.usuarios (id),
    constraint produtos_atualizado_por_fkey foreign key (atualizado_por) references public.usuarios (id)
);

create index if not exists produtos_id_empresa_idx
    on public.produtos using btree (id_empresa);

create index if not exists produtos_criado_por_idx
    on public.produtos using btree (criado_por);

create index if not exists produtos_atualizado_por_idx
    on public.produtos using btree (atualizado_por);

create index if not exists produtos_categoria_idx
    on public.produtos using btree (categoria);

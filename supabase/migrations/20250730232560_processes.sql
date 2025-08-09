-- Crear la tabla de procesos
create table if not exists processes (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    type text not null,
    status text not null default 'stopped',
    port integer,
    command text,
    service_id uuid references services(id) on delete cascade not null,
    provider_id uuid references providers(id) on delete cascade not null,
    configuration jsonb not null default '{
        "envVars": {},
        "autoRestart": true,
        "healthCheck": {
            "command": "",
            "interval": 30,
            "timeout": 5,
            "retries": 3
        }
    }',
    resources jsonb not null default '{
        "cpu": {
            "limit": 1,
            "reserved": 0.5
        },
        "memory": {
            "limit": 1024,
            "reserved": 512
        }
    }',
    dependencies uuid[] default array[]::uuid[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear índices
create index if not exists processes_service_id_idx on processes(service_id);
create index if not exists processes_provider_id_idx on processes(provider_id);
create index if not exists processes_type_idx on processes(type);
create index if not exists processes_status_idx on processes(status);

-- Crear políticas RLS
alter table processes enable row level security;

create policy "Users can view processes"
    on processes for select
    using (
        exists (
            select 1 from services
            where services.id = processes.service_id
            and exists (
                select 1 from user_services
                where user_services.service_id = services.id
                and user_services.user_id = auth.uid()
            )
        )
    );

create policy "Users can insert processes"
    on processes for insert
    with check (
        exists (
            select 1 from services
            where services.id = processes.service_id
            and exists (
                select 1 from user_services
                where user_services.service_id = services.id
                and user_services.user_id = auth.uid()
                and user_services.role in ('owner', 'admin')
            )
        )
    );

create policy "Users can update processes"
    on processes for update
    using (
        exists (
            select 1 from services
            where services.id = processes.service_id
            and exists (
                select 1 from user_services
                where user_services.service_id = services.id
                and user_services.user_id = auth.uid()
                and user_services.role in ('owner', 'admin')
            )
        )
    );

create policy "Users can delete processes"
    on processes for delete
    using (
        exists (
            select 1 from services
            where services.id = processes.service_id
            and exists (
                select 1 from user_services
                where user_services.service_id = services.id
                and user_services.user_id = auth.uid()
                and user_services.role in ('owner', 'admin')
            )
        )
    );

-- Función para actualizar updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Trigger para actualizar updated_at
create trigger update_processes_updated_at
    before update on processes
    for each row
    execute function update_updated_at_column();

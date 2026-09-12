-- Esquema inicial de Entre Yerbas para Supabase/PostgreSQL.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  description text not null default '',
  weight text not null,
  price numeric(12,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  image_url text,
  accent text not null default '#2f7057',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select on public.admin_users to authenticated;

alter table public.products enable row level security;
alter table public.admin_users enable row level security;

create policy "Productos activos visibles públicamente" on public.products for select to anon using (active = true);
create policy "Administradores pueden ver todos los productos" on public.products for select to authenticated using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Administradores pueden agregar productos" on public.products for insert to authenticated with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Administradores pueden modificar productos" on public.products for update to authenticated using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))) with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Administradores pueden eliminar productos" on public.products for delete to authenticated using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Administradores pueden validar su acceso" on public.admin_users for select to authenticated using (user_id = (select auth.uid()));

insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do update set public = true;
create policy "Fotos de productos públicas" on storage.objects for select to anon, authenticated using (bucket_id = 'products');
create policy "Administradores pueden subir fotos" on storage.objects for insert to authenticated with check (bucket_id = 'products' and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Administradores pueden actualizar fotos" on storage.objects for update to authenticated using (bucket_id = 'products' and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))) with check (bucket_id = 'products' and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Administradores pueden borrar fotos" on storage.objects for delete to authenticated using (bucket_id = 'products' and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

create or replace function public.set_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();

-- Tras crear el usuario en Authentication, agregarlo como administrador:
-- insert into public.admin_users (user_id) select id from auth.users where lower(email) = lower('correo@ejemplo.com');

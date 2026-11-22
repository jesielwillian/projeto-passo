-- PASSO LABS · vincula a conta administrativa ao painel
-- Pré-requisito: criar primeiro o usuário em Supabase > Authentication > Users.
-- Este script não cria nem armazena senha. Ele apenas concede a permissão de admin
-- ao usuário já existente com o e-mail configurado abaixo.

do $$
declare
  admin_uuid uuid;
  admin_email text := 'jesielwillianvieira1989@gmail.com';
begin
  select id
    into admin_uuid
    from auth.users
   where lower(email) = lower(admin_email)
   limit 1;

  if admin_uuid is null then
    raise exception 'Usuário % não encontrado. Crie a conta em Authentication > Users e execute este script novamente.', admin_email;
  end if;

  insert into public.admin_users (user_id)
  values (admin_uuid)
  on conflict (user_id) do nothing;
end;
$$;

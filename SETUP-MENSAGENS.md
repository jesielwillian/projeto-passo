# Central de mensagens — configuração

1. Abra o projeto no Supabase e entre em **SQL Editor**.
2. Execute o conteúdo de `supabase/contact-messages.sql`.
3. Publique os arquivos atualizados do projeto.
4. Confirme que a conta de administrador está cadastrada em `admin_users` (o painel já usa essa tabela para autorizar acesso).

O formulário salva mensagens em `contact_messages`; o painel carrega, filtra e permite marcar mensagens como respondidas. O botão **Responder por e-mail** abre o aplicativo de e-mail do administrador com destinatário e assunto preenchidos. Para enviar a resposta dentro do próprio painel, será necessário configurar um provedor de e-mail e um endpoint backend com credenciais privadas.

O catálogo agora usa cards responsivos e mantém as ações de editar/excluir e o cadastro existente.

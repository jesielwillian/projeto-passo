<div align="center">

# PASSO LABS
### Move Beyond. Menos pressa. Mais caminho.

**Documentação técnica · arquitetura · mapa de arquivos · operação**

</div>

---

## 1. Visão geral

A **PASSO LABS** é uma loja digital de tênis e movimento. O projeto reúne uma experiência de marca editorial, catálogo de produtos, carrinho persistente, checkout integrado ao Mercado Pago, consulta de pedidos e páginas institucionais.

A aplicação é dividida em duas camadas:

- **Front-end:** HTML semântico, CSS responsivo e JavaScript nativo.
- **Back-end:** Node.js, Express e SQLite, responsável por validar pedidos, calcular valores e conversar com o Mercado Pago.

> **Princípio de confiança:** o navegador não é a fonte oficial de preços, frete ou estado do pagamento. O servidor mantém o catálogo autorizado, recalcula os valores e confirma o pagamento com o provedor.

## 2. Mapa completo do projeto

```text
passo/
├── index.html                    # Home, marca e vitrine de produtos
├── checkout.html                 # Dados do cliente e resumo do pedido
├── pedido-status.html            # Acompanhamento do pagamento/pedido
│
├── entrega-e-frete.html          # Política e informações de entrega
├── fale-com-a-gente.html         # Canais e formulário de contato
├── guia-de-tamanhos.html         # Guia de medidas e tamanhos
├── trocas-e-devolucoes.html      # Política de trocas e devoluções
├── privacidade.html              # Política de privacidade
├── termos-de-uso.html            # Termos e condições de uso
├── trabalhe-conosco.html         # Página de oportunidades profissionais
│
├── assets/
│   ├── css/
│   │   ├── style.css             # Tokens, reset, layout, componentes e loja
│   │   └── info-pages.css        # Componentes e layouts institucionais
│   │
│   ├── js/
│   │   ├── app.js                # Catálogo, filtros, busca, favoritos e carrinho
│   │   ├── checkout.js           # Validação e envio do checkout
│   │   ├── custom-select.js      # Select customizado acessível
│   │   └── order-status.js       # Consulta e renderização do status do pedido
│   │
│   └── images/
│       ├── historia.jpg          # Imagem editorial da marca
│       ├── tenis.png             # Imagem institucional/visual
│       └── produtos/
│           ├── tenis-01.webp     # Move Air
│           ├── tenis-02.webp     # Cloud Walk
│           ├── tenis-03.webp     # Urban Flow
│           ├── tenis-04.webp     # Trail Flex
│           ├── tenis-05.webp     # Breeze Knit
│           ├── tenis-06.webp     # Pace Pro
│           ├── tenis-07.webp     # Daily Ease
│           └── tenis-08.webp     # Terra Move
│
├── server/
│   └── server.js                # API, regras comerciais, SQLite e Mercado Pago
│
├── .env.example                 # Modelo de configuração local/produção
├── .gitignore                   # Arquivos e dados que não devem ir ao Git
├── package.json                 # Scripts, runtime e dependências
├── package-lock.json            # Versões resolvidas das dependências
├── vercel.json                  # Regras de URL/rewrites da Vercel
└── README.md                    # Esta documentação
```

### 2.1. Mapa de páginas

| Página | Arquivo | Estilos | JavaScript principal |
|---|---|---|---|
| Loja / início | `index.html` | `style.css` | `app.js` |
| Checkout | `checkout.html` | `style.css` | `custom-select.js`, `checkout.js` |
| Status do pedido | `pedido-status.html` | `style.css` | `order-status.js` |
| Entrega e frete | `entrega-e-frete.html` | `style.css`, `info-pages.css` | Script da própria página |
| Fale com a gente | `fale-com-a-gente.html` | `style.css`, `info-pages.css` | Script da página e `custom-select.js` |
| Guia de tamanhos | `guia-de-tamanhos.html` | `style.css`, `info-pages.css` | Script da própria página |
| Trocas e devoluções | `trocas-e-devolucoes.html` | `style.css`, `info-pages.css` | Script da própria página |
| Privacidade | `privacidade.html` | `style.css`, `info-pages.css` | Script da própria página |
| Termos de uso | `termos-de-uso.html` | `style.css`, `info-pages.css` | Script da própria página |
| Trabalhe conosco | `trabalhe-conosco.html` | `style.css`, `info-pages.css` | Script da página e `custom-select.js` |

## 3. Stack e dependências

### Front-end

- **HTML5:** estrutura semântica das páginas.
- **CSS3:** design system, layouts, estados, animações e breakpoints.
- **JavaScript:** interações sem framework, manipulação do DOM e chamadas à API.
- **Google Fonts:** DM Sans e Space Grotesk.
- **Font Awesome 6.7.2:** biblioteca de ícones carregada por CDN.

### Back-end

| Tecnologia | Papel |
|---|---|
| Node.js `>=20` | Runtime JavaScript do servidor |
| Express `4.21` | Servidor HTTP e endpoints REST |
| better-sqlite3 | Persistência relacional local |
| Mercado Pago | Criação e acompanhamento do pagamento |
| Helmet | Cabeçalhos de segurança HTTP |
| express-rate-limit | Limitação de requisições |
| dotenv | Carregamento de variáveis de ambiente |

## 4. Organização e convenções de código

### CSS

`assets/css/style.css` concentra os estilos compartilhados e a interface da loja. `assets/css/info-pages.css` contém somente as regras complementares das páginas institucionais.

A leitura recomendada segue esta hierarquia:

1. Tokens e variáveis globais (`:root`).
2. Reset e elementos base.
3. Containers e estrutura de layout.
4. Componentes reutilizáveis.
5. Seções e páginas específicas.
6. Estados, interações e acessibilidade.
7. Animações (`@keyframes`).
8. Media queries e ajustes responsivos.

As propriedades foram colocadas em ordem alfabética quando a troca não interfere na cascata. Quando há relações entre shorthand/longhand, propriedades repetidas ou dependência da ordem original, a sequência é preservada. A ordem dos seletores e dos breakpoints também é mantida quando necessária para evitar regressões visuais.

### JavaScript

Os scripts são organizados por responsabilidade e encapsulados para evitar variáveis globais desnecessárias. Comentários devem explicar intenção, regra de negócio ou comportamento não óbvio — não repetir literalmente o nome da função.

- `app.js`: catálogo e estado da experiência de compra.
- `checkout.js`: leitura do carrinho, resumo, validação e criação do pedido.
- `custom-select.js`: aprimoramento progressivo dos campos `select`.
- `order-status.js`: consulta periódica/manual e atualização visual do status.
- `server.js`: configuração, persistência, validações, integração externa e rotas.

### HTML

Cada página mantém sua própria estrutura, metadados, navegação e conteúdo. Recursos compartilhados são carregados por caminhos relativos a partir da raiz do projeto. Scripts que dependem do DOM devem permanecer no fim do `body` ou usar `defer`.

## 5. Fluxo da compra

```text
index.html
   │
   ├── app.js ── catálogo / filtros / busca / favoritos
   │                 │
   │                 └── carrinho (localStorage: passo:cart)
   │
   ▼
checkout.html
   │
   ├── checkout.js ── validação do formulário
   │                 │
   │                 └── POST /api/orders
   │
   ▼
server/server.js
   │
   ├── valida cliente e itens
   ├── recalcula preços e frete pelo catálogo do servidor
   ├── registra pedido no SQLite
   └── cria a ordem no Mercado Pago
          │
          ▼
   Checkout Pro do Mercado Pago
          │
          ├── retorno do navegador → pedido-status.html
          └── webhook → atualização do pedido no SQLite
                              │
                              ▼
                   GET /api/order-status/:id
```

O carrinho é mantido no navegador para conveniência, mas os valores submetidos pelo cliente não são considerados confiáveis. O servidor deve continuar sendo a autoridade para preço, frete, total e estado final do pagamento.

## 6. API HTTP

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/api/health` | Verifica disponibilidade e ambiente da API |
| `POST` | `/api/orders` | Valida e cria pedido/ordem de pagamento |
| `GET` | `/api/order-status/:id` | Consulta e sincroniza o status do pedido |
| `POST` | `/api/webhooks/mercadopago` | Recebe notificações do Mercado Pago |

### 6.1. Criação do pedido

O front-end envia para `POST /api/orders` os dados do cliente, método de pagamento, itens e identificador de requisição/idempotência. O servidor valida os campos, confere os IDs no catálogo interno, calcula os valores e então solicita a criação da ordem ao Mercado Pago.

A resposta de sucesso fornece, entre outros dados, o identificador do pedido e a URL de checkout do provedor. O navegador deve redirecionar o cliente para essa URL — nunca deve receber ou armazenar o Access Token.

### 6.2. Consulta de status

`GET /api/order-status/:id` consulta o registro local e, quando aplicável, sincroniza estados ainda pendentes com o Mercado Pago. A página `pedido-status.html` usa esse endpoint para apresentar a situação atual.

### 6.3. Webhook

`POST /api/webhooks/mercadopago` valida a assinatura recebida com o segredo configurado e sincroniza o estado local com a informação obtida do provedor. O webhook deve ser configurado no painel do Mercado Pago com uma URL pública HTTPS.

> Para payloads completos, códigos de resposta e regras de validação, consulte diretamente os handlers correspondentes em `server/server.js`. Este README descreve o contrato funcional sem substituir a implementação.

## 7. Banco de dados e persistência

O banco é SQLite, acessado por `better-sqlite3`. Por padrão, o arquivo é criado em `server/data/orders.sqlite`. É possível alterar o caminho usando `DATABASE_PATH`.

O projeto utiliza consultas preparadas e configurações de banco definidas no servidor. A pasta `server/data/` e os arquivos SQLite são ignorados pelo Git.

**Atenção à hospedagem:** em ambientes serverless, o filesystem local pode ser efêmero e não compartilhado entre instâncias. Antes de produção, use armazenamento persistente compatível ou migre a camada de persistência para um banco gerenciado. Planeje backup, retenção e recuperação.

## 8. Configuração local

### Requisitos

- Node.js 20 ou superior.
- npm.
- Credenciais de teste do Mercado Pago para testar o fluxo de pagamento.

Verifique as versões:

```bash
node --version
npm --version
```

### Instalação

Na raiz do projeto:

```bash
npm install
```

Crie o arquivo `.env` a partir do modelo:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

**Linux / macOS**

```bash
cp .env.example .env
```

Configure as variáveis:

```env
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
MP_ACCESS_TOKEN=SEU_ACCESS_TOKEN
MP_WEBHOOK_SECRET=SEU_SEGREDO_DE_WEBHOOK

# Opcional: caminho para o banco SQLite
# DATABASE_PATH=./server/data/orders.sqlite
```

Inicie o servidor:

```bash
# Desenvolvimento, com reinicialização automática
npm run dev

# Execução normal
npm start
```

A loja ficará disponível em `http://localhost:3000`.

## 9. Mercado Pago: configuração e cuidados

1. Acesse o [painel de desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/).
2. Selecione ou crie a aplicação da loja.
3. Use credenciais de teste durante o desenvolvimento.
4. Defina `MP_ACCESS_TOKEN` no ambiente do servidor.
5. Configure `BASE_URL` com o domínio público correto.
6. Configure a URL do webhook e o segredo correspondente.
7. Teste aprovação, pendência, recusa, repetição de notificações e falhas de rede.
8. Só depois da homologação, configure as credenciais de produção.

`localhost` não recebe notificações externas diretamente. Para testar webhooks localmente, utilize um túnel HTTPS confiável e configure a URL pública temporária no painel.

**Nunca** inclua tokens ou segredos em HTML, CSS, JavaScript público, commits, prints ou logs.

## 10. Regras comerciais e catálogo

O catálogo de referência e as regras de frete do backend estão em `server/server.js`. A vitrine e o checkout também possuem dados de apresentação no front-end; mantenha os identificadores consistentes.

Ao incluir ou alterar um produto:

1. Atualize o catálogo autorizado no servidor.
2. Atualize a vitrine em `assets/js/app.js`.
3. Atualize a referência usada pelo checkout em `assets/js/checkout.js`.
4. Adicione/substitua a imagem em `assets/images/produtos/`.
5. Confira nome, ID, categoria, preço e caminho da imagem.
6. Teste carrinho, subtotal, frete e total com o backend ativo.

As regras de frete grátis e taxa também são definidas no backend. Ajuste-as conforme a política comercial vigente antes de publicar.

## 11. Segurança, privacidade e operação

O servidor inclui Helmet, rate limiting em rotas sensíveis, limite de payload JSON, desativação de `X-Powered-By`, validações de entrada, consultas SQLite preparadas e credenciais mantidas no ambiente.

Antes de disponibilizar a loja comercialmente, valide também:

- Assinatura e idempotência dos webhooks.
- Proteção contra enumeração de IDs e exposição excessiva de dados pessoais na consulta de pedidos.
- Configuração de `trust proxy` de acordo com a infraestrutura real.
- Política de logs sem tokens, segredos ou dados pessoais desnecessários.
- Backup, monitoramento, alertas e recuperação de falhas.
- Persistência compatível com o ambiente de hospedagem.
- Adequação à LGPD e revisão jurídica dos textos institucionais.
- Políticas reais de frete, prazos, estoque, troca e devolução.

## 12. Publicação

O repositório inclui `vercel.json` com regras de URL e rewrite. Isso não significa que o SQLite local esteja automaticamente preparado para produção em ambiente serverless.

Checklist de publicação:

- [ ] Configurar domínio e HTTPS.
- [ ] Definir variáveis de ambiente no provedor.
- [ ] Manter credenciais de produção apenas no servidor.
- [ ] Configurar e validar o webhook público.
- [ ] Garantir banco persistente e rotina de backup.
- [ ] Configurar corretamente proxy e rate limit.
- [ ] Testar o ciclo completo de compra em homologação.
- [ ] Validar todos os caminhos de imagens e links internos.
- [ ] Revisar textos legais, contato e política de privacidade.
- [ ] Configurar monitoramento de erros e disponibilidade.

## 13. Manutenção e evolução

Para manter o projeto previsível e fácil de evoluir:

- Prefira componentes e estilos reutilizáveis antes de duplicar regras.
- Evite regras globais que afetem páginas sem necessidade.
- Preserve a ordem da cascata ao reorganizar CSS.
- Não confie em valores enviados pelo navegador para decisões financeiras.
- Centralize novas regras comerciais no servidor.
- Atualize este mapa sempre que adicionar páginas, assets, endpoints ou scripts.
- Teste em desktop, tablet e mobile após alterações de CSS.

---

<div align="center">

**PASSO LABS**  
*Menos pressa. Mais caminho.*

</div>

### Upload de imagens no catálogo
O formulário de produtos do painel agora permite selecionar uma imagem diretamente do computador (JPG, PNG, WEBP ou AVIF, até 5 MB), com prévia antes de salvar. O arquivo é enviado para o bucket público `products-images` do Supabase Storage e a URL pública é gravada em `products.image_url`.

Para habilitar o recurso no projeto Supabase, execute no SQL Editor o bloco **“Armazenamento público das imagens do catálogo”** que está no final de `supabase/admin-schema.sql` (ou execute o arquivo completo caso ainda não tenha aplicado o schema). O upload exige uma sessão autenticada cujo usuário esteja cadastrado em `public.admin_users`; a leitura das imagens é pública para exibição na loja.

(() => {
  const cfg = window.PASSO_ADMIN_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
  const date = (value) => value ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : '—';
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  const statusLabel = (s) => ({ pending:'Pendente', paid:'Pago', processing:'Em preparação', shipped:'Enviado', delivered:'Entregue', cancelled:'Cancelado', creating:'Criando', approved:'Pago', rejected:'Recusado' }[s] || s || '—');
  let sb, products = [], orders = [], messages = [], selectedMessageId = null, currentView = 'overview';
  const loginScreen = $('loginScreen'), app = $('app');
  function showLogin() { loginScreen.hidden = false; app.hidden = true; }
  function showApp(user) { loginScreen.hidden = true; app.hidden = false; $('adminEmail').textContent = user?.email || 'Admin'; }
  function message(id, text) { $(id).textContent = text || ''; }
  function showToast(type, title, detail) {
    const host = $('adminToast');
    if (!host) return;
    const toast = document.createElement('div');
    toast.className = `admin-toast${type === 'error' ? ' is-error' : ''}`;
    const icon = document.createElement('span');
    icon.className = 'admin-toast-icon';
    icon.innerHTML = type === 'error' ? '<i class="fa-solid fa-triangle-exclamation"></i>' : '<i class="fa-solid fa-check"></i>';
    const copy = document.createElement('div');
    copy.className = 'admin-toast-copy';
    const heading = document.createElement('strong');
    heading.textContent = title;
    const description = document.createElement('span');
    description.textContent = detail;
    copy.append(heading, description);
    const close = document.createElement('button');
    close.className = 'admin-toast-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Fechar notificação');
    close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    const dismiss = () => {
      if (!toast.isConnected) return;
      toast.classList.add('is-leaving');
      window.setTimeout(() => toast.remove(), 220);
    };
    close.addEventListener('click', dismiss);
    toast.append(icon, copy, close);
    host.append(toast);
    while (host.children.length > 3) host.firstElementChild.remove();
    window.setTimeout(dismiss, 4600);
  }
  async function initialize() {
    if (!cfg.supabaseUrl || cfg.supabaseUrl.includes('SEU-PROJETO') || !cfg.supabaseAnonKey || cfg.supabaseAnonKey.includes('SUA-CHAVE')) {
      message('loginError', 'Configure a URL e a chave pública do Supabase em admin-config.js.'); return;
    }
    if (!window.supabase) { message('loginError', 'Biblioteca Supabase não carregou. Verifique sua conexão.'); return; }
    sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    const { data: { session } } = await sb.auth.getSession();
    if (session) await verifyAdmin(session.user); else showLogin();
    sb.auth.onAuthStateChange((_event, sessionNow) => { if (sessionNow) verifyAdmin(sessionNow.user); else showLogin(); });
  }
  async function verifyAdmin(user) {
    const { data, error } = await sb.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
    if (error || !data) { await sb.auth.signOut(); showLogin(); message('loginError', 'Usuário sem permissão de administrador.'); return; }
    showApp(user); await loadAll();
  }
  async function loadAll() {
    const refresh = $('refreshBtn');
    if (refresh) refresh.disabled = true;
    const [p, o, m] = await Promise.all([sb.from('products').select('*').order('id'), sb.from('orders').select('*').order('created_at', { ascending: false }).limit(500), sb.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(300)]);
    if (refresh) refresh.disabled = false;
    if (p.error) { console.error(p.error); $('productsTable').innerHTML = `<tr><td colspan="6" class="empty">${escapeHtml(p.error.message)}</td></tr>`; }
    else products = p.data || [];
    if (o.error) { console.warn('Orders table may not yet be populated:', o.error.message); orders = []; }
    else orders = o.data || [];
    if (m.error) { console.warn('Mensagens ainda não configuradas:', m.error.message); messages = []; } else messages = m.data || [];
    renderProducts(); renderOrders(); renderMessages(); renderOverview();
  }
  function renderOverview() {
    const paid = orders.filter(o => ['paid','approved','processing','shipped','delivered'].includes(o.status));
    $('statProducts').textContent = products.filter(p => p.active).length;
    $('statOrders').textContent = orders.length;
    $('statPaid').textContent = paid.length;
    $('statRevenue').textContent = money(paid.reduce((sum, o) => sum + Number(o.total_cents ?? o.total ?? 0) / (o.total_cents != null ? 100 : 1), 0));
    $('countPending').textContent = orders.filter(o => o.status === 'pending' || o.status === 'creating').length;
    $('countProcessing').textContent = orders.filter(o => o.status === 'processing').length;
    $('countShipped').textContent = orders.filter(o => o.status === 'shipped').length;
    $('countDelivered').textContent = orders.filter(o => o.status === 'delivered').length;
    $('recentOrders').innerHTML = orders.slice(0, 6).map(orderRow).join('') || `<tr><td colspan="5" class="empty">Ainda não há pedidos na tabela do Supabase.</td></tr>`;
  }
  function orderRow(o) {
    const customer = o.customer && typeof o.customer === 'object' ? (o.customer.name || o.customer.email) : o.customer_name || o.customer_email || o.customer_json || 'Cliente';
    const total = o.total_cents != null ? Number(o.total_cents) / 100 : Number(o.total || 0);
    const id = o.order_number || o.id || '—';
    return `<tr><td><strong>#${escapeHtml(String(id).slice(0, 10))}</strong></td><td>${date(o.created_at)}</td><td>${escapeHtml(customer)}</td><td>${money(total)}</td><td><span class="badge ${escapeHtml(o.status)}">${escapeHtml(statusLabel(o.status))}</span></td></tr>`;
  }
  function renderProducts() {
    const q = $('productSearch')?.value?.trim().toLowerCase() || '';
    const rows = products.filter(p => `${p.name} ${p.category || ''}`.toLowerCase().includes(q));
    $('productTotal').textContent = `${rows.length} ${rows.length === 1 ? 'item' : 'itens'}`;
    $('productsTable').innerHTML = rows.map(p => `<article class="product-card"><div class="product-card-media">${p.image_url || p.image ? `<img src="${escapeHtml(p.image_url || p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.remove()">` : '<span class="product-no-image"><i class="fa-regular fa-image"></i></span>'}<span class="badge ${p.active ? '' : 'inactive'}">${p.active ? 'Ativo' : 'Inativo'}</span></div><div class="product-card-body"><span class="product-category">${escapeHtml(p.category || 'Sem categoria')}</span><h4>${escapeHtml(p.name)}</h4><strong class="product-price">${money(p.price_cents != null ? p.price_cents / 100 : p.price || 0)}</strong><div class="product-card-meta"><span><i class="fa-solid fa-box"></i> ${Number(p.stock ?? 0)} em estoque</span><span>${Number(p.stock ?? 0) <= 0 ? 'Sem estoque' : 'Disponível'}</span></div><div class="product-card-actions"><button class="btn btn-light" data-edit="${escapeHtml(p.id)}"><i class="fa-solid fa-pen"></i> Editar</button><button class="icon-button delete" data-delete="${escapeHtml(p.id)}" title="Excluir" aria-label="Excluir ${escapeHtml(p.name)}"><i class="fa-solid fa-trash"></i></button></div></div></article>`).join('') || '<div class="empty">Nenhum produto encontrado.</div>';
  }
  function renderMessages() {
    const q = $('messageSearch')?.value?.trim().toLowerCase() || '', filter = $('messageFilter')?.value || 'all';
    const unread = messages.filter(m => !m.replied_at).length;
    $('messageCount').textContent = unread;
    const rows = messages.filter(m => `${m.name} ${m.email} ${m.subject} ${m.message}`.toLowerCase().includes(q) && (filter === 'all' || (filter === 'new' ? !m.replied_at : !!m.replied_at)));
    $('messagesList').innerHTML = rows.map(m => `<button class="message-item ${String(m.id) === String(selectedMessageId) ? 'selected' : ''}" data-message="${escapeHtml(m.id)}"><span class="message-avatar">${escapeHtml((m.name || '?').trim().charAt(0).toUpperCase())}</span><span class="message-item-copy"><span class="message-item-top"><strong>${escapeHtml(m.name || 'Visitante')}</strong><time>${date(m.created_at)}</time></span><span class="message-subject">${escapeHtml(m.subject || 'Sem assunto')}</span><span class="message-preview">${escapeHtml(m.message || '')}</span></span>${m.replied_at ? '<i class="fa-solid fa-check-double message-read" title="Respondida"></i>' : '<span class="message-unread" title="Não respondida"></span>'}</button>`).join('') || '<div class="empty">Nenhuma mensagem encontrada.</div>';
    if (selectedMessageId && !messages.some(m => String(m.id) === String(selectedMessageId))) { selectedMessageId = null; }
    if (!selectedMessageId) $('messageDetail').innerHTML = '<div class="message-placeholder"><i class="fa-regular fa-envelope-open"></i><h3>Selecione uma mensagem</h3><p>Abra uma conversa para ler e responder ao cliente.</p></div>';
  }
  function openMessage(id) {
    const m = messages.find(item => String(item.id) === String(id)); if (!m) return;
    selectedMessageId = m.id;
    $('messageDetail').innerHTML = `<div class="message-detail-head"><span class="eyebrow">MENSAGEM RECEBIDA</span><h3>${escapeHtml(m.subject || 'Contato pelo site')}</h3><div class="message-sender"><span class="message-avatar">${escapeHtml((m.name || '?').trim().charAt(0).toUpperCase())}</span><div><strong>${escapeHtml(m.name || 'Visitante')}</strong><a href="mailto:${escapeHtml(m.email)}">${escapeHtml(m.email)}</a></div><time>${date(m.created_at)}</time></div></div><div class="message-content">${escapeHtml(m.message || '').replace(/\n/g, '<br>')}</div><div class="message-detail-actions"><a class="btn btn-dark" href="mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent('Re: ' + (m.subject || 'Contato pelo site'))}"><i class="fa-regular fa-paper-plane"></i> Responder por e-mail</a><button class="btn btn-light" data-mark-replied="${escapeHtml(m.id)}">${m.replied_at ? 'Marcar como não respondida' : 'Marcar como respondida'}</button></div>`;
    renderMessages();
  }
  async function toggleReplied(id) {
    const item = messages.find(m => String(m.id) === String(id)); if (!item) return;
    const replied_at = item.replied_at ? null : new Date().toISOString();
    const { error } = await sb.from('contact_messages').update({ replied_at }).eq('id', id);
    if (error) { showToast('error', 'Não foi possível atualizar', error.message); return; }
    item.replied_at = replied_at; renderMessages(); openMessage(id);
  }
  function renderOrders() {
    const q = $('orderSearch')?.value?.trim().toLowerCase() || '', filter = $('orderFilter')?.value || 'all';
    const rows = orders.filter(o => { const customer = typeof o.customer === 'object' ? (o.customer.name || o.customer.email || '') : (o.customer_name || o.customer_email || ''); const matches = `${o.id} ${o.order_number || ''} ${customer}`.toLowerCase().includes(q); return matches && (filter === 'all' || o.status === filter); });
    $('ordersTable').innerHTML = rows.map(o => { const customer = typeof o.customer === 'object' ? (o.customer.name || o.customer.email || 'Cliente') : (o.customer_name || o.customer_email || 'Cliente'); const amount = o.total_cents != null ? Number(o.total_cents)/100 : Number(o.total||0); return `<tr><td><strong>#${escapeHtml(String(o.order_number || o.id).slice(0,12))}</strong></td><td>${date(o.created_at)}</td><td>${escapeHtml(customer)}</td><td>${money(amount)}</td><td><span class="badge ${escapeHtml(o.status)}">${escapeHtml(statusLabel(o.status))}</span></td><td><select class="status-select" data-status="${escapeHtml(o.id)}"><option value="pending" ${o.status==='pending'?'selected':''}>Pendente</option><option value="paid" ${o.status==='paid'?'selected':''}>Pago</option><option value="processing" ${o.status==='processing'?'selected':''}>Em preparação</option><option value="shipped" ${o.status==='shipped'?'selected':''}>Enviado</option><option value="delivered" ${o.status==='delivered'?'selected':''}>Entregue</option><option value="cancelled" ${o.status==='cancelled'?'selected':''}>Cancelado</option></select></td></tr>`; }).join('') || `<tr><td colspan="6" class="empty">Nenhum pedido encontrado. A conexão do checkout SQLite com Supabase ainda precisa ser migrada.</td></tr>`;
  }
  let selectedProductImage = null;
  let imagePreviewObjectUrl = null;
  function setImagePreview(url = '') {
    const preview = $('imagePreview');
    preview.innerHTML = url ? `<img src="${escapeHtml(url)}" alt="Prévia da imagem do produto">` : '<i class="fa-regular fa-image"></i>';
    $('imagePickerTitle').textContent = url ? 'Imagem selecionada' : 'Escolher imagem';
    $('imagePickerHint').textContent = url ? 'Você pode selecionar outra imagem.' : 'PNG, JPG, WEBP ou AVIF · até 5 MB';
    $('removeProductImage').hidden = !url;
  }
  function openProduct(p = null) {
    $('productError').textContent = ''; $('dialogTitle').textContent = p ? 'Editar produto' : 'Novo produto';
    selectedProductImage = null; if (imagePreviewObjectUrl) { URL.revokeObjectURL(imagePreviewObjectUrl); imagePreviewObjectUrl = null; } $('pImageFile').value = '';
    $('productId').value = p?.id || ''; $('pName').value = p?.name || ''; $('pCategory').value = p?.category || ''; $('pPrice').value = p ? (p.price_cents != null ? p.price_cents/100 : p.price || 0) : ''; $('pStock').value = p?.stock ?? 0; $('pImage').value = p?.image_url || p?.image || ''; setImagePreview($('pImage').value); $('pActive').checked = p?.active ?? true; $('productDialog').showModal();
  }
  async function uploadProductImage() {
    const file = selectedProductImage;
    if (!file) return $('pImage').value.trim() || null;
    const extension = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = `products/${crypto.randomUUID()}.${extension}`;
    const { error } = await sb.storage.from('products-images').upload(path, file, { cacheControl: '31536000', contentType: file.type, upsert: false });
    if (error) throw new Error(`Falha ao enviar imagem: ${error.message}. Confira se o bucket products-images foi criado no Supabase.`);
    const { data } = sb.storage.from('products-images').getPublicUrl(path);
    return data.publicUrl;
  }
  async function saveProduct() {
    const id = $('productId').value;
    const payload = {
      name: $('pName').value.trim(),
      category: $('pCategory').value.trim(),
      price_cents: Math.round(Number($('pPrice').value) * 100),
      stock: Number($('pStock').value),
      image_url: $('pImage').value.trim() || null,
      active: $('pActive').checked,
      updated_at: new Date().toISOString()
    };
    if (!payload.name || !payload.category || !Number.isSafeInteger(payload.price_cents) || payload.price_cents < 0 || !Number.isSafeInteger(payload.stock) || payload.stock < 0) {
      message('productError', 'Confira os campos e informe preço e estoque válidos.');
      showToast('error', 'Confira os dados do produto', 'Preencha os campos obrigatórios com valores válidos.');
      return;
    }

    const saveButton = $('saveProduct');
    const originalLabel = saveButton.innerHTML;
    saveButton.disabled = true;
    saveButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
    message('productError', '');

    try {
      payload.image_url = await uploadProductImage();
      const result = id
        ? await sb.from('products').update(payload).eq('id', id)
        : await sb.from('products').insert(payload);

      if (result.error) throw result.error;

      $('productDialog').close();
      await loadAll();
      showToast('success', id ? 'Produto atualizado!' : 'Produto cadastrado!', `${payload.name} foi salvo com sucesso no catálogo.`);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      const detail = error?.message || 'Ocorreu um erro inesperado ao salvar o produto.';
      message('productError', detail);
      showToast('error', 'Não foi possível salvar', detail);
    } finally {
      saveButton.disabled = false;
      saveButton.innerHTML = originalLabel;
    }
  }
  async function deleteProduct(id) { if (!confirm('Excluir este produto?')) return; const { error } = await sb.from('products').delete().eq('id', id); if (error) alert(error.message); else await loadAll(); }
  async function updateOrder(id, status) { const { error } = await sb.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id); if (error) { alert('Não foi possível atualizar o pedido: ' + error.message); await loadAll(); } else await loadAll(); }
  function setView(view) { currentView = view; document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view)); document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `${view}View`)); const names = { overview:'Visão geral', products:'Produtos', messages:'Mensagens', orders:'Pedidos' }; $('pageTitle').textContent = names[view]; }
  $('loginForm').addEventListener('submit', async e => { e.preventDefault(); message('loginError',''); if (!sb) return; const { error } = await sb.auth.signInWithPassword({ email: $('email').value.trim(), password: $('password').value }); if (error) message('loginError', 'Não foi possível entrar. Verifique seu e-mail e senha.'); });
  $('logoutBtn').addEventListener('click', () => sb?.auth.signOut()); $('refreshBtn').addEventListener('click', loadAll); $('newProduct').addEventListener('click', () => openProduct()); $('saveProduct').addEventListener('click', saveProduct); $('chooseProductImage').addEventListener('click', () => $('pImageFile').click()); $('imagePicker').addEventListener('click', e => { if (!e.target.closest('button')) $('pImageFile').click(); }); $('pImageFile').addEventListener('change', () => { const file = $('pImageFile').files?.[0]; if (!file) return; if (!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type) || file.size > 5 * 1024 * 1024) { $('pImageFile').value = ''; message('productError', 'Escolha uma imagem JPG, PNG, WEBP ou AVIF de até 5 MB.'); return; } selectedProductImage = file; if (imagePreviewObjectUrl) URL.revokeObjectURL(imagePreviewObjectUrl); imagePreviewObjectUrl = URL.createObjectURL(file); setImagePreview(imagePreviewObjectUrl); }); $('removeProductImage').addEventListener('click', () => { selectedProductImage = null; $('pImageFile').value = ''; $('pImage').value = ''; if (imagePreviewObjectUrl) { URL.revokeObjectURL(imagePreviewObjectUrl); imagePreviewObjectUrl = null; } setImagePreview(''); }); $('productSearch').addEventListener('input', renderProducts); $('orderSearch').addEventListener('input', renderOrders); $('orderFilter').addEventListener('change', renderOrders); $('messageSearch').addEventListener('input', renderMessages); $('messageFilter').addEventListener('change', renderMessages);
  document.addEventListener('click', e => { const nav = e.target.closest('[data-view]'); if (nav) setView(nav.dataset.view); const goto = e.target.closest('[data-goto]'); if (goto) setView(goto.dataset.goto); const edit = e.target.closest('[data-edit]'); if (edit) openProduct(products.find(p => String(p.id) === edit.dataset.edit)); const del = e.target.closest('[data-delete]'); if (del) deleteProduct(del.dataset.delete); const msg = e.target.closest('[data-message]'); if (msg) openMessage(msg.dataset.message); const mark = e.target.closest('[data-mark-replied]'); if (mark) toggleReplied(mark.dataset.markReplied); });
  document.addEventListener('change', e => { const select = e.target.closest('[data-status]'); if (select) updateOrder(select.dataset.status, select.value); });
  document.addEventListener('click', e => {
    const stockStep = e.target.closest('[data-stock-step]');
    const priceStep = e.target.closest('[data-price-step]');
    if (!stockStep && !priceStep) return;

    const input = stockStep ? $('pStock') : $('pPrice');
    const delta = Number(stockStep ? stockStep.dataset.stockStep : priceStep.dataset.priceStep);
    const current = Number(input.value) || 0;
    const next = Math.max(0, current + delta);
    input.value = stockStep ? String(Math.round(next)) : next.toFixed(2);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  initialize();
})();

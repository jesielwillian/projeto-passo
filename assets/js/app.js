/**
 * PASSO — app.js
 *
 * Interações da vitrine, catálogo, favoritos, busca e carrinho.
 */

(() => {
    "use strict";
    // Catálogo estático usado para montar os cards e validar o carrinho.
    const products = [
        { id: 1, name: "Breeze Knit", category: "dia-a-dia", label: "Leve", price: 229.9, oldPrice: null, rating: "4.8", reviews: 52, image: "assets/images/produtos/breeze-knit/tenis-01.webp", desc: "Respirabilidade o dia todo", bg: "#111", colors: [
            { name: "Vermelho", hex: "#e51f2a", image: "assets/images/produtos/breeze-knit/tenis-01.webp" },
            { name: "Amarelo", hex: "#f4d51d", image: "assets/images/produtos/breeze-knit/tenis-02.webp" },
            { name: "Cinza", hex: "#8d9197", image: "assets/images/produtos/breeze-knit/tenis-03.webp" }
        ] },
        { id: 2, name: "Cloud Walk", category: "caminhada", label: "Conforto extra", price: 319.9, oldPrice: null, rating: "4.8", reviews: 96, image: "assets/images/produtos/cloud-walk/tenis-04.webp", desc: "Amortecimento macio", bg: "#111", colors: [
            { name: "Preto", hex: "#171918", image: "assets/images/produtos/cloud-walk/tenis-04.webp" },
            { name: "Azul", hex: "#1752aa", image: "assets/images/produtos/cloud-walk/tenis-05.webp" },
            { name: "Branco", hex: "#f4f4f1", image: "assets/images/produtos/cloud-walk/tenis-06.webp" }
        ] },
        { id: 3, name: "Daily Ease", category: "dia-a-dia", label: "Favorito", price: 269.9, oldPrice: 299.9, rating: "4.8", reviews: 89, image: "assets/images/produtos/daily-ease/tenis-08.webp", desc: "Seu companheiro diário", bg: "#111", colors: [
            { name: "Branco", hex: "#ef3d9c", image: "assets/images/produtos/daily-ease/tenis-07.webp" },
            { name: "Rosa", hex: "#f7f7f4", image: "assets/images/produtos/daily-ease/tenis-08.webp" },
            { name: "Amarelo", hex: "#f2cf19", image: "assets/images/produtos/daily-ease/tenis-09.webp" }
        ] },
        { id: 4, name: "Move Air", category: "caminhada", label: "Mais vendido", price: 279.9, oldPrice: 329.9, rating: "4.9", reviews: 128, image: "assets/images/produtos/move-air/tenis-10.webp", desc: "Leveza para ir além", bg: "#111", colors: [
            { name: "Laranja", hex: "#f47716", image: "assets/images/produtos/move-air/tenis-10.webp" },
            { name: "Azul", hex: "#1256c5", image: "assets/images/produtos/move-air/tenis-11.webp" },
            { name: "Vermelho", hex: "#e31d2b", image: "assets/images/produtos/move-air/tenis-12.webp" }
        ] },
        { id: 5, name: "Pace Pro", category: "performance", label: "Performance", price: 389.9, oldPrice: null, rating: "5.0", reviews: 43, image: "assets/images/produtos/pace-pro/tenis-13.webp", desc: "Energia para cada meta", bg: "#111", colors: [
            { name: "Roxo", hex: "#6f19d8", image: "assets/images/produtos/pace-pro/tenis-13.webp" },
            { name: "Caramelo", hex: "#b9855e", image: "assets/images/produtos/pace-pro/tenis-14.webp" },
            { name: "Lima", hex: "#8ee900", image: "assets/images/produtos/pace-pro/tenis-15.webp" }
        ] },
        { id: 6, name: "Terra Move", category: "performance", label: "Edição especial", price: 339.9, oldPrice: null, rating: "4.9", reviews: 37, image: "assets/images/produtos/terra-move/tenis-16.webp", desc: "Feito para novos caminhos", bg: "#111", colors: [
            { name: "Branco", hex: "#f4f4f2", image: "assets/images/produtos/terra-move/tenis-16.webp" },
            { name: "Preto", hex: "#151716", image: "assets/images/produtos/terra-move/tenis-17.webp" },
            { name: "Vermelho", hex: "#df1e2b", image: "assets/images/produtos/terra-move/tenis-18.webp" }
        ] },
        { id: 7, name: "Trail Flex", category: "performance", label: "Versátil", price: 359.9, oldPrice: 399.9, rating: "4.7", reviews: 61, image: "assets/images/produtos/trail-flex/tenis-19.webp", desc: "Aderência e estabilidade", bg: "#111", colors: [
            { name: "Lima", hex: "#9cf000", image: "assets/images/produtos/trail-flex/tenis-19.webp" },
            { name: "Azul", hex: "#078cf2", image: "assets/images/produtos/trail-flex/tenis-20.webp" },
            { name: "Rosa", hex: "#f00c8c", image: "assets/images/produtos/trail-flex/tenis-21.webp" }
        ] },
        { id: 8, name: "Urban Flow", category: "dia-a-dia", label: "Novo", price: 249.9, oldPrice: null, rating: "4.9", reviews: 74, image: "assets/images/produtos/urban-flow/tenis-22.webp", desc: "Do parque à cidade", bg: "#111", colors: [
            { name: "Amarelo", hex: "#f0cc12", image: "assets/images/produtos/urban-flow/tenis-22.webp" },
            { name: "Roxo", hex: "#6b20d9", image: "assets/images/produtos/urban-flow/tenis-23.webp" },
            { name: "Verde", hex: "#59f000", image: "assets/images/produtos/urban-flow/tenis-24.webp" }
        ] }
    ];
    const sizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];
    // Utilitários de consulta ao DOM e formatação monetária.
    const money = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => [...document.querySelectorAll(s)];
    // Persistência local: carrinho, favoritos e avaliações.
    // A versão 2 limpa qualquer carrinho de demonstração deixado por versões anteriores.
    if (localStorage.getItem("passo:cart-version") !== "2") {
        localStorage.removeItem("passo:cart");
        localStorage.setItem("passo:cart-version", "2");
    }
    const readCart = () => {
        try {
            const saved = JSON.parse(localStorage.getItem("passo:cart") || "[]");
            if (!Array.isArray(saved)) return [];
            return saved.map((item) => {
                const product = products.find((p) => p.id === Number(item.id));
                if (!product || !Number.isInteger(Number(item.qty)) || Number(item.qty) <= 0) return null;
                const colorIndex = Number.isInteger(Number(item.colorIndex)) ? Number(item.colorIndex) : 0;
                const selectedColor = product.colors[colorIndex] || product.colors[0];
                const size = sizes.includes(Number(item.size)) ? Number(item.size) : null;
                return { ...product, colorIndex: product.colors.indexOf(selectedColor), selectedColor: selectedColor.name, selectedImage: selectedColor.image, size, qty: Math.min(99, Number(item.qty)) };
            }).filter(Boolean);
        } catch {
            return [];
        }
    };
    let cart = readCart();
    let favorites = new Set((() => {
        try {
            const saved = JSON.parse(localStorage.getItem("passo:favorites") || "[]");
            return Array.isArray(saved)
                ? saved.map(Number).filter((id) => products.some((p) => p.id === id))
                : [];
        }
        catch {
            return [];
        }
    })());
    let userRatings = (() => {
        try {
            const saved = JSON.parse(localStorage.getItem("passo:ratings") || "{}");
            return saved && typeof saved === "object" ? saved : {};
        } catch { return {}; }
    })();
    let favoritesOnly = false;
    let activeFilter = "todos";
    let showAllProducts = false;
    let toastTimer;
    const categoryNames = {
        caminhada: "Caminhada",
        "dia-a-dia": "Dia a dia",
        performance: "Performance",
    };
    function productCard(p) {
        return `<article class="product-card" data-id="${p.id}" style="--card-bg:${p.bg}">
  <div class="product-image">
    <img class="product-main-image" data-product-image src="${p.image}" alt="${p.name} — tênis esportivo" loading="lazy">
    <span class="product-tag">${p.label}</span>
    <div class="product-image-actions">
      <button class="favorite-btn ${favorites.has(p.id) ? "active" : ""}" data-favorite="${p.id}" aria-label="${favorites.has(p.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}"><i class="${favorites.has(p.id) ? "fa-solid" : "fa-regular"} fa-heart"></i></button>
      <button class="view-product-btn" data-view-product="${p.id}" aria-label="Visualizar ${p.name}" title="Visualizar produto"><i class="fa-solid fa-eye"></i></button>
    </div>
    <button class="quick-add" data-add="${p.id}"><i class="fa-solid fa-plus"></i> ADICIONAR À SACOLA</button>
  </div>
  <div class="product-info"><span class="product-category">${categoryNames[p.category]}</span><div class="product-name-row"><h3 class="product-name">${p.name}</h3><span class="rating"><i class="fa-solid fa-star"></i> ${p.rating} <span style="color:#92998f">(${p.reviews})</span></span></div><p class="product-desc">${p.desc}</p><div class="price-row"><span class="price">${money(p.price)}</span>${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ""}</div><div class="color-dots" role="group" aria-label="Cores disponíveis para ${p.name}">${p.colors.map((c, index) => `<button type="button" class="color-dot ${index === 0 ? "active" : ""}" data-color-index="${index}" data-color-image="${c.image}" style="--swatch-color:${c.hex}" title="${c.name}" aria-label="${c.name}" aria-pressed="${index === 0}"></button>`).join("")}</div></div>
 </article>`;
    }
    function updateFavorites() {
        const count = favorites.size;
        const badge = $("#favoritesCount");
        const button = $("#favoritesJump");
        badge.textContent = count > 99 ? "99+" : String(count);
        badge.hidden = count === 0;
        button.classList.toggle("has-favorites", count > 0);
        button.setAttribute("aria-label", count ? `Ver ${count} produto(s) favorito(s)` : "Ver favoritos");
        const icon = button.querySelector("i");
        icon.classList.toggle("fa-solid", count > 0);
        icon.classList.toggle("fa-regular", count === 0);
        try {
            localStorage.setItem("passo:favorites", JSON.stringify([...favorites]));
        }
        catch { }
    }
    function renderProducts() {
        let list = products.filter((p) => (activeFilter === "todos" || p.category === activeFilter) &&
            (!favoritesOnly || favorites.has(p.id)));
        if (!showAllProducts && activeFilter === "todos" && !favoritesOnly)
            list = list.slice(0, 4);
        $("#productGrid").innerHTML = list.length
            ? list.map(productCard).join("")
            : '<div class="no-results">Nenhum modelo encontrado nessa categoria.</div>';
        $("#productGrid").classList.toggle("show-all", showAllProducts);
    }
    function notify(message) {
        $("#toastText").textContent = message;
        $("#toast").classList.add("active");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => $("#toast").classList.remove("active"), 2600);
    }
    function addToCart(id, colorIndex = 0, size = null) {
        const p = products.find((x) => x.id === Number(id));
        if (!p) return;
        const selected = p.colors[Number(colorIndex)] || p.colors[0];
        const normalizedSize = Number(size);
        if (!sizes.includes(normalizedSize)) {
            openProductViewer(p.id, Number(colorIndex));
            notify("Escolha o tamanho do tênis antes de adicionar à sacola");
            return;
        }
        const item = cart.find((x) => x.id === p.id && x.colorIndex === Number(colorIndex) && x.size === normalizedSize);
        if (item) item.qty = Math.min(99, item.qty + 1);
        else cart.push({ ...p, colorIndex: Number(colorIndex), selectedColor: selected.name, selectedImage: selected.image, size: normalizedSize, qty: 1 });
        updateCart();
        notify(`${p.name} · ${selected.name} · ${normalizedSize} adicionado à sacola`);
    }
    function updateCart() {
        try {
            localStorage.setItem("passo:cart", JSON.stringify(cart.map(({ id, qty, colorIndex, size }) => ({ id, qty, colorIndex, size }))));
        }
        catch { }
        const count = cart.reduce((n, p) => n + p.qty, 0), subtotal = cart.reduce((n, p) => n + p.price * p.qty, 0);
        $("#cartCount").textContent = count;
        $("#drawerCount").textContent = `(${count})`;
        $("#cartSubtotal").textContent = money(subtotal);
        $("#shippingNote").textContent =
            subtotal >= 299
                ? "Você ganhou frete grátis!"
                : "Faltam " + money(299 - subtotal) + " para ganhar frete grátis.";
        $("#cartBody").innerHTML = count
            ? cart
                .map((p) => { const key = `${p.id}-${p.colorIndex}-${p.size}`; return `<article class="cart-item"><img src="${p.selectedImage || p.image}" alt="${p.name} — ${p.selectedColor || ""}" onerror="this.style.display='none'"><div><h4>${p.name}</h4><small>${categoryNames[p.category]} · ${p.selectedColor || "Cor padrão"} · Tamanho ${p.size || "—"}</small><span class="price">${money(p.price)}</span><div class="qty-controls"><button data-qty="${key}" data-delta="-1" aria-label="Diminuir quantidade">−</button><span>${p.qty}</span><button data-qty="${key}" data-delta="1" aria-label="Aumentar quantidade">+</button></div></div><button type="button" class="remove-item" data-remove="${key}" aria-label="Remover ${p.name}"><i class="fa-solid fa-trash-can"></i></button></article>`; })
                .join("")
            : '<div class="empty-cart"><i class="fa-solid fa-bag-shopping"></i><h4>Sua sacola está leve.</h4><p>Encontre o par que vai acompanhar seus próximos passos.</p></div>';
        $("#cartFoot").style.display = count ? "block" : "none";
    }
    function openCart() {
        $("#cartDrawer").classList.add("active");
        $("#overlay").classList.add("active");
        $("#cartDrawer").setAttribute("aria-hidden", "false");
        document.body.classList.add("locked");
        $("#cartClose").focus();
    }
    function closeCart() {
        $("#cartDrawer").classList.remove("active");
        $("#overlay").classList.remove("active");
        $("#cartDrawer").setAttribute("aria-hidden", "true");
        document.body.classList.remove("locked");
    }
    function openSearch() {
        $("#searchModal").classList.add("active");
        document.body.classList.add("locked");
        setTimeout(() => $("#searchInput").focus(), 50);
        renderSearch("");
    }
    function closeSearch() {
        $("#searchModal").classList.remove("active");
        document.body.classList.remove("locked");
    }
    function renderSearch(q) {
        const term = q.trim().toLocaleLowerCase("pt-BR");
        if (!term) {
            $("#searchResults").innerHTML = "";
            return;
        }
        const results = products.filter((p) => `${p.name} ${p.desc} ${p.category}`
            .toLocaleLowerCase("pt-BR")
            .includes(term));
        $("#searchResults").innerHTML = results.length
            ? results
                .slice(0, 5)
                .map((p) => `<button class="search-result" data-search-product="${p.id}"><img src="${p.image}" alt="" onerror="this.style.display='none'"><span><strong>${p.name}</strong><small>${categoryNames[p.category]}</small></span><span class="price">${money(p.price)}</span></button>`)
                .join("")
            : '<p class="no-results">Não encontramos esse modelo. Tente outra busca.</p>';
    }
    function filterTo(filter) {
        activeFilter = filter;
        showAllProducts = true;
        $$(".filter-btn").forEach((b) => b.classList.toggle("active", b.dataset.filter === filter));
        renderProducts();
        $("#colecao").scrollIntoView({ behavior: "smooth" });
    }
    function saveRatings() {
        try { localStorage.setItem("passo:ratings", JSON.stringify(userRatings)); } catch {}
    }
    function renderViewerRating(product) {
        const saved = Number(userRatings[product.id] || 0);
        const stars = [1,2,3,4,5].map((n) => `<button type="button" class="rating-star ${n <= saved ? "active" : ""}" data-rating-star="${n}" aria-label="${n} ${n === 1 ? "estrela" : "estrelas"}"><i class="fa-solid fa-star"></i></button>`).join("");
        $("#viewerRatingStars").innerHTML = stars;
        $("#viewerRatingValue").textContent = saved ? `${saved}.0` : product.rating;
        $("#viewerRatingHint").textContent = saved ? "Sua avaliação está salva neste dispositivo." : "Toque em uma estrela para avaliar";
        $("#viewerRatingBadge").textContent = saved ? "AVALIADO POR VOCÊ" : "AVALIAÇÃO DOS CLIENTES";
    }
    let viewerSelection = { id: null, colorIndex: 0, size: null };
    function openProductViewer(id, colorIndex = 0) {
        const product = products.find((p) => p.id === Number(id));
        if (!product) return;
        const color = product.colors[colorIndex] || product.colors[0];
        viewerSelection = { id: product.id, colorIndex: product.colors.indexOf(color), size: null };
        $("#viewerImage").src = color.image;
        $("#viewerImage").alt = `${product.name} — ${color.name}`;
        $("#viewerName").textContent = product.name;
        $("#viewerColor").textContent = color.name;
        $("#viewerPrice").textContent = money(product.price);
        $("#viewerDescription").textContent = product.desc;
        renderViewerRating(product);
        $("#viewerSize").innerHTML = sizes.map((size) => `<button type="button" class="size-option" data-viewer-size="${size}">${size}</button>`).join("");
        $("#viewerSizeHint").textContent = "Selecione seu tamanho";
        $("#viewerAdd").disabled = true;
        $("#viewerAdd").dataset.productId = product.id;
        $("#productViewer").classList.add("active");
        $("#productViewer").setAttribute("aria-hidden", "false");
        document.body.classList.add("locked");
    }
    function closeProductViewer() {
        $("#productViewer").classList.remove("active");
        $("#productViewer").setAttribute("aria-hidden", "true");
        document.body.classList.remove("locked");
    }

    $("#productGrid").addEventListener("click", (e) => {
        const add = e.target.closest("[data-add]"), fav = e.target.closest("[data-favorite]"), view = e.target.closest("[data-view-product]");
        const color = e.target.closest("[data-color-index]");
        if (view) {
            const card = view.closest(".product-card");
            const activeColor = card?.querySelector("[data-color-index].active");
            openProductViewer(view.dataset.viewProduct, Number(activeColor?.dataset.colorIndex || 0));
            return;
        }
        if (color) {
            const card = color.closest(".product-card");
            const image = card.querySelector("[data-product-image]");
            const product = products.find((item) => item.id === Number(card.dataset.id));
            if (image && product) {
                image.style.display = "";
                card.querySelector(".product-image").classList.remove("image-missing");
                image.src = color.dataset.colorImage;
                image.alt = `${product.name} — variação de cor ${Number(color.dataset.colorIndex) + 1}`;
                card.querySelectorAll("[data-color-index]").forEach((button) => {
                    const selected = button === color;
                    button.classList.toggle("active", selected);
                    button.setAttribute("aria-pressed", String(selected));
                });
            }
            return;
        }
        if (add) {
            openProductViewer(add.dataset.add);
            return;
        }
        if (fav) {
            const id = Number(fav.dataset.favorite);
            favorites.has(id) ? favorites.delete(id) : favorites.add(id);
            updateFavorites();
            renderProducts();
            notify(favorites.has(id)
                ? "Adicionado aos favoritos"
                : "Removido dos favoritos");
        }
    });
    $(".filters").addEventListener("click", (e) => {
        const b = e.target.closest("[data-filter]");
        if (!b)
            return;
        activeFilter = b.dataset.filter;
        showAllProducts = activeFilter !== "todos";
        $$(".filter-btn").forEach((x) => x.classList.toggle("active", x === b));
        renderProducts();
    });
    $("#showAll").addEventListener("click", () => {
        showAllProducts = !showAllProducts;
        activeFilter = "todos";
        $$(".filter-btn").forEach((b) => b.classList.toggle("active", b.dataset.filter === "todos"));
        renderProducts();
        $("#showAll").innerHTML = showAllProducts
            ? 'Mostrar menos <i class="fa-solid fa-arrow-up"></i>'
            : 'Explorar coleção completa <i class="fa-solid fa-arrow-right"></i>';
        if (!showAllProducts)
            $("#colecao").scrollIntoView({ behavior: "smooth" });
    });
    $("#cartOpen").addEventListener("click", openCart);
    $("#cartClose").addEventListener("click", closeCart);
    $("#overlay").addEventListener("click", closeCart);
    $("#cartBody").addEventListener("click", (e) => {
        const target = e.target;
        const qty = target.closest?.("[data-qty]");
        const remove = target.closest?.("[data-remove]");
        const keyFor = (p) => `${p.id}-${Number(p.colorIndex ?? 0)}-${p.size ?? ""}`;

        if (remove) {
            e.preventDefault();
            e.stopPropagation();
            const key = String(remove.dataset.remove || "");
            const before = cart.length;
            cart = cart.filter((p) => keyFor(p) !== key);
            if (cart.length !== before) {
                updateCart();
                notify("Produto removido da sacola");
            }
            return;
        }

        if (qty) {
            e.preventDefault();
            const key = String(qty.dataset.qty || "");
            const item = cart.find((p) => keyFor(p) === key);
            if (item) {
                item.qty += Number(qty.dataset.delta);
                if (item.qty <= 0) cart = cart.filter((p) => keyFor(p) !== key);
                updateCart();
            }
        }
    });
    $("#viewerClose").addEventListener("click", closeProductViewer);
    $("#productViewer").addEventListener("click", (e) => {
        if (e.target.matches("[data-viewer-close]")) closeProductViewer();
        const ratingButton = e.target.closest("[data-rating-star]");
        if (ratingButton) {
            const value = Number(ratingButton.dataset.ratingStar);
            userRatings[viewerSelection.id] = value;
            saveRatings();
            const product = products.find((p) => p.id === viewerSelection.id);
            if (product) renderViewerRating(product);
            notify(`Você deu ${value} ${value === 1 ? "estrela" : "estrelas"} para este tênis`);
            return;
        }
        const sizeButton = e.target.closest("[data-viewer-size]");
        if (sizeButton) {
            viewerSelection.size = Number(sizeButton.dataset.viewerSize);
            $$("[data-viewer-size]").forEach((button) => button.classList.toggle("active", button === sizeButton));
            $("#viewerSizeHint").textContent = `Tamanho ${viewerSelection.size} selecionado`;
            $("#viewerAdd").disabled = false;
        }
    });
    $("#viewerAdd").addEventListener("click", () => {
        if (!viewerSelection.size) {
            $("#viewerSizeHint").textContent = "Escolha um tamanho para continuar";
            return;
        }
        addToCart(viewerSelection.id, viewerSelection.colorIndex, viewerSelection.size);
        closeProductViewer();
    });

    $("#checkoutBtn").addEventListener("click", () => {
        if (!cart.length)
            return;
        window.location.href = "checkout.html";
    });
    $("#searchOpen").addEventListener("click", openSearch);
    $("#searchClose").addEventListener("click", closeSearch);
    $("#searchInput").addEventListener("input", (e) => renderSearch(e.target.value));
    $("#searchResults").addEventListener("click", (e) => {
        const result = e.target.closest("[data-search-product]");
        if (!result)
            return;
        const p = products.find((x) => x.id === Number(result.dataset.searchProduct));
        closeSearch();
        activeFilter = "todos";
        showAllProducts = true;
        renderProducts();
        $("#colecao").scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
            const card = $(`.product-card[data-id="${p.id}"]`);
            card?.scrollIntoView({ behavior: "smooth", block: "center" });
            card?.animate([
                { transform: "scale(1)" },
                { transform: "scale(1.025)" },
                { transform: "scale(1)" },
            ], { duration: 450 });
        }, 350);
    });
    $("#favoritesJump").addEventListener("click", () => {
        if (!favorites.size) {
            notify("Toque no coração de um produto para favoritar");
            return;
        }
        favoritesOnly = !favoritesOnly;
        activeFilter = "todos";
        showAllProducts = true;
        renderProducts();
        $("#colecao").scrollIntoView({ behavior: "smooth" });
        notify(favoritesOnly
            ? `${favorites.size} produto(s) nos favoritos`
            : "Exibindo todos os produtos");
    });
    $("#menuToggle").addEventListener("click", () => {
        const open = $("#navLinks").classList.toggle("open");
        $("#menuToggle").setAttribute("aria-expanded", String(open));
        $("#menuToggle").innerHTML = open
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });
    $("#navLinks").addEventListener("click", (e) => {
        if (e.target.closest("a")) {
            $("#navLinks").classList.remove("open");
            $("#menuToggle").setAttribute("aria-expanded", "false");
            $("#menuToggle").innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
    $$("[data-footer-filter]").forEach((a) => 
    // Evento "click" em a
    a.addEventListener("click", () => filterTo(a.dataset.footerFilter)));
    $("#newsletterForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = $("#emailInput").value.trim();
        if (!email)
            return;
        notify("Cadastro demonstrativo recebido. Conecte sua API para salvar.");
        e.target.reset();
    });
    // Evento "keydown" em document
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeCart();
            closeSearch();
            closeProductViewer();
            $("#navLinks").classList.remove("open");
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            openSearch();
        }
    });
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    }), { threshold: 0.12 });
    $$(".reveal").forEach((el) => observer.observe(el));
    $("#year").textContent = new Date().getFullYear();
    const scrollDiscover = $("#scrollDiscover");
    const backToTop = $("#backToTop");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Evento "click" em scrollDiscover?
    scrollDiscover?.addEventListener("click", () => {
        const target = $(".ticker");
        if (!target)
            return;
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: Math.max(0, top),
            behavior: reducedMotion.matches ? "auto" : "smooth",
        });
    });
    // Comportamentos auxiliares de rolagem e acessibilidade.
    const updateBackToTop = () => {
        backToTop?.classList.toggle("is-visible", window.scrollY > 320);
    };
    // Evento "scroll" em window
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    // Evento "click" em backToTop?
    backToTop?.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: reducedMotion.matches ? "auto" : "smooth",
        });
    });
    updateBackToTop();
    renderProducts();
    updateCart();
    updateFavorites();
})();

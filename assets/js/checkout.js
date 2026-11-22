/**
 * PASSO — checkout.js
 *
 * Validação e envio seguro dos dados de checkout para a API.
 */

(() => {
    "use strict";
    // Referências e utilitários compartilhados pela tela de checkout.
    const $ = (selector) => document.querySelector(selector);
    const money = (value) => value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    // Catálogo de referência: o servidor recalcula preços e frete.
    const catalog = [
        { id: 1, name: "Breeze Knit", category: "Dia a dia", price: 229.9, colors: [
            "assets/images/produtos/breeze-knit/tenis-01.webp", "assets/images/produtos/breeze-knit/tenis-02.webp", "assets/images/produtos/breeze-knit/tenis-03.webp"
        ] },
        { id: 2, name: "Cloud Walk", category: "Caminhada", price: 319.9, colors: [
            "assets/images/produtos/cloud-walk/tenis-04.webp", "assets/images/produtos/cloud-walk/tenis-05.webp", "assets/images/produtos/cloud-walk/tenis-06.webp"
        ] },
        { id: 3, name: "Daily Ease", category: "Dia a dia", price: 269.9, colors: [
            "assets/images/produtos/daily-ease/tenis-07.webp", "assets/images/produtos/daily-ease/tenis-08.webp", "assets/images/produtos/daily-ease/tenis-09.webp"
        ] },
        { id: 4, name: "Move Air", category: "Caminhada", price: 279.9, colors: [
            "assets/images/produtos/move-air/tenis-10.webp", "assets/images/produtos/move-air/tenis-11.webp", "assets/images/produtos/move-air/tenis-12.webp"
        ] },
        { id: 5, name: "Pace Pro", category: "Performance", price: 389.9, colors: [
            "assets/images/produtos/pace-pro/tenis-13.webp", "assets/images/produtos/pace-pro/tenis-14.webp", "assets/images/produtos/pace-pro/tenis-15.webp"
        ] },
        { id: 6, name: "Terra Move", category: "Performance", price: 339.9, colors: [
            "assets/images/produtos/terra-move/tenis-16.webp", "assets/images/produtos/terra-move/tenis-17.webp", "assets/images/produtos/terra-move/tenis-18.webp"
        ] },
        { id: 7, name: "Trail Flex", category: "Performance", price: 359.9, colors: [
            "assets/images/produtos/trail-flex/tenis-19.webp", "assets/images/produtos/trail-flex/tenis-20.webp", "assets/images/produtos/trail-flex/tenis-21.webp"
        ] },
        { id: 8, name: "Urban Flow", category: "Dia a dia", price: 249.9, colors: [
            "assets/images/produtos/urban-flow/tenis-22.webp", "assets/images/produtos/urban-flow/tenis-23.webp", "assets/images/produtos/urban-flow/tenis-24.webp"
        ] },
    ];
    // Recupera o carrinho local e prepara o resumo do pedido.
    const notice = $("#checkoutNotice");
    const submit = $("#checkoutSubmit");
    const paymentUnavailable = $("#paymentUnavailable");
    const paymentOptions = $("#paymentOptions");
    let paymentAvailable = false;
    let cart = [];
    try {
        const saved = JSON.parse(localStorage.getItem("passo:cart") || "[]");
        if (Array.isArray(saved))
            cart = saved.reduce((result, item) => {
                const product = catalog.find((p) => p.id === Number(item.id));
                const qty = Number(item.qty);
                if (product && Number.isInteger(qty) && qty > 0 && qty <= 99) {
                    const colorIndex = Number.isInteger(Number(item.colorIndex)) ? Number(item.colorIndex) : 0;
                    result.push({
                        ...product,
                        colorIndex,
                        size: Number(item.size),
                        image: product.colors[colorIndex] || product.colors[0],
                        qty,
                    });
                }
                return result;
            }, []);
    }
    catch { }
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= 299 ? 0 : subtotal > 0 ? 19.9 : 0;
    const empty = count === 0;
    $("#checkoutYear").textContent = new Date().getFullYear();
    $("#checkoutEmpty").hidden = !empty;
    $("#checkoutLayout").hidden = empty;
    if (!empty) {
        $("#checkoutItemCount").textContent = `(${count})`;
        $("#checkoutProducts").innerHTML = cart
            .map((item) => `
  <article class="checkout-product">
   <img src="${item.image}" alt="${item.name}" loading="lazy">
   <div><div class="checkout-product-name">${item.name}</div><div class="checkout-product-meta">${item.category} · Tamanho ${item.size || "—"} · Qtd. ${item.qty}</div></div>
   <strong class="checkout-product-price">${money(item.price * item.qty)}</strong>
  </article>`)
            .join("");
        $("#checkoutSubtotal").textContent = money(subtotal);
        $("#checkoutShipping").textContent =
            shipping === 0 ? "Grátis" : money(shipping);
        $("#checkoutTotal").textContent = money(subtotal + shipping);
    }
    // Feedback de validação e envio do pedido.
    const showNotice = (message) => {
        notice.textContent = message;
        notice.classList.add("is-visible");
        notice.scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
            block: "nearest",
        });
    };
    const setPaymentAvailability = (available, message = "") => {
        paymentAvailable = available;
        submit.disabled = !available;
        submit.innerHTML = available
            ? 'Finalizar compra <i class="fa-solid fa-arrow-right"></i>'
            : 'Pagamento indisponível <i class="fa-solid fa-lock"></i>';
        paymentUnavailable.hidden = available || empty;
        paymentOptions.classList.toggle("is-disabled", !available);
        paymentOptions.querySelectorAll('input[name="payment"]').forEach((input) => {
            input.disabled = !available;
        });
        if (message) {
            const paragraph = paymentUnavailable.querySelector("p");
            if (paragraph) paragraph.textContent = message;
        }
    };

    const checkPaymentAvailability = async () => {
        if (empty) return;
        try {
            const response = await fetch("/api/health", {
                headers: { Accept: "application/json" },
                cache: "no-store",
            });
            const health = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error("Não foi possível consultar o serviço de pagamento.");
            if (health.paymentConfigured === true) {
                setPaymentAvailability(true);
                return;
            }
            setPaymentAvailability(false);
        } catch {
            setPaymentAvailability(false, "Ainda não conseguimos validar a configuração do pagamento. A loja só poderá receber pedidos quando o backend e as credenciais do Mercado Pago estiverem configurados.");
        }
    };

    setPaymentAvailability(false);
    checkPaymentAvailability();

    // Envia somente os dados necessários; o backend valida valores e itens.
    $("#checkoutForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity() || empty)
            return;
        if (!paymentAvailable) {
            showNotice("O pagamento ainda não está disponível. A integração com o Mercado Pago precisa ser configurada antes de liberar a finalização da compra.");
            return;
        }
        if (submit.disabled)
            return;
        const data = new FormData(form);
        const digits = (value) => String(value || "").replace(/\D/g, "");
        const makeRequestId = () => {
            if (crypto.randomUUID)
                return crypto.randomUUID();
            const bytes = crypto.getRandomValues(new Uint8Array(16));
            bytes[6] = (bytes[6] & 0x0f) | 0x40;
            bytes[8] = (bytes[8] & 0x3f) | 0x80;
            const hex = [...bytes]
                .map((value) => value.toString(16).padStart(2, "0"))
                .join("");
            return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
        };
        const requestId = makeRequestId();
        const payload = {
            requestId,
            customer: {
                name: String(data.get("name") || "").trim(),
                email: String(data.get("email") || "").trim(),
                phone: digits(data.get("phone")),
                cep: digits(data.get("cep")),
                state: String(data.get("state") || ""),
                address: String(data.get("address") || "").trim(),
                number: String(data.get("number") || "").trim(),
                complement: String(data.get("complement") || "").trim(),
                neighborhood: String(data.get("neighborhood") || "").trim(),
                city: String(data.get("city") || "").trim(),
            },
            items: cart.map(({ id, qty, colorIndex, size }) => ({
                id,
                qty,
                colorIndex,
                size,
            })),
            paymentMethod: String(data.get("payment") || "pix"),
        };
        submit.disabled = true;
        submit.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Preparando pedido...';
        showNotice("Validando seu pedido e preparando o checkout seguro do Mercado Pago.");
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Idempotency-Key": requestId,
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                const apiError = typeof result.error === "string"
                    ? result.error
                    : typeof result.error?.message === "string"
                        ? result.error.message
                        : "Não foi possível criar o pedido. Tente novamente.";
                throw new Error(apiError);
            }
            if (!result.checkoutUrl)
                throw new Error("O Mercado Pago não retornou o endereço de pagamento.");
            const paymentUrl = new URL(result.checkoutUrl);
            if (paymentUrl.protocol !== "https:" ||
                !/(^|\.)mercadopago\./i.test(paymentUrl.hostname))
                throw new Error("O provedor retornou um endereço de pagamento inválido.");
            sessionStorage.setItem("passo:last-order", result.orderId);
            window.location.assign(result.checkoutUrl);
        }
        catch (error) {
            const message = typeof error?.message === "string"
                ? error.message
                : "Falha de conexão. Verifique sua conexão e tente novamente.";
            showNotice(message);
            submit.disabled = false;
            submit.innerHTML = 'Finalizar compra <i class="fa-solid fa-arrow-right"></i>';
        }
    });
    const cep = $("#customerCep");
    // Evento "input" em cep
    cep.addEventListener("input", () => {
        const digits = cep.value.replace(/\D/g, "").slice(0, 8);
        cep.value =
            digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    });
    const phone = $("#customerPhone");
    // Evento "input" em phone
    phone.addEventListener("input", () => {
        const digits = phone.value.replace(/\D/g, "").slice(0, 11);
        if (digits.length <= 2)
            phone.value = digits.length ? `(${digits}` : "";
        else if (digits.length <= 7)
            phone.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        else
            phone.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    });
})();

/* ============================================================
   PANIER (localStorage) + COMMANDE WHATSAPP
   ============================================================ */

const CART_KEY = "babouches_cart_v1";

function getProductById(id) {
  return PRODUCTS.find(function (p) { return p.id === id; });
}

function getSizeStock(id, size) {
  var product = getProductById(id);
  if (!product) return 0;
  var entry = product.sizes.find(function (s) { return s.size === size; });
  return entry ? entry.stock : 0;
}

function productTotalStock(product) {
  return product.sizes.reduce(function (sum, s) { return sum + s.stock; }, 0);
}

function productAvailability(product) {
  var total = productTotalStock(product);
  if (total === 0) return "out";
  if (total <= 3) return "low";
  return "in";
}

function availabilityLabel(state) {
  return t("badge." + (state === "in" ? "in" : state === "low" ? "low" : "out"));
}

function sizeLabel(product, size) {
  return product && product.oneSize ? t("size.one") : size;
}

function loadCart() {
  var raw;
  try {
    raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch (e) {
    raw = [];
  }
  if (!Array.isArray(raw)) raw = [];
  var clean = [];
  raw.forEach(function (line) {
    if (!line || !line.id || !line.size) return;
    var product = getProductById(line.id);
    if (!product) return;
    var stock = getSizeStock(line.id, line.size);
    if (stock <= 0) return;
    var qty = Math.max(1, Math.min(parseInt(line.qty, 10) || 1, stock));
    var existing = clean.find(function (l) { return l.id === line.id && l.size === line.size; });
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, stock);
    } else {
      clean.push({ id: line.id, size: line.size, qty: qty });
    }
  });
  return clean;
}

var cart = loadCart();

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id, size, qty) {
  qty = Math.max(1, parseInt(qty, 10) || 1);
  var stock = getSizeStock(id, size);
  if (stock <= 0) return { ok: false, reason: "out" };
  var existing = cart.find(function (l) { return l.id === id && l.size === size; });
  if (existing) {
    var next = Math.min(existing.qty + qty, stock);
    var capped = next === existing.qty;
    existing.qty = next;
    saveCart();
    return { ok: true, capped: capped };
  }
  cart.push({ id: id, size: size, qty: Math.min(qty, stock) });
  saveCart();
  return { ok: true };
}

function updateCartQty(id, size, qty) {
  var line = cart.find(function (l) { return l.id === id && l.size === size; });
  if (!line) return;
  var stock = getSizeStock(id, size);
  qty = parseInt(qty, 10) || 1;
  if (qty <= 0) {
    removeFromCart(id, size);
    return;
  }
  line.qty = Math.min(qty, stock);
  saveCart();
  renderCart();
}

function removeFromCart(id, size) {
  cart = cart.filter(function (l) { return !(l.id === id && l.size === size); });
  saveCart();
  renderCart();
  if (typeof showToast === "function") showToast(t("toast.removed"));
}

function cartCount() {
  return cart.reduce(function (sum, l) { return sum + l.qty; }, 0);
}

function cartTotal() {
  return cart.reduce(function (sum, l) {
    var p = getProductById(l.id);
    return sum + (p ? p.price * l.qty : 0);
  }, 0);
}

function cartHasStockIssue() {
  return cart.some(function (l) { return l.qty > getSizeStock(l.id, l.size); });
}

/* ---------- Rendu du panier ---------- */

function renderCart() {
  var container = document.getElementById("cartItems");
  var footer = document.getElementById("cartFooter");
  var countEl = document.getElementById("cartCount");
  var totalEl = document.getElementById("cartTotal");
  if (!container) return;

  var count = cartCount();
  if (countEl) {
    countEl.textContent = count;
    countEl.hidden = count === 0;
  }
  var cartBtn = document.getElementById("cartButton");
  if (cartBtn) {
    cartBtn.setAttribute("aria-label", t("nav.cart") + " (" + count + ")");
  }

  if (cart.length === 0) {
    container.innerHTML =
      '<div class="cart-empty">' +
        '<div class="cart-empty__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16l-1.5 10.5a1.5 1.5 0 0 1-1.5 1.3H7a1.5 1.5 0 0 1-1.5-1.3Z"/><path d="M8 9 9.5 4h5L16 9"/><path d="M9.5 13v4M14.5 13v4"/></svg></div>' +
        '<h3>' + escapeHtml(t("cart.empty")) + "</h3>" +
        '<p>' + escapeHtml(t("cart.emptyHint")) + "</p>" +
        '<button type="button" class="btn btn--primary" data-close-cart>' + escapeHtml(t("cart.continue")) + "</button>" +
      "</div>";
    if (footer) footer.hidden = true;
    return;
  }

  if (footer) footer.hidden = false;

  container.innerHTML = cart.map(function (line) {
    var product = getProductById(line.id);
    if (!product) return "";
    var stock = getSizeStock(line.id, line.size);
    var lineTotal = product.price * line.qty;
    var metaSize = product.oneSize
      ? t("size.one")
      : t("cart.size") + " : " + sizeLabel(product, line.size);
    return (
      '<article class="cart-line" data-id="' + escapeHtml(line.id) + '" data-size="' + escapeHtml(line.size) + '">' +
        '<img class="cart-line__img" src="' + escapeHtml(product.images[0]) + '" alt="' + escapeHtml(product.name[currentLang]) + '" loading="lazy">' +
        '<div class="cart-line__info">' +
          '<h4>' + escapeHtml(product.name[currentLang]) + "</h4>" +
          '<p class="cart-line__meta">' + escapeHtml(metaSize) +
            ' · <span class="cart-line__stock">' + escapeHtml(t("modal.stockLeft", { n: stock })) + "</span></p>" +
          '<div class="qty qty--small" role="group" aria-label="' + escapeHtml(t("modal.qty")) + '">' +
            '<button type="button" class="qty__btn" data-cart-action="dec" aria-label="-">−</button>' +
            '<span class="qty__value">' + line.qty + "</span>" +
            '<button type="button" class="qty__btn" data-cart-action="inc" aria-label="+">+</button>' +
          "</div>" +
        "</div>" +
        '<div class="cart-line__end">' +
          '<strong>' + formatPrice(lineTotal) + "</strong>" +
          '<button type="button" class="link-danger" data-cart-action="remove">' + escapeHtml(t("cart.remove")) + "</button>" +
        "</div>" +
      "</article>"
    );
  }).join("");

  if (totalEl) totalEl.textContent = formatPrice(cartTotal());
}

function cartOrderText() {
  var lines = cart.map(function (line) {
    var product = getProductById(line.id);
    var sizePart = product.oneSize ? "" : " — " + t("cart.size") + " " + sizeLabel(product, line.size);
    return "• " + product.name[currentLang] + sizePart +
      " × " + line.qty + " — " + formatPrice(product.price * line.qty);
  });
  return t("cart.orderIntro", { shop: SHOP.name }) + "\n" + lines.join("\n") + "\n\n" +
    t("cart.orderTotal", { total: formatPrice(cartTotal()) }) + "\n" +
    t("cart.orderOutro");
}

function whatsappUrl(text) {
  return "https://wa.me/" + SHOP.whatsapp + "?text=" + encodeURIComponent(text);
}

function orderOnWhatsApp() {
  if (cart.length === 0) return;
  if (cartHasStockIssue()) {
    if (typeof showToast === "function") showToast(t("cart.stockWarning"));
  }
  window.open(whatsappUrl(cartOrderText()), "_blank", "noopener");
}

function copyOrder() {
  var text = cartOrderText();
  function done() { if (typeof showToast === "function") showToast(t("cart.copied")); }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(fallback);
  } else {
    fallback();
  }
  function fallback() {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) {}
    document.body.removeChild(ta);
  }
}

function openCart() {
  var drawer = document.getElementById("cartDrawer");
  var overlay = document.getElementById("overlay");
  if (!drawer) return;
  renderCart();
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  if (overlay) overlay.classList.add("is-visible");
  document.body.classList.add("no-scroll");
  var closeBtn = drawer.querySelector("[data-close-cart]");
  if (closeBtn) closeBtn.focus();
}

function closeCart() {
  var drawer = document.getElementById("cartDrawer");
  var overlay = document.getElementById("overlay");
  if (!drawer) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  if (overlay) overlay.classList.remove("is-visible");
  document.body.classList.remove("no-scroll");
}

/* ---------- Utilitaires ---------- */

function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

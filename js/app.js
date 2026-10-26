/* ============================================================
   LOGIQUE DU SITE : catalogue, filtres, modal produit, panier
   ============================================================ */

var state = {
  category: "all",
  size: "all",
  availability: "all",
  sort: "featured",
  search: "",
  modalProductId: null,
  selectedSize: null,
  modalQty: 1
};

var lastFocused = null;
var toastTimer = null;

/* ---------- Initialisation ---------- */

document.addEventListener("DOMContentLoaded", function () {
  fillShopInfo();
  wireEvents();

  applyTranslations();
  syncLangButtons();
  renderCategoryChips();
  renderSizeOptions();
  renderProducts();
  renderCart();

  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Infos magasin ---------- */

function fillShopInfo() {
  document.querySelectorAll("#brandName, #brandNameFooter, #brandNameCopy").forEach(function (el) {
    el.textContent = SHOP.name;
  });

  var waHref = whatsappUrl(t("whatsapp.generic", { shop: SHOP.name }));
  document.getElementById("heroWhatsapp").href = waHref;
  document.getElementById("contactWhatsapp").href = waHref;
  var aboutWa = document.getElementById("aboutWhatsapp");
  if (aboutWa) aboutWa.href = waHref;
  document.getElementById("whatsappValue").textContent = SHOP.phone;

  var phone = document.getElementById("contactPhone");
  phone.href = "tel:" + SHOP.phone.replace(/[^\d+]/g, "");
  document.getElementById("phoneValue").textContent = SHOP.phone;

  var ig = document.getElementById("contactInstagram");
  ig.href = SHOP.instagramUrl;
  document.getElementById("instagramValue").textContent = "@" + SHOP.instagram;

  document.getElementById("addressValue").textContent = SHOP.address[currentLang] + " · " + SHOP.city[currentLang];
  document.getElementById("mapsLink").href = SHOP.mapsUrl;
  document.getElementById("hoursValue").textContent = SHOP.hours[currentLang];

  var email = document.getElementById("contactEmail");
  email.href = "mailto:" + SHOP.email;
  document.getElementById("emailValue").textContent = SHOP.email;
}

/* ---------- Navigation mobile ---------- */

function closeMobileNav() {
  var nav = document.getElementById("mainNav");
  var btn = document.getElementById("menuToggle");
  nav.classList.remove("is-open");
  btn.setAttribute("aria-expanded", "false");
}

/* ---------- Chips catégories ---------- */

function renderCategoryChips() {
  var wrap = document.getElementById("categoryChips");
  wrap.innerHTML = CATEGORIES.map(function (cat) {
    var active = state.category === cat.id;
    return '<button type="button" class="chip' + (active ? " is-active" : "") +
      '" data-category="' + escapeHtml(cat.id) + '" aria-pressed="' + active + '">' +
      escapeHtml(cat.label[currentLang]) + "</button>";
  }).join("");
}

/* ---------- Filtre tailles ---------- */

function allSizes() {
  var set = new Set();
  PRODUCTS.forEach(function (p) {
    if (p.oneSize) return;
    p.sizes.forEach(function (s) { set.add(s.size); });
  });
  return Array.from(set).sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); });
}

function renderSizeOptions() {
  var select = document.getElementById("sizeFilter");
  var sizes = allSizes();
  select.innerHTML = '<option value="all">' + escapeHtml(t("catalog.size")) + "</option>" +
    sizes.map(function (s) {
      return '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + "</option>";
    }).join("");
  if (sizes.indexOf(state.size) === -1) state.size = "all";
  select.value = state.size;
}

/* ---------- Catalogue ---------- */

function productInCategory(product) {
  var cat = state.category;
  if (cat === "all") return true;
  if (cat === "babouches") return product.category === "babouches";
  if (cat.indexOf("babouches-") === 0) {
    return product.category === "babouches" && product.audience === cat.replace("babouches-", "");
  }
  return product.category === cat;
}

function filteredProducts() {
  var search = state.search.trim().toLowerCase();

  var list = PRODUCTS.filter(function (p) {
    if (!productInCategory(p)) return false;

    if (state.size !== "all") {
      var sizeEntry = p.sizes.find(function (s) { return s.size === state.size; });
      if (!sizeEntry || sizeEntry.stock <= 0) return false;
    }

    var avail = productAvailability(p);
    if (state.availability !== "all" && avail !== state.availability) return false;

    if (search) {
      var haystack = [
        p.name.fr, p.name.en, p.color.fr, p.color.en, p.description.fr, p.description.en
      ].join(" ").toLowerCase();
      if (haystack.indexOf(search) === -1) return false;
    }
    return true;
  });

  if (state.sort === "price-asc") {
    list.sort(function (a, b) { return a.price - b.price; });
  } else if (state.sort === "price-desc") {
    list.sort(function (a, b) { return b.price - a.price; });
  } else {
    list.sort(function (a, b) {
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
      return a.id.localeCompare(b.id);
    });
  }

  return list;
}

function renderProducts() {
  var grid = document.getElementById("productGrid");
  var empty = document.getElementById("emptyState");
  var results = document.getElementById("resultsCount");
  var list = filteredProducts();

  results.textContent = list.length === 1 ? t("catalog.resultsOne") : t("catalog.results", { n: list.length });

  grid.innerHTML = list.map(productCardHtml).join("");
  grid.hidden = list.length === 0;
  empty.hidden = list.length !== 0;
}

function productCardHtml(product) {
  var avail = productAvailability(product);
  var badgeClass = "badge--" + avail;
  var availableSizes = product.sizes.filter(function (s) { return s.stock > 0; });
  var sizesLabel = t("card.sizes");
  var sizeChips;

  if (product.oneSize) {
    sizesLabel = t("card.format");
    sizeChips = '<span class="size-chip">' + escapeHtml(t("size.oneShort")) + "</span>";
  } else if (availableSizes.length) {
    sizeChips = availableSizes.map(function (s) {
      return '<span class="size-chip">' + escapeHtml(s.size) + "</span>";
    }).join("");
  } else {
    sizeChips = '<span class="size-chip size-chip--muted">—</span>';
  }

  return (
    '<article class="product-card" role="button" tabindex="0" data-open-product="' + escapeHtml(product.id) + '" ' +
      'aria-label="' + escapeHtml(product.name[currentLang] + " — " + formatPrice(product.price)) + '">' +
      '<div class="product-card__media">' +
        '<img src="' + escapeHtml(product.images[0]) + '" alt="' + escapeHtml(product.name[currentLang]) + '" loading="lazy" width="800" height="800">' +
        '<span class="badge ' + badgeClass + '">' + escapeHtml(availabilityLabel(avail)) + "</span>" +
      "</div>" +
      '<div class="product-card__body">' +
        '<div class="product-card__top">' +
          "<h3>" + escapeHtml(product.name[currentLang]) + "</h3>" +
          '<span class="product-card__price">' + formatPrice(product.price) + "</span>" +
        "</div>" +
        '<p class="product-card__color"><span class="color-dot" style="background:' + escapeHtml(product.color.hex) + '"></span>' +
          escapeHtml(product.color[currentLang]) + "</p>" +
        '<div class="product-card__sizes">' +
          '<span class="product-card__sizes-label">' + escapeHtml(sizesLabel) + "</span>" +
          '<span class="size-chips">' + sizeChips + "</span>" +
        "</div>" +
        '<span class="card-link">' + escapeHtml(t("card.details")) +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        "</span>" +
      "</div>" +
    "</article>"
  );
}

/* ---------- Modal produit ---------- */

function openProduct(id) {
  var product = getProductById(id);
  if (!product) return;

  lastFocused = document.activeElement;
  state.modalProductId = id;
  state.selectedSize = product.oneSize ? "one" : null;
  state.modalQty = 1;

  renderModal();

  var modal = document.getElementById("productModal");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  var closeBtn = modal.querySelector(".modal__close");
  if (closeBtn) closeBtn.focus();
}

function renderModal() {
  var product = getProductById(state.modalProductId);
  if (!product) return;

  var avail = productAvailability(product);
  var badge = document.getElementById("modalBadge");
  badge.className = "badge badge--" + avail;
  badge.textContent = availabilityLabel(avail);

  var img = document.getElementById("modalImage");
  img.src = product.images[0];
  img.alt = product.name[currentLang];

  document.getElementById("modalTitle").textContent = product.name[currentLang];
  document.getElementById("modalPrice").textContent = formatPrice(product.price);
  document.getElementById("modalDescription").textContent = product.description[currentLang];

  var color = document.getElementById("modalColor");
  color.innerHTML = '<span class="color-dot" style="background:' + escapeHtml(product.color.hex) + '"></span>' +
    escapeHtml(product.color[currentLang]);

  document.getElementById("modalSizes").innerHTML = product.sizes.map(function (s) {
    var disabled = s.stock <= 0;
    var selected = state.selectedSize === s.size;
    return '<button type="button" class="size-btn' + (selected ? " is-selected" : "") + '" ' +
      'data-size="' + escapeHtml(s.size) + '"' + (disabled ? " disabled" : "") + ">" +
      escapeHtml(s.size) + "</button>";
  }).join("");

  var sizeRow = document.getElementById("modalSizeRow");
  var oneNote = document.getElementById("modalOneSizeNote");
  if (product.oneSize) {
    sizeRow.hidden = true;
    oneNote.hidden = false;
    oneNote.textContent = t("size.one");
  } else {
    sizeRow.hidden = false;
    oneNote.hidden = true;
  }

  updateModalSizeHint(product);
  updateModalQty();

  var addBtn = document.getElementById("modalAdd");
  addBtn.textContent = avail === "out" ? t("badge.out") : t("modal.add");
  addBtn.disabled = avail === "out";
}

function updateModalSizeHint(product) {
  var hint = document.getElementById("modalSizeHint");
  if (state.selectedSize) {
    var stock = getSizeStock(product.id, state.selectedSize);
    hint.textContent = t("modal.stockLeft", { n: stock });
    hint.classList.add("is-stock");
  } else {
    hint.textContent = t("modal.chooseSize");
    hint.classList.remove("is-stock");
  }
}

function updateModalQty() {
  document.getElementById("modalQty").textContent = state.modalQty;
  var max = state.selectedSize ? getSizeStock(state.modalProductId, state.selectedSize) : 1;
  document.getElementById("modalQtyMinus").disabled = state.modalQty <= 1;
  document.getElementById("modalQtyPlus").disabled = !!state.selectedSize && state.modalQty >= max;
}

function closeModal() {
  var modal = document.getElementById("productModal");
  if (!modal.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
}

function addFromModal() {
  if (!state.selectedSize) {
    var picker = document.getElementById("modalSizes");
    picker.classList.add("is-error");
    setTimeout(function () { picker.classList.remove("is-error"); }, 900);
    showToast(t("modal.sizeRequired"));
    return;
  }
  var res = addToCart(state.modalProductId, state.selectedSize, state.modalQty);
  if (!res.ok) {
    showToast(t("badge.out"));
    return;
  }
  closeModal();
  renderCart();
  if (res.capped) showToast(t("toast.maxStock"));
  openCart();
}

/* ---------- Panier : délégation ---------- */

function handleCartClick(e) {
  var btn = e.target.closest("[data-cart-action]");
  if (!btn) return;
  var line = btn.closest(".cart-line");
  if (!line) return;
  var id = line.getAttribute("data-id");
  var size = line.getAttribute("data-size");
  var action = btn.getAttribute("data-cart-action");

  if (action === "remove") {
    removeFromCart(id, size);
    return;
  }
  var current = cart.find(function (l) { return l.id === id && l.size === size; });
  if (!current) return;

  if (action === "inc") {
    var stock = getSizeStock(id, size);
    if (current.qty >= stock) {
      showToast(t("toast.maxStock"));
      return;
    }
    updateCartQty(id, size, current.qty + 1);
  } else if (action === "dec") {
    updateCartQty(id, size, current.qty - 1);
  }
}

/* ---------- Toast ---------- */

function showToast(message) {
  var el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 2600);
}

/* ---------- Événements ---------- */

function wireEvents() {
  /* langue */
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(btn.getAttribute("data-lang"));
    });
  });

  /* menu mobile */
  var menuBtn = document.getElementById("menuToggle");
  var nav = document.getElementById("mainNav");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeMobileNav();
  });

  /* panier */
  document.getElementById("cartButton").addEventListener("click", openCart);
  document.querySelectorAll("[data-close-cart]").forEach(function (el) {
    el.addEventListener("click", closeCart);
  });
  document.getElementById("orderWhatsapp").addEventListener("click", orderOnWhatsApp);
  document.getElementById("copyOrder").addEventListener("click", copyOrder);
  document.getElementById("cartItems").addEventListener("click", handleCartClick);

  /* modal */
  document.querySelectorAll("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });
  document.getElementById("modalAdd").addEventListener("click", addFromModal);

  document.getElementById("productGrid").addEventListener("click", function (e) {
    var card = e.target.closest("[data-open-product]");
    if (card) openProduct(card.getAttribute("data-open-product"));
  });
  document.getElementById("productGrid").addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var card = e.target.closest("[data-open-product]");
    if (!card) return;
    e.preventDefault();
    openProduct(card.getAttribute("data-open-product"));
  });

  var modalSizes = document.getElementById("modalSizes");
  modalSizes.addEventListener("click", function (e) {
    var btn = e.target.closest(".size-btn");
    if (!btn || btn.disabled) return;
    state.selectedSize = btn.getAttribute("data-size");
    state.modalQty = 1;
    modalSizes.querySelectorAll(".size-btn").forEach(function (b) {
      b.classList.toggle("is-selected", b === btn);
    });
    updateModalSizeHint(getProductById(state.modalProductId));
    updateModalQty();
  });

  document.getElementById("modalQtyMinus").addEventListener("click", function () {
    if (state.modalQty > 1) { state.modalQty--; updateModalQty(); }
  });
  document.getElementById("modalQtyPlus").addEventListener("click", function () {
    var stock = state.selectedSize ? getSizeStock(state.modalProductId, state.selectedSize) : 99;
    if (state.modalQty < stock) { state.modalQty++; updateModalQty(); }
  });

  /* filtres */
  document.getElementById("categoryChips").addEventListener("click", function (e) {
    var chip = e.target.closest("[data-category]");
    if (!chip) return;
    state.category = chip.getAttribute("data-category");
    renderCategoryChips();
    renderProducts();
  });
  document.getElementById("searchInput").addEventListener("input", function (e) {
    state.search = e.target.value;
    renderProducts();
  });
  document.getElementById("sizeFilter").addEventListener("change", function (e) {
    state.size = e.target.value;
    renderProducts();
  });
  document.getElementById("availabilityFilter").addEventListener("change", function (e) {
    state.availability = e.target.value;
    renderProducts();
  });
  document.getElementById("sortFilter").addEventListener("change", function (e) {
    state.sort = e.target.value;
    renderProducts();
  });
  document.getElementById("resetFilters").addEventListener("click", resetFilters);

  /* clavier */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (document.getElementById("productModal").classList.contains("is-open")) {
        closeModal();
      } else if (document.getElementById("cartDrawer").classList.contains("is-open")) {
        closeCart();
      }
    }
    if (e.key === "Tab") {
      var modal = document.getElementById("productModal");
      if (modal.classList.contains("is-open")) trapFocus(modal.querySelector(".modal__dialog"), e);
      var drawer = document.getElementById("cartDrawer");
      if (drawer.classList.contains("is-open")) trapFocus(drawer, e);
    }
  });

  /* header au scroll */
  window.addEventListener("scroll", function () {
    document.querySelector(".site-header").classList.toggle("is-scrolled", window.scrollY > 10);
  }, { passive: true });

  /* changement de langue */
  document.addEventListener("languagechange", function () {
    syncLangButtons();
    fillShopInfo();
    renderCategoryChips();
    renderSizeOptions();
    renderProducts();
    renderCart();
    if (state.modalProductId && document.getElementById("productModal").classList.contains("is-open")) {
      renderModal();
    }
  });
}

function resetFilters() {
  state.category = "all";
  state.size = "all";
  state.availability = "all";
  state.sort = "featured";
  state.search = "";
  document.getElementById("searchInput").value = "";
  document.getElementById("availabilityFilter").value = "all";
  document.getElementById("sortFilter").value = "featured";
  renderCategoryChips();
  renderSizeOptions();
  renderProducts();
}

function syncLangButtons() {
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    var active = btn.getAttribute("data-lang") === currentLang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function trapFocus(container, e) {
  var focusables = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  var first = focusables[0];
  var last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

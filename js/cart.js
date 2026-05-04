/* ================================================================
   cart.js  –  Asliceofartinyourlife
   Shared cart + lightbox logic. Include on every page AFTER
   Bootstrap's JS bundle.
================================================================ */

// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

/* ── ADD / REMOVE ─────────────────────────────────────────────── */
function addToCart(title, price) {
  const ex = cart.find(i => i.title === title);
  if (ex) { ex.qty++; } else { cart.push({ title, price: Number(price) || 0, qty: 1 }); }
  saveCart();
  renderCart();
  openCart();
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  saveCart();
  renderCart();
}

/* ── SAVE TO LOCALSTORAGE ────────────────────────────────────── */
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/* ── RENDER ───────────────────────────────────────────────────── */
function renderCart() {
  const list    = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');

  if (!list || !totalEl || !countEl) return;

  list.innerHTML = '';
  let sum = 0, count = 0;
  cart.forEach((item, i) => {
    sum   += item.price * item.qty;
    count += item.qty;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div>
        <div class="cart-item-name">${item.title}</div>
        <div class="cart-item-price">€${item.price} × ${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>`;
    list.appendChild(li);
  });
  totalEl.textContent = sum.toFixed(2);
  countEl.textContent = count;
}

/* ── OPEN / CLOSE / TOGGLE CART ───────────────────────────────── */
function openCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('open');
}

function closeCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  if (!sidebar) return;
  if (sidebar.classList.contains('open')) {
    closeCart();
  } else {
    openCart();
  }
}

/* ── MOBILE NAV ───────────────────────────────────────────────── */
function openNav() {
  const navOverlay = document.getElementById('nav-overlay');
  if (navOverlay) {
    navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeNav() {
  const navOverlay = document.getElementById('nav-overlay');
  if (navOverlay) {
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ── LIGHTBOX  (gallery.html / prints.html use this) ─────────── */
let _lbCurrent = null;

function openLightbox(src, title, desc, price) {
  _lbCurrent = { src, title, desc, price: Number(price) || 0 };
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  document.getElementById('lb-image').src         = src;
  document.getElementById('lb-title').textContent = title;
  document.getElementById('lb-desc').innerHTML    = desc;
  const btn = document.getElementById('lb-add-btn');
  btn.textContent      = 'Добави в количката';
  btn.style.background = '#1A1218';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  _lbCurrent = null;
}

/* ── GLOBAL KEY HANDLER ───────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeNav();
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('open')) closeLightbox();
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar && sidebar.classList.contains('open')) closeCart();
  }
});

/* ── INITIALIZE ON PAGE LOAD ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // Render cart badge + items on every page
  renderCart();

  /* ---- NAV ---- */
  // Burger button (works whether wired with onclick in HTML or not)
  document.querySelectorAll('.burger-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openNav(); });
  });

  // Nav close button
  document.querySelectorAll('.nav-close-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); closeNav(); });
  });

  /* ---- CART ---- */
  // Cart toggle buttons (header button)
  document.querySelectorAll('.cart-toggle').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggleCart(); });
  });

  // Cart close button (inside sidebar)
  document.querySelectorAll('.cart-close').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); closeCart(); });
  });

  // Cart overlay click-outside to close
  const cartOverlay = document.getElementById('cart-overlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  /* ---- LIGHTBOX ---- */
  // Add-to-cart button inside lightbox
  const addBtn = document.getElementById('lb-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      if (!_lbCurrent) return;
      addToCart(_lbCurrent.title, _lbCurrent.price);
      this.textContent      = '✓ Добавено!';
      this.style.background = '#D63484';
      setTimeout(() => {
        this.textContent      = 'Добави в количката';
        this.style.background = '#1A1218';
      }, 1500);
    });
  }

  // Lightbox overlay close
  const lbOverlay = document.querySelector('.lb-overlay');
  if (lbOverlay) lbOverlay.addEventListener('click', closeLightbox);

  // Lightbox close button
  const lbClose = document.querySelector('.lb-close');
  if (lbClose) lbClose.addEventListener('click', closeLightbox);

  // Wire gallery image clicks → lightbox
  document.querySelectorAll('.artwork-card img').forEach(img => {
    img.addEventListener('click', () =>
      openLightbox(img.src, img.dataset.title, img.dataset.desc, 0)
    );
  });

  // Wire print thumbnail image clicks → lightbox
  document.querySelectorAll('.print-thumb img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () =>
      openLightbox(img.src, img.dataset.title, img.dataset.desc, img.dataset.price || 0)
    );
  });
});
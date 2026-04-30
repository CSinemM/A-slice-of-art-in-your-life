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
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
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

/* ── TOGGLE SIDEBAR ───────────────────────────────────────────── */
function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
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

/* ── LIGHTBOX  (gallery.html uses this) ──────────────────────── */
let _lbCurrent = null;

function openLightbox(src, title, desc, price) {
  _lbCurrent = { src, title, desc, price: Number(price) || 0 };
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  
  document.getElementById('lb-image').src          = src;
  document.getElementById('lb-title').textContent  = title;
  document.getElementById('lb-desc').innerHTML     = desc;
  const btn = document.getElementById('lb-add-btn');
  btn.textContent       = 'Добави в количката';
  btn.style.background  = '#1A1218';
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
    if (lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  }
});

/* ── INITIALIZE ON PAGE LOAD ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Render cart on page load
  renderCart();

  // Wire up burger menu button
  const burgerBtn = document.querySelector('.burger-btn');
  if (burgerBtn) {
    burgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openNav();
    });
  }

  // Wire up nav close button
  const navCloseBtn = document.querySelector('.nav-close-btn');
  if (navCloseBtn) {
    navCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeNav();
    });
  }

  // Wire up cart toggle button
  const cartToggle = document.querySelector('.cart-toggle');
  if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleCart();
    });
  }

  // Wire up cart overlay close
  const cartOverlay = document.getElementById('cart-overlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', toggleCart);
  }

  // Wire up cart close button
  const cartClose = document.querySelector('.cart-close');
  if (cartClose) {
    cartClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleCart();
    });
  }

  // Wire up lightbox add button
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

  // Wire up lightbox overlay close
  const lbOverlay = document.querySelector('.lb-overlay');
  if (lbOverlay) {
    lbOverlay.addEventListener('click', closeLightbox);
  }

  // Wire up lightbox close button
  const lbClose = document.querySelector('.lb-close');
  if (lbClose) {
    lbClose.addEventListener('click', closeLightbox);
  }

  /* wire gallery image clicks */
  document.querySelectorAll('.artwork-card img').forEach(img => {
    img.addEventListener('click', () =>
      openLightbox(img.src, img.dataset.title, img.dataset.desc, 0)
    );
  });

  /* wire print thumbnail clicks */
  document.querySelectorAll('.print-thumb img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () =>
      openLightbox(img.src, img.dataset.title, img.dataset.desc, img.dataset.price || 0)
    );
  });
});
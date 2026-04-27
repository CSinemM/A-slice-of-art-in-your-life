/* ================================================================
   cart.js  –  Asliceofartinyourlife
   Shared cart + lightbox logic. Include on every page AFTER
   Bootstrap's JS bundle.
================================================================ */

let cart = [];

/* ── ADD / REMOVE ─────────────────────────────────────────────── */
function addToCart(title, price) {
  const ex = cart.find(i => i.title === title);
  if (ex) { ex.qty++; } else { cart.push({ title, price: Number(price) || 0, qty: 1 }); }
  renderCart();
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  renderCart();
}

/* ── RENDER ───────────────────────────────────────────────────── */
function renderCart() {
  const list    = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');
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
  totalEl.textContent = sum;
  countEl.textContent = count;
}

/* ── TOGGLE SIDEBAR ───────────────────────────────────────────── */
function toggleCart() {
  document.getElementById('cart-sidebar').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

/* ── MOBILE NAV ───────────────────────────────────────────────── */
function openNav() {
  document.getElementById('nav-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  document.getElementById('nav-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── LIGHTBOX  (gallery.html uses this) ──────────────────────── */
let _lbCurrent = null;

function openLightbox(src, title, desc, price) {
  _lbCurrent = { src, title, desc, price: Number(price) || 0 };
  document.getElementById('lb-image').src          = src;
  document.getElementById('lb-title').textContent  = title;
  document.getElementById('lb-desc').innerHTML     = desc;
  const btn = document.getElementById('lb-add-btn');
  btn.textContent       = 'Добави в количката';
  btn.style.background  = '#1A1218';
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
  _lbCurrent = null;
}

/* ── GLOBAL KEY HANDLER ───────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeNav();
    if (document.getElementById('lightbox')) closeLightbox();
  }
});

/* ── WIRE UP lb-add-btn AFTER DOM READY ──────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
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
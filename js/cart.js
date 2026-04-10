const CART_KEY = "art_cart";

/* -----------------------------
   CART STORAGE
------------------------------ */
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* -----------------------------
   ADD ITEM
------------------------------ */
function addToCart(item) {
  const cart = getCart();

  cart.push({
    title: item.title,
    src: item.src,
    price: item.price || 0,
  });

  saveCart(cart);
  updateCartUI();
}

/* -----------------------------
   REMOVE ITEM
------------------------------ */
function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartUI();
}

/* -----------------------------
   RENDER CART UI
------------------------------ */
function updateCartUI() {
  const cart = getCart();

  const countEl = document.getElementById("cart-count");
  const listEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!countEl || !listEl || !totalEl) return;

  countEl.innerText = cart.length;
  listEl.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
        <span>${item.title}</span>
        <button onclick="removeItem(${index})" style="background:none;border:none;color:red;font-size:18px;cursor:pointer;">✕</button>
      </div>
    `;

    listEl.appendChild(li);

    total += Number(item.price || 0);
  });

  totalEl.innerText = total;
}

/* -----------------------------
   TOGGLE CART SIDEBAR
------------------------------ */
function toggleCart() {
  document.getElementById("cart-sidebar")?.classList.toggle("open");
  document.getElementById("cart-overlay")?.classList.toggle("open");
}

/* -----------------------------
   INIT ON LOAD
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
});
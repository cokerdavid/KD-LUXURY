document.addEventListener("DOMContentLoaded", () => {

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");
const overlay = document.getElementById("menuOverlay");

if (hamburger) hamburger.onclick = () => {
  mobileMenu.classList.add("active");
  overlay.classList.add("active");
};

if (closeMenu) closeMenu.onclick = closeMobileMenu;
if (overlay) overlay.onclick = closeMobileMenu;

function closeMobileMenu() {
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
}

/* ===== CART ===== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  el.textContent = cart.reduce((t, i) => t + i.quantity, 0);
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  if (!cartItems) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    const sum = item.price * item.quantity;

    li.innerHTML = `
      <img src="${item.image}" width="70">
      <strong>${item.name}</strong> (${item.size}) x${item.quantity}
      ₦${sum}
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;

    cartItems.appendChild(li);
    total += sum;
  });

  cartTotal.textContent = `Total: ₦${total.toFixed(2)}`;
  updateCartCount();
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("remove-btn")) {
    cart.splice(e.target.dataset.index, 1);
    saveCart();
    updateCart();
  }
});

/* ===== ADD TO CART ===== */
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.onclick = e => {
    const product = e.target.closest(".product");
    const name = product.dataset.name;
    const price = Number(product.dataset.price);
    const qty = Number(product.querySelector(".quantity-input").value);
    const image = product.querySelector(".main-img")?.src || product.querySelector("img").src;
    const size = product.querySelector(".size-select").value;

    const existing = cart.find(i => i.name === name && i.size === size);

    if (existing) existing.quantity += qty;
    else cart.push({ name, price, quantity: qty, image, size });

    saveCart();
    updateCart();
    alert(`${name} (${size}) added to cart`);
  };
});

/* ===== IMAGE SWITCHER ===== */
document.querySelectorAll(".thumb").forEach(thumb => {
  thumb.onclick = () => {
    const product = thumb.closest(".product");
    product.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");
    product.querySelector(".main-img").src = thumb.src;
  };
});

updateCart();
updateCartCount();

});

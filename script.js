document.addEventListener("DOMContentLoaded", () => {

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");
const overlay = document.getElementById("menuOverlay");

if (hamburger) {
  hamburger.onclick = () => {
    mobileMenu.classList.add("active");
    overlay.classList.add("active");
  };
}

if (closeMenu) closeMenu.onclick = closeMobileMenu;
if (overlay) overlay.onclick = closeMobileMenu;

function closeMobileMenu() {
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
}

/* ===== CART LOGIC ===== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
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
      ${item.name} x${item.quantity}
      ₦${sum}
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;

    cartItems.appendChild(li);
    total += sum;
  });

  cartTotal.textContent = `Total: ₦${total.toFixed(2)}`;
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
    const quantity = Number(product.querySelector(".quantity-input").value);
    const image = product.querySelector("img").src;

    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ name, price, quantity, image });
    }

    saveCart();
    alert("Added to cart");
  };
});

/* ===== CHECKOUT ===== */
const checkoutBtn = document.getElementById("checkout");
if (checkoutBtn) {
  checkoutBtn.onclick = () => {
    if (cart.length === 0) return alert("Cart is empty");

    const orderNumber = "ORD-" + Date.now();
    let details = "";
    let total = 0;

    cart.forEach(i => {
      details += `${i.name} x${i.quantity}\n`;
      total += i.price * i.quantity;
    });

    PaystackPop.setup({
      key: "pk_test_xxxxxxxxxxxxx",
      email: "customer@email.com",
      amount: total * 100,
      ref: orderNumber,
      callback: () => {
        document.getElementById("order-number").value = orderNumber;
        document.getElementById("order-details").value = details;
        document.getElementById("total-amount").value = total;
        document.getElementById("checkout-form").submit();

        cart = [];
        saveCart();
        updateCart();
        alert("Payment successful");
      }
    }).openIframe();
  };
}

updateCart();

});

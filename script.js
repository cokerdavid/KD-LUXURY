document.addEventListener("DOMContentLoaded", () => {

  /* ===================== MOBILE MENU ===================== */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");
const overlay = document.getElementById("menuOverlay");

if (hamburger && mobileMenu && overlay) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    overlay.classList.add("active");
  });

  closeMenu.addEventListener("click", closeMobileMenu);
  overlay.addEventListener("click", closeMobileMenu);

  // Close menu when link is clicked
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });
}

function closeMobileMenu() {
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
}
  /* ===================== CART ===================== */
  let cart = [];

  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout");

  function generateOrderNumber() {
    return "ORD-" + Math.floor(100000 + Math.random() * 900000);
  }

  // Quantity buttons
  document.addEventListener("click", e => {
    if (e.target.classList.contains("plus")) {
      e.target.previousElementSibling.value++;
    }

    if (e.target.classList.contains("minus")) {
      const input = e.target.nextElementSibling;
      if (input.value > 1) input.value--;
    }
  });

  function updateCart() {
    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const li = document.createElement("li");
      const itemTotal = item.price * item.quantity;

      li.innerHTML = `
        ${item.name} x${item.quantity} — ₦${itemTotal.toFixed(2)}
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;

      cartItems.appendChild(li);
      total += itemTotal;
    });

    cartTotal.textContent = `Total: ₦${total.toFixed(2)}`;
  }

  // Remove item
  document.addEventListener("click", e => {
    if (e.target.classList.contains("remove-btn")) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      updateCart();
    }
  });

  // Add to cart
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      const product = e.target.closest(".product");
      if (!product) return;

      const name = product.dataset.name;
      const price = parseFloat(product.dataset.price);
      const qty = parseInt(product.querySelector(".quantity-input").value);

      const existing = cart.find(i => i.name === name);
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({ name, price, quantity: qty });
      }

      updateCart();
    });
  });

  // Checkout + Paystack
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) return alert("Cart is empty");

      const orderNumber = generateOrderNumber();
      let orderText = "";
      let total = 0;

      cart.forEach(i => {
        const sum = i.price * i.quantity;
        orderText += `${i.name} x${i.quantity} - ₦${sum}\n`;
        total += sum;
      });

      let handler = PaystackPop.setup({
        key: "pk_test_xxxxxxxxxxxxx", // replace with your key
        email: "customer@email.com",
        amount: total * 100,
        ref: orderNumber,
        callback: function () {
          document.getElementById("order-number").value = orderNumber;
          document.getElementById("order-details").value = orderText;
          document.getElementById("total-amount").value = `₦${total}`;
          document.getElementById("checkout-form").submit();

          cart = [];
          updateCart();
          alert("Payment successful!");
        }
      });

      handler.openIframe();
    });
  }

});

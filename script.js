let cart = [];
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Order number generation
function generateOrderNumber() {
  return "ORD-" + Math.floor(100000 + Math.random() * 900000);
}

// Update cart display (WITH REMOVE BUTTON)
function updateCart() {
  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("cart-item");

    const itemTotal = item.price * item.quantity;

    const itemText = document.createElement("span");
    itemText.textContent = `${item.name} x${item.quantity} - ₦${itemTotal.toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-btn");

    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCart();
    });

    li.appendChild(itemText);
    li.appendChild(removeBtn);
    cartItems.appendChild(li);

    total += itemTotal;
  });

  cartTotal.textContent = `Total: ₦${total.toFixed(2)}`;
}

// Add to cart
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", (e) => {
    const product = e.target.closest(".product");
    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);
    const quantityInput = product.querySelector(".quantity-input");
    const quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity < 1) {
      alert("Please select a valid quantity");
      return;
    }

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ name, price, quantity });
    }

    updateCart();
    alert(`${quantity} piece(s) of ${name} added to cart`);
  });
});

// Checkout
const checkout = document.getElementById("checkout");

if (checkout) {
  checkout.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const orderNumber = generateOrderNumber();
    let orderText = "";
    let displayText = "";
    let totalAmount = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;

      orderText += `${item.name} x${item.quantity} - ₦${itemTotal.toFixed(2)}\n`;
      displayText += `• ${item.name} x${item.quantity} - ₦${itemTotal.toFixed(2)}\n`;

      totalAmount += itemTotal;
    });

    alert(
      `ORDER CONFIRMATION\n\n` +
      `Order Number: ${orderNumber}\n\n` +
      `Items Purchased:\n${displayText}\n` +
      `Total: ₦${totalAmount.toFixed(2)}`
    );

    document.getElementById("order-number").value = orderNumber;
    document.getElementById("order-details").value = orderText;
    document.getElementById("total-amount").value = `₦${totalAmount.toFixed(2)}`;

    document.getElementById("checkout-form").submit();

    cart = [];
    updateCart();
  });
}
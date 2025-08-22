// on DOM loaded
document.addEventListener("DOMContentLoaded", function () {
  // get the cart from local storage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = JSON.parse(localStorage.getItem("cartTotal")) || 0;
  let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity")) || 0;
  if (cart.length === 0) {
    document.getElementById("products-container").style.display = "none";
    document.getElementById("delivery-summary").style.display = "none";
    document.getElementById("go-to-payment").style.display = "none";
    document.getElementById("cart-header").innerText = "Your cart is empty";
  } else {
    getCartSummary();
    localStorage.setItem("deliveryOptionId", 1);
    document.getElementById("summary-products").innerText =
      total.toFixed(2) + "€";
    updateTotal();

    document
      .getElementById("delivery-form")
      .addEventListener("change", function (event) {
        const deliveryPrice = getDeliveryPrice(parseInt(event.target.value));
        localStorage.setItem("deliveryOptionId", event.target.value);
        document.getElementById("summary-delivery").innerText =
          deliveryPrice + "€";
        updateTotal();
      });

    document
      .getElementById("go-to-payment")
      .addEventListener("click", function (event) {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You need to be logged in to place an order");
          return;
        }
        window.location = "payment.html";
      });
  }
});

// ---------------------------------------------FETCHING CART------------------------------------------------
async function getCartSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const response = await fetch("http://localhost:5000/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cart }),
  });

  const cartItems = await response.json();

  for (const cartItem of cartItems) {
    const {
      product_id,
      name,
      image_url,
      size_option_id,
      size,
      regular_price,
      discounted_price,
      is_discounted,
      stock,
    } = cartItem;
    const price = is_discounted ? discounted_price : regular_price;
    const quantity = cart.find(
      (item) => item.sizeOptionId === size_option_id
    ).numberOfUnits;
    const totalPrice = price * quantity;
    const newCartItemDiv = document.createElement("div");
    newCartItemDiv.classList.add("product");
    newCartItemDiv.id = `product${size_option_id}`;
    newCartItemDiv.innerHTML = `
            <div class="felxbox-left">
                <img class="discard" src="../assets/discard.svg" alt="remove from cat" onclick="deleteFromCart(${size_option_id.toString()}, ${price})">
                <img class="product-image" src="${image_url}" alt="">
                <div class="product-name">${name} - ${size}g</div>
            </div>
            <div class="flexbox-right">
                <div class="counter">
                    <div class="minus" onclick="handleMinus(${size_option_id}, ${price})">-</div>
                    <div class="quantity" id="quantity${size_option_id}">${quantity}</div>
                    <div class="plus" onclick="handlePlus(${size_option_id}, ${price})">+</div>
                </div>
                <div class="price-calculation">
                    <div class="x">x</div>
                    <div class="unit-price">${price}€</div>
                    <div class="equals">=</div>
                    <div class="product-price" id="total${size_option_id}">${totalPrice}€</div>
                </div>
            </div>
        `;
    document.getElementById("products-container").appendChild(newCartItemDiv);
  }
}

function handlePlus(sizeOptionId, price) {
  const quantityDiv = document.getElementById(`quantity${sizeOptionId}`);
  const totalDiv = document.getElementById(`total${sizeOptionId}`);
  quantityDiv.innerText = parseInt(quantityDiv.innerText) + 1;
  totalDiv.innerText = (parseFloat(totalDiv.innerText) + price).toFixed(2);
  +"€";
  addToCart(sizeOptionId.toString(), price);
}

function handleMinus(sizeOptionId, price) {
  const quantityDiv = document.getElementById(`quantity${sizeOptionId}`);
  const totalDiv = document.getElementById(`total${sizeOptionId}`);
  const quantity = parseInt(quantityDiv.innerText);
  if (quantity > 1) {
    quantityDiv.innerText = quantity - 1;
    totalDiv.innerText =
      (parseFloat(totalDiv.innerText) - price).toFixed(2) + "€";
    removeFromCart(sizeOptionId.toString(), price);
  }
}

function removeFromCart(sizeOptionId, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = JSON.parse(localStorage.getItem("cartTotal")) || 0;
  let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity")) || 0;

  // Check if the product is already in the cart
  const productIndex = cart.findIndex(
    (item) => item.sizeOptionId === sizeOptionId
  );

  if (productIndex !== -1) {
    // If the product exists, update the quantity
    cart[productIndex].numberOfUnits -= 1;
    if (cart[productIndex].numberOfUnits === 0) {
      cart = cart.filter((item) => item.sizeOptionId !== sizeOptionId);
    }
  }

  // Update total price
  total -= price;
  cartQuantity -= 1;

  // Save updated cart back to local storage
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartTotal", JSON.stringify(total));
  localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));

  document.getElementById("summary-products").innerText =
    total.toFixed(2) + "€";
  updateTotal();
  document.dispatchEvent(new Event("addedToCart"));
}

function addToCart(sizeOptionId, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = JSON.parse(localStorage.getItem("cartTotal")) || 0;
  let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity")) || 0;

  // Check if the product is already in the cart
  const productIndex = cart.findIndex(
    (item) => item.sizeOptionId === sizeOptionId
  );

  if (productIndex !== -1) {
    // If the product exists, update the quantity
    cart[productIndex].numberOfUnits += 1;
  } else {
    // If the product is new, add it to the cart
    cart.push({ sizeOptionId, numberOfUnits: 1 });
  }

  // Update total price
  total += price;
  cartQuantity += 1;

  // Save updated cart back to local storage
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartTotal", JSON.stringify(total));
  localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));

  document.getElementById("summary-products").innerText =
    total.toFixed(2) + "€";
  updateTotal();
  document.dispatchEvent(new Event("addedToCart"));
}

function deleteFromCart(sizeOptionId, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = JSON.parse(localStorage.getItem("cartTotal")) || 0;
  let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity")) || 0;
  // Check if the product is already in the cart
  const productIndex = cart.findIndex(
    (item) => item.sizeOptionId == sizeOptionId
  );
  if (productIndex !== -1) {
    // If the product exists, update the quantity
    const numberOfUnits = cart[productIndex].numberOfUnits;
    cart = cart.filter((item) => item.sizeOptionId != sizeOptionId);
    total -= price * numberOfUnits;
    cartQuantity -= numberOfUnits;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartTotal", JSON.stringify(total));
  localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));

  if (cartQuantity == 0) {
    location.reload();
  }
  document.getElementById("summary-products").innerText =
    total.toFixed(2) + "€";
  document.getElementById(`product${sizeOptionId}`).remove();
  updateTotal();
  document.dispatchEvent(new Event("addedToCart"));
}

function updateTotal() {
  const productsTotal = JSON.parse(localStorage.getItem("cartTotal")) || 0;
  const deliveryPrice = parseInt(
    document.getElementById("summary-delivery").innerText
  );
  const total = productsTotal + deliveryPrice;
  document.getElementById("summary-total").innerText = total.toFixed(2) + "€";
}

function getDeliveryPrice(deliveryOption) {
  switch (deliveryOption) {
    case 1:
      return 5;
    case 2:
      return 8;
    case 3:
      return 11;
    default:
      return 0;
  }
}

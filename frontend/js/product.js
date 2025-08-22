function mapSizeToIndex(size) {
  switch (size) {
    case "200":
      return 1;
    case "300":
      return 2;
    case "900":
      return 3;
    default:
      return 0;
  }
}

function updatePrice(size_option) {
  const priceElement = document.getElementById("price");
  const price = size_option.is_discounted
    ? size_option.discounted_price
    : size_option.regular_price;
  priceElement.textContent = price + "€";
}

function redirect(pathAfterPages) {
  window.location.href = `${pathAfterPages}`;
}

async function addToCart(sizeOption) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = JSON.parse(localStorage.getItem("cartTotal")) || 0;
  let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity")) || 0;

  // Check if the product is already in the cart
  const productIndex = cart.findIndex(
    (item) => item.sizeOptionId === sizeOption.id
  );

  if (productIndex !== -1) {
    // If the product exists, update the quantity
    cart[productIndex].numberOfUnits += 1;
  } else {
    // If the product is new, add it to the cart
    cart.push({ sizeOptionId: sizeOption.id, numberOfUnits: 1 });
  }

  // Update total price
  total += sizeOption.is_discounted
    ? sizeOption.discounted_price
    : sizeOption.regular_price;
  cartQuantity += 1;

  // Save updated cart back to local storage
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartTotal", JSON.stringify(total));
  localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
  document.dispatchEvent(new Event("addedToCart"));
}

document.addEventListener("DOMContentLoaded", function () {
  // ---------------------------------------------FETCHING PRODUCT------------------------------------------------
  // Get the product ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const sizeOption = urlParams.get("size");

  if (!productId) {
    redirect("shop.html");
  }
  // Fetch the specific product JSON file based on the ID
  fetch(`http://localhost:5000/api/products/${productId}`)
    .then((response) => {
      if (response.status === 404) {
        redirect("shop.html");
      }
      if (!response.ok) throw new Error("Product not found");
      return response.json();
    })
    .then((json) => {
      const product = json.product;
      let {
        id,
        name,
        full_name,
        category,
        key_features,
        description,
        image_url,
        size_options,
      } = product;

      document.getElementById("product-name").textContent = name;
      document.getElementById("full-name").textContent = full_name;
      document.getElementById("description").textContent = description;

      featuresArray = key_features.split(";");
      for (feature of featuresArray) {
        const li = document.createElement("li");
        li.textContent = feature;
        li.classList.add("key-feature");
        document.getElementById("key-features").appendChild(li);
      }

      document.getElementById("product-image").src = size_options[0].image_url;

      const sizeSelectElement = document.getElementById("size-select");
      size_options = size_options.map((option) => {
        return {
          ...option,
          sizeInt: mapSizeToIndex(option.size) || option.size,
        };
      });

      size_options.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.sizeInt;
        option.textContent = item.size + "g";
        sizeSelectElement.appendChild(option);
      });

      const available_sizes = size_options.map((option) => option.sizeInt);
      const sizeOptionInt = parseInt(sizeOption);
      if (available_sizes.includes(sizeOptionInt)) {
        sizeSelectElement.value = sizeOptionInt;
        updatePrice(
          size_options.find((option) => option.sizeInt === sizeOptionInt)
        );
      } else {
        sizeSelectElement.value = available_sizes[0];
        updatePrice(
          size_options.find((option) => option.sizeInt === available_sizes[0])
        );
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set("size", available_sizes[0]);
        window.history.replaceState({}, "", currentUrl.toString());
      }

      sizeSelectElement.addEventListener("change", (event) => {
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set("size", event.target.value);
        window.history.replaceState({}, "", currentUrl.toString());
        updatePrice(
          size_options.find(
            (option) => option.sizeInt === parseInt(event.target.value)
          )
        );
      });

      const addToCartButton = document.getElementById("add-to-cart");
      addToCartButton.addEventListener("click", async () => {
        const sizeSelectElement = document.getElementById("size-select");
        const sizeOption = size_options.find(
          (option) => option.sizeInt === parseInt(sizeSelectElement.value)
        );
        addToCart(sizeOption);
        alert("Product added to cart");
      });
    })
    .catch((error) => {
      console.error("Error loading product data:", error);
    });
  // ---------------------------------------------FETCHING RECCOMENDATIONS------------------------------------------------
  fetch("http://localhost:5000/api/home")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch home data");
      return response.json();
    })
    .then((json) => {
      const reccomendations = json.data;
      const container = document.getElementById("reccomendations-container");
      console.log(reccomendations);
      for (const product of reccomendations) {
        const productDiv = document.createElement("div");
        productDiv.classList.add("reccomendation");
        productDiv.innerHTML = `
          <img class="reccomendation-image"  src="${product.image_url}" alt="reccomendation-image">
          <div class="reccomendation-title" >${product.product_name}</div>
          <a href="product.html?id=${product.product_id}" class="reccomendation-button" >See details <img src="../assets/eye-icon.svg" alt="eye-icon"></a>
          `;
        container.appendChild(productDiv);
      }
    });
});

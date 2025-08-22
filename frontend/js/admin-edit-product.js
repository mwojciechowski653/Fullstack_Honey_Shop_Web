// Get references to the elements
const uploadButton = document.getElementById("upload-button");
const imageUpload = document.getElementById("image-upload");
const productImage = document.getElementById("product-image");

// Trigger file input click when the button is clicked
uploadButton.addEventListener("click", () => {
  imageUpload.click();
});

// Preview the uploaded image
imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      productImage.src = e.target.result; // Set the image source to the uploaded file
    };
    reader.readAsDataURL(file);
  }
});

const textarea = document.getElementById("description");
const charCounter = document.getElementById("char-counter");
const maxLength = 2000;

textarea.addEventListener("input", () => {
  const currentLength = textarea.value.length;
  charCounter.textContent = `${currentLength} / ${maxLength}`;

  // If the limit is reached, add a visual indicator
  if (currentLength >= maxLength) {
    charCounter.classList.add("limit-reached");
  } else {
    charCounter.classList.remove("limit-reached");
  }
});

// Function to get URL parameter
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Fetch product details and populate the form
async function fetchProductDetails() {
  const id = getUrlParameter("id"); // Extract the `id` parameter from the URL
  if (!id) {
    console.error("No ID parameter found in the URL.");
    return;
  }

  try {
    // Make the API request
    const response = await fetch(
      `http://localhost:5000/api/products_edit/${id}`
    );
    const data = await response.json();

    if (data.success) {
      const product = data.product;

      // Populate the fields with the fetched data
      document.querySelector(".title").value = product.name;
      document.querySelector(".subtitle").value = product.full_name;
      document.querySelector(".price").value = `${product.regular_price}€`;
      document.querySelector(".stock").value = product.stock;
      productImage.src = product.image_url;

      // Populate the dropdown with the category
      const dropdown = document.querySelector(".product-type-dropdown");
      dropdown.value = product.category;

      // Populate the key features
      const features = product.key_features.split(";");
      const featuresList = document.querySelector(".features");
      featuresList.innerHTML = ""; // Clear existing features
      features.forEach((feature) => {
        const featureInput = document.createElement("input");
        featureInput.type = "text";
        featureInput.className = "key-feature";
        featureInput.value = feature;
        featuresList.appendChild(featureInput);
      });

      // Populate the description
      textarea.value = product.description;
      charCounter.textContent = `${product.description.length} / ${maxLength}`;

      // Populate the size options
      const sizeOptions = document.querySelectorAll('input[name="size"]');
      sizeOptions.forEach((option) => {
        option.checked = parseInt(option.value, 10) == product.size;
      });
    } else {
      console.error("Failed to fetch product details:", data);
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

// Call the fetch function on page load
fetchProductDetails();

// Get reference to the save button
const saveButton = document.getElementsByClassName("save-product-button")[0];

// Function to handle saving the product
saveButton.addEventListener("click", async () => {
  const id = getUrlParameter("id"); // Extract the `id` parameter from the URL
  if (!id) {
    console.error("No ID parameter found in the URL.");
    return;
  }

  // Gather all the data from the form
  const name = document.querySelector(".title").value;
  const fullName = document.querySelector(".subtitle").value;
  const price = parseFloat(
    document.querySelector(".price").value.replace("€", "")
  );
  const stock = parseInt(document.querySelector(".stock").value, 10);
  const category = document.querySelector(".product-type-dropdown").value;
  const description = textarea.value;
  const size = Array.from(document.querySelectorAll('input[name="size"]')).find(
    (option) => option.checked
  )?.value;
  const keyFeatures = Array.from(document.querySelectorAll(".key-feature"))
    .map((input) => input.value)
    .join(";");

  // Determine if the photo has changed
  const originalImageUrl = productImage.getAttribute("src");
  const isPhotoChanged = !originalImageUrl.startsWith("http"); // Assuming links will start with "http"

  const apiUrl = isPhotoChanged
    ? `http://localhost:5000/api/products_update_new_photo/${id}`
    : `http://localhost:5000/api/products_update_same_photo/${id}`;

  const payload = {
    name: name,
    full_name: fullName,
    regular_price: parseFloat(price),
    stock: parseInt(stock, 10),
    category: category,
    description: description,
    size: parseInt(size, 10), // Ensure size is sent as an integer
    key_features: keyFeatures,
  };

  // If photo changed, include the photo file in the payload
  if (isPhotoChanged) {
    const fileInput = imageUpload.files[0];
    if (!fileInput) {
      console.error("Photo has changed but no file was uploaded.");
      return;
    }

    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("full_name", payload.full_name);
    formData.append("regular_price", payload.regular_price);
    formData.append("stock", payload.stock);
    formData.append("category", payload.category);
    formData.append("description", payload.description);
    formData.append("size", payload.size);
    formData.append("key_features", payload.key_features);
    formData.append("image", fileInput);

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        console.log("Product updated successfully!");
        alert("Product updated successfully with new photo!");
      } else {
        console.error("Failed to update product:", result);
      }
    } catch (error) {
      console.error("Error updating product with new photo:", error);
    }
  } else {
    // Send data for products with the same photo
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        console.log("Product updated successfully!");
        alert("Product updated successfully!");
      } else {
        console.error("Failed to update product:", result);
      }
    } catch (error) {
      console.error("Error updating product with the same photo:", error);
    }
  }
});

// Handle delete product button click
const deleteButton = document.getElementsByClassName(
  "delete-product-button"
)[0]; // Reference to the delete button
const modal = document.getElementById("confirm-delete-modal");
const confirmDeleteButton = document.getElementById("confirm-delete-button");
const cancelDeleteButton = document.getElementById("cancel-delete-button");

// Handle delete product button click
deleteButton.addEventListener("click", () => {
  const id = getUrlParameter("id"); // Extract the `id` parameter from the URL
  if (!id) {
    console.error("No ID parameter found in the URL.");
    return;
  }

  // Show the modal
  modal.style.display = "block";
  confirmDeleteButton.disabled = true;
  cancelDeleteButton.disabled = true;

  // Automatically hide the modal and trigger confirmation after 3 seconds
  setTimeout(() => {
    confirmDeleteButton.disabled = false;
    cancelDeleteButton.disabled = false;
    alert("You can now confirm deletion.");
  }, 3000);
});

// Handle confirm delete button click
confirmDeleteButton.addEventListener("click", async () => {
  const id = getUrlParameter("id");
  if (!id) {
    console.error("No ID parameter found in the URL.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/product_delete/${id}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();
    if (result.success) {
      alert("Product deleted successfully!");
      window.location.href = "../pages/admin-products.html"; // Redirect to admin-products page
    } else {
      console.error("Failed to delete product:", result);
      alert("Failed to delete product.");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("An error occurred while deleting the product.");
  }

  // Close the modal after confirming the deletion
  modal.style.display = "none";
});

// Handle cancel delete button click
cancelDeleteButton.addEventListener("click", () => {
  // Close the modal without deleting
  modal.style.display = "none";
});

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "homePage.html";
});

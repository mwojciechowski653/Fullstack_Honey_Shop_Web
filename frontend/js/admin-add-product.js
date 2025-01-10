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

document.addEventListener("DOMContentLoaded", () => {
  const addProductButton = document.querySelector(".add-product-button");

  addProductButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Collect input values
    const title = document.querySelector(".title").value.trim();
    const subtitle = document.querySelector(".subtitle").value.trim();
    const price = document.querySelector(".price").value.trim();
    const productType = document.querySelector(".product-type-dropdown").value;
    const keyFeatures = Array.from(
      document.querySelectorAll(".key-feature")
    ).map((input) => input.value.trim());
    const sizeRadio = document.querySelector('input[name="size"]:checked');
    const size = sizeRadio ? sizeRadio.value : "";
    const stock = document.querySelector(".stock").value.trim();
    const description = document.querySelector("#description").value.trim();
    const imageInput = document.querySelector("#image-upload");
    const imageFile = imageInput.files[0];

    // Validation
    let errors = [];

    if (!title) errors.push("Title is required.");
    if (!subtitle) errors.push("Subtitle is required.");
    if (!price) errors.push("Price is required.");
    if (!productType) errors.push("Product type is required.");
    if (keyFeatures.length < 3 || keyFeatures.some((feature) => !feature)) {
      errors.push("All three key features are required.");
    }
    if (!size) errors.push("Size selection is required.");
    if (!stock) errors.push("Stock number is required.");
    if (!description) errors.push("Description is required.");
    if (!imageFile) errors.push("Product image is required.");

    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"));
      return; // Do not proceed if there are validation errors
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("price", price);
    formData.append("productType", productType);
    keyFeatures.forEach((feature, index) => {
      formData.append(`keyFeature${index + 1}`, feature);
    });
    formData.append("size", size);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("image", imageFile); // Assuming backend expects 'image' field

    try {
      // Send POST request to the backend
      const response = await fetch("http://localhost:5000/api/add_product", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        // If the response is not ok, throw an error to be caught in the catch block
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add product.");
      }

      // Assuming the backend returns JSON
      const result = await response.json();

      // Handle successful response
      alert("Product added successfully!");
      // Optionally, reset the form or redirect the user
      document.querySelector(".title").value = "";
      document.querySelector(".subtitle").value = "";
      document.querySelector(".price").value = "";
      document.querySelector(".product-type-dropdown").value = "";
      Array.from(document.querySelectorAll(".key-feature")).map((input) => {
        input.value = "";
      });
      document.querySelector('input[name="size"]:checked').value = "";
      document.querySelector('input[name="size"]:checked').checked = false;
      document.querySelector(".stock").value = "";
      document.querySelector("#description").value = "";
      document.querySelector("#product-image").src =
        "../images/CloverImage.jpg"; // Reset image preview if applicable
    } catch (error) {
      // Handle errors
      console.error("Error adding product:", error);
      alert("There was an error adding the product: " + error.message);
    }
  });
});

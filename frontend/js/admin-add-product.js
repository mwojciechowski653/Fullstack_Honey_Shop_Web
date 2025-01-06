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

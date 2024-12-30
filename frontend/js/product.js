document.addEventListener("DOMContentLoaded", function() {
    // Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
  
    // Fetch the specific product JSON file based on the ID
    fetch(`../temp/products/${productId}.json`)
      .then(response => {
        if (!response.ok) throw new Error("Product not found");
        return response.json();
      })
      .then(product => {
        // Populate HTML with product details
        console.log(product);
        // const content = document.querySelector('.main-content');   
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('full-name').textContent = product.fullName;
        document.getElementById('description').textContent = product.description;
        console.log(content);
        // content.innerHTML = JSON.stringify(product, null, 2);

      })
      .catch(error => {
        console.error('Error loading product data:', error);
        // document.getElementById('product-name').textContent = "Product not found";
      });
  });
  
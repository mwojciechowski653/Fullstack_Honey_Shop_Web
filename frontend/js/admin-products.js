document.addEventListener("DOMContentLoaded", () => {
  const tableContent = document.getElementById("table");
  const nameInput = document.getElementById("name-input");
  const stockInput = document.getElementById("stock-input");
  const categorySelect = document.getElementById("category-select");
  const searchButton = document.querySelector(".filter-button:nth-child(1)");
  const resetButton = document.querySelector(".filter-button:nth-child(2)");

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "homePage.html";
  });

  let allProducts = [];

  // Fetch data from the API
  async function fetchProducts() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/products-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productsData = await response.json();

      // Save all products for later use
      allProducts = productsData.products;

      // Populate category select options
      populateCategories(productsData.products);

      // Display all products initially
      displayProducts(productsData.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  // Populate category select with unique categories
  function populateCategories(products) {
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];
    categorySelect.innerHTML =
      '<option value="">Select category</option>' +
      categories
        .map((category) => `<option value="${category}">${category}</option>`)
        .join("");
  }

  // Display products in the table
  function displayProducts(products) {
    tableContent.innerHTML = "";
    products.forEach((product) => {
      const { id, img_link, name, category, size, stock, sold, price } =
        product;
      const row = document.createElement("div");
      row.classList.add("table-row");

      row.innerHTML = `
        <div class="table-cell"><img src="${img_link}"></div>
        <div class="table-cell">${name}</div>
        <div class="table-cell">${category}</div>
        <div class="table-cell">${size}</div>
        <div class="table-cell">${stock}</div>
        <div class="table-cell">${sold}</div>
        <div class="table-cell">${price}</div>
        <div class="table-cell">
          <button class="edit-button" data-id="${id}">Edit</button>
        </div>
      `;

      tableContent.appendChild(row);
    });

    // Add event listeners for edit buttons
    document.querySelectorAll(".edit-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        const sizeOptionId = event.target.getAttribute("data-id");
        window.location.href = `admin-edit-product.html?id=${sizeOptionId}`;
      });
    });
  }

  // Filter products based on inputs
  function filterProducts() {
    const nameFilter = nameInput.value.toLowerCase();
    const stockFilter = parseInt(stockInput.value, 10);
    const categoryFilter = categorySelect.value;

    const filteredProducts = allProducts.filter((product) => {
      const matchesName = nameFilter
        ? product.name.toLowerCase().includes(nameFilter)
        : true;
      const matchesStock = !isNaN(stockFilter)
        ? product.stock == stockFilter
        : true;
      const matchesCategory = categoryFilter
        ? product.category === categoryFilter
        : true;

      return matchesName && matchesStock && matchesCategory;
    });

    displayProducts(filteredProducts);
  }

  // Event listeners for buttons
  searchButton.addEventListener("click", filterProducts);
  resetButton.addEventListener("click", () => {
    nameInput.value = "";
    stockInput.value = "";
    categorySelect.value = "";
    displayProducts(allProducts);
  });

  // Fetch products when the page loads
  fetchProducts();
});

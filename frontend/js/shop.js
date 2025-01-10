// ----------------------------------------------------FETCHING----------------------------------------------------

// Function to fetch products from the server
async function fetchProducts() {
    console.log("Fetching products...");
    try {
        // Send a GET request to the API to fetch product data
        const response = await fetch(`https://honeyshopweb.onrender.com/api/products`);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Response received");
        // Parse the JSON response
        const data = await response.json();

        // Handle cases where no products or invalid data is returned
        if (!data.success || !data.products || data.products.length === 0) {
            console.log('No products');
            document.getElementById('products-area').innerHTML = '';
            return [];
        }

        // Split the size options for each product into separate entries
        const splitProducts = splitSizeOptions(data.products);
        // Render the products on the page
        renderProducts(splitProducts);
        return splitProducts;
    } catch (error) {
        // Handle errors during the fetch process
        console.error('Error fetching products: ', error);
        document.getElementById('products-area').innerHTML = '';
        return [];
    }
}

// Helper function to split product size options into individual products
function splitSizeOptions(products) {
    const splitProducts = [];
    products.forEach(product => {
        product.size_options.forEach(sizeOption => {
            // Create a new product object for each size option
            const newProduct = {
                id: product.id,
                name: product.name,
                full_name: product.full_name,
                category: product.category,
                key_features: product.key_features,
                description: product.description,
                image_url: product.image_url,
                size_options: {
                    id: sizeOption.id,
                    size: sizeOption.size,
                    regular_price: sizeOption.regular_price,
                    stock: sizeOption.stock,
                    is_discounted: sizeOption.is_discounted,
                    discounted_price: sizeOption.discounted_price
                }
            };
            splitProducts.push(newProduct);
        });
    });
    return splitProducts;
}

let allProducts = [];

// Function to initialize products by fetching them from the server
async function initializeProducts() {
    allProducts = await fetchProducts();

    // Calculate the maximum price after loading products
    if (allProducts.length > 0) {
        const maxPrice = Math.max(...allProducts.map(product => choosePrice(product)));
        console.log("Max Price:", maxPrice);

        // Set the maximum value of sliders
        document.getElementById("slider-min").max = maxPrice;
        const maxSlider = document.getElementById("slider-max");
        maxSlider.max = maxPrice;
        maxSlider.value = maxPrice;

        updateSlider();
    } else {
        console.log("No products available to calculate max price.");
    }
}

// ----------------------------------------------------RENDERING----------------------------------------------------

// Function to render products on the page
function renderProducts(products) {
    const productsArea = document.getElementById('products-area');
    // Generate HTML for each product and insert it into the products area
    productsArea.innerHTML = products.map(product =>
        `
            <div class="reccomendation">
            <img class="reccomendation-image" id="item-image${product.size_options.id}" src="${product.image_url}" alt="reccomendation-image">
            <div class="reccomendation-title" id="item-title${product.size_options.id}">${product.name} - ${product.size_options.size}g</div>
            <div class="reccomendation-price" id="item-price${product.size_options.id}">${choosePrice(product)}€</div>
            <a href="product.html?id=${product.id}" class="reccomendation-button" id="redirection${product.id}">See details <img src="../assets/eye-icon.svg" alt="eye-icon"></a>
            </div>
        `).join('');
}

// Helper function to determine the appropriate price to display
function choosePrice(product) {
    let price = product.size_options.regular_price;
    if (product.size_options.is_discounted) {
        price = product.size_options.discounted_price;
    }
    return price;
}


// Slider elements
const sliderMin = document.getElementById('slider-min');
const sliderMax = document.getElementById('slider-max');
const sliderTrack = document.getElementById('slider-track');
const minOutput = document.getElementById('min-output');
const maxOutput = document.getElementById('max-output');

// Update slider values and appearance
// Update slider values and appearance
function updateSlider() {
    // Pobierz wartości jako zmiennoprzecinkowe
    let minVal = sliderMin.value;
    let maxVal = parseFloat(sliderMax.value);

    if (minVal > maxVal) {
        let temp = minVal;
        minVal = maxVal;
        maxVal = temp;
    }

    // Wyświetl wartości z dwoma miejscami po przecinku
    minOutput.textContent = minVal;
    minOutput.value = minVal;
    maxOutput.textContent = maxVal.toFixed(2);
    maxOutput.value = maxVal;

    // Oblicz procentowe położenie suwaków
    const minPercent = (minVal / sliderMin.max) * 100;
    const maxPercent = (maxVal / parseFloat(sliderMax.max)) * 100;

    sliderTrack.style.left = minPercent + '%';
    sliderTrack.style.right = (100 - maxPercent) + '%';
}

sliderMin.addEventListener('input', updateSlider);
sliderMax.addEventListener('input', updateSlider);


// ----------------------------------------------------FILTERING----------------------------------------------------

// Function to handle filtering of products based on user input
function handleFiltering() {
    const checkedCategory = getChecked("category");
    const checkedSizes = getChecked("size");
    const minPrice = parseInt(document.getElementById("min-output").value, 10) || null;
    const maxPrice = parseInt(document.getElementById("max-output").value, 10) || null;

    // Apply price filtering
    let filteredProducts = filterProductsByPrice(allProducts, minPrice, maxPrice);

    // Apply category filtering if any categories are selected
    if (checkedCategory.length > 0) {
        filteredProducts = filterProductsByCategory(filteredProducts, checkedCategory);
    }

    // Apply size filtering if any sizes are selected
    if (checkedSizes.length > 0) {
        filteredProducts = filterProductsBySize(filteredProducts, checkedSizes);
    }
    // Render the filtered products
    renderProducts(filteredProducts);
}

// Filter products based on price range
function filterProductsByPrice(products, minPrice, maxPrice) {
    return products.filter(product => {
        const isAboveMin = minPrice === null || choosePrice(product) >= minPrice;
        const isBelowMax = maxPrice === null || choosePrice(product) <= maxPrice;
        return isAboveMin && isBelowMax;
    });
}

// Filter products based on selected categories
function filterProductsByCategory(products, categories) {
    return products.filter(product => categories.includes(categoryNumber(product.category)));
}

// Map category names to corresponding numeric identifiers
function categoryNumber(category) {
    let categories = ["Wildflower", "Acacia", "Buckwheat", "Clover", "Creamed", "Alfalfa"];
    return categories.indexOf(category) + 1;
}

// Filter products based on selected sizes
function filterProductsBySize(products, sizes) {
    return products.filter(product => sizes.includes(sizeNumber(product.size_options.size)));
}

// Map size values to corresponding numeric identifiers
function sizeNumber(size) {
    let sizes = ["200", "300", "900"];
    return sizes.indexOf(size) + 1;
}

// Get checked checkboxes for filtering options
function getChecked(option) {
    const acceptedOptions = ["category", "size"];
    if (!acceptedOptions.includes(option)) {
        throw new Error("Invalid option parameter.");
    }
    const checkboxes = document.querySelectorAll(`.${option}-checkbox`);
    const checkedOptions = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkedOptions.push(parseInt(checkbox.value, 10));
        }
    });
    return checkedOptions;
}

// Add click event listener to the filter button
document.getElementById("filter-button").addEventListener("click", event => {
    handleFiltering();
});

// ----------------------------------------------------SORTING----------------------------------------------------

// Sort products based on the selected order
function sortProducts(products, order = "priceAsc") {
    return products.sort((a, b) => {
        if (order === "priceAsc") {
            return choosePrice(a) - choosePrice(b); // Ascending order
        } else if (order === "priceDesc") {
            return choosePrice(b) - choosePrice(a); // Descending order
        } else if (order === "alph") {
            return a.name.localeCompare(b.name); // Alphabetical order
        } else if (order === "new") {
            return b.id - a.id; // By ID (newest first)
        } else {
            throw new Error("Invalid order parameter.");
        }
    });
}

// Handle sort button click events
function handleSortButtonClick(event, order) {
    // Sort the products
    const sortedProducts = sortProducts(allProducts, order);
    renderProducts(sortedProducts);

    // Update the active state of the clicked button
    const buttons = document.querySelectorAll(".sorting-button");
    buttons.forEach(button => button.classList.remove("sorting-active"));
    event.target.classList.add("sorting-active");
}

// Add click event listeners to sorting buttons
document.getElementById("price-ascending").addEventListener("click", event => {
    handleSortButtonClick(event, "priceAsc");
});

document.getElementById("price-descending").addEventListener("click", event => {
    handleSortButtonClick(event, "priceDesc");
});

document.getElementById("alphabetical").addEventListener("click", event => {
    handleSortButtonClick(event, "alph");
});

document.getElementById("new").addEventListener("click", event => {
    handleSortButtonClick(event, "new");
});

// ----------------------------------------------------INITIALIZING----------------------------------------------------

// Initialize the page when it loads
window.onload = () => {
    updateSlider();
    initializeProducts();
};

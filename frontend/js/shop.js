async function fetchProducts() {
    console.log("Fetching products...");
    try {
        const response = await fetch(`http://localhost:5000/api/products`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Response received");
        const data = await response.json();

        if (!data.success || !data.products || data.products.length === 0) {
            console.log('No products');
            document.getElementById('products-area').innerHTML = '';
            return [];
        }

        const splitProducts = splitSizeOptions(data.products);
        renderProducts(splitProducts);
        return splitProducts;
    } catch (error) {
        console.error('Error fetching products: ', error);
        document.getElementById('products-area').innerHTML = '';
        return [];
    }
}

function splitSizeOptions(products) {
    const splitProducts = [];

    products.forEach(product => {
        product.size_options.forEach(sizeOption => {
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

// Fetch products and store them in a variable
let allProducts = [];

async function initializeProducts() {
    allProducts = await fetchProducts();
}

function renderProducts(products) {
    const productsArea = document.getElementById('products-area');
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

function choosePrice(product) {
    let price = product.size_options.regular_price;
    if (product.size_options.is_discounted) {
        price = product.size_options.discounted_price;
    }
    return price;
}


// set sliders
const maxPrice = Math.max(...allProducts.map(product => choosePrice(product)));
console.log(maxPrice);
document.getElementById("slider-min").max = maxPrice;
const maxSlider = document.getElementById("slider-max")
maxSlider.max = maxPrice;
maxSlider.value = maxPrice;

// ----------------------------------------------------FILTERING----------------------------------------------------

function handleFiltering() {
    const checkedCategory = getChecked("category");
    const checkedSizes = getChecked("size");
    const minPrice = parseInt(document.getElementById("min-output").value, 10) || null;
    const maxPrice = parseInt(document.getElementById("max-output").value, 10) || null;

    let filteredProducts = filterProductsByPrice(allProducts, minPrice, maxPrice);

    if (checkedCategory.length > 0) {
        filteredProducts = filterProductsByCategory(filteredProducts, checkedCategory);
    }

    if (checkedSizes.length > 0) {
        filteredProducts = filterProductsBySize(filteredProducts, checkedSizes);
    }
    renderProducts(filteredProducts);
}

function filterProductsByPrice(products, minPrice, maxPrice) {
    return products.filter(product => {
        const isAboveMin = minPrice === null || choosePrice(product) >= minPrice;
        const isBelowMax = maxPrice === null || choosePrice(product) <= maxPrice;
        return isAboveMin && isBelowMax;
    });
}

function filterProductsByCategory(products, categories) {
    return products.filter(product => categories.includes(categoryNumber(product.category)));
}

function categoryNumber(category) {
    let categories = ["Wildflower", "Acacia", "Buckwheat", "Clover", "Creamed", "Alfalfa"];
    return categories.indexOf(category) + 1;
}

function filterProductsBySize(products, sizes) {
    return products.filter(product => sizes.includes(sizeNumber(product.size_options.size)));
}

function sizeNumber(size) {
    let sizes = ["200", "300", "900"];
    return sizes.indexOf(size) + 1;
}

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

document.getElementById("filter-button").addEventListener("click", event => {
    handleFiltering();
});

// ----------------------------------------------------SORTING----------------------------------------------------

function sortProducts(products, order = "priceAsc") {
    return products.sort((a, b) => {
        if (order === "priceAsc") {
            return choosePrice(a) - choosePrice(b); // Ascending order
        } else if (order === "priceDesc") {
            return choosePrice(b) - choosePrice(a); // Descending order
        } else if (order === "alph") {
            return a.name.localeCompare(b.name);
        } else if (order === "new") {
            return b.id - a.id;
        } else {
            throw new Error("Invalid order parameter.");
        }
    });
}

function handleSortButtonClick(event, order) {
    // Sort the products
    const sortedProducts = sortProducts(allProducts, order);
    renderProducts(sortedProducts);

    // Update active button
    const buttons = document.querySelectorAll(".sorting-button");
    buttons.forEach(button => button.classList.remove("sorting-active"));
    event.target.classList.add("sorting-active");
}

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


// ----------------------------------------------------SLIDER----------------------------------------------------
const sliderMin = document.getElementById('slider-min');
const sliderMax = document.getElementById('slider-max');
const sliderTrack = document.getElementById('slider-track');
const minOutput = document.getElementById('min-output');
const maxOutput = document.getElementById('max-output');

function updateSlider() {
    // Make sure min slider always stays <= max slider
    let minVal = parseInt(sliderMin.value);
    let maxVal = parseInt(sliderMax.value);

    if (minVal > maxVal) {
        // Swap values if the user crosses the sliders
        let temp = minVal;
        minVal = maxVal;
        maxVal = temp;
    }

    // Update the displayed text values
    minOutput.textContent = minVal;
    minOutput.value = minVal;
    maxOutput.textContent = maxVal;
    maxOutput.value = maxVal;

    // Calculate how far along each knob is (as percentage of total width)
    const minPercent = (minVal / (sliderMin.max - sliderMin.min)) * 100;
    const maxPercent = (maxVal / (sliderMax.max - sliderMax.min)) * 100;

    // Update the track's position and width
    sliderTrack.style.left = minPercent + '%';
    sliderTrack.style.right = (100 - maxPercent) + '%';
}

// Initialize everything on load
window.onload = () => {
    updateSlider();
    initializeProducts();
};
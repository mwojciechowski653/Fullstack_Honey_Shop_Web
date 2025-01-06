const exampleProduct = {
    id: 1,
    name: 'Wildflower Honey',
    price: 102,
    imgUrl: "../images/AcaciaImage.jpg",
    type: 1,
    sizes:[1,2]
}


const allProducts = [exampleProduct,  {...exampleProduct, id:2, price:22, name:"Cheap Honey"}, {...exampleProduct, id: 3, name: "Aavender Honey", price:33}];

function renderProducts(products) {
    document.getElementById('products-area').innerHTML = products.map(product => 
        `
            <div class="reccomendation">
            <img class="reccomendation-image" id="item-image${product.id}" src="${product.imgUrl}" alt="reccomendation-image">
            <div class="reccomendation-title" id="item-title${product.id}">${product.name}</div>
            <div class="reccomendation-price" id="item-price${product.id}">${product.price}€</div>
            <a href="product.html?id=${product.id}" class="reccomendation-button" id="redirection${product.id}">See details <img src="../assets/eye-icon.svg" alt="eye-icon"></a>
            </div>
        `).join('')
}



renderProducts(allProducts);



// set sliders
const maxPrice = Math.max(...allProducts.map(product => product.price));
document.getElementById("slider-min").max = maxPrice;
const maxSlider = document.getElementById("slider-max")
maxSlider.max = maxPrice;
maxSlider.value = maxPrice;

// ----------------------------------------------------FILTERING----------------------------------------------------
function handleFiltering() {
    const checkedTypes = getChecked("type");
    const checkedSizes = getChecked("size");
    const minPrice = parseInt(document.getElementById("min-output").value, 10) || null;
    const maxPrice = parseInt(document.getElementById("max-output").value, 10) || null;
  
    let filteredProducts = filterProductsByPrice(allProducts, minPrice, maxPrice);

    if(checkedTypes.length > 0) {
        filteredProducts = filterProductsByType(filteredProducts, checkedTypes);
    }

    if(checkedSizes.length > 0) {
        filteredProducts = filterProductsBySize(filteredProducts, checkedSizes);
    }
    renderProducts(filteredProducts);
}


function filterProductsByPrice(products, minPrice, maxPrice) {
    return products.filter(product => {
      const isAboveMin = minPrice === null || product.price >= minPrice;
      const isBelowMax = maxPrice === null || product.price <= maxPrice;
      return isAboveMin && isBelowMax;
    });
}

function filterProductsByType(products, types) {
    return products.filter(product => types.includes(product.type));
}

function filterProductsBySize(products, sizes) {
    return products.filter(product => sizes.some(size => product.sizes.includes(size)));
}

function getChecked(option) {
    acceptedOptions = ["type", "size"];
    if(!acceptedOptions.includes(option)) {
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
        return a.price - b.price; // Ascending order
      } else if (order === "priceDesc") {
        return b.price - a.price; // Descending order
      } else if(order === "alph") {
        return a.name.localeCompare(b.name);
      } else if(order === "new") {
        return b.id - a.id;
      }
       else {
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
    };
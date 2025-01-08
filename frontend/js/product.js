function mapSizeToIndex(size) {
  switch (size) {
    case '200':
      return 1;
    case '300':
      return 2;
    case '900':
      return 3;
    default:
      return 0;
  }
}

function updatePrice(size_option) {
  const priceElement = document.getElementById('price');
  const price = size_option.is_discounted ? size_option.discounted_price : size_option.regular_price;
  priceElement.textContent = price + '€';
}

function redirect(pathAfterPages) {
  window.location.href = `http://127.0.0.1:3000/frontend/pages/${pathAfterPages}`;
}

document.addEventListener("DOMContentLoaded", function() {
// ---------------------------------------------FETCHING PRODUCT------------------------------------------------
    // Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const sizeOption = urlParams.get("size");
  
    if(!productId) {
      redirect('shop.html');
    }
    // Fetch the specific product JSON file based on the ID
    fetch(`http://127.0.0.1:5000/api/products/${productId}`)
      .then(response => {
        if (response.status === 404) {
          redirect('shop.html');
        }
        if (!response.ok) throw new Error("Product not found");
        return response.json();
      })
      .then(json => {
        const product = json.product;
        let {id, name, full_name, category, key_features, description, image_url, size_options} = product;
        console.log(product);

        document.getElementById('product-name').textContent = name;
        document.getElementById('full-name').textContent = full_name;
        document.getElementById('description').textContent = description;

        featuresArray = key_features.split(';')
        for (feature of featuresArray) {
            const li = document.createElement('li');
            li.textContent = feature;
            li.classList.add('key-feature');
            document.getElementById('key-features').appendChild(li);
        }

        document.getElementById('product-image').src = image_url;

        const sizeSelectElement = document.getElementById('size-select');
        size_options = size_options.map(option => {
          return {...option, sizeInt: mapSizeToIndex(option.size) || option.size}
        })

        size_options.forEach((item) => {
          const option = document.createElement('option');
          option.value = item.sizeInt;
          option.textContent = item.size + 'g';
          sizeSelectElement.appendChild(option);
        });

        const available_sizes = size_options.map(option => option.sizeInt);
        const sizeOptionInt = parseInt(sizeOption)
        if(available_sizes.includes(sizeOptionInt)) {
          sizeSelectElement.value = sizeOptionInt;
          updatePrice(size_options.find(option => option.sizeInt === sizeOptionInt));
        } else {
          sizeSelectElement.value = available_sizes[0];
          updatePrice(size_options.find(option => option.sizeInt === available_sizes[0]));
          const currentUrl = new URL(window.location);
          currentUrl.searchParams.set("size", available_sizes[0]); 
          window.history.replaceState({}, '', currentUrl.toString());
        }

        sizeSelectElement.addEventListener('change', (event) => {
          const currentUrl = new URL(window.location);
          currentUrl.searchParams.set("size", event.target.value); 
          window.history.replaceState({}, '', currentUrl.toString());
          updatePrice(size_options.find(option => option.sizeInt === parseInt(event.target.value)));
        });

      })
      .catch(error => {
        console.error('Error loading product data:', error);
      });
  });
  
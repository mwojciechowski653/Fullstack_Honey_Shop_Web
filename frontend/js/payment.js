const BACKEND_URL = 'https://honeyshopweb.onrender.com/api';
document.getElementById("credit-card-info-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const jsonData = Object.fromEntries(formData.entries());
    const expiryDate = jsonData.expiry_date.split('/');
    const today = new Date();
    const expiry = new Date();
    expiry.setFullYear(parseInt('20' + expiryDate[0]), parseInt(expiryDate[1]) -1, 1);
    if (expiry < today) {
        alert('Card expired');
        return;
    }
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const deliveryOptionId = JSON.parse(localStorage.getItem('deliveryOptionId')) || 1;

    const token = getAndVerifyToken();
    const postResponse = await fetch(`${BACKEND_URL}/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({cart, deliveryOptionId})
    });
    const response = await postResponse.json();
    if(!response.success) {
        alert(response.message);
        return;
    }

    localStorage.removeItem('cart');
    localStorage.removeItem('cartTotal');
    localStorage.removeItem('cartQuantity');
    localStorage.removeItem('deliveryOptionId');

    alert(`Order placed successfully. Your order number is ${response.orderId}`);
    window.location.href = 'homePage.html';
});



async function getCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTotal = JSON.parse(localStorage.getItem('cartTotal')) || 0;
    const cartQuantity = JSON.parse(localStorage.getItem('cartQuantity')) || 0;
    const deliveryOptionId = JSON.parse(localStorage.getItem('deliveryOption')) || 1;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const totalTotal = cartTotal + deliveryOption.price;

    const response = await fetch(`${BACKEND_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({cart})
      });

    const cartItems = await response.json();
    const container = document.getElementById('summary-products-container'); 
    for(const cartItem of cartItems) {
        // get item from localstorage
        const item = cart.find(item => item.sizeOptionId === cartItem.size_option_id);
        const {product_id, name, image_url, size_option_id, size, regular_price, discounted_price, is_discounted, stock} = cartItem;
        const price = is_discounted ? discounted_price : regular_price;
        const totalPrice = price * item.numberOfUnits;
        const product = document.createElement('div');
        product.classList.add('summary-product');
        product.innerHTML = `
            <div class="summary-product-name">${name} - ${size}g</div>
            <div class="summary-product-quantity">x${item.numberOfUnits}</div>
            <div class="summary-product-price">${totalPrice.toFixed(2)}€</div>
        `;
        container.appendChild(product);
    }

    const deliveryDiv = document.createElement('div');
    deliveryDiv.classList.add('delivery');
    deliveryDiv.innerHTML = `
                    <div class="delivery-title">${deliveryOption.name}</div>
                    <div class="delivery-price">${deliveryOption.price}€</div>
    `;
    container.append(deliveryDiv);

    document.getElementById('total').innerText = `Total: ${totalTotal.toFixed(2)}€`;
    document.getElementById('total-quantity').innerText = `${cartQuantity} products`

}


function getDeliveryOption(deliveryOptionId) {
    if (deliveryOptionId === 1) {
        return {name: "InPost", price: 5};
    } else if (deliveryOptionId === 2) {
        return {name: "DHL", price: 8};
    } else if (deliveryOptionId === 3) {
        return {name: "FedEx", price: 11}
    } else {
        console.error("Wrong option id")
    }
}

function getAndVerifyToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to be logged in to do this');
        window.location.href = 'login.html';
    }
    return token;
}

getCartSummary();

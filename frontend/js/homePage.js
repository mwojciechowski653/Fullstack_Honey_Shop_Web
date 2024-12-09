// Backend URL (adjust to your configuration)
const HOME_PAGE_API_URL = '/home';

// Function to fetch data from the backend
async function fetchHomePageData() {
  try {
    const response = await fetch(HOME_PAGE_API_URL);
    if (!response.ok) {
      throw new Error('Error fetching data from the backend');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to update carousel images
function updateCarouselImages(discountedProducts) {
  const carouselTrack = document.querySelector('.carousel-track');
  const slides = carouselTrack.querySelectorAll('.carousel-slide');

  // Check if the number of products matches the existing slides
  discountedProducts.forEach((product, index) => {
    if (slides[index]) {
      // Update existing slides
      const link = slides[index].querySelector('a');
      const img = slides[index].querySelector('img');

      link.href = `../pages/product.html?id=${product.id}`;
      img.src = product.image_url;
      img.alt = product.name;
    } else {
      // If there are additional products, create new slides
      const slide = document.createElement('div');
      slide.classList.add('carousel-slide');
      const link = document.createElement('a');
      link.href = `../pages/product.html?id=${product.id}`;
      const img = document.createElement('img');
      img.src = product.image_url;
      img.alt = product.name;

      link.appendChild(img);
      slide.appendChild(link);
      carouselTrack.appendChild(slide);
    }
  });
}

// Function to update the bestsellers section
function updateBestsellers(topSellingProducts) {
  const cardsContainer = document.querySelector('.cards-section .container');

  // Clear existing content
  cardsContainer.innerHTML = '';

  // Iterate through products and generate HTML
  topSellingProducts.forEach((product) => {
    // Create a card
    const card = document.createElement('div');
    card.classList.add('card');

    const title = document.createElement('h3');
    title.textContent = product.name; // Product name

    const img = document.createElement('img');
    img.src = product.image_url; // Image URL from the backend
    img.alt = product.name;

    const link = document.createElement('a');
    link.href = `../pages/product.html?id=${product.id}`; // Link to product details
    const button = document.createElement('button');
    button.textContent = 'More information';
    link.appendChild(button);

    // Add elements to the card
    card.appendChild(title);
    card.appendChild(img);
    card.appendChild(link);

    // Add the card to the container
    cardsContainer.appendChild(card);
  });
}

// Function to initialize the homepage
async function initHomePage() {
  const data = await fetchHomePageData();
  if (data) {
    // Update the carousel
    updateCarouselImages(data.discountedProducts);
    // Update the bestsellers section
    updateBestsellers(data.topSellingProducts);
  }
}

// Run the initialization function after the page has loaded
document.addEventListener('DOMContentLoaded', initHomePage);

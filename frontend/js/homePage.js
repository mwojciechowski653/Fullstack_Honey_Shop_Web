document.addEventListener('DOMContentLoaded', function() {
  const fetchTopSellingProducts = async () => {
      try {
          const response = await fetch('http://localhost:5000/api/home');
          const products = await response.json();
          if (products.success) {
              populateCarousel(products.data);
          } else {
              throw new Error('Failed to fetch top selling products');
          }
      } catch (error) {
          console.error('Error fetching top selling products:', error);
      }
  };

  const populateCarousel = (products) => {
      const carouselTrack = document.querySelector('.carousel-track');
      carouselTrack.innerHTML = ''; 
      products.forEach(product => {
          const slide = document.createElement('div');
          slide.className = 'carousel-slide';
          slide.innerHTML = `
<a href="../pages/shop.html?product_id=${product.product_id}">
<img src="${product.image_url}" alt="${product.product_name}" style="width:100%;">
</a>
          `;
          carouselTrack.appendChild(slide);
      });
  };

  fetchTopSellingProducts();
});
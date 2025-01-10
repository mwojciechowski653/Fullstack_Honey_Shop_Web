document.addEventListener("DOMContentLoaded", function () {

    const fetchTopSellingProducts = async () => {

        try {

            const response = await fetch('http://localhost:5000/api/home');

            const products = await response.json();

            if (products.success) {

                populateCarousel(products.data); 

                initializeCarousel(); 

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
 
    const initializeCarousel = () => {

        const track = document.querySelector(".carousel-track");

        const slides = Array.from(track.children);

        const nextButton = document.querySelector(".carousel-button.right");

        const prevButton = document.querySelector(".carousel-button.left");

        const indicators = Array.from(document.querySelectorAll(".indicator"));
 
        const slidesToShow = 3;

        const slideWidth = slides[0].getBoundingClientRect().width;
 
        let currentSlideIndex = slidesToShow;
 

        const firstClones = slides.slice(0, slidesToShow).map(slide => slide.cloneNode(true));

        const lastClones = slides.slice(-slidesToShow).map(slide => slide.cloneNode(true));
 
        firstClones.forEach(clone => track.appendChild(clone));

        lastClones.forEach(clone => track.prepend(clone));
 
        const totalSlides = track.children.length;
 
        track.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
 
        const updateIndicators = () => {

            const indicatorIndex = (currentSlideIndex - slidesToShow) % slidesToShow;

            indicators.forEach((indicator, index) => {

                if (index === indicatorIndex) {

                    indicator.classList.add("active");

                } else {

                    indicator.classList.remove("active");

                }

            });

        };
 
        const moveToSlide = (index) => {

            const amountToMove = -index * slideWidth;

            track.style.transition = "transform 0.5s ease-in-out";

            track.style.transform = `translateX(${amountToMove}px)`;

            currentSlideIndex = index;

            updateIndicators();

        };
 
        const checkLoop = () => {

            if (currentSlideIndex >= totalSlides - slidesToShow) {

                track.style.transition = "none";

                currentSlideIndex = slidesToShow;

                track.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;

            }
 
            if (currentSlideIndex < slidesToShow) {

                track.style.transition = "none";

                currentSlideIndex = totalSlides - slidesToShow * 2;

                track.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;

            }
 
            updateIndicators();

        };
 
        nextButton.addEventListener("click", () => moveToSlide(currentSlideIndex + 1));

        prevButton.addEventListener("click", () => moveToSlide(currentSlideIndex - 1));
 
        track.addEventListener("transitionend", checkLoop);
 
        updateIndicators();

    };
 

    fetchTopSellingProducts();

});

 
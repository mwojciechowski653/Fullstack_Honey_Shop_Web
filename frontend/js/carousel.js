document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector(".carousel-track");
    const slides = Array.from(track.children); // All slides in the carousel
    const nextButton = document.querySelector(".carousel-button.right");
    const prevButton = document.querySelector(".carousel-button.left");
    const indicators = Array.from(document.querySelectorAll(".indicator"));
 
    const slidesToShow = 3; // Number of images visible at once
    const slideWidth = slides[0].getBoundingClientRect().width; // Width of a single slide
    let currentSlideIndex = slidesToShow; // Start at the first actual set
 
    // Duplicate the first and last sets of slides
    const firstClones = slides.slice(0, slidesToShow).map(slide => slide.cloneNode(true));
    const lastClones = slides.slice(-slidesToShow).map(slide => slide.cloneNode(true));
 
    // Add clones to the track
    firstClones.forEach(clone => track.appendChild(clone)); // Clones at the end
    lastClones.forEach(clone => track.prepend(clone)); // Clones at the beginning
 
    const totalSlides = track.children.length; // Total number of slides (original + clones)
 
    // Initial offset (to the first actual set)
    track.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
 
    // Function to update indicators
    function updateIndicators() {
        // Calculate the indicator corresponding to the currently visible slide
        const indicatorIndex = (currentSlideIndex - slidesToShow) % slidesToShow;
        indicators.forEach((indicator, index) => {
            if (index === indicatorIndex) {
                indicator.classList.add("active");
            } else {
                indicator.classList.remove("active");
            }
        });
    }
 
    // Function to move to a specific index
    function moveToSlide(index) {
        const amountToMove = -index * slideWidth; // Calculate the offset
        track.style.transition = "transform 0.5s ease-in-out"; // Slide animation
        track.style.transform = `translateX(${amountToMove}px)`;
        currentSlideIndex = index; // Update the current index
 
        // Update indicators
        updateIndicators();
    }
 
    // Function to handle looping
    function checkLoop() {
        if (currentSlideIndex >= totalSlides - slidesToShow) {
            // If we reached the clones at the end
            track.style.transition = "none"; // Disable animation
            currentSlideIndex = slidesToShow; // Return to the first actual set
            track.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
        }
 
        if (currentSlideIndex < slidesToShow) {
            // If we reached the clones at the beginning
            track.style.transition = "none"; // Disable animation
            currentSlideIndex = totalSlides - slidesToShow * 2; // Return to the last actual set
            track.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
        }
 
        // Update indicators after looping
        updateIndicators();
    }
 
    // Handle "Next" button
    nextButton.addEventListener("click", () => {
        moveToSlide(currentSlideIndex + 1); // Move one slide to the right
    });
 
    // Handle "Previous" button
    prevButton.addEventListener("click", () => {
        moveToSlide(currentSlideIndex - 1); // Move one slide to the left
    });
 
    // Listen for the end of the transition
    track.addEventListener("transitionend", checkLoop);
 
    // Initial update of indicators
    updateIndicators();
});

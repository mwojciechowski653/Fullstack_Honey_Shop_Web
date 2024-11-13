//adds active class based on the current page
  document.addEventListener("navbarLoaded", function() {
    // Get the current page URL path
    const currentPage = window.location.pathname.split("/").pop();
  
    // Select all navbar links within .navbar-options
    const navbarLinks = document.querySelectorAll(".navbar-options a");
    console.log(navbarLinks);
    navbarLinks.forEach(link => {
      // Check if the link's href matches the current page
      if (link.getAttribute("href") === currentPage) {
        // Add 'active' class to the child <div> element inside the <a> tag
        const navbarOption = link.querySelector(".navbar-option");
        if (navbarOption) {
          navbarOption.classList.add("active");
        }
      }
    });
  });
  

  
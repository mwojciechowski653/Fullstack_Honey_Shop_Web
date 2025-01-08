//adds active class based on the current page
  document.addEventListener("navbarLoaded", function() {
    // Get the current page URL path
    const currentPage = window.location.pathname.split("/").pop();
  
    // Select all navbar links within .navbar-options
    const navbarLinks = document.querySelectorAll(".navbar-options a");
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

    const token = localStorage.getItem('token');
    if(token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if(payload.exp < Date.now() / 1000) {
        localStorage.removeItem('token');
        window.location = 'login.html';
      } else {
      document.getElementById('logged-user').style.display = 'flex';
      document.getElementById('nav-user-name').innerText = "User: " + payload.first_name + " " + payload.last_name;
      document.getElementById('login-register-buttons').style.display = 'none';
      document.getElementById('go-to-profile').href = 'users_data.html';
      document.getElementById('logout-button').addEventListener('click', function() {
        localStorage.removeItem('token');
        alert('You have been logged out');
        window.location = 'homePage.html';
      });
      }
    }
  });
  

  
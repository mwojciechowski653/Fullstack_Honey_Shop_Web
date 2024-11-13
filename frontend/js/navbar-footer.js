// Footer and header loading
document.addEventListener("DOMContentLoaded", function() {
    // Load navbar content
    fetch('../components/top-navbar.html', { cache: "force-cache" })
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar').innerHTML = data;
      })
      .catch(error => console.error('Error loading navbar:', error));
  
    // Load footer content
    fetch('../components/footer.html', { cache: "force-cache" })
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer').innerHTML = data;
        const navbarLinks = document.querySelectorAll(".navbar-options a");
    console.log(navbarLinks);
        document.dispatchEvent(new Event("navbarLoaded"));
      })
      .catch(error => console.error('Error loading footer:', error));
  });
  
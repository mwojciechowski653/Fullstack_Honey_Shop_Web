document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const formData = new FormData(this);
    const jsonData = Object.fromEntries(formData.entries());
    try {
      const response = await fetch('https://honeyshopweb.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });

      const responseJson = await response.json();

      if (response.ok) {
        alert(responseJson.message);
        const token = responseJson.token;
        localStorage.setItem('token', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        if(payload.isAdmin) {
          window.location = 'admin_main_dashboard.html';
        } else {
            window.location = 'shop.html';
        }
        
      } else if (response.status === 401) {
        alert(responseJson.error);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit the form.');
    }
  });
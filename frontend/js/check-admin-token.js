const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'homePage.html';
  } else {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log(payload);
    const currentTime = Math.floor(Date.now() / 1000);
    if (!payload.isAdmin || payload.exp < currentTime) {
      window.location.href = 'homePage.html';
    }
  }
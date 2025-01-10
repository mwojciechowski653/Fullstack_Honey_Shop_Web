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
});
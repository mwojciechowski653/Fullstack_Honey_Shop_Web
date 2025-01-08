const url = "http://127.0.0.1:5000/api/users/1"
fetch(url)
.then(response => {
    return response.json();
})
.then(responseJson => {
    const user = responseJson.user
    const firstNameInput = document.getElementById("firstName")
    firstNameInput.value = user.first_name

    const lastNameInput = document.getElementById("lastName")
    lastNameInput.value = user.last_name

    const emailInput = document.getElementById("email")
    emailInput.value = user.email

    const phoneInput = document.getElementById("phone")
    phoneInput.value = user.user_phone

    const countryInput = document.getElementById("country")
    countryInput.value = user.country

    const cityInput = document.getElementById("city")
    cityInput.value = user.city

    const streetInput = document.getElementById("street")
    streetInput.value = user.street

    const streetNumberInput = document.getElementById("streetNumber")
    streetNumberInput.value = user.street_number

    const postalCodeInput = document.getElementById("postalCode")
    postalCodeInput.value = user.postal_code
})


document.getElementById("saveButton").addEventListener("click", event => {
    const data = {
        first_name: document.getElementById("firstName").value,
        last_name:document.getElementById("lastName").value,
        email: document.getElementById("email").value, 
        phone: document.getElementById("phone").value,
        country: document.getElementById("country").value,
        city: document.getElementById("city").value,
        street: document.getElementById("street").value,
        street_number: document.getElementById("streetNumber").value,
        postal_code: document.getElementById("postalCode").value,
        password1: document.getElementById("password1").value,
        password2: document.getElementById("password2").value
        }
    fetch(url, {
        method: "PUT", // HTTP method
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        body: JSON.stringify(data) // Convert data to JSON string
      })
      password1 = document.getElementById('password1').value;
      password2 = document.getElementById('password2').value;
      if (password1 !== password2) {
        alert('Provided passwords are not the same!');
        return;
    }

});

fetch("http://127.0.0.1:5000/api/users/1")
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

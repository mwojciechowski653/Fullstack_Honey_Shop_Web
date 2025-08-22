// get data from token
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "homePage.html";
}
// get userId from token
const userId = JSON.parse(atob(token.split(".")[1])).userId;
const url = "http://localhost:5000/api/users/" + userId;

fetch(url, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => {
    return response.json();
  })
  .then((responseJson) => {
    const user = responseJson.user;
    const firstNameInput = document.getElementById("firstName");
    firstNameInput.value = user.first_name;

    const lastNameInput = document.getElementById("lastName");
    lastNameInput.value = user.last_name;

    const emailInput = document.getElementById("email");
    emailInput.value = user.email;

    const phoneInput = document.getElementById("phone");
    phoneInput.value = user.user_phone;

    const countryInput = document.getElementById("country");
    countryInput.value = user.country;

    const cityInput = document.getElementById("city");
    cityInput.value = user.city;

    const streetInput = document.getElementById("street");
    streetInput.value = user.street;

    const streetNumberInput = document.getElementById("streetNumber");
    streetNumberInput.value = user.street_number;

    const postalCodeInput = document.getElementById("postalCode");
    postalCodeInput.value = user.postal_code;
  })
  .catch((error) => {
    console.error("Error fetching user data:", error);
  });

// submit data from user-data-form
document
  .getElementById("user-data-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const jsonData = Object.fromEntries(formData.entries());
    console.log(jsonData);

    if (!jsonData.password1 && !jsonData.password2) {
      delete jsonData.password1;
      delete jsonData.password2;
    }

    if (jsonData.password1 !== jsonData.password2) {
      alert("Provided passwords are not the same!");
      console.log(jsonData.password1, jsonData.password2);
      return;
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jsonData),
      });
      const responseJson = await response.json();
      if (response.ok) {
        alert("Data updated successfully!");
      } else {
        alert(responseJson.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit the form.");
    }
  });

// Pobieranie danych z API
async function fetchOrders(id) {
  try {
    const response = await fetch("http://localhost:5000/api/orders/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseJson = await response.json();
    const orders = responseJson.orders;

    // Generowanie wierszy tabeli
    const tableBody = document.getElementById("ordersTable");
    tableBody.innerHTML = ""; // Wyczyszczenie tabeli

    if (!orders || orders.length === 0) {
      document.getElementById("orders-table").style.display = "none";
      document.getElementById("orders-header").innerText =
        "You have no orders yet";
      return;
    }

    orders.forEach((order) => {
      const row = `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.date.split("T")[0]}</td>
                    <td>${order.order_value}€</td>
                    <td>${order.status}</td>
                    <td><a href="#" class="details-link">DETAILS</a></td>
                </tr>
            `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

fetchOrders(userId);

const url = "http://127.0.0.1:5000/api/users"; // Endpoint API do dodawania użytkowników

document.getElementById("signUpButton").addEventListener("click", event => {
    event.preventDefault(); // Zapobiega przeładowaniu strony

    // Pobieranie wartości haseł
    const password1 = document.getElementById("password1").value;
    const password2 = document.getElementById("password2").value;

    // Walidacja haseł
    if (!password1 || !password2) {
        alert("Passwords cannot be empty!");
        return;
    }
    if (password1 !== password2) {
        alert("Provided passwords are not the same!");
        return;
    }

    // Pobieranie danych z formularza
    const data = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        country: document.getElementById("country").value,
        city: document.getElementById("city").value,
        street: document.getElementById("street").value,
        street_number: document.getElementById("streetNumber").value,
        postal_code: document.getElementById("postalCode").value,
        password: password1 // Tylko jedno hasło jest wysyłane do bazy danych
    };

    // Wysłanie danych do API
    fetch(url, {
        method: "POST", // Ustawienie metody HTTP
        headers: {
            "Content-Type": "application/json", // Typ danych
        },
        body: JSON.stringify(data) // Konwersja danych do formatu JSON
    })
    .then(response => {
        if (!response.ok) {
            // Obsługa błędów, jeśli odpowiedź serwera nie jest prawidłowa
            return response.json().then(errorData => {
                throw new Error(errorData.message || "Failed to add user");
            });
        }
        return response.json(); // Parsowanie odpowiedzi na JSON
    })
    .then(data => {
        alert("User successfully added!"); // Powiadomienie o sukcesie
        console.log("Added user:", data); // Logowanie danych nowego użytkownika
    })
    .catch(error => {
        alert("Error: " + error.message); // Obsługa błędów
        console.error("Error adding user:", error); // Logowanie błędu w konsoli
    });
});

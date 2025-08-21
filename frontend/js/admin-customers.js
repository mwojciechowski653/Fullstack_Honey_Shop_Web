const BACKEND_URL = "http://backend:5000/api";

/**
 * Fetch all customers or apply filters if specified.
 */
async function fetchCustomers() {
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "homePage.html";
  });
  // Get values of filters
  const month = document.getElementById("month-select").value; // Selected month
  const date = document.getElementById("date-input").value; // Selected date
  const name = document.getElementById("name-input").value.trim(); // Entered name

  // Build query parameters for filters
  const queryParams = new URLSearchParams();
  if (month) queryParams.append("month", month);
  if (date) queryParams.append("date", date);
  if (name) queryParams.append("name", name);

  try {
    // Fetch data from the API
    const requestUrl = `${BACKEND_URL}/customers?${queryParams.toString()}`;
    console.log("Fetching customers from:", requestUrl); // Debugging log
    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch customers: ${response.statusText} (status: ${response.status})`
      );
    }

    // Parse the response JSON
    const { total, customers } = await response.json();

    // Update total customers display
    document.getElementById("total-customers").textContent = total;

    // Render customers in the table
    renderCustomers(customers);
  } catch (error) {
    console.error("Error fetching customers:", error.message);
  }
}

/**
 * Render a list of customers in the table.
 * @param {Array} customers - The list of customers to display.
 */
function renderCustomers(customers) {
  const table = document.getElementById("table");
  table.innerHTML = ""; // Clear table before adding new rows

  // Check if there are no customers
  if (customers.length === 0) {
    const noDataRow = document.createElement("div");
    noDataRow.classList.add("table-row");
    noDataRow.textContent = "No customers found.";
    table.appendChild(noDataRow);
    return;
  }

  // Render each customer as a row
  customers.forEach((customer) => {
    const row = document.createElement("div");
    row.classList.add("table-row");

    // Join date cell
    const dateDiv = document.createElement("div");
    dateDiv.classList.add("table-cell");
    dateDiv.innerHTML = formatDate(customer.created_at);

    // Customer name cell
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("table-cell");
    nameDiv.innerHTML = `${customer.first_name} ${customer.last_name}` || "N/A";

    // Email cell
    const emailDiv = document.createElement("div");
    emailDiv.classList.add("table-cell");
    emailDiv.innerHTML = customer.email || "N/A";

    // Country cell
    const countryDiv = document.createElement("div");
    countryDiv.classList.add("table-cell");
    countryDiv.innerHTML = customer.country || "N/A";

    // City cell
    const cityDiv = document.createElement("div");
    cityDiv.classList.add("table-cell");
    cityDiv.innerHTML = customer.city || "N/A";

    // Address cell
    const addressDiv = document.createElement("div");
    addressDiv.classList.add("table-cell");
    addressDiv.innerHTML =
      `${customer.street || ""} ${customer.street_number || ""}, ${
        customer.postal_code || ""
      }` || "N/A";

    // Paid amount cell
    const paidAmountDiv = document.createElement("div");
    paidAmountDiv.classList.add("table-cell");
    paidAmountDiv.innerHTML = `${customer.paid_amount || 0}€`;

    // Purchases amount cell
    const purchasesAmountDiv = document.createElement("div");

    // Append all cells to the row
    row.appendChild(dateDiv);
    row.appendChild(nameDiv);
    row.appendChild(emailDiv);
    row.appendChild(countryDiv);
    row.appendChild(cityDiv);
    row.appendChild(addressDiv);
    row.appendChild(paidAmountDiv);
    row.appendChild(purchasesAmountDiv);

    // Append the row to the table
    table.appendChild(row);
  });
}

/**
 * Format a date string into DD-MM-YYYY format.
 * @param {string} dateString - The raw date string to format.
 * @returns {string} - Formatted date or 'N/A' if invalid.
 */
function formatDate(dateString) {
  if (!dateString) return "N/A"; // Handle missing dates
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}

// Add event listeners for buttons
document
  .getElementById("search-button")
  .addEventListener("click", fetchCustomers);
document.getElementById("reset-button").addEventListener("click", () => {
  // Clear all filters
  document.getElementById("month-select").value = "";
  document.getElementById("date-input").value = "";
  document.getElementById("name-input").value = "";
  // Fetch all customers
  fetchCustomers();
});

// Fetch all customers when the page loads
document.addEventListener("DOMContentLoaded", fetchCustomers);

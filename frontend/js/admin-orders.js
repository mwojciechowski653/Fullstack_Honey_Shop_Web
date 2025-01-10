// Asynchronous function to fetch orders based on the provided filters
async function fetchOrders(filters = {}) {
    console.log("Fetching orders with filters: ", filters);
    try {
        // Create a query string from the filters object for the API request
        const queryString = new URLSearchParams(filters).toString();

        // Make a GET request to the API with the filters as query parameters
        const response = await fetch(`http://localhost:5000/api/orders?${queryString}`);

        // If the response is not OK, throw an error
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Response received");
        console.log(queryString);

        // Parse the response body as JSON
        const data = await response.json();
        console.log(data);

        // Check if 'success' is true and if 'orders' is not empty in the response
        if (!data.success || !data.orders || data.orders.length === 0) {
            console.log('No orders match the filters');
            document.getElementById('table').innerHTML = '<div class="no-results">No orders match the filters</div>';
            return;
        }

        // If data is valid, populate the table with the orders
        populateTable(data.orders);
        countOrders(data.orders);
    } catch (error) {
        // Log any errors and clear the table in case of an error
        console.error('Error fetching orders: ', error);
        document.getElementById('table').innerHTML = ''; // Clear the table in case of an error
    }
}

// Function to populate the table with orders data
function populateTable(orders) {
    const table = document.getElementById('table');
    table.innerHTML = ''; // Clear existing rows in the table

    // Iterate through each order to create a row in the table
    orders.forEach(order => {
        const row = document.createElement("div");
        row.classList.add("table-row");

        // Create and populate the date cell
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("table-cell");
        const date = new Date(order.date);
        dateDiv.innerHTML = date.toLocaleDateString(); // Format the date

        // Create and populate the name cell (user's full name)
        const nameDiv = document.createElement("div");
        nameDiv.classList.add("table-cell");
        nameDiv.innerHTML = `${order.user.first_name} ${order.user.last_name}`;

        // Create and populate the total amount cell (order value)
        const totalDiv = document.createElement("div");
        totalDiv.classList.add("table-cell");
        totalDiv.innerHTML = `${order.order_value}€`; // Display the order value in euros

        // Create and populate the invoice ID cell
        const invoiceDiv = document.createElement("div");
        invoiceDiv.classList.add("table-cell");
        invoiceDiv.innerHTML = `#${order.invoice_id}`;

        // Create and populate the status cell
        const statusDiv = document.createElement("div");
        statusDiv.classList.add("table-cell");
        statusDiv.innerHTML = order.status;

        // Create a buttons cell for view and download actions
        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("table-cell", "table-buttons");

        // Create and add the "View" button
        const viewButton = document.createElement("div");
        viewButton.classList.add("table-button");
        viewButton.innerHTML = "View";
        viewButton.addEventListener('click', () => {
            alert(`Viewing order #${order.invoice_id}`);
        });

        // Create and add the "Download PDF" button
        const downloadButton = document.createElement("div");
        downloadButton.classList.add("table-button");
        downloadButton.innerHTML = "Download PDF";
        downloadButton.addEventListener('click', () => {
            alert(`Downloading PDF for order #${order.invoice_id}`);
        });

        // Append the buttons to the buttons div
        buttonsDiv.appendChild(viewButton);
        buttonsDiv.appendChild(downloadButton);

        // Append all cells to the row
        row.appendChild(dateDiv);
        row.appendChild(nameDiv);
        row.appendChild(totalDiv);
        row.appendChild(invoiceDiv);
        row.appendChild(statusDiv);
        row.appendChild(buttonsDiv);

        // Append the row to the table
        table.appendChild(row);
    });
}

// Function to update the total count of orders
function countOrders(orders) {
    const ordersNumber = orders.length;
    let totalText = `Total: ${ordersNumber} orders`;

    // If there is only one order, update the text to singular
    if (parseInt(ordersNumber, 10) === 1) {
        totalText = `Total: ${ordersNumber} order`;
    }

    // Update the total orders count in the UI
    const total = document.getElementById("total");
    total.innerHTML = totalText;
}

// Function to populate the year dropdown list with years from 2000 to the current year
function yearList() {
    const yearSelect = document.getElementById("year-select");
    const currentYear = new Date().getFullYear();
    const startYear = 2000;

    // Create options for each year and append them to the dropdown
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement("option");
        option.value = year;               // Set the value attribute for the option
        option.textContent = year;         // Set the display text for the option
        yearSelect.appendChild(option);    // Append the option to the select element
    }
}

// Function to apply filters based on user input and fetch orders
function applyFilters() {
    const nameInput = document.getElementById('name-input').value.trim();
    const yearSelect = document.getElementById('year-select').value;
    const dateInput = document.getElementById('date-input').value;

    // Prepare the filters object based on user input
    const filters = {};

    if (nameInput) filters.name = nameInput;
    if (yearSelect) filters.year = yearSelect;
    if (dateInput) filters.date = dateInput;

    // Fetch the orders with the applied filters
    fetchOrders(filters);
}

// Function to reset all filters and fetch all orders
function resetFilters() {
    document.getElementById('name-input').value = '';
    document.getElementById('year-select').value = '';
    document.getElementById('date-input').value = '';
    fetchOrders(); // Fetch all orders without filters
}

// Set up event listeners when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for the filter buttons
    document.querySelector('.filter-button:nth-child(1)').addEventListener('click', applyFilters);
    document.querySelector('.filter-button:nth-child(2)').addEventListener('click', resetFilters);

    // Fetch all orders and populate the year list when the page loads
    fetchOrders();
    yearList();
});

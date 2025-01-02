async function fetchOrders(filters = {}) {
    console.log("Fetching orders with filters: ", filters);
    try {
        const queryString = new URLSearchParams(filters).toString();
        const response = await fetch(`http://localhost:5000/api/orders?${queryString}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Response received");
        const data = await response.json();
        console.log(data);

        if (!data.success || !data.orders || data.orders.length === 0) {
            console.error('No orders match the filters');
            document.getElementById('table').innerHTML = '<div class="no-results">No orders match the filters</div>';
            return;
        }

        populateTable(data.orders);
        countOrders(data.orders);
    } catch (error) {
        console.error('Error fetching orders: ', error);
    }
}

function populateTable(orders) {
    const table = document.getElementById('table');
    table.innerHTML = ''; // Clear existing rows

    orders.forEach(order => {
        const row = document.createElement("div");
        row.classList.add("table-row");

        const dateDiv = document.createElement("div");
        dateDiv.classList.add("table-cell");
        const date = new Date(order.date);
        dateDiv.innerHTML = date.toLocaleDateString(); // Formatowanie daty

        const nameDiv = document.createElement("div");
        nameDiv.classList.add("table-cell");
        nameDiv.innerHTML = `${order.user.first_name} ${order.user.last_name}`;

        const totalDiv = document.createElement("div");
        totalDiv.classList.add("table-cell");
        totalDiv.innerHTML = `${order.order_value}€`; // Poprawiona właściwość

        const invoiceDiv = document.createElement("div");
        invoiceDiv.classList.add("table-cell");
        invoiceDiv.innerHTML = `#${order.invoice_id}`;

        const statusDiv = document.createElement("div");
        statusDiv.classList.add("table-cell");
        statusDiv.innerHTML = order.status;

        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("table-cell", "table-buttons");

        const viewButton = document.createElement("div");
        viewButton.classList.add("table-button");
        viewButton.innerHTML = "View";
        viewButton.addEventListener('click', () => {
            alert(`Viewing order #${order.invoice_id}`);
        });

        const downloadButton = document.createElement("div");
        downloadButton.classList.add("table-button");
        downloadButton.innerHTML = "Download PDF";
        downloadButton.addEventListener('click', () => {
            alert(`Downloading PDF for order #${order.invoice_id}`);
        });

        buttonsDiv.appendChild(viewButton);
        buttonsDiv.appendChild(downloadButton);

        row.appendChild(dateDiv);
        row.appendChild(nameDiv);
        row.appendChild(totalDiv);
        row.appendChild(invoiceDiv);
        row.appendChild(statusDiv);
        row.appendChild(buttonsDiv);

        table.appendChild(row);
    });
}

function countOrders(orders) {
    const ordersNumber = orders.length;
    let totalText = `Total: ${ordersNumber} orders`;

    if (parseInt(ordersNumber, 10) === 1) {
        totalText = `Total: ${ordersNumber} order`;
    }

    const total = document.getElementById("total");
    total.innerHTML = totalText;
}

function yearList() {
    const yearSelect = document.getElementById("year-select");
    const currentYear = new Date().getFullYear();
    const startYear = 2000;

    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement("option");
        option.value = year;                                            // Set the value attribute
        option.textContent = year;                                      // set the display text
        yearSelect.appendChild(option);                                 // Add the option to the select element
    }
}

function applyFilters() {
    const nameInput = document.getElementById('name-input').value.trim();
    const yearSelect = document.getElementById('year-select').value;
    const dateInput = document.getElementById('date-input').value;

    const filters = {};

    if (nameInput) filters.name = nameInput;
    if (yearSelect) filters.year = yearSelect;
    if (dateInput) filters.date = dateInput;

    fetchOrders(filters);
}
function resetFilters() {
    document.getElementById('name-input').value = '';
    document.getElementById('year-select').value = '';
    document.getElementById('date-input').value = '';
    fetchOrders(); // Fetch all orders without filters
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.filter-button:nth-child(1)').addEventListener('click', applyFilters);
    document.querySelector('.filter-button:nth-child(2)').addEventListener('click', resetFilters);
    fetchOrders();
    yearList();
});

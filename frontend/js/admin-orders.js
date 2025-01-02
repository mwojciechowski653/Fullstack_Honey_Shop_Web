async function fetchOrders() {
    console.log("Fetching orders...");
    try {
        const response = await fetch('http://localhost:5000/api/orders');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Response received");
        const data = await response.json();
        console.log(data);

        if (!data.success || !data.orders) {
            console.error('No orders found');
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

window.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
    yearList();
});

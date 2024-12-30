const exampleOrder = {
    date: '2021-02-15',
    customer: 'John Doe',
    total: 150,
    invoiceNr: '892310',
    status: 'Paid',
}

exampleOrders = [exampleOrder, exampleOrder, exampleOrder]


for (order of exampleOrders) {
    const row = document.createElement("div")
    row.classList.add("table-row")
    

    const dateDiv = document.createElement("div")
    dateDiv.classList.add("table-cell")
    dateDiv.innerHTML = order.date

    const nameDiv = document.createElement("div")
    nameDiv.classList.add("table-cell")
    nameDiv.innerHTML = order.customer

    const totalDiv = document.createElement("div")
    totalDiv.classList.add("table-cell")
    totalDiv.innerHTML = `${order.total}€`

    const invoiceDiv = document.createElement("div")
    invoiceDiv.classList.add("table-cell")
    invoiceDiv.innerHTML = `#${order.invoiceNr}`

    const statusDiv = document.createElement("div")
    statusDiv.classList.add("table-cell")
    statusDiv.innerHTML =  order.status

    const buttonsDiv = document.createElement("div")
    buttonsDiv.classList.add("table-cell", "table-buttons")

    
    button1 = document.createElement("div")
    button1.classList.add("table-button")
    button1.innerHTML = "View"

    button2 = document.createElement("div")
    button2.classList.add("table-button")
    button2.innerHTML = "Download PDF"

    buttonsDiv.appendChild(button1)
    buttonsDiv.appendChild(button2)

    row.appendChild(dateDiv)
    row.appendChild(nameDiv)
    row.appendChild(totalDiv)
    row.appendChild(invoiceDiv)
    row.appendChild(statusDiv)
    row.appendChild(buttonsDiv)

    table.appendChild(row)
}    
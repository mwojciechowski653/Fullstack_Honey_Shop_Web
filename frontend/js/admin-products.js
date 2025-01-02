const exampleProduct = {
    imgUrl: "../assets/admin-item.png",
    name: "Example Product",
    number: "Rp60000",
    stock : 250,
    sold: 15,
    status: "Active"
}
const exampleProducts = [exampleProduct, exampleProduct, exampleProduct] 
// needs to be replaced by a backend call to get all products


const table = document.getElementById("table")

// fill table with products
for (product of exampleProducts) { 
    const row = document.createElement("div")
    row.classList.add("table-row")
    

    const img = document.createElement("img")
    img.src = product.imgUrl
    img.alt = product.name
    img.width = 150
    img.height = 108

    const imgDiv = document.createElement("div")
    imgDiv.classList.add("table-cell")
    imgDiv.appendChild(img)

    const nameDiv = document.createElement("div")
    nameDiv.classList.add("table-cell")
    nameDiv.innerHTML = product.name

    const numberDiv = document.createElement("div")
    numberDiv.classList.add("table-cell")
    numberDiv.innerHTML = product.number

    const stockDiv = document.createElement("div")
    stockDiv.classList.add("table-cell")
    stockDiv.innerHTML = product.stock

    const soldDiv = document.createElement("div")
    soldDiv.classList.add("table-cell")
    soldDiv.innerHTML = product.sold

    const statusDiv = document.createElement("div")
    statusDiv.classList.add("table-cell")
    statusDiv.innerHTML =  "Change"

    row.appendChild(imgDiv)
    row.appendChild(nameDiv)
    row.appendChild(numberDiv)
    row.appendChild(stockDiv)
    row.appendChild(soldDiv)
    row.appendChild(statusDiv)

    table.appendChild(row)

}




const exampleProductsNumber = 3
const totalText = `Total: ${exampleProductsNumber} products`

const total = document.getElementById("total")
total.innerHTML = totalText
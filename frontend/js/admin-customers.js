const exampleCustomer = {
  date: "2021-02-15",
  customer: "John Doe",
  emailAddress: "xxx@gmail.com",
  country: "Spain",
  city: "Almeria",
  homeAddress: "Std. street 12/29",
  paidAmount: "123",
  purchasesAmount: 2137,
};

exampleCustomers = [
  exampleCustomer,
  exampleCustomer,
  exampleCustomer,
  exampleCustomer,
  exampleCustomer,
];

for (customer of exampleCustomers) {
  const row = document.createElement("div");
  row.classList.add("table-row");

  const dateDiv = document.createElement("div");
  dateDiv.classList.add("table-cell");
  dateDiv.innerHTML = customer.date;

  const nameDiv = document.createElement("div");
  nameDiv.classList.add("table-cell");
  nameDiv.innerHTML = customer.customer;

  const emailDiv = document.createElement("div");
  emailDiv.classList.add("table-cell");
  emailDiv.innerHTML = customer.emailAddress;

  const countryDiv = document.createElement("div");
  countryDiv.classList.add("table-cell");
  countryDiv.innerHTML = customer.country;

  const cityDiv = document.createElement("div");
  cityDiv.classList.add("table-cell");
  cityDiv.innerHTML = customer.city;

  const homeAddressDiv = document.createElement("div");
  homeAddressDiv.classList.add("table-cell");
  homeAddressDiv.innerHTML = customer.homeAddress;

  const paidAmountDiv = document.createElement("div");
  paidAmountDiv.classList.add("table-cell");
  paidAmountDiv.innerHTML = `${customer.paidAmount}€`;

  const purchasesAmountDiv = document.createElement("div");
  purchasesAmountDiv.classList.add("table-cell");
  purchasesAmountDiv.innerHTML = customer.purchasesAmount;

  row.appendChild(dateDiv);
  row.appendChild(nameDiv);
  row.appendChild(emailDiv);
  row.appendChild(countryDiv);
  row.appendChild(cityDiv);
  row.appendChild(homeAddressDiv);
  row.appendChild(paidAmountDiv);
  row.appendChild(purchasesAmountDiv);

  table.appendChild(row);
}

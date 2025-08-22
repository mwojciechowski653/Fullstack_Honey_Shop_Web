const BACKEND_URL = "http://localhost:5000/api";

async function getAdminStats() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BACKEND_URL}/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const stats = await response.json();
  return stats;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const stats = await getAdminStats();
    console.log(stats);

    document.getElementById("revenue-recent").innerText =
      parseInt(stats.orders.this_month_sum) + "€";
    document.getElementById("revenue-vs").innerText =
      parseInt(stats.orders.this_month_sum) -
      parseInt(stats.orders.last_month_sum) +
      "€";
    document.getElementById("today-revenue").innerText =
      parseInt(stats.orders.today_sum) + "€";
    document.getElementById("yesterday-revenue").innerText =
      parseInt(stats.orders.yesterday_sum) + "€";
    document.getElementById("orders-recent").innerText =
      stats.orders.this_month_orders_count;
    document.getElementById("orders-vs").innerText =
      stats.orders.this_month_orders_count -
      stats.orders.last_month_orders_count;
    document.getElementById("new-users").innerText =
      stats.newUsers.this_month_new_users;
    document.getElementById("users-vs").innerText =
      stats.newUsers.this_month_new_users - stats.newUsers.last_month_new_users;
    document.getElementById("sign-ins").innerText =
      stats.loginStats[0].sign_in_count;
    document.getElementById("sign-ins-vs").innerText =
      stats.loginStats[0].sign_in_count - stats.loginStats[1].sign_in_count;

    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "homePage.html";
    });

    const productsTable = document.getElementById("products-table");
    stats.topProducts.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${product.name} - ${product.size}g</td>
                <td>${product.total_units_sold}</td>
                <td>${product.total_revenue}€</td>
            `;
      productsTable.appendChild(row);
    });

    // You can add code here to update the DOM with the stats
  } catch (error) {
    console.error("Error fetching admin stats:", error);
  }
});

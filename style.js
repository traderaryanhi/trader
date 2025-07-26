
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    alert(`Login with\nEmail: ${email}\nPassword: ${password}`);
    // Add your backend login call here
  });

  document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    alert(`Sign Up with\nName: ${name}\nEmail: ${email}`);
    // Add your backend signup call here
  });





let stockChartInstance;

async function getStockData(symbol = "AAPL") {
  const output = document.getElementById("stockOutput");
  const ctx = document.getElementById("stockChart").getContext("2d");
  const API_KEY = "2JI2GKK57EV6EZZS";
  const URL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;

  try {
    const res = await fetch(URL);
    const data = await res.json();

    const timeSeries = data["Time Series (5min)"];

    if (!timeSeries) {
      if (data["Note"]) {
        output.innerHTML = "⏳ API limit exceeded. Wait and try again.";
      } else if (data["Error Message"]) {
        output.innerHTML = "❌ Invalid stock symbol.";
      } else {
        output.innerHTML = "⚠️ Unknown error.";
      }
      return;
    }

    const times = Object.keys(timeSeries).slice(0, 10).reverse();
    const prices = times.map(t => parseFloat(timeSeries[t]["1. open"]));
    const latestPrice = prices[prices.length - 1];

    output.innerHTML = `📈 Latest price for <strong>${symbol}</strong>: <span class="text-success">$${latestPrice.toFixed(2)}</span>`;

    if (stockChartInstance) stockChartInstance.destroy();
    stockChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: times,
        datasets: [{
          label: `${symbol} Price (5-min)`,
          data: prices,
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.1)",
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        scales: {
          x: { ticks: { color: "#000" } },
          y: { ticks: { color: "#000" } }
        },
        plugins: {
          legend: {
            labels: {
              color: "#000"
            }
          }
        }
      }
    });
  } catch (err) {
    console.error(err);
    output.innerHTML = "❌ Error fetching data.";
  }
}

function searchStock() {
  const input = document.getElementById("stockInput").value.trim().toUpperCase();
  if (input) getStockData(input);
}



 let cryptoChart;

  async function getCryptoData() {
    const symbol = document.getElementById("cryptoInput").value.toLowerCase() || "bitcoin";
    const outputNote = document.getElementById("cryptoNote");

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=7`);
      const data = await res.json();

      const prices = data.prices.map(p => p[1]);
      const labels = data.prices.map(p => new Date(p[0]).toLocaleDateString());

      const ctx = document.getElementById("cryptoChart").getContext("2d");

      if (cryptoChart) cryptoChart.destroy();

      cryptoChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: `${symbol.toUpperCase()} (USD)`,
            data: prices,
            borderColor: "orange",
            backgroundColor: "rgba(255,165,0,0.2)",
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { display: true },
            y: { display: true }
          }
        }
      });

      outputNote.innerHTML = `Showing last 7 days price for <strong>${symbol.toUpperCase()}</strong>`;
    } catch (err) {
      outputNote.innerHTML = `<span class="text-danger">Crypto not found. Try using the full name like "bitcoin", "ethereum", etc.</span>`;
    }
  }

  // Load default crypto on page load
  window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("cryptoInput").value = "ethereum";
    getCryptoData();
  });

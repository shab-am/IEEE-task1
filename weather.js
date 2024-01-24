const apikey = "d489a9d7743754c40ab84dc6be4e5aca"; //Application Programming Interface Key
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const unitToggleBtn = document.getElementById("unitToggle");

const url = (city) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

let isCelsius = true;

function toggleTemperatureUnit() {
  isCelsius = !isCelsius;
  const city = search.value;
  if (city) {
    getWeatherByLocation(city);
  }
}

unitToggleBtn.addEventListener("click", toggleTemperatureUnit);

function displayTemperature(temp) {
  return isCelsius ? `${temp}°C` : `${(temp * 9) / 5 + 32}°F`;
}

async function getWeatherByLocation(city) {
  try {
    const resp = await fetch(url(city), { origin: "cors" });
    if (!resp.ok) {
      throw new Error("Weather data not found");
    }
    const respData = await resp.json();
    addWeatherToPage(respData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    main.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function addWeatherToPage(data) {
  const temp = KtoC(data.main.temp);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const weatherDescription = data.weather[0].description;

  const weather = document.createElement("div");
  weather.classList.add("weather");

  weather.innerHTML = `
        <h2><img src="https://openweathermap.org/img/wn/${
          data.weather[0].icon
        }@2x.png" /> ${displayTemperature(temp)} <img src="https://openweathermap.org/img/wn/${
    data.weather[0].icon
  }@2x.png" /></h2>
        <small>${weatherDescription}</small>
        <div class="more-info">
          <p>Humidity: <span>${humidity}%</span></p>
          <p>Wind speed: <span>${+Math.trunc(windSpeed * 3.16)}km/h</span></p>
        </div>
    `;

  // cleanup
  main.innerHTML = "";
  main.appendChild(weather);
}

function KtoC(K) {
  return Math.floor(K - 273.15);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = search.value;

  if (city) {
    getWeatherByLocation(city);
  }
});
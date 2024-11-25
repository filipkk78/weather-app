import "./styles.css";

let weatherQuery;

let weather = {};

async function getWeather() {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${weatherQuery}/today?unitGroup=metric&key=HE6349R9L33N4J5GUV6UAVHH5&contentType=json`,
    {
      mode: "cors",
    }
  );
  const responseJson = await response.json();
  weather = responseJson;
  console.log(weather);
  loadCard();
}

const searchBar = document.querySelector("#city");
searchBar.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    weatherQuery = searchBar.value;
    getWeather();
  }
});

const searchIcon = document.querySelector(".search-icon");
searchIcon.addEventListener("click", () => {
  weatherQuery = searchBar.value;
  getWeather();
});

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

async function success(pos) {
  const crd = pos.coords;
  const response = await fetch(
    `https://us1.locationiq.com/v1/reverse?key=pk.5fa4583b105ea1f99a78e3abcf8f6896&lat=${crd.latitude}&lon=${crd.longitude}&format=json&`,
    {
      mode: "cors",
    }
  );
  console.log(`${crd.latitude}, ${crd.longitude}`);
  const responseJson = await response.json();
  const cityName = responseJson.address.city;
  console.log(cityName);
  weatherQuery = cityName;
  getWeather();
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  weatherQuery = "Białystok";
  getWeather();
}

navigator.geolocation.getCurrentPosition(success, error, options);

function loadCard() {
  const cityName = document.querySelector(".city-name");
  cityName.textContent = weather.address;

  const temp = document.querySelector(".temp");
  temp.textContent = `${Math.round(weather.currentConditions.temp)}°C`;

  const conditionsIcon = document.querySelector("#conditions-icon");
  conditionsIcon.className = weather.currentConditions.icon;

  const conditionsDesc = document.querySelector(".conditions");
  conditionsDesc.textContent = weather.currentConditions.conditions;

  const windSpeed = document.querySelector(".wind-speed");
  windSpeed.textContent = `${weather.currentConditions.windspeed} m/s`;

  const humidity = document.querySelector(".humidity");
  humidity.textContent = `${Math.round(weather.currentConditions.humidity)}%`;

  const pressure = document.querySelector(".athm-pressure");
  pressure.textContent = `${weather.currentConditions.pressure} mm Hg`;
}

document.querySelector("#title").addEventListener("click", loadCard);

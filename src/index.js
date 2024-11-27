import "./styles.css";

let weatherQuery;

let weather = {};

async function getWeather() {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${weatherQuery}/next24hours?unitGroup=metric&key=HE6349R9L33N4J5GUV6UAVHH5&contentType=json`,
    {
      mode: "cors",
    }
  );
  const responseJson = await response.json();
  weather = responseJson;
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
  const responseJson = await response.json();
  let cityName;
  if (responseJson.address.city) {
    cityName = responseJson.address.city;
  } else if (responseJson.address.town) {
    cityName = responseJson.address.town;
  } else {
    cityName = responseJson.address.village;
  }
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

  let hours;
  if (!weather.days[1]) {
    hours = weather.days[0].hours;
  } else {
    const time = new Date().getHours();
    let currentDay = weather.days[0].hours.slice(time);
    let nextDay = weather.days[1].hours.slice(0, time);
    hours = currentDay.concat(nextDay);
  }

  hours.forEach((hour) => {
    const hourTab = document.querySelector(`#nextHour${hours.indexOf(hour)}`);

    const hourTitle = document.querySelector(
      `#nextHour${hours.indexOf(hour)} p`
    );

    hourTitle.textContent = hour.datetime.substring(0, 5);

    const hourIcon = document.querySelector(
      `#nextHour${hours.indexOf(hour)} div`
    );

    hourIcon.className = `hour-icon ${hour.icon}`;

    const hourTemp = document.querySelector(
      `#nextHour${hours.indexOf(hour)} h3`
    );

    hourTemp.textContent = `${Math.round(hour.temp)}°C`;

    hourTitle.className = "hour";

    if (hours.indexOf(hour) > 7) {
      hourTab.style.display = "none";
    }
  });

  // console.log(hours);

  let carouselPos = 0;

  const hourTabs = document.querySelectorAll(".next-hour");

  function loadHours(hour) {
    hourTabs.forEach((hourTab) => {
      hourTab.style.display = "none";
    });
    let i = hour + 8;
    for (hour; hour < i; hour++) {
      hourTabs[hour].style.display = "flex";
    }
  }

  function carouselPrev() {
    arrowRight.style.display = "block";
    arrowPlaceholderRight.style.display = "none";
    carouselPos--;
    console.log(carouselPos);
    if (carouselPos === 0) {
      arrowLeft.style.display = "none";
      arrowPlaceholderLeft.style.display = "block";
    }
    loadHours(carouselPos);
  }

  function carouselNext() {
    arrowLeft.style.display = "block";
    arrowPlaceholderLeft.style.display = "none";
    carouselPos++;
    console.log(carouselPos);
    if (carouselPos === 16) {
      arrowRight.style.display = "none";
      arrowPlaceholderRight.style.display = "block";
    }
    loadHours(carouselPos);
  }

  const arrowLeft = document.querySelector("#carousel-arrow-left");
  arrowLeft.addEventListener("click", carouselPrev);
  arrowLeft.style.display = "none";
  const arrowPlaceholderLeft = document.querySelector(
    "#carousel-arrow-placeholder-left"
  );
  arrowPlaceholderLeft.style.display = "block";

  const arrowRight = document.querySelector("#carousel-arrow-right");
  arrowRight.addEventListener("click", carouselNext);
  const arrowPlaceholderRight = document.querySelector(
    "#carousel-arrow-placeholder-right"
  );
  arrowPlaceholderRight.style.display = "none";
}

document.querySelector("#title").addEventListener("click", loadCard);

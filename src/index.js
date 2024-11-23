import "./styles.css";

async function getWeather() {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchBar.value}/today?unitGroup=metric&key=HE6349R9L33N4J5GUV6UAVHH5&contentType=json`,
    {
      mode: "cors",
    }
  );
  const responseJson = await response.json();
  console.log(responseJson);
}

const searchBar = document.querySelector("#city");
searchBar.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    getWeather(searchBar.value);
  }
});

const searchIcon = document.querySelector(".search-icon");
searchIcon.addEventListener("click", getWeather);

import weather from "..";

function loadCard() {
  const cityName = document.querySelector(".city-name");
  cityName.textContent = weather.address;
}

export default loadCard;

import "./styles.css";
import { getWeather } from "./weather.js";
import { ICON_MAP } from "./iconMap.js";

const headerSection = document.getElementById("header-section");
const daySection = document.getElementById("day-section");
const tableSection = document.getElementById("table-section");

// Geocoding

const geocodingApiKey = "e2c698c42e064432ae0ae88303b47af0";

document.getElementById("searchButton").addEventListener("click", convertWeatherData);

function convertWeatherData() {
  const location = document.getElementById("locationInput").value;

  if (location) {
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        location
      )}&key=${geocodingApiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const lat = data.results[0].geometry.lat;
        const lon = data.results[0].geometry.lng;
        const timezoneResult = data.results[0].annotations.timezone.name;
        getWeather(lat, lon, timezoneResult)
          .then(renderWeather)
          .catch((e) => console.error(e));
      });
  }
}

// Get weather

// getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone)
//   .then(renderWeather)
//   .catch((e) => {
//     console.error(e);
//     // alert("Error getting weather.");
//   });

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);

  headerSection.classList.remove("blurred");
  daySection.classList.remove("blurred");
  tableSection.classList.remove("blurred");

  document.getElementById("heading-name").innerHTML = `${
    document.getElementById("locationInput").value
  }`;
  document.getElementById("locationInput").value = "";
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function getIconUrl(iconCode) {
  return `./icons/${ICON_MAP.get(iconCode)}.svg`;
}

const currentIcon = document.querySelector("[data-current-icon]");

function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode);
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-fl-high", current.highFeelsLike);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-low", current.lowFeelsLike);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });
const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template");

function renderDailyWeather(daily) {
  dailySection.innerHTML = "";
  daily.forEach((day) => {
    const element = dayCardTemplate.content.cloneNode(true);
    setValue("temp", day.maxTemp, { parent: element });
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
    dailySection.append(element);
  });
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric", hour12: true });
const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");

function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";
  hourly.forEach((hour) => {
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.temp, { parent: element });
    setValue("fl-temp", hour.feelsLike, { parent: element });
    setValue("wind", hour.windSpeed, { parent: element });
    setValue("precip", hour.precip, { parent: element });
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element });
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
    hourlySection.append(element);
  });
}

// DARKMODE

document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const iconDM = document.getElementById("iconDM");
  if (document.body.classList.contains("dark-mode")) {
    iconDM.classList.remove("fa-sun");
    iconDM.classList.add("fa-moon");
  } else {
    iconDM.classList.remove("fa-moon");
    iconDM.classList.add("fa-sun");
  }
}

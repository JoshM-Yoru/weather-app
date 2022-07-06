"use strict";

const key = "2f8ab8fe8286470480231710220207";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

//GETS GEOLOCATION FROM BROWSER
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

//GETS CITY FOR LAT AND LONG
const whereAmI = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    //Reverse Geocoding
    const resGeo = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=44196cbc559240a090cbde69c73e15a0`
    );
    const dataGeo = await resGeo.json();
    if (!resGeo.ok) throw new Error("Problem getting location data.");

    return dataGeo.features[0].properties.city;
  } catch (err) {
    alert(`Something went wrong. ${err.message}`);
    document.querySelector(".container").style.opacity = 1;

    renderError(`${err.message}`);

    throw err;
  }
};

//GETS AND SETS HOURLY WEATHER FOR CURRENT DAY
const getHourlyWeather = function (weather) {
  for (let i = 0; i < weather.length; i++) {
    document
      .querySelector(`.img-${i}`)
      .setAttribute("src", weather[i].condition.icon);

    document.querySelector(`.temp-${i}`).innerHTML =
      Math.floor(weather[i].temp_f) + "&deg";
  }
};

//GETS AND SETS FORECAST
const getForecast = async function (weather) {
  for (let i = 0; i < weather.length; i++) {
    let parsedTime = new Date(JSON.parse(JSON.stringify(weather[i].date)));

    let day = days[parsedTime.getDay()];
    document.querySelector(`.day-${i}`).innerHTML = day;

    document.querySelector(`.day-0`).style.fontWeight = "bold";
    document.querySelector(`.day-0`).innerHTML = "Today";

    document
      .querySelector(`.conditions-${i}`)
      .setAttribute("src", weather[i].day.condition.icon);
    document.querySelector(`.high-${i}`).innerHTML =
      Math.floor(weather[i].day.maxtemp_f) + "&deg";
    document.querySelector(`.low-${i}`).innerHTML =
      Math.floor(weather[i].day.mintemp_f) + "&deg";
  }
};

//GETS TIME
const getLocationTime = async function (lat, lng) {
  const locationTime = `http://api.timezonedb.com/v2.1/get-time-zone?key=V69MTVCHXA2T&format=json&by=position&lat=${lat}&lng=${lng}`;

  const response = await fetch(locationTime);
  const data = await response.json();

  return data.formatted;
};

//RENDERS WEATHER INFO
const renderWeather = async (key, city) => {
  if (!city) {
    city = await whereAmI();
  }

  const forecastWeather = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=10&aqi=no&alerts=no`;
  const responseForecastWeather = await fetch(forecastWeather);
  const dataForecastWeather = await responseForecastWeather.json();

  console.log(dataForecastWeather);
  //SETS CURRENT INFO
  document.querySelector(".city").innerHTML = dataForecastWeather.location.name;
  document.querySelector(".temperature").innerHTML =
    Math.floor(dataForecastWeather.current.temp_f) + "&deg";
  document.querySelector(".current-status").innerHTML =
    dataForecastWeather.current.condition.text;
  document.querySelector(".current-high-low").innerHTML = `H:${Math.floor(
    dataForecastWeather.forecast.forecastday[0].day.maxtemp_f
  )}&deg L:${Math.floor(
    dataForecastWeather.forecast.forecastday[0].day.mintemp_f
  )}&deg`;

  //SETS DATE AND TIME
  let locationTime = await getLocationTime(
    dataForecastWeather.location.lat,
    dataForecastWeather.location.lon
  );

  const parsedTime = new Date(JSON.parse(JSON.stringify(locationTime)));

  let month = months[parsedTime.getMonth()];
  let day = days[parsedTime.getDay()];
  let date = parsedTime.getDate();
  let year = parsedTime.getFullYear();
  let min = parsedTime.getMinutes();
  let hour = parsedTime.getHours();
  let time;

  if (hour > 12) {
    time = hour - 12 + ":" + min + " " + "PM";
  } else {
    time = hour + ":" + min + " " + "AM";
  }

  document.querySelector(".date-time").innerHTML =
    time + " " + "-" + " " + day + " " + month + " " + date + " " + year;

  //SETS HOURLY WEATHER
  getHourlyWeather(dataForecastWeather.forecast.forecastday[0].hour);

  document
    .querySelector(".temp-" + hour)
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  let timeNow = document.querySelector(".hour-" + hour);

  timeNow.style.fontWeight = "bold";
  timeNow.style.color = "white";
  timeNow.innerHTML = "Now";

  //SETS MULTIDAY FORECAST
  getForecast(dataForecastWeather.forecast.forecastday);

  document.querySelector(".container").style.opacity = 1;

  let background = dataForecastWeather.current.condition.text.toLowerCase();

  const backgroundArray = ["cloudy", "night", "rain", "storm", "snow"];

  for (let i = 0; i < backgroundArray.length; i++) {
    if (background.includes(backgroundArray[i])) {
      background = backgroundArray[i];
    }
    document
      .querySelector(`body`)
      .setAttribute(
        "style",
        "background-image: url(./backgrounds/" + background + ".jpg)"
      );
  }
};

renderWeather(key);

//GETS INPUT FROM USER TO SEARCH FOR A SPECIFIC LOCATION
document.querySelector(".submit").addEventListener("click", function (e) {
  e.preventDefault();
  let city = document.querySelector("input").value;

  document.querySelector("input").value = "Please enter a city.";

  renderWeather(key, city);
});

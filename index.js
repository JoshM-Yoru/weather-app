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
function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

//ACTIVATES GOOGLE AUTOCOMPLETE
function activatePlacesSearch() {
  const citySearch = document.querySelector(".city-find");
  const autocomplete = new google.maps.places.Autocomplete(citySearch);
}

//GETS AND SETS HOURLY WEATHER FOR CURRENT DAY
function getHourlyWeather(weather) {
  for (let i = 0; i < weather.length; i++) {
    if (document.querySelector(`.hour-${i}`).innerHTML === "Now") {
      document.querySelector(`.hour-${i}`).innerHTML =
        i > 12 ? i - 12 + "PM" : i + "AM";
      document.querySelector(`.hour-${i}`).style.fontWeight = "normal";
    }
    document
      .querySelector(`.img-${i}`)
      .setAttribute("src", weather[i].condition.icon);

    document
      .querySelector(`.img-${i}`)
      .setAttribute("alt", weather[i].condition.text);

    document.querySelector(`.temp-${i}`).innerHTML =
      Math.floor(weather[i].temp_f) + "&deg";
  }
}

//GETS AND SETS FORECAST
function getForecast(weather) {
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
}

//GETS CITY FOR LAT AND LONG
async function whereAmI() {
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
    document.querySelector(".loader").style.opacity = 0;
    document.querySelector(".loading").style.opacity = 0;
    document.querySelector(".container").style.opacity = 1;

    renderError(`${err.message}`);

    throw err;
  }
}

//GETS TIME
async function getLocationTime(lat, lng) {
  const locationTime = `https://api.timezonedb.com/v2.1/get-time-zone?key=V69MTVCHXA2T&format=json&by=position&lat=${lat}&lng=${lng}`;

  const response = await fetch(locationTime);
  const data = await response.json();

  return data.formatted;
}

//RENDERS WEATHER INFO
const renderWeather = async (key, city) => {
  if (!city) {
    city = await whereAmI();
  }

  const forecastWeather = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=10&aqi=no&alerts=no`;
  const responseForecastWeather = await fetch(forecastWeather);
  const dataForecastWeather = await responseForecastWeather.json();

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

  if (min < 10) {
    min = "0" + min;
  }
  if (hour > 12) {
    time = hour - 12 + ":" + min + " " + "PM";
  } else {
    time = hour + ":" + min + " " + "AM";
  }
  if (hour === 0) {
    time = 12 + ":" + min + " " + "AM";
  }

  document.querySelector(".date-time").innerHTML =
    time + " " + "-" + " " + day + " " + month + " " + date + " " + year;

  let timeNow = document.querySelector(".hour-" + hour);

  //SETS HOURLY WEATHER
  getHourlyWeather(dataForecastWeather.forecast.forecastday[0].hour);

  document
    .querySelector(".temp-" + hour)
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });

  timeNow.style.fontWeight = "bold";
  timeNow.innerHTML = "Now";

  //SETS MULTIDAY FORECAST
  getForecast(dataForecastWeather.forecast.forecastday);

  //SHOWS THE WEATHER APP
  document.querySelector(".loader").style.opacity = 0;
  document.querySelector(".loading").style.opacity = 0;
  document.querySelector(".loader").setAttribute("style","-webkit-filter:opacity(0)");
   document.querySelector(".loading").setAttribute("style","-webkit-filter:opacity(0)");

  document.querySelector(".container").style.animation = "render 3s forwards";
//   document.querySelector(".container").setAttribute("style", "-webkit-filter:opacity(0)");

  let background = dataForecastWeather.current.condition.text.toLowerCase();

  const backgroundArray = [
    "partly",
    "cloudy",
    "thunder",
    "night",
    "rain",
    "snow",
  ];

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

//GETS INPUT FROM USER TO SEARCH FOR A SPECIFIC LOCATION
document.querySelector(".submit").addEventListener("click", function (e) {
  e.preventDefault();

  let city = document.querySelector("input").value;

  if (city === "" || city === "Please enter a city.") {
    alert("That is not a valid input. Please enter a city.");
  } else {
    document.querySelector("input").value = "";
    document.querySelector("input").placeholder = "Please enter a city.";
    renderWeather(key, city);
  }
});

document.querySelector(".use-location").addEventListener("click", function (e) {
  e.preventDefault();
  renderWeather(key);
});
renderWeather(key);

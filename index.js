"use strict";

const key = "2f8ab8fe8286470480231710220207";

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

const getHourlyWeather = function (weather) {
  for (let i = 0; i < weather.length; i++) {
    document
      .querySelector(`.img-${i}`)
      .setAttribute("src", weather[i].condition.icon);

    document.querySelector(`.temp-${i}`).innerHTML = Math.floor(
      weather[i].temp_f
    );
  }
};

const getLocationTime = async function (lat, lng) {
  const locationTime =
    "http://api.timezonedb.com/v2.1/get-time-zone?key=V69MTVCHXA2T&format=json&by=position&lat=40.689247&lng=-74.044502";

  const response = await fetch(locationTime);
  const data = await response.json();

  return data.formatted;
};

//GETS AND SETS WEATHER INFO
const gettingWeather = async (key, city) => {
  let location = await whereAmI();
  if (!city) {
    city = location;
  }

  let locationTime = await getLocationTime();

  const forecastWeather = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=10&aqi=no&alerts=no`;

  const responseForecastWeather = await fetch(forecastWeather);
  const dataForecastWeather = await responseForecastWeather.json();

  console.log(dataForecastWeather);

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

  document.querySelector(".date-time").innerHTML = locationTime;

  getHourlyWeather(dataForecastWeather.forecast.forecastday[0].hour);

  document.querySelector(".container").style.opacity = 1;
};

gettingWeather(key);

//GETS INPUT FROM USER TO SEARCH FOR A SPECIFIC LOCATION
document.querySelector(".submit").addEventListener("click", function (e) {
  e.preventDefault();
  let city = document.querySelector("input").value;

  document.querySelector("input").value = "Please enter a city.";

  gettingWeather(key, city);
});

"use strict";

const key = "2f8ab8fe8286470480231710220207";

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    //Reverse Geocoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    const dataGeo = await resGeo.json();
    if (!resGeo.ok) throw new Error("Problem getting location data.");

    console.log(dataGeo.city);

    return dataGeo.city;
  } catch (err) {
    alert(`Something went wrong. ${err.message}`);
    renderError(`${err.message}`);

    throw err;
  }
};

whereAmI();

const gettingWeather = async (key, city) => {
  const currentWeather = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`;

  const responseCurrentWeather = await fetch(currentWeather);
  const dataCurrentWeather = await responseCurrentWeather.json();

  console.log(dataCurrentWeather);

  document.querySelector(".city").innerHTML = dataCurrentWeather.location.name;

  document.querySelector(".temperature").innerHTML =
    Math.floor(dataCurrentWeather.current.temp_f) + "&deg";

  document.querySelector(".current-status").innerHTML =
    dataCurrentWeather.current.condition.text;

  document.querySelector(".current-high-low").innerHTML =
    dataForecastWeather.current;
};

gettingWeather(key, whereAmI());

document.querySelector(".submit").addEventListener("click", function (e) {
  e.preventDefault();
  let city = document.querySelector("input").value;
  console.log(city);
  document.querySelector("input").value = "Please enter a city.";

  gettingWeather(key, city);
});

// const getCity = async (city) => {
//   const baseURL =
//     "http://dataservice.accuweather.com/locations/v1/cities/search";
//   const query = `?apikey=${key}&q=${city}`;

//   const response = await fetch(baseURL + query);
//   const data = await response.json();
//   console.log(data);

//   return data[0];
// };

// getCity("Tampa");

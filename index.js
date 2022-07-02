"use strict";

// window.addEventListener("load", () => {
//   let long;
//   let lat;

//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position) => {
//       console.log(position);
//       long = position.coords.longitude;
//       lat = position.coords.latitude;
//       console.log(long, lat);

//       const apiForecast = `https://api.weather.gov/points/${lat},${long}`;
//       console.log(apiForecast);
//       fetch(apiForecast)
//         .then((response) => {
//           return response.json();
//         })
//         .then((data) => {
//           console.log(data.properties.forecast);
//           console.log(JSON.stringify(data.properties.forecast));
//         });
//     });
//   } else {
//     h1.textContent =
//       "This site needs location data. Please enter a location Below.";
//   }
// });

const key = "2f8ab8fe8286470480231710220207";

const gettingWeatherDetails = async (id) => {
  const baseURL = "http://dataservice.accueweather.com/currentconditions/v1/";
  const query = `${id}?apikey=${key}`;

  const response = await fetch(baseURL + query);
  const data = await response.json();

  return data[0];
};

const getCity = async (city) => {
  const baseURL =
    "http://dataservice.accuweather.com/locations/v1/cities/search";
  const query = `?apikey=${key}&q=${city}`;

  const response = await fetch(baseURL + query);
  const data = await response.json();
  console.log(data);

  return data[0];
};

getCity("Tampa");

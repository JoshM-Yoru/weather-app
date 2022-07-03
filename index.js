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

// const slider = function () {
//   const slides = document.querySelectorAll(".slide");
//   const btnLeft = document.querySelector(".arrow-left");
//   const btnRight = document.querySelector(".arrow-right");

//   let curSlide = 0;
//   const maxSlide = slides.length;

//   slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

//   const goToSlide = function (slide) {
//     slides.forEach(
//       (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
//     );
//   };

//   const nextSlide = function () {
//     if (curSlide === maxSlide - 1) {
//       curSlide = maxSlide - 1;
//     } else {
//       curSlide++;
//     }

//     goToSlide(curSlide);
//     activateDot(curSlide);
//   };
//   btnRight.addEventListener("click", nextSlide);

//   const prevSlide = function () {
//     if (curSlide === 0) {
//       curSlide = 0;
//     } else {
//       curSlide--;
//     }

//     goToSlide(curSlide);
//   };

//   const init = function () {
//     goToSlide(0);
//   };

//   init();

//   //Event Handlers
//   btnLeft.addEventListener("click", prevSlide);

//   document.addEventListener("keydown", function (e) {
//     if (e.key === "ArrowRight") nextSlide();
//     if (e.key === "ArrowLeft") prevSlide();
//   });
// };
// slider();

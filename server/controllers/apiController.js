/* eslint-disable object-curly-newline */
const apiController = {};
const fetch = require('node-fetch');

apiController.getCountryData = (req, res, next) => {
  const location = 'Belgium';
  const url = `https://restcountries.eu/rest/v2/name/${location}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // destructure from array
      const [country] = data;

      // destructure preferred properties
      const { name, alpha2Code, capital, region, area, population, languages, flag } = country;

      // format languages
      const langs = languages.map((lang) => lang.name);

      const countryData = {
        name,
        alpha2Code,
        capital,
        region,
        area,
        population,
        languages: langs,
        flag,
      };

      res.locals.data = { countryData };
      return next();
    })
    .catch((err) => next(`Error in getCountryData${err}`));
};

apiController.getWeatherData = (req, res, next) => {
  console.log('got here');
  const city = 'Brussels';
  const apiKey = '3f38b9994196b8f88058af69468302df';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const weatherData = {
        weather: data.weather[0].main,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        humidity: data.main.humidity,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      };

      console.log(weatherData);
      res.locals.data.weatherData = weatherData;
      return next();
    })
    .catch((err) => {
      console.log('this error');
      next(`Error in getWeatheryData${err}`);
    });
};

// apiController.getData = async (req, res, next) => {
//   const obj = await apiController.getCountryData();
//   console.log('returned obj: ', obj);
//   res.locals.data = obj;
//   console.log(res.locals.data);
//   return next();
// };

module.exports = apiController;

/* eslint-disable object-curly-newline */
const apiController = {};
const fetch = require('node-fetch');

apiController.getCountryData = (req, res, next) => {
  const { country } = req.params;
  const url = `https://restcountries.eu/rest/v2/name/${country}`;

  fetch(url) 
    .then((response) => response.json())
    .then((data) => {
      // destructure from array
      const [countryObj] = data;

      // destructure preferred properties
      const {
        name,
        alpha2Code,
        capital,
        region,
        area,
        population,
        languages,
        flag,
      } = countryObj;

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
      // console.log(res.locals.data);
      return next();
    })
    .catch((err) => next(`Error in getCountryData${err}`));
};

apiController.getWeatherData = (req, res, next) => {
  const { city } = req.params;
  const apiKey = '3f38b9994196b8f88058af69468302df';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // format weather data from api
      const weatherData = {
        weather: data.weather[0].main,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone,
      };

      res.locals.data.weatherData = weatherData;
      return next();
    })
    .catch((err) => {
      next(`Error in getWeatheryData: ${err}`);
    });
};

apiController.getSpotifyData = (req, res, next) => {
  // fetch featured playlist in specified country from spotify
  const url = `https://api.spotify.com/v1/browse/categories/toplists/playlists?country=${res.locals.data.countryData.alpha2Code}`;
  const accessToken = req.cookies.token.access_token;
  const country = res.locals.data.countryData.name;

  // use access token cookie
  const options = {
    headers: { Authorization: `Bearer ${accessToken}` },
    mode: 'no-cors',
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
    //   console.log(data.playlists.items.find((playlist) => playlist.name === `${country} Top 50`));

      // get tracks href of top 50 regional playlist
      const tracksURL = data.playlists.items.find((playlist) => playlist.name === `${country} Top 50`).tracks.href;
    //   console.log(tracksURL);

      fetch(tracksURL, options)
        .then((response) => response.json())
        .then((tracks) => {
          console.log(tracks.items.map((track) => (
            {
              name: track.track.name,
              by: track.track.artists[0].name,
            }
          )));
          return next();
        })
        .catch((err) => next(`Error in getSpotifyData: ${err}`));
    })
    .catch((err) => {
      console.log('spotify error');
      return next(`Error in getSpotifyData: ${err}`);
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

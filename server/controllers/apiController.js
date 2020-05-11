/* eslint-disable object-curly-newline */
const apiController = {};
const fetch = require('node-fetch');

apiController.getCountryData = (req, res, next) => {
  let { country } = req.params;
  country = country.toLowerCase();

  // handle common inputs that result in errors unexpected country
  if (country === 'uk') {
    country = 'GB';
  } else if (country === 'us' || country === 'united states') {
    country = 'usa';
  }

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
  const accessToken = req.cookies.token.access_token;
  const { alpha2Code } = res.locals.data.countryData;
  let country = res.locals.data.countryData.name;
  const url = `https://api.spotify.com/v1/browse/categories/toplists/playlists?country=${alpha2Code}`;

  if (alpha2Code === 'US') {
    country = 'United States';
  } else if (alpha2Code === 'GB') {
    country = 'United Kingdom';
  }

  // use access token cookie
  const options = {
    headers: { Authorization: `Bearer ${accessToken}` },
    mode: 'no-cors',
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      // get tracks href of top 50 regional playlist

      // list of feature playlists for testing:
      // console.log(data.playlists.items.map((playlist) => playlist.name));
      const tracksURL = data.playlists.items.find(
        (playlist) => playlist.name === `${country} Top 50`,
      ).tracks.href;

      // fetch track list of regional top 50
      fetch(tracksURL, options)
        .then((response) => response.json())
        .then((tracks) => {
          // format tracks
          const trackList = tracks.items.map((track) => ({
            name: track.track.name,
            by: track.track.artists[0].name,
          }));

          res.locals.data.trackList = trackList;
          return next();
        })
        .catch((err) => {
          console.log('error fetching specific playlist');
          res.locals.data.trackList = [];
          return next();
        });
    })
    .catch((err) => {
      console.log('spotify not available in specified country');
      res.locals.data.trackList = [];
      return next();
    });
};

module.exports = apiController;

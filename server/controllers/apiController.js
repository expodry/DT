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
      const { name, alpha2Code, capital, region, area, population, languages } = country;

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
      };

      res.locals.data = { countryData };
      return next();
    })
    .catch((err) => next(`Error in getCountryData${err}`));
};

// apiController.getData = async (req, res, next) => {
//   const obj = await apiController.getCountryData();
//   console.log('returned obj: ', obj);
//   res.locals.data = obj;
//   console.log(res.locals.data);
//   return next();
// };

module.exports = apiController;

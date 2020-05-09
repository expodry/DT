const apiController = {};
const fetch = require('node-fetch');

apiController.getWikiData = (req, res, next) => {
  const location = 'Rainbow';
  const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=revisions&titles=${location}&rvprop=content&format=json`;
//   fetch(url)
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//     //   const content = Object.keys(data.query.pages)[0];
//     //   console.log(content);
//     //   res.locals.wikiData = content;
//       return next();
//     })
//     .catch((err) => console.log(err));
  return next();
};

module.exports = apiController;

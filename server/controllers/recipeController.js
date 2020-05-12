const axios = require('axios');

const recipeController = {};

recipeController.getComplexRecipes = (req, res, next) => {
  const searchCuisine = req.body.searchParams;
  const limit = '10'; // Lowered the limit so David gets more hits
  const apiKey = 'fc4f7bc8bd37432684adbe0ec6844a8c';

  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&cuisine=${searchCuisine}&addRecipeInformation=true&number=${limit}`;

  // console.log(url)
  axios
    .get(url)
    .then(data => {
      const { results } = data;
      console.log('Data received from Spoonacular -> ', results[0]);
      const { title } = data.results[0];
      const { sourceUrl } = data.results[0];
      const { image } = data.results[0];
      const cuisineData = [];
      for (let i = 0; i < results; i++) {
        const cuisineObj = {};
        cuisineObj.title = results[i].title;
        cuisineObj.sourceUrl = results[i].sourceUrl;
        cuisineObj.image = results[i].image;

        cuisineData.push(
          data.results[i].title,
          data.results[i].sourceUrl,
          data.results[i].image
        );
      }
      res.status(200).json(cuisineData);
      //   cusineData = [
      //     { title: '', sourceUrl: '', image: '' },
      //     { title: '', sourceUrl: '', image: '' },
      //     { title: '', sourceUrl: '', image: '' },
      //     { title: '', sourceUrl: '', image: '' },
      //   ];
      return next();
    })
    .catch(err =>
      console.log('Error fetching data from Spoonacular Api: ', err)
    );
};

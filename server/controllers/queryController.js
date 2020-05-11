const db = require('../models/dbModels');

const queryController = { };

// Add user to database
queryController.createOrFindUser = (req, res, next) => {
  // middleware to take user info sent from spotify login
  // add user to users table in db
  const username = res.locals.user.display_name;
  const spotifyEmail = res.locals.user.email;
  const reqParams = [spotifyEmail, username];

  const findQuery = 'SELECT id, spotify_email, username FROM users WHERE spotify_email = $1';
  const createQuery = `INSERT INTO users (spotify_email, username)
                        VALUES ($1, $2)`;

  db.query(findQuery, [spotifyEmail])
    .then((response) => response)
    .then((data) => {
      if (data.rowCount === 0) {
        db.query(createQuery, reqParams)
          .then((response) => response)
          .then((data) => {
            res.locals.userInfo = data.rows[0];
            console.log(res.locals.userInfo);
            return next();
          })
          .catch(err => {
            console.log(err);
            return next({
              log: 'Error occurred in queryController.createOrFindUser - creating user',
              message: { err: `The following error occurred: ${err}` },
            });
          });
      } else {
        res.locals.userInfo = data.rows[0];
        console.log(res.locals.userInfo);
        return next();
      }
    }).catch((err) => {
      console.log(err);
      return next({
        log: 'Error occurred in queryController.createOrFindUser - finding user',
        message: { err: `The following error occurred: ${err}` },
      });
    });
};

// Add a new favourite city to database
queryController.addFav = (req, res, next) => {
  // add a favourite city (+ country) to database
  // const username = 'koalaparty'; // res.locals.username
  const userEmail = 'koalaparty@gmail.com'; // get from params
  const city = 'Melbourne'; // res.locals.city;
  const country = 'Australia'; // res.locals.country / or from req.params/body
  const reqParams = [userEmail, city, country];

  // if city not in cities table, add to cities table
  const checkCityQuery = 'SELECT id FROM cities WHERE city_name = $1';
  const addCityQuery = `INSERT INTO cities (city_name, country_id)
                          VALUES (
                              $1, 
                              (SELECT id FROM countries WHERE country_name = $2 OR alternate_name = $2)
                          )`;

  // query to insert new favourite connected to user
  const addFavQuery = `INSERT INTO countries_cities_users (user_id, city_id, country_id)
                          VALUES (
                              (SELECT id FROM users WHERE spotify_email = $1),
                              (SELECT id FROM cities WHERE city_name = $2),
                              (SELECT id FROM countries WHERE country_name = $3 OR alternate_name = $3)
                          )`;

  db.query(checkCityQuery, [city])
    .then(response => response)
    .then(data => {
      console.log(data);
      if (data.rowCount === 0) {
        db.query(addCityQuery, [city, country])
          .then((response) => response)
          .then((data) => {
            console.log(data);
            return data;
          });
      } else {
        console.log(`${city} exists in database`);
      }
    })
    .then(() => {
      // once we've checked for the city in the database, add as favourite for our user
      db.query(addFavQuery, reqParams)
        .then((response) => response)
        .then((data) => next())
        .catch((err) => {
          console.log(err);
          return next({
            log: 'Error occurred in queryController.addFav',
            message: { err: `The following error occurred: ${err}` },
          });
        });
    })
    .catch(err => {
      console.log(err);
      return next({
        log: 'Error occurred in queryController.addFav when trying to create a new city',
        message: { err: `The following error occurred: ${err}` },
      });
    });
};

// delete a favourite from database 
queryController.deleteFav = (req, res, next) => {
  // add a favourite city (+ country) to database
  const username = 'koalaparty'; // res.locals.username 
  const userEmail = 'koalaparty@gmail.com'; // get from params
  const city = 'Columbus'; // req.body.city;
  const country = 'USA'; // req.body.country
  const reqParams = [userEmail, city, country];

  const deleteQuery = `DELETE FROM countries_cities_users
                      WHERE 
                      user_id = (SELECT id FROM users WHERE spotify_email = $1)
                      AND
                      city_id = (SELECT id FROM cities WHERE city_name = $2)
                      AND 
                      country_id = (SELECT id FROM countries WHERE country_name = $3 
                                                              OR alternate_name = $3)`;

  db.query(deleteQuery, reqParams)
    .then((response) => response)
    .then((data) => {
      console.log('Success on delete!');
      return next();
    })
    .catch((err) => {
      console.log(err);
      return next({
        log: 'Error occurred in queryController.deleteFav',
        message: { err: `The following error occurred: ${err}` },
      });
    });
};

// get information about favourites from database (city and country)
queryController.getFavs = (req, res, next) => {
  // retrieve fave countries and cities from db for individual user
  // get all favourites from countries_cities_users table 
  // if no favourites, send user to next middleware and send empty array
  const username = 'koalaparty'; // res.locals.userInfo.username
  const userEmail = 'koalaparty@gmail.com'; // res.locals.userInfo.spotify_email

  const findFavsQuery = `SELECT cities.city_name AS city, countries.country_name AS country 
                        FROM countries_cities_users 
                        JOIN cities ON (countries_cities_users.city_id = cities.id)
                        JOIN countries ON (countries_cities_users.country_id = countries.id)
                        WHERE countries_cities_users.user_id = 
                        (SELECT id FROM users WHERE spotify_email = $1)`;

  db.query(findFavsQuery, [userEmail])
    .then((response) => response)
    .then((data) => {
      res.locals.favsArray = data.rows;
      return next();
    })
    .catch((err) => {
      return next({
        log: 'Error occurred in queryController.getFavs',
        message: { err: `The following error occurred: ${err}` },
      });
    });
};


module.exports = queryController;

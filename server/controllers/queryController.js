const db = require('../models/dbModels');

const queryController = { };

// Add user to database
queryController.createOrFindUser = (req, res, next) => {
  // middleware to take user info sent from spotify login
  // if user already exists in table, add user to users table in db
  const username = res.locals.user.display_name;
  const spotifyEmail = res.locals.user.email;
  const reqParams = [spotifyEmail, username];

  // query to find a specific user in the users table
  const findQuery = 'SELECT id, spotify_email, username FROM users WHERE spotify_email = $1';

  // if the findQuery returns no rows, add new user into the table with
  // their email and username taken from the spotify login
  const createQuery = `INSERT INTO users (spotify_email, username)
                        VALUES ($1, $2)`;

  // first look for user in users table
  db.query(findQuery, [spotifyEmail])
    .then((response) => response)
    .then((data) => {
      // if no rows are returned, add a new user
      if (data.rowCount === 0) {
        // query to add new user to table
        db.query(createQuery, reqParams)
          .then((response) => response)
          .then((data) => {
            res.locals.userInfo = data.rows[0];
            return next();
          })
          .catch((err) => {
            console.log(err);
            return next({
              log:
                'Error occurred in queryController.createOrFindUser - creating user',
              message: { err: `The following error occurred: ${err}` },
            });
          });
      } else {
        // if user already exists in table, go to next middleware
        res.locals.userInfo = data.rows[0];
        return next();
      }
    })
    .catch((err) => {
      console.log(err);
      return next({
        log:
          'Error occurred in queryController.createOrFindUser - finding user',
        message: { err: `The following error occurred: ${err}` },
      });
    });
};

// Add a new favourite city to database
queryController.addFav = (req, res, next) => {
  const { userEmail } = req.params;
  const { city } = req.params;
  const { country } = req.params;
  const reqParams = [userEmail, city, country];

  // check cities table to see if any rows are returned with this city name
  const checkCityQuery = 'SELECT id FROM cities WHERE city_name = $1';

  // if city not in cities table, add to cities table
  const addCityQuery = `INSERT INTO cities (city_name, country_id)
                          VALUES (
                              $1, 
                              (SELECT id FROM countries WHERE country_name = $2 OR alternate_name = $2)
                          )`;

  // check if favourite exists in database first
  const checkForFav = `SELECT * FROM countries_cities_users
                        WHERE 
                        user_id = (SELECT id FROM users WHERE spotify_email = $1)
                        AND 
                        city_id = (SELECT id FROM cities WHERE city_name = $2)`;


  // query to insert new favourite city & country, connected by user id
  const addFavQuery = `INSERT INTO countries_cities_users (user_id, city_id, country_id)
                          VALUES (
                              (SELECT id FROM users WHERE spotify_email = $1),
                              (SELECT id FROM cities WHERE city_name = $2),
                              (SELECT id FROM countries WHERE country_name = $3 OR alternate_name = $3)
                          )`;

  // first query database to see if a city exists in the cities table
  db.query(checkCityQuery, [city])
    .then((response) => response)
    .then((data) => {
      // if data.rowCount is 0, then city does not exist in table
      if (data.rowCount === 0) {
        // query to add the city to the cities table
        db.query(addCityQuery, [city, country])
          .then((response) => response)
          .then((data) => data)
          .catch((err) => {
            return next({
              log: 'Error occurred in queryController.addFav when adding new city',
              message: { err: `The following error occurred: ${err}` },
            });
          });
      } else {
        console.log(`${city} exists in database`);
      }
    })
    .then(() => {
      // once we've checked for the city in the database, check if fav exists
      // if not, add as favourite for our user. If yes, return next();
      db.query(checkForFav, [userEmail, city])
        .then((response) => response)
        .then((data) => {
          // if no rows returned from first query, add new favourite
          if (data.rowCount === 0) {
            db.query(addFavQuery, reqParams)
              .then((response) => response)
              .then((data) => next())
              .catch((err) => {
                return next({
                  log: 'Error occurred in queryController.addFav - adding fav',
                  message: { err: `The following error occurred: ${err}` },
                });
              });
          } else {
            return next();
          }
        })
        .catch((err) => {
          return next({
            log: 'Error occurred in queryController.addFav when trying to check for favourite',
            message: { err: `The following error occurred: ${err}` },
          });
        });
    })
    .catch((err) => {
      return next({
        log: 'Error occurred in queryController.addFav when trying to create a new city',
        message: { err: `The following error occurred: ${err}` },
      });
    });
};

// delete a favourite from database
// this middleware was not used yet in app.js / front-end, but query should
// work ok after integration
queryController.deleteFav = (req, res, next) => {
  // add a favourite city (+ country) to database
  // takes information from params sent from request
  const { userEmail } = req.params;
  const { city } = req.params;
  const { country } = req.params;
  const reqParams = [userEmail, city, country];

  const deleteQuery = `DELETE FROM countries_cities_users
                      WHERE 
                      user_id = (SELECT id FROM users WHERE spotify_email = $1)
                      AND
                      city_id = (SELECT id FROM cities WHERE city_name = $2)
                      AND 
                      country_id = (SELECT id FROM countries WHERE country_name = $3 
                                                              OR alternate_name = $3)`;
  // delete favourite from database
  db.query(deleteQuery, reqParams)
    .then((response) => response)
    .then((data) => {
      // if row was successfully deleted, go to next middleware
      return next();
    })
    .catch((err) => {
      return next({
        log: 'Error occurred in queryController.deleteFav',
        message: { err: `The following error occurred: ${err}` },
      });
    });
};

// get information about favourites from database (city and country names)
queryController.getFavs = (req, res, next) => {
  // retrieve fave countries and cities from db for individual user
  // get all favourites from countries_cities_users table
  // if no favourites, send user to next middleware and send empty array

  // if req.params.email is undefined, use res.locals.user.email
  let userEmail;
  if (req.params.email) {
    userEmail = req.params.email;
    res.locals.user = {};
  } else {
    userEmail = res.locals.user.email;
  }

  // using the user's unique email inside users table to get user's id,
  // join favourites (countries_cities_users) table
  // on id from countries table = country_id, and id from cities table = city_id
  const findFavsQuery = `SELECT cities.city_name AS city, countries.country_name AS country 
                        FROM countries_cities_users 
                        JOIN cities ON (countries_cities_users.city_id = cities.id)
                        JOIN countries ON (countries_cities_users.country_id = countries.id)
                        WHERE countries_cities_users.user_id = 
                        (SELECT id FROM users WHERE spotify_email = $1)`;

  // return array of favourites from favourites table
  // if no rows returned (i.e no faves), this will return empty array
  db.query(findFavsQuery, [userEmail])
    .then((response) => response)
    .then((data) => {
      // adding the returned rows in the following format to res.locals:
      /* [ {city: '<city_name>', country: '<country_name>'},
            {city: '<city_name>', country: '<country_name>'} ]
      */
      res.locals.user.favsArray = data.rows;
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

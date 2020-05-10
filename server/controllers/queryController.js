const db = require('../models/dbModels');

const queryController = { };

// Add user to database
queryController.createOrFindUser = (req, res, next) => {
    // middleware to take user info sent from spotify login 
    // add user to users table in db
    const userID = 'xyz123' // res.locals.userId;
    const spotifyUsername = 'koalaparty' // res.locals.spotifyUsername;
    const reqParams = [userID, spotifyUsername];

    const findQuery = `SELECT id FROM users WHERE spotify_username = $1`;
    const createQuery = `INSERT INTO users (spotify_user_id, spotify_username)
                        VALUES ($1, $2)`;

    db.query(findQuery, spotifyUsername)
        .then(response => response)
        .then(data => {
            if (data === null) {
                db.query(createQuery, reqParams)
                    .then(response => response)
                    .then(data => {
                        console.log(data);
                        return data;
                    })
                    .catch(err => {
                        return next({
                            log: 'Error occurred in queryController.createUser',
                            message: {err: `The following error occurred: ${err}`}
                        })
                    })
            }
        })                    
};


// Add a new favourite city to database
queryController.addFav = (req, res, next) => {
    // add a favourite city (+ country) to database 
    const city = 'Sydney'; // res.locals.city;
    const username = 'koalaparty' // res.locals.username get from somewhere in previous middleware?
    const reqParams = [username, city];

    const sqlQuery = `INSERT INTO countries_cities_users (user_id, city_id, country_id)
                        VALUES (
                            (SELECT id FROM users WHERE spotify_username = $1),
                            (SELECT id FROM cities WHERE city_name = $2),
                            (SELECT country_id FROM cities WHERE city_name = $2)
                        )`;
    db.query(sqlQuery, reqParams)
    .then(response => response)
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(err => {
        return next({
            log: 'Error occurred in queryController.createUser',
            message: {err: `The following error occurred: ${err}`}
        })
    })
}

// get information about favourites from database (city and country)
queryController.getFavs = (req, res, next) => {
    // retrieve countries and cities from db for individual user
    // get all favourites from countries_cities_users table 
    const favsArray = [];
    // return as array of objects? [{city: 'Paris', country: 'France'}, {city: 'London', country: 'UK'}]



}




module.exports = queryController;
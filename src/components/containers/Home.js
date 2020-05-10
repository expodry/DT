import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Spotify from './Spotify';
import Weather from './Weather';
import Window from './Window';
import Favorites from './Favorites';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regStar } from '@fortawesome/free-regular-svg-icons';

// maybe create add favorite function in home where it has access to username and
// search string value and just pass that function down to the star?
//or even keep it outside of the window.

const bigAssObject = {
  countryData: {
    name: 'Belgium',
    capital: 'Brussels',
    region: 'Europe',
    area: 30528,
    population: 11319511,
    languages: ['Dutch', 'French', 'German'],
    flag: 'https://restcountries.eu/data/bel.svg',
  },
  spotify: [
    'someSong1',
    'someSong2',
    'someSong3',
    'someSong4',
    'someSong5',
    'someSong6',
    'someSong7',
    'someSong8',
    'someSong9',
  ],
  weather: {
    temperature: 60,
    sky: 'cloudy',
    wind: '25 km/h',
  },
};
const bigAssObject2 = {
  countryData: {
    name: 'Russia',
    capital: 'Moscow',
    region: 'Europe-Asia',
    area: 30528,
    population: 11319511,
    languages: ['Russian'],
    flag: 'https://restcountries.eu/data/rus.svg',
  },
  spotify: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  weather: {
    temperature: 80,
    sky: 'sunny',
    wind: '5 km/h',
  },
};
const fakeUser = {
  name: 'Michael',
  favorites: ['London', 'Baku', 'Paris', 'NYC', 'Moscow'],
  //each fav is gonna be an object of country and city
};
function Home() {
  const [location, setLocation] = useState('');
  const [current, setCurrent] = useState({});
  const [username, setUsername] = useState(fakeUser.name);
  const [favorites, setFavorites] = useState(fakeUser.favorites);
  const [cityCountryUserQuery, setQuery] = useState('');

  // useEffect(() => {
  //   fetch('someurl', {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((user) => {
  //       setUserName(user.name);
  //       setFavorites(user.favorites);
  //     });
  // }, []);
  const grabLocationData = (location) => {
    let locationString = location
      .split(',')
      .map((word) => word.trim())
      .join('&');
    // fetch(`http://localhost:8080/api/${locationString}`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //   },
    // })
    //   .then((data) => data.json())
    //   .then((response) => {
    //     //receive a bigassaobject
    //     //setCurrent(based on that obj);
    //     console.log(response);
    //   });
    setCurrent(bigAssObject);
  };

  const toggleFav = (query) => {
    const values = query.split(',').map((elem) => elem.trim());
    const city = values[0];
    const country = values[1];
    const user = values[2];
    let method = 'POST';
    if (
      favorites.includes(
        JSON.stringify({
          city,
          country,
          user,
        }),
      )
    ) {
      method = 'DELETE';
    }

    fetch(`http://localhost:8080/api/toggleFav`, {
      body: JSON.stringify({ city, country, user }),
      method,
    })
      .then((data) => data.json())
      .then((updatedFavs) => {
        setFavorites(updatedFavs);
      });
  };
  if (!Object.keys(current).length)
    return (
      <div>
        <div>Welcome, {username}!</div>
        <label htmlFor="search">Search the destination!</label>
        <input
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
          name="search"
          id="search"
          type="text"
        ></input>
        <button
          onClick={() => {
            grabLocationData(location);
            setQuery(`${location}, ${username}`);
            setLocation('');
          }}
          id="search-button"
        >
          Let's go!
        </button>
        <Favorites
          favorites={favorites}
          grabLocationData={grabLocationData}
          setCurrent={setCurrent}
        />
      </div>
    );
  let FavIcon = (
    <span className="favIcon">
      <FAIcon
        onClick={() => toggleFav(cityCountryUserQuery)}
        icon={solidStar}
        style={{ color: 'steelblue' }}
      />
    </span>
  );
  return (
    <div id="main">
      <div id="leftColumn">
        <div>Welcome, {username}!</div>
        <Weather weather={current.weather} />
        <Spotify songs={current.spotify} />
      </div>
      <div id="middleColumn">
        <label htmlFor="search">Search the destination!</label>
        <div id="searchBar">
          <input
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
            name="search"
            id="search"
            type="text"
          ></input>
          <button
            onClick={() => {
              grabLocationData(location);
              setQuery(`${location}, ${username}`);
              setLocation('');
            }}
            id="search-button"
          >
            Let's go!
          </button>
        </div>
        {FavIcon}

        <Window setFavorites={setFavorites} country={current.countryData} />
      </div>
      <div id="rightColumn">
        <Favorites
          favorites={favorites}
          grabLocationData={grabLocationData}
          setCurrent={setCurrent}
        />
      </div>
    </div>
  );
}

export default Home;

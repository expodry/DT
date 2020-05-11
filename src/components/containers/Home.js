import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Spotify from './Spotify';
import Weather from './Weather';
import Window from './Window';
import Search from './Search';

import Favorites from './Favorites';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regStar } from '@fortawesome/free-regular-svg-icons';

const fakeUser = {
  name: 'Michael',
  favorites: ['London', 'Baku', 'Paris', 'NYC', 'Moscow'],
  //each fav is gonna be an object of country and city
};
function Home() {
  const [current, setCurrent] = useState({});
  const [username, setUsername] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [cityCountryUserQuery, setQuery] = useState('');

  useEffect(() => {
    // fetch(`http://localhost:8080/api/`)
    //   .then((res) => res.json())
    //   .then((user) => {
    //     setUserName(user.name);
    //     setFavorites(user.favorites);
    //   });
    setUsername(fakeUser.name);
    setFavorites(fakeUser.favorites);
  }, []);

  const grabLocationData = (location) => {
    if (!location) return;
    let locationString = location
      .split(',')
      .map((word) => word.trim())
      .join('&');
    fetch(`http://localhost:8080/api/${locationString}`)
      .then((data) => data.json())
      .then((response) => {
        console.log(response);
        setCurrent(response);
      });
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

    fetch(`http://localhost:3000/api/toggleFav`, {
      body: { city, country, user },
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
        <Search grabLocationData={grabLocationData} />
        <div>Welcome, {username}!</div>

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
        <Weather weather={current.weatherData} />
        {/* <Spotify songs={current.spotify} /> */}
      </div>
      <div id="middleColumn">
        <Search grabLocationData={grabLocationData} />

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

/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faStar as regStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';

import Spotify from './Spotify';
import Weather from './Weather';
import Window from './Window';
import Search from './Search';

import Favorites from './Favorites';

function Home() {
  const [current, setCurrent] = useState({});
  //current is the bigAssObject we receive from "grabLocationData" that feeds most of the components with data
  const [username, setUserName] = useState('');
  //for welcoming
  const [email, setEmail] = useState('');
  //unique name to add favs to db
  const [favorites, setFavorites] = useState([]);
  //array of favs we got on initial load
  const [query, setQuery] = useState('');
  //save users search in case he wants to add it to favs(we only save his query, not actual country data
  //since its different every time)

  //initial load
  useEffect(() => {
    fetch('http://localhost:8080/api/user')
      .then((res) => res.json())
      .then((user) => {
        setUserName(user.display_name);
        setEmail(user.email);
        setFavorites(user.favsArray);
      })
      .catch((err) => err);
  }, []);
  //fires up on search submit and on click of fav city
  const grabLocationData = (location) => {
    if (!location) return;
    //change the format of incoming string to add if as params
    const locationString = location
      .split(',')
      .map((word) => word.trim())
      .join('&');
    fetch(`http://localhost:8080/api/${locationString}`)
      .then((data) => data.json())
      .then((response) => {
        setCurrent(response);
        setQuery(email + ', ' + response.userQuery);
      });
  };
  //toggle fav doesnt toggle, only adds fav, there is no way to remove it, sorry guys, we had no time:(
  const toggleFav = (queryString) => {
    //format the string for params
    const values = queryString.split(',').map((elem) => elem.trim());
    const city = values[1];
    const country = values[2];
    const userEmail = values[0];
    fetch(
      `http://localhost:8080/api/toggleFav/${city}&${country}&${userEmail}`,
      {
        method: 'POST',
      },
    )
      .then((data) => data.json())
      .then((updatedFavs) => {
        setFavorites(updatedFavs);
        //receive new array of favs and change the state
      });
  };

  if (!Object.keys(current).length) {
    //there is no current - render only these..
    return (
      <div>
        <div id="leftColumn">
          <Search grabLocationData={grabLocationData} />
          <div className="welcoming">Welcome, {username}!</div>
        </div>
        <div id="middleColumn"></div>
        <div className="rightColumn">
          <Favorites
            favorites={favorites}
            grabLocationData={grabLocationData}
            setCurrent={setCurrent}
          />
        </div>
      </div>
    );
  }
  const FavIcon = (
    <span className="favIcon">
      <FAIcon
        onClick={() => {
          toggleFav(query);
        }}
        size="2x"
        icon={regStar}
        style={{ color: 'rgb(66, 65, 52)' }}
      />
    </span>
  );

  return (
    <div id="main">
      <div id="leftColumn">
        <div className="welcoming">
          {' '}
          <br />
          Welcome,
          {username}
          !
          <br />
          <br />{' '}
        </div>
        <Weather weather={current.weatherData} />
        <Spotify songs={current.trackList} />
      </div>
      <div id="middleColumn">
        <Search grabLocationData={grabLocationData} />

        <div id="favIcon">{FavIcon}</div>

        <Window country={current.countryData} />
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

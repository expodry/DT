import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import City from '../display/City';

function Favorites(props) {
  // props.favorites(array of cities)   props.setCurrent(function to change current)
  if (props.favorites.length === 0) return(<div id="favorites">You don't have any favorites yet</div>)
  const arrayOfCities = [];
  console.log(props.favorites);
  props.favorites.forEach((city, index) => {
    arrayOfCities.push(
      <City
        grabLocationData={props.grabLocationData}
        setCurrent={props.setCurrent}
        key={`city` + index}
        name={city}
        locationString={props.cityCountrySearch}
      />,
    );
  });

  return <div id="favorites">{arrayOfCities}</div>;
}

export default Favorites;

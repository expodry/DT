import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import City from '../display/City';

function Favorites(props) {
  // props.favorites(array of cities)   props.setCurrent(function to change current)
  const arrayOfCities = [];
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

import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// const bigAssObject2 = {
//   countryData: {
//     name: 'Russia',
//     capital: 'Moscow',
//     region: 'Europe-Asia',
//     area: 30528,
//     population: 11319511,
//     languages: ['Russian'],
//     flag: 'https://restcountries.eu/data/rus.svg',
//   },
//   spotify: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
//   weather: {
//     temperature: 80,
//     weather: 'sunny',
//     wind: '5 km/h',
//   },
// };

function City(props) {
  return (
    <div
      className="cityCard"
      onClick={() => {
        props.setCurrent(
          props.grabLocationData(`${props.city}, ${props.country}`),
        );
      }}
    >
      {props.name}
    </div>
  );
}

export default City;

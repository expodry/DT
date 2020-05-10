import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

function City(props) {
  // props will be an obj of country and city thus we can render Paris, France
  //and when we click we pass in a proper string
  return (
    <div
      onClick={() => {
        // props.setCurrent(
        //   props.grabLocationData(`${props.city}, ${props.country}`),
        // );
        props.setCurrent(bigAssObject2);
      }}
    >
      {props.name}
    </div>
  );
}

export default City;

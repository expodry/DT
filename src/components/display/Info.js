import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Info(props) {
  //props.countryData

  const languages = [];
  props.countryData.languages.forEach((language, index) =>
    languages.push(<li key={'language' + index}>{language}</li>),
  );

  return (
    <div>
      <ul>
        <li>Capital: {props.countryData.capital}</li>
        <li>Region: {props.countryData.region}</li>
        <li>Area: {props.countryData.area}</li>
        <li>Population: {props.countryData.population}</li>
      </ul>
      <ol>
        Languages:
        {languages}
      </ol>
    </div>
  );
}

export default Info;

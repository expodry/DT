import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Weather(props) {
  return (
    <div>
      Temperature: {props.weather.temperature} {<br></br>}
      Sky: {props.weather.sky} {<br></br>}
      Wind: {props.weather.wind} {<br></br>}
    </div>
  );
}

export default Weather;

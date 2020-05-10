import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Weather(props) {
  let color = '';
  if (props.weather.weather === 'cloudy') color = 'grey';
  if (props.weather.weather === 'sunny') color = 'yellow';
  if (props.weather.weather === 'rain') color = 'blue';

  let style = {
    'background-color': color,
  };
  return (
    <div style={style} id="weather">
      Temperature: {props.weather.temp} {<br></br>}
      Sky: {props.weather.weather} {<br></br>}
      Wind: {props.weather.wind} {<br></br>}
    </div>
  );
}

export default Weather;

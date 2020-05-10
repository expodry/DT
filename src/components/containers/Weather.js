import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Weather(props) {
  console.log('THESE ARER PROPS', props);
  let color = '';
  if (props.weather.weather === 'Clouds') color = 'grey';
  if (props.weather.weather === 'Clear') color = 'yellow';
  if (props.weather.weather === 'rain') color = 'blue';

  let style = {
    backgroundColor: color,
  };
  return (
    <div style={style} id="weather">
      Temperature: {props.weather.temp} {<br></br>}
      Sky: {props.weather.weather} {<br></br>}
      Wind: {props.weather.windSpeed} {<br></br>}
    </div>
  );
}

export default Weather;

import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { faSun as solidSun } from '@fortawesome/free-solid-svg-icons';
import { faMoon as solidMoon } from '@fortawesome/free-solid-svg-icons';
import { faCloudShowersHeavy as solidRain } from '@fortawesome/free-solid-svg-icons';
import { faCloud as solidCloud } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

function Weather(props) {
  const isDay = () => {
    const timeNow = Date.now();
    const timeThere = timeNow + props.weather.timezone + 14400;
    if (
      timeThere > props.weather.sunrise * 1000 &&
      timeThere < props.weather.sunset * 1000
    ) {
      return true;
    }
    return false;
  };
  if (isDay()) {
    document.body.style.backgroundImage =
      'url(https://files.123freevectors.com/wp-content/original/104312-yellow-stripes-pattern.jpg)';
  } else {
    document.body.style.backgroundImage =
      'url(http://4dadventurehotsprings.com/wp-content/uploads/2016/06/Dark-Grey-Pattern-Background.jpg)';
  }
  let icon = isDay() ? solidSun : solidMoon;
  let iconColor = isDay() ? 'orange' : 'white';
  let color = 'rgb(66, 65, 52)';
  if (props.weather.weather === 'Clouds') {
    icon = solidCloud;
    iconColor = 'white';
  }
  if (props.weather.weather === 'Rain') {
    document.body.style.backgroundImage =
      'url(https://live.staticflickr.com/6209/6087695435_4b545db144_b.jpg)';
    icon = solidRain;
    iconColor = 'white';
  }
  console.log(isDay());
  document.body.style.color = 'white';

  let style = {
    backgroundColor: color,
  };
  return (
    <div style={style} id="weather">
      <div id="weather-texts">
        <span className="weather-text">
          {Math.round(props.weather.temp)} °C {<br></br>}
        </span>
        <span className="weather-text">
          {props.weather.weather === 'Clear' ? 'Sunny' : props.weather.weather}{' '}
          {<br></br>}
        </span>
        <span className="weather-text">
          Wind: {props.weather.windSpeed} {<br></br>}
        </span>{' '}
      </div>
      <div>
        <FAIcon
          onClick={() => favClicked(id)}
          icon={icon}
          className="fas fa-camera fa-3x"
          style={{ color: iconColor }}
        />
      </div>
    </div>
  );
}

export default Weather;

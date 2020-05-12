/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';

import { faSun as solidSun } from '@fortawesome/free-solid-svg-icons';
import { faMoon as solidMoon } from '@fortawesome/free-solid-svg-icons';
import { faCloudShowersHeavy as solidRain } from '@fortawesome/free-solid-svg-icons';
import { faCloud as solidCloud } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';

function Weather(props) {
  //function to check if its day/night
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
  //change backgrounds based on daytime
  if (isDay()) {
    document.body.style.backgroundImage =
      'url(https://files.123freevectors.com/wp-content/original/104312-yellow-stripes-pattern.jpg)';
  } else {
    document.body.style.backgroundImage =
      'url(http://4dadventurehotsprings.com/wp-content/uploads/2016/06/Dark-Grey-Pattern-Background.jpg)';
  }
  //change icons based on daytime

  let icon = isDay() ? solidSun : solidMoon;
  let iconColor = isDay() ? 'orange' : 'white';
  const color = 'rgb(66, 65, 52)';
  //change backgrounds and icons based on weather

  if (props.weather.weather === 'Clouds') {
    document.body.style.backgroundImage =
      'url(https://c1.wallpaperflare.com/preview/717/892/904/air-sky-cloud-background.jpg)';
    icon = solidCloud;
    iconColor = 'white';
  }
  if (props.weather.weather === 'Rain') {
    document.body.style.backgroundImage =
      'url(https://live.staticflickr.com/6209/6087695435_4b545db144_b.jpg)';
    icon = solidRain;
    iconColor = 'white';
  }
  document.body.style.color = 'white';

  const style = {
    backgroundColor: color,
  };
  return (
    <div style={style} id="weather">
      <div id="weather-texts">
        <span className="weather-text">
          {Math.round(props.weather.temp)} °C {<br></br>}
        </span>
        <span className="weather-text">
          {props.weather.weather === 'Clear' ? 'Clear' : props.weather.weather}{' '}
          {<br></br>}
        </span>
        <span className="weather-text">
          Wind: {Math.round(props.weather.windSpeed)} km/h {<br></br>}
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

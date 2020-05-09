import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Spotify from './Spotify';
import Weather from './Weather';
import Window from './Window';
import Favorites from './Favorites';

function Home() {
  return (
    <div>
      <div>Welcome home!</div>
      <Spotify />
      <Weather />
      <Window />
      <Favorites />
    </div>
  );
}

export default Home;

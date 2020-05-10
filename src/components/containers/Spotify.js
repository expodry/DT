import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Spotify(props) {
  const arrayOfSongs = [];
  props.songs.forEach((song, index) =>
    arrayOfSongs.push(<div key={'song' + index}>{song}</div>),
  );

  return <div>{arrayOfSongs}</div>;
}

export default Spotify;

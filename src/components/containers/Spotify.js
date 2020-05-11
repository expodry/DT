import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Spotify(props) {
  const arrayOfSongs = [];
  props.songs.forEach((song, index) =>
    arrayOfSongs.push(
      <div className="song" key={'song' + index}>
        {song.name} by {song.by}
      </div>,
    ),
  );

  return <div id="spotify">{arrayOfSongs}</div>;
}

export default Spotify;

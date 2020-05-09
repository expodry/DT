import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import City from '../display/City';

function Favorites() {
  return (
    <div>
      <City />
      <City />
      <City />
      <City />
      <City />
    </div>
  );
}

export default Favorites;

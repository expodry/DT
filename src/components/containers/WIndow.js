import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Info from './../display/Info';

function Window() {
  return (
    <div>
      <div></div>
      NAME OF THE CITY <Info />
    </div>
  );
}

export default Window;

import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Info() {
  return (
    <div>
      <ul>
        <li>Territory</li>
        <li>language</li>
        <li>Population</li>
        <li>Some date</li>
      </ul>
    </div>
  );
}

export default Info;

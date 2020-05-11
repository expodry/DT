import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Home from './Home';

function App() {
  return (
    <div id="app">
      <Switch>
        <Route exact path="/">
          <center>LOGIN PAGE</center>
          <div id="spotifyLogin">
            {' '}
            <center>
              <a href="/verify">LOGIN WITH SPOTIFY</a>
            </center>
          </div>
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route>100 * 4 + 4 = ? That's right. Not found.</Route>
      </Switch>
    </div>
  );
}

export default App;

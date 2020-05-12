import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faSpotify as Spotify } from '@fortawesome/fontawesome-free-brands';
import Home from './Home';

function App() {
  let FavIcon = (
    <span className="favIcon">
      <FAIcon size="7x" icon={Spotify} style={{ color: 'green' }} />
    </span>
  );
  return (
    <div id="app">
      <Switch>
        <Route exact path="/">
          <div>
            {' '}
            <center id="spotifyLogin">
              <a className="black" href="/verify">
                {FavIcon}
                <br></br>
                <br></br>
                LOGIN WITH SPOTIFY
              </a>
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

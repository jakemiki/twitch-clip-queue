import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Button from './components/Button';
import TwitchAuth from './services/TwitchAuth';
import { isLoggedIn, logOut } from './store/user';

const HomePage = React.lazy(() => import('./pages/Home/HomePage'));
const QueuePage = React.lazy(() => import('./pages/Queue/QueuePage'));

function App() {
  const loggedIn = isLoggedIn.use();

  return (
    <>
      <header className="flex">
        <h1 className="mb-4">Twitch Clip Queue</h1>
        <div className="flex-grow"></div>
        <div>
          {loggedIn ? (
            <Button onClick={() => logOut()}>Logout</Button>
          ) : (
            <Button onClick={() => TwitchAuth.redirectToLogin()}>Login with Twitch</Button>
          )}
        </div>
      </header>
      <Suspense fallback={<div></div>}>
        <Router basename={process.env.REACT_APP_BASEPATH}>
          <Switch>
            <Route exact={true} path="/">
              {!loggedIn ? <HomePage /> : <QueuePage />}
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Router>
      </Suspense>
      <div className="flex-grow"></div>
      <footer className="text-xs mt-4">
        Created by{' '}
        <span className="font-bold">
          <a href="https://github.com/JakeMiki" target="_blank" rel="noreferrer">
            JakeMiki
          </a>
        </span>
      </footer>
    </>
  );
}

export default App;

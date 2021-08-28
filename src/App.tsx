import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { isLoggedIn, logOut } from './store/user';

const HomePage = React.lazy(() => import('./pages/Home/HomePage'));
const QueuePage = React.lazy(() => import('./pages/Queue/QueuePage'));

function App() {
  const loggedIn = isLoggedIn.use();

  return (
    <>
      <header className="flex">
        <h1 className="mb-4 text-2xl md:text-3xl lg:text-5xl font-black leading-tight">Twitch Clip Queue</h1>
        <div className="flex-grow"></div>
        {loggedIn && (
          <div>
            <button onClick={() => logOut()}>Logout</button>
          </div>
        )}
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
      <footer className="text-xs mt-4">
        Created by <span className="font-bold">JakeMiki</span>
      </footer>
    </>
  );
}

export default App;

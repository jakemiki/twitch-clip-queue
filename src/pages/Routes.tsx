import { useState } from '@hookstate/core';
import React from 'react';
import { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { isLoggedIn } from '../store/user';

const HomePage = React.lazy(() => import('./Home/HomePage'));
const QueuePage = React.lazy(() => import('./Queue/QueuePage'));

function Routes() {
  const loggedIn = useState(isLoggedIn).get();

  return (
    <Suspense fallback={<div></div>}>
      <Router basename={process.env.REACT_APP_BASEPATH}>
        <Switch>
          <Route path="/queue">
            {loggedIn ? <QueuePage /> : <Redirect to="/" />}
          </Route>
          <Route exact={true} path="/">
            {!loggedIn ? <HomePage /> : <Redirect to="/queue" />}
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </Suspense>
  );
}

export default Routes;

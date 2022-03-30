// React Required
import React, { Component, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { NotificationContainer } from 'react-notifications';
import { FacebookProvider } from 'react-facebook';
import { FACEBOOK_APP_ID } from './api/uri';

// Create Import File
import './main.scss';
import 'react-notifications/lib/notifications.css';

// Common Layout
import { Router, Switch, Route } from 'react-router-dom';

import history from './helpers/history';

// store
import configureStore from './store';

import * as serviceWorker from './serviceWorker';

class Root extends Component {
  render() {
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <NotificationContainer />
          <Provider store={configureStore()}>
            <FacebookProvider appId={FACEBOOK_APP_ID}>
              <Router basename="/" history={history}>
                <Switch>
                  <Route
                    exact
                    path={`${process.env.PUBLIC_URL}/`}
                    component={React.lazy(() => import('./pages/Home'))}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/countdown/:id`}
                    component={React.lazy(() => import('./pages/Countdown'))}
                  />
                  <Route
                    component={React.lazy(() => import('./pages/Notfound'))}
                  />
                </Switch>
              </Router>
            </FacebookProvider>
          </Provider>
        </Suspense>
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
serviceWorker.register();

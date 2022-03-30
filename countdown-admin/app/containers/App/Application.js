import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import { AppContext } from './ThemeWrapper';
import {
  DashboardPage,
  CountdownsPage,
  RequestsPage,
  CommentsOnRequestsPage,
  CommentsOnUsersPage,
  CommentsOnCountdownsPage,
  UsersPage,
  SettingsPage
} from '../pageListAsync';

function Application(props) {
  const { history } = props;
  const changeMode = useContext(AppContext);

  return (
    <Dashboard history={history} changeMode={changeMode}>
      <Switch>
        {/* Home */}
        <Route exact path="/app/dashboard" component={DashboardPage} />
        <Route path="/app/countdowns" component={CountdownsPage} />
        <Route path="/app/requests" component={RequestsPage} />
        <Route
          path="/app/comments/request"
          component={CommentsOnRequestsPage}
        />
        <Route path="/app/comments/user" component={CommentsOnUsersPage} />
        <Route
          path="/app/comments/countdown"
          component={CommentsOnCountdownsPage}
        />
        <Route path="/app/users" component={UsersPage} />
        <Route path="/app/settings" component={SettingsPage} />
        <Redirect from="/app" to="/app/dashboard" />
      </Switch>
    </Dashboard>
  );
}

Application.propTypes = {
  history: PropTypes.object.isRequired
};

export default Application;

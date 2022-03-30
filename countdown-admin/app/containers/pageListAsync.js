/* eslint-disable */

import React from 'react';
import Loading from 'enl-components/Loading';
import loadable from '../utils/loadable';

export const DashboardPage = loadable(() => import('./Pages/Dashboard'), {
  fallback: <Loading />
});
export const CountdownsPage = loadable(() => import('./Pages/Countdown'), {
  fallback: <Loading />
});
export const RequestsPage = loadable(() => import('./Pages/Request'), {
  fallback: <Loading />
});
export const CommentsOnRequestsPage = loadable(
  () => import('./Pages/Comment/Request'),
  {
    fallback: <Loading />
  }
);
export const CommentsOnUsersPage = loadable(
  () => import('./Pages/Comment/User'),
  {
    fallback: <Loading />
  }
);
export const UsersPage = loadable(() => import('./Pages/User'), {
  fallback: <Loading />
});
export const CommentsOnCountdownsPage = loadable(
  () => import('./Pages/Comment/Countdown'),
  {
    fallback: <Loading />
  }
);
export const Login = loadable(() => import('./Pages/Auth/Login'), {
  fallback: <Loading />
});
export const Register = loadable(() => import('./Pages/Auth/Register'), {
  fallback: <Loading />
});
export const ResetPassword = loadable(
  () => import('./Pages/Auth/ResetPassword'),
  {
    fallback: <Loading />
  }
);
export const SettingsPage = loadable(() => import('./Pages/Settings'), {
  fallback: <Loading />
});

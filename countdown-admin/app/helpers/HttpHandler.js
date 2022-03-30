import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { BASE_URL } from '../api/consts';
import { getAuthCookie } from './authHelper';

export const httpRequest = (uri, method, payload) => {
  const auth = getAuthCookie();
  let token = '';
  if (auth) {
    // eslint-disable-next-line prefer-destructuring
    token = auth.token;
  }
  return axios
    .request({
      url: `${BASE_URL}${uri}`,
      method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: payload
    })
    .then(res => ({
      success: true,
      code: res.status,
      data: res.data
    }))
    .catch(err => {
      if (err.response) {
        return {
          success: false,
          code: err.response.status,
          data: err.response.data
        };
      }
      NotificationManager.error('The API server is not running now.');
      return {
        success: false,
        code: 501,
        data: 'The API server is not running now.'
      };
    });
};

export const notify = response => {
  if (response.success) {
    NotificationManager.success('Success!');
  } else {
    NotificationManager.error(response.data);
  }
};

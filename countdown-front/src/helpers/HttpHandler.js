import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { BASE_URL, USERS } from '../api/uri';
import { getUser } from './UserCookie';
import { getIP } from './Country';

/**
 * send http request
 * @param {String} uri
 * @param {String} method
 * @param {Object} payload
 */
export const httpRequest = (uri, method, payload) => {
  return axios
    .request({
      url: `${BASE_URL}${uri}`,
      method,
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

/**
 * popup notification message
 */
export const notify = response => {
  if (response.success) {
    NotificationManager.success('Success!');
  } else {
    NotificationManager.error(response.data);
  }
};

/**
 * get user id from cookie
 */
export const getUserId = async () => {
  let user = getUser();
  // user id
  let id = '';
  let userRes = await httpRequest(`${USERS}?email=${user.email}`, 'GET');
  if (userRes.success) {
    // non-existing user
    if (userRes.data.length === 0) {
      // get ip and country
      let ipResponse = await getIP();
      let ip = '127.0.0.1';
      let country = 'US';
      if (ipResponse.success) {
        ip = ipResponse.data.query;
        country = ipResponse.data.countryCode;
      }
      // save new user
      let newRes = await httpRequest(`${USERS}`, 'POST', {
        name: user.name,
        email: user.email,
        isLive: false,
        isReal: true,
        ip: ip,
        country: country
      });
      if (newRes.success) {
        id = newRes.data._id;
      }
    }
    // existing user
    else {
      id = userRes.data[0]._id;
    }
  }
  return id;
};

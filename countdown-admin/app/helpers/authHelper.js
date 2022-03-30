import { setCookie, getCookie } from './Cookie';
const AUTH_COOKIE = 'auth';

export const setAuthCookie = credential => {
  setCookie(AUTH_COOKIE, JSON.stringify(credential), 1);
};

export const getAuthCookie = () => {
  const cookie = getCookie(AUTH_COOKIE);
  if (cookie) {
    return JSON.parse(cookie);
  }
  return null;
};

export const expireAuthCookie = () => {
  setCookie(AUTH_COOKIE, '', -1);
};

import { setCookie, getCookie } from './Cookie';

const COOKIE_NAME = 'user';

export function storeUser(str) {
  setCookie(COOKIE_NAME, str, 365);
}

export function getUser(str) {
  let user = getCookie(COOKIE_NAME);
  if (user) {
    return JSON.parse(user);
  }
  return {
    name: '',
    email: ''
  };
}

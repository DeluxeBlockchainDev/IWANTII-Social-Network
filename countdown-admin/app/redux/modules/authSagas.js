import {
  call, fork, put, takeEvery, all
} from 'redux-saga/effects';
import history from '../../utils/history';
import {
  LOGIN_REQUEST,
  LOGIN_WITH_EMAIL_REQUEST,
  REGISTER_WITH_EMAIL_REQUEST,
  LOGOUT_REQUEST
} from '../constants/authConstants';
import {
  loginSuccess,
  loginFailure,
  registerWithEmailSuccess,
  registerWithEmailFailure,
  logoutSuccess,
  logoutFailure
} from '../actions/authActions';
import { httpRequest } from '../../helpers/HttpHandler';
import { LOGIN, REGISTER } from '../../api/consts';

function getUrlVars() {
  const vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
    // eslint-disable-line
    vars[key] = value;
  });
  return vars;
}

function* loginSaga(payload) {
  try {
    const res = yield call(httpRequest, `${LOGIN}`, 'POST', {
      email: payload.email,
      password: payload.password
    });
    if (res.success) {
      yield put(loginSuccess(res.data));
      if (getUrlVars().next) {
        // Redirect to next route
        yield history.push(getUrlVars().next);
      } else {
        // Redirect to dashboard if no next parameter
        yield history.push('/app');
      }
    } else {
      yield put(loginFailure(res.data));
    }
  } catch (error) {
    yield put(loginFailure(error));
  }
}

function* registerWithEmailSaga(payload) {
  try {
    const res = yield call(httpRequest, `${REGISTER}`, 'POST', {
      name: payload.name,
      email: payload.email,
      password: payload.password
    });
    if (res.success) {
      yield put(registerWithEmailSuccess(res.data));
      // Redirect to login
      yield history.push('/login');
    } else if (res.code === 501) {
      yield put(registerWithEmailFailure(res.data));
    } else {
      let resStr = '';
      res.data.errors.forEach(element => {
        resStr += element.msg + '\r\n';
      });
      yield put(registerWithEmailFailure(resStr));
    }
  } catch (error) {
    yield put(registerWithEmailFailure(error));
  }
}

function* logoutSaga() {
  try {
    yield put(logoutSuccess());
    // Redirect to home
    yield history.replace('/');
  } catch (error) {
    yield put(logoutFailure(error));
  }
}

//= ====================================
//  WATCHERS
//-------------------------------------

function* loginRootSaga() {
  yield all([
    takeEvery(LOGIN_REQUEST, loginSaga),
    takeEvery(LOGIN_WITH_EMAIL_REQUEST, loginSaga),
    takeEvery(REGISTER_WITH_EMAIL_REQUEST, registerWithEmailSaga),
    takeEvery(LOGOUT_REQUEST, logoutSaga)
  ]);
}

const authSagas = [fork(loginRootSaga)];

export default authSagas;

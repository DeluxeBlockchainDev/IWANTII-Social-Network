import { combineReducers } from 'redux-immutable';

// Global Reducers
import modeReducer from './modeReducer';
import statusReducer from './statusReducer';

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    modeReducer,
    statusReducer,
    ...injectedReducers
  });

  return rootReducer;
}

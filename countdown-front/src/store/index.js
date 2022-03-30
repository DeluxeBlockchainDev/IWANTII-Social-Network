/**
 * Create the store with dynamic reducers
 */

import { createStore } from 'redux';
import createReducer from './reducer';

export default function configureStore() {
  const store = createStore(createReducer());

  store.injectedReducers = {}; // Reducer registry

  return store;
}

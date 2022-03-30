import { MODE } from './../constant/actionConstants';

export default (state = { simpleMode: true }, action = {}) => {
  switch (action.type) {
    case MODE:
      return {
        ...state,
        simpleMode: action.payload
      };
    default:
      return state;
  }
};

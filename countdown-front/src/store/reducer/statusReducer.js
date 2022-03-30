import { PENDING_TEXT } from './../constant/actionConstants';

const setPendingStatus = (
  state = {
    pending: true
  },
  action = {}
) => {
  switch (action.type) {
    case PENDING_TEXT:
      return {
        ...state,
        pending: action.payload
      };
    default:
      return state;
  }
};

export default setPendingStatus;

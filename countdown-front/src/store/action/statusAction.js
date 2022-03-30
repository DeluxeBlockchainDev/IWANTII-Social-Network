import { PENDING_TEXT } from './../constant/actionConstants';

const setPendingStatus = payload => {
  return {
    type: PENDING_TEXT,
    payload
  };
};
export default setPendingStatus;

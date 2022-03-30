import { MODE } from './../constant/actionConstants';

const setSimpleMode = payload => {
  return {
    type: MODE,
    payload
  };
};
export default setSimpleMode;

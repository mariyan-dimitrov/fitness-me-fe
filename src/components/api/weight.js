import axios from "axios";

import hostURL from "../../_constants/serverApiUrl";

export const addWeight = payload => {
  return axios({
    method: "post",
    url: `${hostURL}/weight`,
    data: payload,
  });
};

export const changeWeight = payload => {
  return axios({
    method: "put",
    url: `${hostURL}/weight`,
    data: payload,
  });
};

export const deleteWeight = weightId => {
  return axios({
    method: "delete",
    url: `${hostURL}/weight/${weightId}`,
  });
};

export const getWeight = weightId => {
  return axios({
    method: "get",
    url: `${hostURL}/weight/${weightId}`,
  });
};

const accout = {
  addWeight,
  changeWeight,
  deleteWeight,
  getWeight,
};

export default accout;

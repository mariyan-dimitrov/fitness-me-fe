import axios from "axios";

import hostURL from "../../_constants/serverApiUrl";

export const addFood = payload => {
  return axios({
    method: "post",
    url: `${hostURL}/food`,
    data: payload,
  });
};

export const changeFood = payload => {
  return axios({
    method: "put",
    url: `${hostURL}/food`,
    data: payload,
  });
};

export const deleteFood = foodId => {
  return axios({
    method: "delete",
    url: `${hostURL}/food/${foodId}`,
  });
};

export const getFood = foodId => {
  return axios({
    method: "get",
    url: `${hostURL}/food/${foodId}`,
  });
};

const accout = {
  addFood,
  changeFood,
  deleteFood,
  getFood,
};

export default accout;

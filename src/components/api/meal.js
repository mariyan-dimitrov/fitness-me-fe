import axios from "axios";

import hostURL from "../../_constants/serverApiUrl";

export const addMeal = payload => {
  return axios({
    method: "post",
    url: `${hostURL}/meal`,
    data: payload,
  });
};

export const changeMeal = payload => {
  return axios({
    method: "put",
    url: `${hostURL}/meal`,
    data: payload,
  });
};

export const deleteMeal = mealId => {
  return axios({
    method: "delete",
    url: `${hostURL}/meal/${mealId}`,
  });
};

export const getMeal = mealId => {
  return axios({
    method: "get",
    url: `${hostURL}/meal/${mealId}`,
  });
};

const accout = {
  addMeal,
  changeMeal,
  deleteMeal,
  getMeal,
};

export default accout;

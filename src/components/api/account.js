import axios from "axios";

import hostURL from "../../_constants/serverApiUrl";

export const login = payload => {
  return axios({
    method: "post",
    url: `${hostURL}/login`,
    data: payload,
  });
};

export const register = payload => {
  return axios({
    method: "post",
    url: `${hostURL}/register`,
    data: payload,
  });
};

export const logout = () => {
  return axios({
    method: "post",
    url: `${hostURL}/logout`,
  });
};

const accout = {
  logout,
  login,
  register,
};

export default accout;

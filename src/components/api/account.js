import axios from "axios";

const hostURL = "http://localhost:5000/api";

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

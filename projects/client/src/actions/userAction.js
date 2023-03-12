export const loginAction = (data) => {
  console.log("data dari komponent  ", data);
  return {
    type: "LOGIN_SUCCESS",
    payload: data,
  };
};

export const logoutAction = () => {
  localStorage.removeItem("prw_login");
  return {
    type: "LOGOUT",
  };
};

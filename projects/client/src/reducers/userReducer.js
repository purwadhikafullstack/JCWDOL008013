const INITIAL_STATE = {
  id: 0,
  username: "",
  email: "",
  isVerified: "false",
  isTenant: "false",
};

export const userReducer = (state = INITIAL_STATE, action) => {
  //acion menerima 2 property yakni type dan payload
  // console.log("data dari action  ", action);
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, ...action.payload };
    case "LOGOUT":
      return INITIAL_STATE;
    default:
      return state;
  }
};

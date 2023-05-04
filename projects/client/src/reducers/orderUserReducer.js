const INITIAL_STATE = {
    id: 0,
    username: "",
    email: "",
    isVerified: "false",
    isTenant: "false",
};

export const orderUserReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ORDER_ACTIVE":
        return { ...state, ...action.payload };
        case "ORDER_RESET":
        return INITIAL_STATE;
        default:
        return state;
    }
};
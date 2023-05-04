export const activeOrder = (data)=>{
    return {
        type: "ORDER_ACTIVE",
        payload: data,
    };
}

export const resetOrder = () =>{
    localStorage.removeItem("order_form");
    return {
        type: "ORDER_RESET",
    };
}
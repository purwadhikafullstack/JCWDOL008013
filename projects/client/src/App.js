import axios from "axios";
import "bootstrap/dist/css/bootstrap.css"
// import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verification from "./pages/Verification";
import ChangePassword from "./pages/ChangePassword";
import MyBooking from "./pages/MyBooking";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import { loginAction } from "./actions/userAction";
import { useDispatch } from "react-redux";
import Axios from "axios";
import API_URL from "./helper";
import Profile from "./pages/Profile";
import ProfilePicture from "./pages/ProfilePicture";
import Property from "./pages/Property";

function App() {
  const [message, setMessage] = useState("");
  console.log(message)
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
      setMessage(data?.message || "");
    })();
  }, []);

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const keepLogin = async() => {
    try {
      let getLocalStorage = localStorage.getItem('prw_login');
      // console.log('hasilnya keep login adalah  :' ,getLocalStorage)
      if (getLocalStorage) {
        let res = await Axios.post(API_URL + `/users/keep`,{},{
          headers:{
            "Authorization" :`Bearer ${getLocalStorage}`
          }
        })
          delete res.data.password 
            dispatch(loginAction(res.data));
            setLoading(false);
            localStorage.setItem("prw_login", res.data.token);
      } else {
        setLoading(false);
        console.log()
      }
    } catch(err){
      console.log(err)
      setLoading(false);// loading dimatikan saat mendapatkan response
    }
  };

  useEffect(() => {
    keepLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
{/* {yang pakai sidebar/>} */}
{['/dashboard','/changepass','/profile','/tobetenant','/changepict', '/mybooking','/profile','/profilepicture'].includes(location.pathname) ? <Sidebar/> : <Navbar loading={loading} />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/changepass" element={<ChangePassword />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/tobetenant" element={<ToBeTenant />} /> */}
        {/* <Route path="/resetpass" element={<ResetPassword />} /> */}
        {/* <Route path="/detail" element={<Detail />} /> */}
        {/* <Route path="/confirmation" element={<Confirmation />} /> */}
        {/* <Route path="/payment" element={<Payment />} /> */}
        {/* <Route path="/success" element={<Success />} /> */}
        <Route path="/mybooking" element={<MyBooking />} />
        {/* <Route path="/404" element={<Page404 />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profilepicture" element={<ProfilePicture />} />
        <Route path="/property" element={<Property />} />
      </Routes>
      {/* {yang pakai Footer dan navbar */}
      {['/','/login','/register','/verification','/resetpass','/detail','/confirmation','/payment','/success','/404','/property'].includes(location.pathname) && <Footer/>}
    </div>
  );
}

export default App;

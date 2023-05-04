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
import ToBeTenant from "./pages/ToBeTenant";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ProfilePicture from "./pages/ProfilePicture";
import Detail from "./pages/Detail";
import Confirmation from "./pages/Confirmation";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Page404 from "./pages/Page404";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import { loginAction } from "./actions/userAction";
import { useDispatch } from "react-redux";
import Axios from "axios";
import API_URL from "./helper";
import OrderList from "./pages/OrderList";
import { Box } from "@chakra-ui/react";
import TenantRoom from "./pages/TenantRoom";
import TenantRoomDetail from "./pages/TenantRoomDetail";
import OrderDetail from "./pages/OrderDetail";
import RatingUser from "./pages/RatingUser";
import AvaliableProperty from "./pages/AvaliableProperty";
import DetailProperty from "./pages/DetailProperty";
import TenantProperty from "./pages/TenantProperty";
import ReportList from "./pages/ReportList";

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
    <div style={{display:"flex",flexDirection:'column', minHeight:"100vh",height:"100%" ,margin:0}}>
{/* {yang pakai sidebar/>} */}
{['/dashboard','/changepass','/profile','/tobetenant','/changepict', '/mybooking','/profile','/profilepicture', '/admin/property', '/admin/room', '/admin/room/detail'].includes(location.pathname) ? <Sidebar loading={loading}/> : <Navbar loading={loading} />}
      <Box flex={1}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/changepass" element={<ChangePassword />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/tobetenant" element={<ToBeTenant />} />
        <Route path="/resetpass" element={<ResetPassword />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />
        <Route path="/mybooking" element={<MyBooking />} />
        <Route path="/404" element={<Page404 />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profilepicture" element={<ProfilePicture />} />
          <Route path= "/admin/order" element={<OrderList />} />
          <Route path= "/admin/report" element={<ReportList />} />
          <Route path="/admin/property" element={<TenantProperty />} />
          <Route path="/admin/room" element={<TenantRoom />} />
        <Route path="/admin/room/detail" element={<TenantRoomDetail />} />
          <Route path="/admin/order/detail/:id/:action" element={<OrderDetail />} />
          <Route path="/rating/:id" element={<RatingUser />} />
          <Route path="/search" element={<AvaliableProperty />} />
          <Route path="/detailproperty/:id" element={<DetailProperty />} />
          
        </Routes>
      {/* {yang pakai Footer dan navbar */}
      </Box>
      {['/','/login','/register','/verification','/resetpass','/detail','/confirmation','/payment','/success','/404','/property'].includes(location.pathname) && <Footer/>}
    </div>
  );
}

export default App;

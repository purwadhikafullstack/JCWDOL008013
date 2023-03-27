import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { loginAction } from "./actions/userAction";
import { useDispatch } from "react-redux";
import Axios from "axios";
import API_URL from "./helper";
import Profile from "./pages/Profile";
import ProfilePicture from "./pages/ProfilePicture";
import OrderList from "./pages/OrderList";
import { Box } from "@chakra-ui/react";
import ReportList from "./pages/ReportList";

function App() {
  const [message, setMessage] = useState("");

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

  const keepLogin = async () => {
    let getLocalStorage = localStorage.getItem("prw_login");
    console.log(getLocalStorage);
    if (getLocalStorage) {
      Axios.get(API_URL + "/users/keep", {
        headers: {
          Authorization: `Bearer ${getLocalStorage}`,
        },
      })
        .then((res) => {
          dispatch(loginAction(res.data));
          setLoading(false);
          localStorage.setItem("prw_login", res.data.token);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    keepLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{display:"flex",flexDirection:'column', minHeight:"100vh",height:"100%" ,margin:0}}>
      <Navbar loading={loading} />
      <Box flex={1}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profilepicture" element={<ProfilePicture />} />
          <Route path= "/admin/order" element={<OrderList />} />
          <Route path= "/admin/report" element={<ReportList />} />
        </Routes>
      </Box>
      <Footer />
    </div>
  );
}

export default App;

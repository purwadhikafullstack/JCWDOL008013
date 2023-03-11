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
    try {
      let getLocalStorage = JSON.parse(localStorage.getItem("prw_login"));
      console.log("hasilnya adalah  :", getLocalStorage);
      if (getLocalStorage.id_user) {
        let res = await Axios.post(API_URL + `/users/keep`, {
          id: getLocalStorage.id_user,
        });
        delete res.data.password;
        dispatch(loginAction(res.data));
        setLoading(false);
        localStorage.setItem("prw_login", JSON.stringify(res.data));
      } else {
        setLoading(false);
        console.log();
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    keepLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Navbar loading={loading} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

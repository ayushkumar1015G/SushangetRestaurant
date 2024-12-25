/* eslint-disable react/prop-types */
import {toast} from "react-toastify";
import "./Navbar.css";

import {assets} from "../../assets/assets.js";
import {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {StoreContext} from "../../context/StoreContext.jsx";

function Navbar({setShowLogin}) {
  const [menu, setMenu] = useState("home");
  const navigate = useNavigate();
  const {getTotalCartAmount, name, token, setToken} = useContext(StoreContext);
  const Logout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to={"/"}>
        <img src={assets.sushLogo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to={"/"}
          onClick={() => {
            setMenu("home");
          }}
          className={menu === "home" ? "active" : ""}
        >
          HOME
        </Link>
        <a
          href="#explore-menu"
          onClick={() => {
            setMenu("menu");
          }}
          className={menu === "menu" ? "active" : ""}
        >
          MENU
        </a>

        <a
          href="#footer"
          onClick={() => {
            setMenu("contact-us");
          }}
          className={menu === "contact-us" ? "active" : ""}
        >
          {" "}
          CONTACT US
        </a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to={"/cart"}>
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button
            onClick={() => {
              setShowLogin(true);
            }}
          >
            Sign In
          </button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li>
                <img src={assets.profile_icon} alt="" />

                <p>{name}</p>
              </li>
              <hr />
              <li>
                <img src={assets.bag_icon} alt="" />
                <Link to={"/myorders"}>
                  <p>Orders</p>
                </Link>
              </li>
              <hr />
              <li onClick={Logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;

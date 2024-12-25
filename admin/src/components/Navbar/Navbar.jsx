import "./Navbar.css";
import {assets} from "../../assets/assets.js";
function Navbar() {
  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
      <img className="profile" src={assets.logo} alt="" />
    </div>
  );
}

export default Navbar;

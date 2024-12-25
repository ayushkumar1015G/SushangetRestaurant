import {assets} from "../../assets/assets";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.sushLogo} className="footer-logo-img" alt="" />
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque,
            voluptatibus! Ad corporis laborum saepe, libero, quod esse eum
            voluptates adipisci non facilis tempora quibusdam deleniti ullam.
            Obcaecati corporis perspiciatis impedit!
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91-78930059020</li>
            <li>contact@sushangat.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p>Copyright 2024 &copy; 2024 Sushangat.com - All Rights Reserved.</p>
    </div>
  );
}

export default Footer;

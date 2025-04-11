// import {useContext, useState} from "react";
// import "./LoginPopup.css";
// import {assets} from "../../assets/assets";
// import axios from "axios";
// import {StoreContext} from "../../context/StoreContext";

// import {toast} from "react-toastify";
// // eslint-disable-next-line react/prop-types
// function LoginPopup({setShowLogin}) {
//   const {url, token, setToken, setName} = useContext(StoreContext);
//   const [currentState, setCurrentState] = useState("Login");
//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const onLogin = async (event) => {
//     event.preventDefault();
//     let newUrl = url;
//     if (currentState === "SignUp") {
//       newUrl += "/api/user/register";
//     } else {
//       newUrl += "/api/user/login";
//     }

//     try {
//       const response = await axios.post(newUrl, data);

//       if (response.data.success) {
//         setToken(response.data.token);
//         setName(response.data.name);
//         console.log(token);
//         localStorage.setItem("token", response.data.token);
//         setShowLogin(false);
//         toast.success(`${currentState} Successful!`);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error during API call:", error.message);
//     }
//   };

//   const onChangeHandler = (event) => {
//     const {name, value} = event.target;
//     setData((prevData) => ({...prevData, [name]: value}));
//   };

//   return (
//     <div className="login-popup">
//       <form onSubmit={onLogin} className="login-popup-container">
//         <div className="login-popup-title">
//           <h2>{currentState}</h2>
//           <img
//             src={assets.cross_icon}
//             onClick={() => setShowLogin(false)}
//             className=""
//             alt=""
//           />
//         </div>
//         <div className="login-popup-inputs">
//           {currentState === "Login" ? (
//             <></>
//           ) : (
//             <input
//               type="text"
//               name="name"
//               onChange={onChangeHandler}
//               value={data.name}
//               placeholder="Your Name"
//               required
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             onChange={onChangeHandler}
//             value={data.email}
//             placeholder="Your Email"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             onChange={onChangeHandler}
//             value={data.password}
//             placeholder="Your Password"
//             required
//           />
//         </div>
//         <button type="submit">
//           {currentState === "SignUp" ? "Create Account" : "Login"}
//         </button>
//         <div className="login-popup-condition">
//           <input type="checkbox" required />
//           <p>By continuing, I agree to the terms of use and privacy policy</p>
//         </div>
//         {currentState === "Login" ? (
//           <p>
//             Create a new account?{" "}
//             <span onClick={() => setCurrentState("SignUp")}>Click here</span>
//           </p>
//         ) : (
//           <p>
//             Already have an account?{" "}
//             <span onClick={() => setCurrentState("Login")}>Login here</span>
//           </p>
//         )}
//       </form>
//     </div>
//   );
// }

// export default LoginPopup;

import {useContext, useState} from "react";
import "./LoginPopup.css";
import {assets} from "../../assets/assets";
import axios from "axios";
import {StoreContext} from "../../context/StoreContext";

import {toast} from "react-toastify";
// eslint-disable-next-line react/prop-types
function LoginPopup({setShowLogin}) {
  const {url, token, setToken, setName} = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currentState === "SignUp") {
      newUrl += "/api/user/register";
    } else {
      newUrl += "/api/user/login";
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        setName(response.data.name);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
        toast.success(`${currentState} Successful!`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error during API call:", error.message);
    }
  };

  const onForgotPassword = async (event) => {
    event.preventDefault();
    const resetPasswordUrl = `${url}/api/user/forgot-password`;

    try {
      const response = await axios.post(resetPasswordUrl, {
        email: forgotPasswordEmail,
      });

      if (response.data.success) {
        toast.success("Password reset link has been sent to your email!");
        setIsForgotPassword(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error during API call:", error.message);
      toast.error("An error occurred while sending the reset email.");
    }
  };

  const onChangeHandler = (event) => {
    const {name, value} = event.target;
    setData((prevData) => ({...prevData, [name]: value}));
  };

  return (
    <div className="login-popup">
      <form
        onSubmit={isForgotPassword ? onForgotPassword : onLogin}
        className="login-popup-container"
      >
        <div className="login-popup-title">
          <h2>{isForgotPassword ? "Forgot Password" : currentState}</h2>
          <img
            src={assets.cross_icon}
            onClick={() => setShowLogin(false)}
            className=""
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {isForgotPassword ? (
            <>
              <input
                type="email"
                name="forgotPasswordEmail"
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                value={forgotPasswordEmail}
                placeholder="Enter your email"
                required
              />
            </>
          ) : (
            <>
              {currentState === "Login" ? null : (
                <input
                  type="text"
                  name="name"
                  onChange={onChangeHandler}
                  value={data.name}
                  placeholder="Your Name"
                  required
                />
              )}
              <input
                type="email"
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                placeholder="Your Email"
                required
              />
              <input
                type="password"
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                placeholder="Your Password"
                required
              />
            </>
          )}
        </div>
        <button type="submit">
          {isForgotPassword
            ? "Reset Password"
            : currentState === "SignUp"
            ? "Create Account"
            : "Login"}
        </button>
        {!isForgotPassword && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use and privacy policy</p>
          </div>
        )}
        {isForgotPassword ? (
          <p>
            Back to{" "}
            <span onClick={() => setIsForgotPassword(false)}>Login</span>
          </p>
        ) : currentState === "Login" ? (
          <>
            <p>
              Create a new account?{" "}
              <span onClick={() => setCurrentState("SignUp")}>Click here</span>
            </p>
            <p>
              Forgot your password?{" "}
              <span onClick={() => setIsForgotPassword(true)}>Reset here</span>
            </p>
          </>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default LoginPopup;

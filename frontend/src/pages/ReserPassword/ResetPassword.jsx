import {useContext, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {StoreContext} from "../../context/StoreContext";
import {useNavigate} from "react-router-dom";
import './ResetPassword.css';
const ResetPassword = () => {
  const {url} = useContext(StoreContext);
  const navigate = useNavigate();
  const {token} = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      console.log(token);
      const response = await axios.post(`${url}/api/user/reset-password`, {
        token,
        password,
      });
      setMessage(response.data.message || "Password reset successful.");
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error resetting password. in reset"
      );
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h1>Reset Your Password</h1>
        <form onSubmit={handleSubmit}>
          <label>
            New Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
  };

export default ResetPassword;

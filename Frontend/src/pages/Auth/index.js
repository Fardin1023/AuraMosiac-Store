import { useState, useContext } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const API_URL = "http://localhost:4000/api/auth";

const Auth = () => {
  const { setUser } = useContext(MyContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/login`, {
          email: formData.email, password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/");
      } else {
        await axios.post(`${API_URL}/register`, {
          name: formData.name, email: formData.email, password: formData.password,
        });
        alert("Registered Successfully! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.hint || err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse || {};
      if (!credential) return;
      const res = await axios.post(`${API_URL}/google`, { credential });
      const { token, user, isNewUser } = res.data || {};
      if (token && user) {
        localStorage.setItem("token", token);
        setUser(user);
        navigate(isNewUser || user.isProfileComplete === false ? "/welcome" : "/");
      } else {
        setErrorMsg("Google sign-in failed. Please try again.");
      }
    } catch (e) {
      setErrorMsg(e?.response?.data?.hint || e?.response?.data?.message || "Google sign-in failed.");
    }
  };

  const handleGoogleError = () => setErrorMsg("Google sign-in was cancelled.");

  return (
    <div className="auth-container">
      <div className={`auth-box ${isLogin ? "login-mode" : "register-mode"}`}>
        {/* Top tabs (no overlap now) */}
        <div className="auth-tabs">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Register</button>
        </div>

        {/* Login */}
        <form className="form login-form" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          {errorMsg && <p className="error-text">{errorMsg}</p>}
          <div className="inputBox">
            <input type="email" name="email" value={formData.email} required onChange={handleChange} />
            <span>Email</span>
          </div>
          <div className="inputBox">
            <input type="password" name="password" value={formData.password} required onChange={handleChange} />
            <span>Password</span>
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="mt-3 d-flex justify-content-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} shape="pill" />
          </div>
          <p className="switch-text">
            Don’t have an account? <span onClick={() => setIsLogin(false)}>Register</span>
          </p>
        </form>

        {/* Register */}
        <form className="form register-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          {errorMsg && <p className="error-text">{errorMsg}</p>}
          <div className="inputBox">
            <input type="text" name="name" value={formData.name} required onChange={handleChange} />
            <span>Name</span>
          </div>
          <div className="inputBox">
            <input type="email" name="email" value={formData.email} required onChange={handleChange} />
            <span>Email</span>
          </div>
          <div className="inputBox">
            <input type="password" name="password" value={formData.password} required onChange={handleChange} />
            <span>Password</span>
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="mt-3 d-flex justify-content-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} shape="pill" />
          </div>
          <p className="switch-text">
            Already have an account? <span onClick={() => setIsLogin(true)}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;

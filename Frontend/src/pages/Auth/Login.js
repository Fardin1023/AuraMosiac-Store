import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [theme, setTheme] = useState("theme-green");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "theme-green" ? "theme-pink" : "theme-green");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // ✅ Add your login logic here
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          <button type="submit" className="btn-submit">
            Login
          </button>
        </form>

        <p className="mt-3">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>

      {/* Theme Toggle */}
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === "theme-green" ? "🌿 Green" : "🌸 Pink"}
      </button>
    </div>
  );
};

export default Login;

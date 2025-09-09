import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [theme, setTheme] = useState("theme-green");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "theme-green" ? "theme-pink" : "theme-green");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // ✅ Add your register logic here
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Register</h2>

        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          <button type="submit" className="btn-submit">
            Register
          </button>
        </form>

        <p className="mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      {/* Theme Toggle */}
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === "theme-green" ? "🌿 Green" : "🌸 Pink"}
      </button>
    </div>
  );
};

export default Register;

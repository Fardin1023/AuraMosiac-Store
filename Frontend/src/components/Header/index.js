import logo from "../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import CityDropdown from "../CityDropdown";
import { Button } from "bootstrap-4-react/lib/components";
import { FaRegUser } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import axios from "axios";

// MUI menu for the user dropdown
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import { logout as apiLogout } from "../../api/api";

const Header = () => {
  const { user, setUser, cart, theme, setTheme, wishlist, openLoginGate } =
    useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // fetcher pulled out so we can also call it after checkout
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data?.user || res.data);
    } catch (err) {
      console.error("Error fetching user:", err.message);
    }
  };

  // ✅ load and re-load when "aura:refresh-me" is dispatched (after order)
  useEffect(() => {
    fetchUser();
    const onRefresh = () => fetchUser();
    window.addEventListener("aura:refresh-me", onRefresh);
    return () => window.removeEventListener("aura:refresh-me", onRefresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser]);

  const toggleTheme = () => {
    setTheme(theme === "theme-green" ? "theme-pink" : "theme-green");
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const handleUserBtnClick = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const goHistory = () => {
    handleCloseMenu();
    navigate("/history");
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {
      /* ignore */
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      handleCloseMenu();
      navigate("/");
    }
  };

  // 🔐 Intercept wishlist nav if not signed in
  const handleWishlistClick = (e) => {
    if (!user) {
      e.preventDefault();
      openLoginGate("Sign in to view & manage your wishlist.");
    }
  };

  return (
    <>
      <header className="headerWrapper">
        {/* 🔹 Top Strip */}
        <div className="top-strip bg-cyan">
          <div className="container">
            <p className="mb-0 mt-0 text-center">
              Due to <b>technical issues</b>, orders can sometimes be processed
              with a delay
            </p>
          </div>
        </div>

        {/* 🔹 Header Bar (pill container) */}
        <div className="header">
          <div className="container">
            <div className="row align-items-center">
              {/* Logo + Animated Brand Name */}
              <div className="logoWrapper d-flex align-items-center col-sm-2">
                <Link
                  to="/"
                  className="brandLink d-flex align-items-center"
                  aria-label="Aura-Mosaic Home"
                >
                  <img src={logo} alt="Aura-Mosaic logo" />
                  <span className="brandName">Aura-Mosaic</span>
                </Link>
              </div>

              {/* Right side */}
              <div className="col-sm-10">
                <div className="headerBar">
                  {/* Location */}
                  <CityDropdown />

                  {/* Search (flexes to fill) */}
                  <SearchBox />

                  {/* Right actions */}
                  <div className="hStack">
                    {/* User */}
                    {user ? (
                      <>
                        <button
                          className="user-chip"
                          onClick={handleUserBtnClick}
                          aria-controls={open ? "user-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          title="Account"
                        >
                          <FaRegUser className="icon" />
                          <div className="meta">
                            <span className="name">Hi, {user.name}</span>
                            {/* 👇 show SPENT, not stored balance */}
                            <span className="sub">
                              Spent: Tk. {Number(user?.spent || 0).toFixed(0)}
                            </span>
                          </div>
                        </button>

                        <Menu
                          id="user-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleCloseMenu}
                          MenuListProps={{ "aria-labelledby": "user-chip" }}
                        >
                          <MenuItem disabled>
                            Signed in as&nbsp;<strong>{user.email}</strong>
                          </MenuItem>
                          <Divider />
                          <MenuItem onClick={goHistory}>Your History</MenuItem>
                          <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                      </>
                    ) : (
                      <Link
                        to="/register"
                        className="iconBtn"
                        title="Sign in / Register"
                      >
                        <FaRegUser />
                      </Link>
                    )}

                    {/* Wishlist */}
                    <Link
                      to="/wishlist"
                      className="iconBtn"
                      title="Wishlist"
                      onClick={handleWishlistClick}
                    >
                      <FaRegHeart />
                      <span className="badgeCounter">
                        {wishlist?.length || 0}
                      </span>
                    </Link>

                    {/* Cart (viewing cart is okay; checkout is gated in Cart page) */}
                    <Link
                      to="/cart"
                      className="iconBtn"
                      title={`Cart • Tk.${cartTotal}`}
                    >
                      <FaCartPlus />
                      <span className="badgeCounter">{cart.length}</span>
                    </Link>

                    {/* Theme toggle */}
                    <button
                      className="iconBtn themeToggler"
                      onClick={toggleTheme}
                      title={
                        theme === "theme-green"
                          ? "Switch to Pink"
                          : "Switch to Green"
                      }
                      aria-label="Toggle color theme"
                    >
                      {theme === "theme-green" ? "🌿" : "🌸"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Navigation />
    </>
  );
};

export default Header;

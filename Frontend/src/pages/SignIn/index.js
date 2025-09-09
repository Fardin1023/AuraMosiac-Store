import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import logo from "../../assets/images/logo.png";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    context.setisHeaderFooterShow(false);
    return () => context.setisHeaderFooterShow(true);
  }, []);

  const onGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:4000/api/auth/google", {
        credential: credentialResponse.credential,
      });
      const { token, user, isNewUser } = res.data || {};
      if (token && user) {
        localStorage.setItem("token", token);
        context.setUser(user);
        navigate(isNewUser || user.isProfileComplete === false ? "/welcome" : "/");
      }
    } catch (e) {
      console.error(e);
      alert("Google sign-in failed.");
    }
  };

  return (
    <section className="section signInPage">
      <div className="shape-bottom">
        {/* …svg stays the same… */}
      </div>
      <div className="container">
        <div className="box card p-3 shadow border-0 text-center">
          <img src={logo} alt="logo" style={{ height: 56 }} className="mb-3" />
          <div className="d-flex justify-content-center">
            <GoogleLogin onSuccess={onGoogleSuccess} onError={() => {}} />
          </div>
        </div>
      </div>
    </section>
  );
};
export default SignIn;

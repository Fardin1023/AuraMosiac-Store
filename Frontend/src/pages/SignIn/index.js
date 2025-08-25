import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import logo from "../../assets/images/logo.png";

const SignIn = () => {
  const context = useContext(MyContext);
  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);
  return (
    <section className="section signInPage">
      <div className="shape-bottom">
        <svg
          fill="fff"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="0 0 1921 819.8"
          style={{ enableBackground: "new 0 0 1921 819.8" }}
        >
          <path
            class="st0"
            d="M1921,413.4c-83.2,0-160.4-32.4-218.4-90.4c-58-58-90.4-135.2-90.4-218.4c0-83.2,32.4-160.4,90.4-218.4C1760.6-32.4,1837.8-64,1921-64c83.2,0,160.4,32.4,218.4,90.4C2180.4,32.4,2212,119.6,2212,202.8c0,83.2-32.4,160.4-90.4,218.4C2081.4,381,2004.2,413.4,1921,413.4z"
          ></path>
        </svg>
      </div>
      <div className="container">
        <div className="box card p-3 shadow border-0">
            <div className="text-center">
                <img src={logo} alt="logo"/>
            </div>
        </div>
      </div>
    </section>
  );
};
export default SignIn;

import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import CityDropdown from "../CityDropdown";
import { Button } from "bootstrap-4-react/lib/components";
import { FaRegUser } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import { useContext } from "react";
import { MyContext } from "../../App";

const Header = () => {
  const context=useContext(MyContext)
  return (
    <>
      <header className="headerWrapper">
        <div className="top-strip bg-cyan">
          <div className="container">
            <p className="mb-0 mt-0 text-center">
              Due to <b>technical issues</b> ,orders can sometimes be processed
              with a delay
            </p>
          </div>
        </div>
        <div className="header">
          <div className="container">
            <div className="row">
              <div className="logoWrapper d-flex align-items-center col-sm-2">
                <Link to={"/"}>
                  {" "}
                  <img src={logo} alt="Logo" />
                </Link>
              </div>
              <div className="col-sm-10 d-flex align-items-center part2">
                {
                  context.cityList.length !== 0 && <CityDropdown />
                }
               
                <SearchBox />
                <div className="part3 d-flex align-items-center ml-auto">
                  <Button className="circle mr-4">
                    <FaRegUser />
                  </Button>
                  <div className="ml-auto cartTab d-flex align-items-center">
                    <span className="price"> Tk.250</span>
                    <div className="position-relative ml-2">
                      <Button className="circle">
                        <FaCartPlus />
                      </Button>
                      <span className="count d-flex align-items-center justify-content-center">
                        1
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Navigation/>
    </>
  );
};
export default Header;

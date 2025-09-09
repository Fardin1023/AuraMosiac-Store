import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { FiSearch } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { MyContext } from "../../App";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CityDropdown = () => {
  const [isOpenModal, setisOpenModal] = useState(false);
  const [selectedTab, setselectedTab] = useState(null);
  const [cityList, setCityList] = useState([]);
  const context = useContext(MyContext);

  const selectCity = (index, name) => {
    setselectedTab(index);
    setisOpenModal(false);
    context.setselectedCity(name);
  };

  useEffect(() => {
    setCityList(context.cityList);
  }, [context.cityList]);

  const filterList = (e) => {
    const keyword = e.target.value.toLowerCase();
    if (keyword !== "") {
      const list = context.cityList.filter((item) =>
        item.name.toLowerCase().includes(keyword)
      );
      setCityList(list);
    } else {
      setCityList(context.cityList);
    }
  };

  return (
    <>
      {/* Compact pill toggle inside header bar */}
      <button className="city-toggle" onClick={() => setisOpenModal(true)}>
        <span className="label">Your Location</span>
        <span className="value">
          {context.selectedCity !== "" ? context.selectedCity : "Select Location"}
        </span>
        <FaAngleDown className="caret" />
      </button>

      {/* Full list in a dialog (unchanged behavior) */}
      <Dialog
        open={isOpenModal}
        onClose={() => setisOpenModal(false)}
        className="locationModal"
        slots={{ transition: Transition }}
      >
        <h4 className="mb-0">Choose your Delivery Location</h4>
        <p>Enter your location address</p>
        <Button className="close_" onClick={() => setisOpenModal(false)}>
          <IoCloseSharp />
        </Button>

        <div className="headersearch w-100">
          <input type="text" placeholder="Search.." onChange={filterList} />
          <Button>
            <FiSearch />
          </Button>
        </div>

        <ul className="cityList mt-3">
          {cityList?.length !== 0 &&
            cityList?.map((item, index) => (
              <li key={index}>
                <Button
                  onClick={() => selectCity(index, item.name)}
                  className={`${selectedTab === index ? "active" : ""}`}
                >
                  {item.name}
                </Button>
              </li>
            ))}
        </ul>
      </Dialog>
    </>
  );
};

export default CityDropdown;

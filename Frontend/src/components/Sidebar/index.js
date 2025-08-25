import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useState } from "react";
import banner5 from "../../assets/images/banner5.png"
import { Link } from "react-router-dom";

const Sidebar = () => {
    const [value,setValue]=useState([100,50000]);
    

  return (
    
    <>
      <div className="sidebar">
        <div className="sticky">
        <div className="filterBox">
          <h6>PRODUCT CATEGORIES</h6>

          <div className="scrol">
            <ul>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="Skincare"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="Plants"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="HandCraft Items"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="Home Decor"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="Giftings"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="New Arrivals"
                />
              </li>
            </ul>
          </div>
        </div>

        <div className="filterBox">
          <h6>FILTER BY PRICE</h6>

          <RangeSlider value={value} onInput={setValue} min={100} max={50000} step={5}/>
          <div className="d-flex pt-2 pb-2 priceRange">
            <span>From: <strong className="text-dark">TK:{value[0]}</strong></span>
            <span className="ml-auto">From: <strong className="text-dark">TK:{value[1]}</strong></span>
          </div>
        </div>

         <div className="filterBox">
          <h6>PRODUCT STATUS</h6>

          <div className="scrol">
            <ul>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="In Stock"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="On Sale"
                />
              </li>
             
            </ul>
          </div>
        </div>

        <div className="filterBox">
          <h6>BRANDS</h6>

          <div className="scrol">
            <ul>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="Crafted Whimsy"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="Heritage Hands"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="GreenNest"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="PureRadiance"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="Nature’s Palette"
                />
              </li>
             
            </ul>
          </div>
        </div>

        <br/>
        <Link to="/"><img src={banner5} alt="pic" className="w-100"/></Link>
      </div>
      </div>
    </>
  );
};
export default Sidebar;

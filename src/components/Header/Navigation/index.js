import { Button } from "bootstrap-4-react/lib/components";
import { IoMenu } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import React from "react";

const Navigation = () => {
  const [isOpenSidebarVal, setisopenSidebarVal] = useState(true);
  
  return (
    <nav>
      <div className="container">
        <div className="row">
          <div className="col-sm-3 navPart1">
            <div className="catWrapper">
              
              {/* ALL CATEGORIES Button */}
<Button
  className="allCartTab align-items-center"
  onClick={() => setisopenSidebarVal(!isOpenSidebarVal)}
>
  <span className="icon1 mr-2">
    <IoMenu />
  </span>
  <span className="text">ALL CATEGORIES</span>
  <span className="icon2 ml-2">
    <FaAngleDown />
  </span>
</Button>

{/* Sidebar Navigation */}
<div className={`sidebarNav ${isOpenSidebarVal ? "open" : ""}`}>
  <ul>
    <li>
      <Link to="/">
        <Button>Skincare Products</Button>
      </Link>
    </li>
    <li>
      <Link to="/">
        <Button>Plants</Button>
      </Link>
    </li>
    <li>
      <Link to="/">
        <Button>Handcraft Items</Button>
      </Link>
    </li>
    <li>
      <Link to="/">
        <Button>Home Décor</Button>
      </Link>
    </li>
    <li>
      <Link to="/">
        <Button>Gifting</Button>
      </Link>
    </li>
    <li>
      <Link to="/">
        <Button>New Arrivals</Button>
      </Link>
    </li>
  </ul>
</div>

            </div>
          </div>
          <div className="col-sm-9 navPart2 d-flex align-items-center">
            <ul className="list list-inline ml-auto">
              <li className="list-inline-item">
                {" "}
                <Link to="/">
                  <Button>Home</Button>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/">
                  <Button>SkinCare-Products</Button>
                </Link>
                <div className="submenu shadow">
                  <Link to="/">
                    <Button>Cleansers</Button>
                  </Link>
                  <Link to="/">
                    <Button>Toners</Button>
                  </Link>
                  <Link to="/">
                    <Button>Moisturizers</Button>
                  </Link>
                  <Link to="/">
                    <Button>Serums</Button>
                  </Link>
                  <Link to="/">
                    <Button>Face Masks</Button>
                  </Link>
                  <Link to="/">
                    <Button>Sunscreens</Button>
                  </Link>
                  <Link to="/">
                    <Button>Eye Care</Button>
                  </Link>
                  <Link to="/">
                    <Button>Lip Care</Button>
                  </Link>
                </div>
              </li>
              <li className="list-inline-item">
                <Link to="/">
                  <Button>Plants</Button>
                </Link>
                <div className="submenu shadow">
                  <Link to="/">
                    <Button>Indoor Plants</Button>
                  </Link>
                  <Link to="/">
                    <Button>Outdoor Plants</Button>
                  </Link>
                  <Link to="/">
                    <Button>Flowering Plants</Button>
                  </Link>
                  <Link to="/">
                    <Button>Succulents & Cacti</Button>
                  </Link>
                  <Link to="/">
                    <Button>Herbs & Edible Plants</Button>
                  </Link>
                  <Link to="/">
                    <Button>Air-Purifying Plants</Button>
                  </Link>
                  <Link to="/">
                    <Button>Bonsai & Decorative Plants</Button>
                  </Link>
                  <Link to="/">
                    <Button>Plant Care Accessories</Button>
                  </Link>
                </div>
              </li>
              <li className="list-inline-item">
                <Link to="/">
                  <Button>Hand-Crafted Items</Button>
                </Link>
                <div className="submenu shadow">
                  <Link to="/">
                    <Button>Home Décor</Button>
                  </Link>
                  <Link to="/">
                    <Button>Jewelry & Accessories</Button>
                  </Link>
                  <Link to="/">
                    <Button>Pottery & Ceramics</Button>
                  </Link>
                  <Link to="/">
                    <Button>Handwoven Textiles</Button>
                  </Link>
                  <Link to="/">
                    <Button>Wooden Crafts</Button>
                  </Link>
                  <Link to="/">
                    <Button>Leather Goods</Button>
                  </Link>
                  <Link to="/">
                    <Button>Traditional Art & Paintings</Button>
                  </Link>
                  <Link to="/">
                    <Button>Gift Items & Souvenirs</Button>
                  </Link>
                </div>
              </li>
              <li className="list-inline-item">
                <Link to="/">
                  <Button>Blog</Button>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/">
                  <Button>Contact Us</Button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;

};
export default Navigation;



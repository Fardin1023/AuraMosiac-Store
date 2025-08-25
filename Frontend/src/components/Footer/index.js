import { GiPlantSeed } from "react-icons/gi";
import { MdDeliveryDining } from "react-icons/md";
import { RiDiscountPercentFill } from "react-icons/ri";
import { IoIosPricetags } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="topInfo row">
          <div className="col d-flex align-items-center">
            <span>
              <GiPlantSeed />
            </span>
            <span className="ml-2">Get Exclusive Products</span>
          </div>
          <div className="col d-flex align-items-center">
            <span>
              <MdDeliveryDining />
            </span>
            <span className="ml-2">Free Delivery on order ৳500</span>
          </div>
          <div className="col d-flex align-items-center">
            <span>
              <RiDiscountPercentFill />
            </span>
            <span className="ml-2">Weekly Mega Discounts</span>
          </div>
          <div className="col d-flex align-items-center">
            <span>
              <IoIosPricetags />
            </span>
            <span className="ml-2">Best Price on the market</span>
          </div>
        </div>

        <div className="row mt-5 linksWrap">
          <div className="col">
            <h5>COMPANY INFO</h5>
            <ul>
              <li>
                {" "}
                <Link to="#">About Us</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Our Story</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Sustainability & Values</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Careers</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Blog / News</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h5>CONNECT WITH US</h5>
            <ul>
              <li>
                {" "}
                <Link to="#">Newsletter Subscription</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Social Media</Link>
              </li>
              <li>
                {" "}
                <Link to="#">WhatsApp Chat / Live Support</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h5>CUSTOMER SUPPORT</h5>
            <ul>
              <li>
                {" "}
                <Link to="#">Help Center / FAQs</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Shipping & Delivery</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Returns & Refunds</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Order Tracking</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h5>SHOP BY CATEGORY</h5>
            <ul>
              <li>
                {" "}
                <Link to="#">Skincare</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Plants</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Handicrafts</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Home Décor</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Gifting</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h5>POLICIES</h5>
            <ul>
              <li>
                {" "}
                <Link to="#">Privacy Policy</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Terms & Conditions</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Refund Policy</Link>
              </li>
              <li>
                {" "}
                <Link to="#">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="copyright mt-3 pb-3 pt-3 d-flex">
          <p className="mb-0">
            {" "}
            © 2025 Aura Mosaic — Where creativity meets craftsmanship.
          </p>
          <ul className="list list-inline ml-auto mb-0">
            <li className="list-inline-item">
                <Link to="#"><FaFacebook /></Link>
            </li>
            <li className="list-inline-item">
                <Link to="#"><FaXTwitter /></Link>
            </li>
            <li className="list-inline-item">
                <Link to="#"><FaInstagram /></Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

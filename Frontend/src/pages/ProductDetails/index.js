import ProductZoom from "../../components/ProductZoom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../components/QuantityBox";
import Button from "@mui/material/Button";
import { FaCartShopping } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
import Tooltip from '@mui/material/Tooltip';
import { useState } from "react";
import RelatedProducts from "./RelatedProducts";

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment || !rating) {
      alert("Please fill all fields before submitting!");
      return;
    }
    alert(`Thanks ${name}, your review has been submitted!`);
    setName("");
    setComment("");
    setRating(0);
  };

  return (
    <section className="productDetails section">
      <div className="container">
        <div className="row">
          <div className="col-md-4 pl-5">
            <ProductZoom />
          </div>
          <div className="col-md-7 pl-5 pr-5">
            <h2 className="hd text-capitalize">
              Himalaya Natural Glow Saffron Face Wash
            </h2>
            <ul className="list list-inline d-flex align-items-center">
              <li className="list-inline-item">
                <div className="d-flex align-items-center">
                  <span className="text-dark mr-2">Brands :</span>
                  <span>Himalaya</span>
                </div>
              </li>
              <li className="list-inline-item ">
                <div className="d-flex align-items-center">
                  <Rating
                    name="read-only"
                    value={3.5}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <span className="text-dark cursor ml-2">1 REVIEW</span>
                </div>
              </li>
            </ul>

            <div class="d-flex info mb-2">
              <span class="oldPrice">৳200.00</span>
              <span class="newPrice text-danger ml-2">৳99.00</span>
            </div>
            <span className="badge badge-success">IN STOCK</span>
            <p className="mt-3">
              Himalaya Brightening Vitamin C Bluberry Face Wash-100ml Country of
              Origin: Bangladesh
            </p>

            <div className="d-flex align-items-center mt-4">
              <QuantityBox />
              <Button className="btn-blue btn-lg btn-big btn-round">
                <FaCartShopping />
                &nbsp; Add to Cart
              </Button>
              <Tooltip title="Add To WishList" placement="top">
                <Button className="btn-blue btn-lg btn-big btn-circle ml-4">
                  <FaRegHeart />
                </Button>
              </Tooltip>
              <Tooltip title="Compare" placement="top">
                <Button className="btn-blue btn-lg btn-big btn-circle ml-2">
                  <GoGitCompare />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* ------------------- Product Tabs Section ------------------- */}
        <div className="row mt-5">
          <div className="col-md-12">
            <ul className="nav nav-tabs productTabs">
              <li 
                className={`nav-item ${activeTab === "description" ? "active" : ""}`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </li>
              <li 
                className={`nav-item ${activeTab === "additional" ? "active" : ""}`}
                onClick={() => setActiveTab("additional")}
              >
                Additional Info
              </li>
              <li 
                className={`nav-item ${activeTab === "vendor" ? "active" : ""}`}
                onClick={() => setActiveTab("vendor")}
              >
                Vendor
              </li>
              <li 
                className={`nav-item ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews (3)
              </li>
            </ul>

            <div className="tab-content p-4 border">
              {activeTab === "description" && (
                <div>
                  <p>
                    Himalaya Natural Glow Saffron Face Wash helps to cleanse,
                    brighten, and refresh your skin naturally with saffron
                    extracts. Suitable for daily use.
                  </p>
                  <ul>
                    <li>Type Of Packing: Bottle</li>
                    <li>Color: Green, Pink, Powder Blue, Purple</li>
                    <li>Quantity Per Case: 100ml</li>
                    <li>Ethyl Alcohol: 70%</li>
                    <li>Piece In One: Carton</li>
                  </ul>
                </div>
              )}
              {activeTab === "additional" && (
                <div>
                  <p>Additional product specifications and manufacturing details will go here.</p>
                </div>
              )}
              {activeTab === "vendor" && (
                <div>
                  <p>Sold by: Himalaya Official Store</p>
                  <p>Trusted vendor with 98% positive reviews.</p>
                </div>
              )}
              {activeTab === "reviews" && (
                <div>
                  <h5>Customer Reviews</h5>
                  <div className="reviewBox">
                    <strong>Rahim</strong> ⭐⭐⭐⭐☆
                    <p>Good face wash, really works on oily skin.</p>
                  </div>
                  <div className="reviewBox">
                    <strong>Karim</strong> ⭐⭐⭐⭐⭐
                    <p>Excellent product! Refreshing smell and smooth skin.</p>
                  </div>
                  <div className="reviewBox">
                    <strong>Ayesha</strong> ⭐⭐⭐⭐☆
                    <p>Nice but a bit dry for my skin type.</p>
                  </div>

                  {/* Comment Form */}
                  <div className="commentForm mt-4">
                    <h5>Write a Review</h5>
                    <form onSubmit={handleCommentSubmit}>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control mb-2"
                      />
                      <Rating
                        name="user-rating"
                        value={rating}
                        precision={0.5}
                        onChange={(e, newValue) => setRating(newValue)}
                        className="mb-2"
                      />
                      <textarea
                        rows="4"
                        placeholder="Write your comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="form-control mb-2"
                      ></textarea>
                      <Button type="submit" className="btn-green btn-lg btn-big btn-round">
                        Submit Review
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ------------------- End Tabs Section ------------------- */}
        <br/>
        <RelatedProducts title="RELATED PRODUCTS"/>
        <RelatedProducts title="RECENTLY VIEWED PRODUCTS"/>
      </div>
    </section>
  );
};

export default ProductDetails;

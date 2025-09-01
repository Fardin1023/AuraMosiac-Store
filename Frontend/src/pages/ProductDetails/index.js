import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductZoom from "../../components/ProductZoom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../components/QuantityBox";
import Button from "@mui/material/Button";
import { FaCartShopping } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
import Tooltip from "@mui/material/Tooltip";
import RelatedProducts from "./RelatedProducts";
import RecommendedProducts from "../../components/RecommendedProducts";

const ProductDetails = () => {
  const { id } = useParams(); // get product id from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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

  if (loading) return <p className="text-center">Loading...</p>;
  if (!product) return <p className="text-center">Product not found.</p>;

  return (
    <section className="productDetails section">
      <div className="container">
        <div className="row">
          <div className="col-md-4 pl-5">
            {/* ProductZoom should display product.images */}
            <ProductZoom images={product.images} />
          </div>
          <div className="col-md-7 pl-5 pr-5">
            <h2 className="hd text-capitalize">{product.name}</h2>
            <ul className="list list-inline d-flex align-items-center">
              <li className="list-inline-item">
                <div className="d-flex align-items-center">
                  <span className="text-dark mr-2">Brand :</span>
                  <span>{product.brand || "No Brand"}</span>
                </div>
              </li>
              <li className="list-inline-item ">
                <div className="d-flex align-items-center">
                  <Rating
                    name="read-only"
                    value={product.rating || 0}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <span className="text-dark cursor ml-2">
                    {product.numReviews || 0} REVIEWS
                  </span>
                </div>
              </li>
            </ul>

            <div className="d-flex info mb-2">
              {product.oldPrice && (
                <span className="oldPrice">৳{product.oldPrice}</span>
              )}
              <span className="newPrice text-danger ml-2">
                ৳{product.price}
              </span>
            </div>
            <span className="badge badge-success">
              {product.countInStock > 0 ? "IN STOCK" : "OUT OF STOCK"}
            </span>
            <p className="mt-3">{product.description}</p>

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
                className={`nav-item ${
                  activeTab === "description" ? "active" : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </li>
              <li
                className={`nav-item ${
                  activeTab === "additional" ? "active" : ""
                }`}
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
                Reviews ({product.numReviews || 0})
              </li>
            </ul>

            <div className="tab-content p-4 border">
              {activeTab === "description" && (
                <div>
                  <p>{product.description}</p>
                </div>
              )}
              {activeTab === "additional" && (
                <div>
                  <p>{product.additionalInfo || "No additional info."}</p>
                </div>
              )}
              {activeTab === "vendor" && (
                <div>
                  <p>Sold by: {product.vendor || "Default Vendor"}</p>
                </div>
              )}
              {activeTab === "reviews" && (
                <div>
                  <h5>Customer Reviews</h5>
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev, idx) => (
                      <div key={idx} className="reviewBox">
                        <strong>{rev.name}</strong> ⭐⭐⭐⭐☆
                        <p>{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}

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
                      <Button
                        type="submit"
                        className="btn-green btn-lg btn-big btn-round"
                      >
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
        <br />
        <RelatedProducts title="RELATED PRODUCTS" />
        <RelatedProducts title="RECENTLY VIEWED PRODUCTS" />
        <RecommendedProducts currentProduct={product} />
      </div>
    </section>
  );
};

export default ProductDetails;

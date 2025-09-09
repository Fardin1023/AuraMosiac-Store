import { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductZoom from "../../components/ProductZoom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../components/QuantityBox";
import Button from "@mui/material/Button";
import { FaCartShopping } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
import Tooltip from "@mui/material/Tooltip";
import RelatedProducts from "./RelatedProducts";
import RecommendedProducts from "../../components/RecommendedProducts";
import Swal from "sweetalert2";
import { MyContext } from "../../App";
import {
  getProductReviews,
  addProductReview,
  deleteProductReview,
} from "../../api/api";

const ProductDetails = () => {
  const { id } = useParams(); // get product id from URL
  const navigate = useNavigate();
  const { user, addToCart, addToWishlist, isWishlisted, removeFromWishlist } = useContext(MyContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("description");

  // reviews state
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);

  // add-review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState(""); // kept for UI compatibility; backend uses user name

  const [qty, setQty] = useState(1); // ✅ quantity to add

  /* ---------------- Load product ---------------- */
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

  /* ---------------- Load reviews ---------------- */
  const loadReviews = async () => {
    try {
      const res = await getProductReviews(id);
      const { reviews = [], rating = 0, numReviews = 0 } = res.data || {};
      setReviews(reviews);
      setAvgRating(Number(rating) || 0);
      setNumReviews(Number(numReviews) || 0);
      // reflect aggregate on page top as well
      setProduct((p) => (p ? { ...p, rating, numReviews } : p));
    } catch (e) {
      console.error("Failed to load reviews", e);
      setReviews([]);
      setAvgRating(0);
      setNumReviews(0);
    }
  };

  useEffect(() => {
    if (!id) return;
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ---------------- Helpers ---------------- */
  const myUserId = useMemo(() => user?._id || user?.id || "", [user]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      const ask = await Swal.fire({
        title: "Please sign in to review",
        text: "You need an account to rate & review products.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Sign in / Create account",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });
      if (ask.isConfirmed) navigate("/register");
      return;
    }

    if (!comment.trim() || !rating) {
      Swal.fire("Missing info", "Add a star rating and a short comment.", "warning");
      return;
    }

    try {
      const res = await addProductReview(id, { rating, comment: comment.trim() });
      // update aggregates from response
      if (res.data) {
        setAvgRating(Number(res.data.rating) || 0);
        setNumReviews(Number(res.data.numReviews) || 0);
        setProduct((p) => (p ? { ...p, rating: res.data.rating, numReviews: res.data.numReviews } : p));
      }
      setRating(0);
      setComment("");
      await loadReviews();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Thanks! Your review was posted",
        showConfirmButton: false,
        timer: 1600,
      });
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Could not submit your review.";
      Swal.fire("Oops", msg, "error");
    }
  };

  const handleDeleteReview = async (rid) => {
    const ask = await Swal.fire({
      title: "Delete your review?",
      text: "This can’t be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (!ask.isConfirmed) return;

    try {
      const res = await deleteProductReview(id, rid);
      if (res.data) {
        setAvgRating(Number(res.data.rating) || 0);
        setNumReviews(Number(res.data.numReviews) || 0);
        setProduct((p) => (p ? { ...p, rating: res.data.rating, numReviews: res.data.numReviews } : p));
      }
      await loadReviews();
      Swal.fire("Removed", "Your review was deleted.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not remove review.", "error");
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const ok = addToCart(product, qty || 1); // returns false if gated
    if (!ok) return;

    const displayImage =
      (Array.isArray(product.images) && product.images[0]) ||
      product.thumbnail ||
      product.image ||
      "";

    // 🎉 pretty alert
    Swal.fire({
      title: "Added to cart!",
      html: `
        <div style="display:flex;gap:12px;align-items:center">
          <img src="${displayImage}" alt="" style="width:64px;height:64px;border-radius:8px;object-fit:cover" />
          <div style="text-align:left">
            <div style="font-weight:600;margin-bottom:4px;">
              ${product.name || product.title || "Product"}
            </div>
            <div>Qty: ${qty || 1} • ৳${((Number(product.price) || 0) * (qty || 1)).toFixed(2)}</div>
          </div>
        </div>
      `,
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Continue shopping",
      cancelButtonText: "Go to cart",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
      },
    }).then((res) => {
      if (res.dismiss === Swal.DismissReason.cancel) {
        navigate("/cart");
      }
    });
  };

  const handleAddToWishlist = () => {
    if (!product) return;

    const pid =
      product._id || product.id || product.productId || product.slug || String(product.name);
    const already = isWishlisted(pid);

    if (!already) {
      const added = addToWishlist(product); // returns false if gated
      if (!added) return;

      const displayImage =
        (Array.isArray(product.images) && product.images[0]) ||
        product.thumbnail ||
        product.image ||
        "";

      Swal.fire({
        title: "Added to wishlist ❤️",
        html: `
          <div style="display:flex;gap:12px;align-items:center">
            <img src="${displayImage}" alt="" style="width:64px;height:64px;border-radius:8px;object-fit:cover" />
            <div style="text-align:left">
              <div style="font-weight:600;margin-bottom:4px;">
                ${product.name || product.title || "Product"}
              </div>
              <div>৳${Number(product.price || 0).toFixed(2)}</div>
            </div>
          </div>
        `,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Continue shopping",
        cancelButtonText: "Go to wishlist",
        reverseButtons: true,
        customClass: { popup: "rounded-2xl" },
      }).then((res) => {
        if (res.dismiss === Swal.DismissReason.cancel) {
          navigate("/wishlist");
        }
      });
    } else {
      // Toggle off with confirmation
      Swal.fire({
        title: "Remove from wishlist?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Remove",
      }).then((r) => {
        if (r.isConfirmed) {
          removeFromWishlist(pid);
          Swal.fire("Removed!", "", "success");
        }
      });
    }
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
                    value={avgRating || product.rating || 0}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <span className="text-dark cursor ml-2">
                    {numReviews || product.numReviews || 0} REVIEWS
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
              <QuantityBox value={qty} onChange={setQty} />
              <Button className="btn-blue btn-lg btn-big btn-round" onClick={handleAddToCart}>
                <FaCartShopping />
                &nbsp; Add to Cart
              </Button>

              {/* ❤️ Wishlist */}
              <Tooltip title="Add To WishList" placement="top">
                <Button className="btn-blue btn-lg btn-big btn-circle ml-4" onClick={handleAddToWishlist}>
                  {isWishlisted(product._id || product.id) ? <FaHeart /> : <FaRegHeart />}
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
                Reviews ({numReviews || product.numReviews || 0})
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

                  {reviews && reviews.length > 0 ? (
                    reviews.map((rev) => {
                      const isMine = myUserId && String(rev.user) === String(myUserId);
                      return (
                        <div key={rev._id} className="reviewBox" style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
                          <div className="d-flex align-items-center">
                            <strong className="mr-2">{rev.name || "User"}</strong>
                            {rev.verifiedPurchase && (
                              <span className="badge badge-success ml-1">Verified Purchase</span>
                            )}
                            <span className="text-muted ml-2" style={{ fontSize: 12 }}>
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
                            </span>
                            {isMine && (
                              <Button
                                className="btn-outline-danger btn-xs ml-auto"
                                onClick={() => handleDeleteReview(rev._id)}
                                title="Delete your review"
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                          <Rating value={Number(rev.rating) || 0} readOnly size="small" precision={0.5} />
                          {rev.comment && <p className="mb-0 mt-1">{rev.comment}</p>}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted">No reviews yet.</p>
                  )}

                  {/* Comment Form */}
                  <div className="commentForm mt-4">
                    <h5>Write a Review</h5>

                    {!user ? (
                      <div className="alert alert-info d-flex align-items-center" role="alert">
                        <span>You need an account to review. </span>
                        <Button className="btn-blue btn-round ml-2" onClick={() => navigate("/register")}>
                          Sign in / Register
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleCommentSubmit}>
                        {/* name is optional visually; backend uses authenticated user */}
                        <input
                          type="text"
                          placeholder="Your Name (optional)"
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
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ------------------- End Tabs Section ------------------- */}
        <br />

        {/* ✅ Related */}
        <RelatedProducts
          title="RELATED PRODUCTS"
          currentProduct={product}
          categoryId={product?.category?._id}
          excludeId={product?._id}
        />

        <RelatedProducts title="RECENTLY VIEWED PRODUCTS" mode="recent" />

        <RecommendedProducts currentProduct={product} />
      </div>
    </section>
  );
};

export default ProductDetails;

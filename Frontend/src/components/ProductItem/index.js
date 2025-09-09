import Rating from "@mui/material/Rating";
import { BsArrowsFullscreen } from "react-icons/bs";
import Button from "@mui/material/Button";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useContext } from "react";
import { MyContext } from "../../App";
import Swal from "sweetalert2";

const ProductItem = ({ product, data, item, itemView }) => {
  const { setSelectedProduct, setisOpenProductModal, addToWishlist, removeFromWishlist, isWishlisted } =
    useContext(MyContext);

  // accept product via any prop shape without breaking existing usage
  const p = product || data || item || {};

  const id = p._id || p.id;
  const name = p.name || p.title || "Unnamed Product";
  const image =
    (Array.isArray(p.images) && p.images[0]) ||
    p.thumbnail ||
    p.image ||
    "https://via.placeholder.com/400x400?text=No+Image";

  const price = Number(
    p.price != null ? p.price : p.newPrice != null ? p.newPrice : 0
  );
  const oldPrice = p.oldPrice != null ? Number(p.oldPrice) : undefined;

  const computedDiscount =
    oldPrice && price && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;
  const discount = p.discount != null ? Number(p.discount) : computedDiscount;

  const inStock =
    typeof p.countInStock === "number"
      ? p.countInStock > 0
      : p.stock > 0 || !!p.inStock;

  const ratingRaw =
    p.rating != null
      ? Number(p.rating)
      : p.ratings != null
      ? Number(p.ratings)
      : p.averageRating != null
      ? Number(p.averageRating)
      : 0;

  const rating = isNaN(ratingRaw) ? 0 : Math.max(0, Math.min(5, ratingRaw));

  const numReviews =
    p.numReviews != null
      ? Number(p.numReviews)
      : Array.isArray(p.reviews)
      ? p.reviews.length
      : undefined;

  const money = (v) =>
    isNaN(Number(v)) ? "0" : Number(v).toFixed(2).replace(/\.00$/, "");

  const viewProductDetails = () => {
    if (id) {
      window.location.href = `/product/${id}`;
    } else {
      setSelectedProduct(p);
      setisOpenProductModal(true);
    }
  };

  const wished = isWishlisted(id);

  const toggleWishlist = () => {
    if (!id) return;
    if (wished) {
      removeFromWishlist(id);
    } else {
      const ok = addToWishlist(p); // returns false if gated
      if (!ok) return;
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Added to wishlist",
        showConfirmButton: false,
        timer: 1400,
      });
    }
  };

  return (
    <div className={`item productItem ${itemView || ""}`}>
      <div className="imgWrapper">
        <img src={image} alt={name} className="w-100" />

        {discount ? <span className="badge badge-primary">{discount}%</span> : null}

        <div className="actions">
          <Button onClick={viewProductDetails}>
            <BsArrowsFullscreen />
          </Button>
          <Button onClick={toggleWishlist} className={wished ? "active" : ""} aria-label="Add to wishlist">
            {wished ? <FaHeart /> : <FaRegHeart />}
          </Button>
        </div>
      </div>

      <div className="info">
        <h4>{name}</h4>

        <span className={inStock ? "text-success d-block" : "text-danger d-block"}>
          {inStock ? "In Stock" : "Out of Stock"}
        </span>

        <div className="d-flex align-items-center">
          <Rating
            className="mt-2 mb-2"
            name="read-only"
            value={rating}
            readOnly
            size="small"
            precision={0.5}
          />
          {numReviews != null && <small className="text-muted ml-2">({numReviews})</small>}
        </div>

        <div className="d-flex align-items-center">
          {oldPrice != null && oldPrice > price && (
            <span className="oldPrice">৳{money(oldPrice)}</span>
          )}
          <span className={`newPrice text-danger ${oldPrice ? "ml-2" : ""}`}>
            ৳{money(price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;

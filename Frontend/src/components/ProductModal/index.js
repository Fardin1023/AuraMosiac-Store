import Button from "@mui/material/Button";
import { IoCloseSharp } from "react-icons/io5";
import Dialog from "@mui/material/Dialog";
import Rating from "@mui/material/Rating";
import { useContext } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import QuantityBox from "../QuantityBox";
import { MyContext } from "../../App";
import ProductZoom from "../ProductZoom";
import { IoMdCart } from "react-icons/io";

const ProductModal = (props) => {
  const {
    selectedProduct,
    setisOpenProductModal,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    user,
    promptLogin
  } = useContext(MyContext);

  // ✅ Get product either from props or context
  const product = props.product || selectedProduct;

  if (!product) return null; // prevent errors if no product selected

  const id =
    product._id || product.id || product.productId || product.slug || String(product.name);
  const wished = isWishlisted(id);

  const toggleWishlist = () => {
    if (!id) return;
    if (!user) {
      promptLogin && promptLogin("Wishlist");
      return;
    }
    if (wished) removeFromWishlist(id);
    else addToWishlist(product);
  };

  return (
    <Dialog
      open={true}
      className="productModal"
      onClose={() => setisOpenProductModal(false)}
    >
      {/* Close Button */}
      <Button
        className="close_"
        onClick={() => setisOpenProductModal(false)}
      >
        <IoCloseSharp />
      </Button>

      {/* Title */}
      <h4 className="mb-1 font-weight-bold">{product.name}</h4>

      {/* Brand + Rating */}
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center mr-4">
          <span>Brand:</span>
          <span className="ml-2">
            <b>{product.brand || "N/A"}</b>
          </span>
        </div>

        <Rating
          name="read-only"
          value={product.rating || 0}
          readOnly
          size="small"
          precision={0.5}
        />
      </div>

      <hr />

      {/* Product Content */}
      <div className="row mt-2 productDetailModal">
        {/* Product Image (Zoom Component) */}
        <div className="col-md-5">
          {/* ✅ Pass images into ProductZoom */}
          <ProductZoom images={product.images} />
        </div>

        {/* Product Info */}
        <div className="col-md-7">
          <div className="d-flex info align-items-center mb-3">
            {/* ✅ oldPrice (crossed) */}
            {product.oldPrice && (
              <span className="oldPrice lg mr-2">৳{product.oldPrice}</span>
            )}
            {/* ✅ newPrice (main) */}
            <span className="newPrice text-danger lg">৳{product.newPrice ?? product.price}</span>
          </div>

          {/* ✅ Stock status */}
          <span
            className={`badge ${product.inStock ? "bg-success" : "bg-danger"}`}
          >
            {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
          </span>

          <p className="mt-3">{product.description}</p>

          {/* Quantity + Add to Cart */}
          <div className="d-flex align-items-center">
            <QuantityBox />
            <Button
              className="btn-blue btn-lg btn-big"
              disabled={!product.inStock} // ✅ Disable if out of stock
            >
              <IoMdCart /> &nbsp; Add To Cart
            </Button>
          </div>

          {/* Wishlist + Compare */}
          <div className="d-flex align-items-center mt-3 actions mt-5">
            <Button className="btn-round btn-sml" variant="outlined" onClick={toggleWishlist}>
              {wished ? <><FaHeart /> &nbsp; IN WISHLIST</> : <><FaRegHeart /> &nbsp; ADD TO WISHLIST</>}
            </Button>
            <Button className="btn-round btn-sml ml-3" variant="outlined">
              <FaCodeCompare /> &nbsp; COMPARE
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductModal;

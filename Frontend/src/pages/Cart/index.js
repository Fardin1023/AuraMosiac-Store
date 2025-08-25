import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../components/QuantityBox";
import { IoClose } from "react-icons/io5";
import Button from "@mui/material/Button";
import { IoMdCart } from "react-icons/io";

const Cart = () => {
  return (
    <>
      <section className="section cartPage">
        <div className="container">
           <h2 className="hd mb-0">Your Cart</h2>
              <p>
                There are <b>3</b> products in your cart
              </p>
          <div className="row">
            <div className="col-md-9 pr-5">
              <div className="table-responsive">
  <table className="table">
    <thead>
      <tr>
        <th width="30%">Product</th>
        <th>Price</th>
        <th >Quantity</th>
        <th>Subtotal</th>
        <th>Remove</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td >
          <Link to="/product/1">
            <div className="d-flex align-items-center cartItemimgWrapper">
              <div className="imgWrapper">
                <img
                  src="https://bk.shajgoj.com/storage/2025/07/32568.jpg"
                  alt="/"
                  className="w-100"
                />
              </div>

              <div className="info px-3">
                <h6>Himalaya Brightening  Face Wash</h6>
                <Rating
                  name="read-only"
                  value={3.5}
                  precision={0.5}
                  size="small"
                  readOnly
                />
              </div>
            </div>
          </Link>
        </td>
        <td >৳99.00</td>
        <td ><QuantityBox /></td>
        <td >৳99.00</td>
        <td>
          <span className="remove"><IoClose /></span>
        </td>
      </tr>
      <tr>
        <td >
          <Link to="/product/1">
            <div className="d-flex align-items-center cartItemimgWrapper">
              <div className="imgWrapper">
                <img
                  src="https://bk.shajgoj.com/storage/2025/07/32568.jpg"
                  alt="/"
                  className="w-100"
                />
              </div>

              <div className="info px-3">
                <h6>Himalaya Brightening  Face Wash</h6>
                <Rating
                  name="read-only"
                  value={3.5}
                  precision={0.5}
                  size="small"
                  readOnly
                />
              </div>
            </div>
          </Link>
        </td>
        <td >৳99.00</td>
        <td ><QuantityBox /></td>
        <td >৳99.00</td>
        <td>
          <span className="remove"><IoClose /></span>
        </td>
      </tr>
      <tr>
        <td >
          <Link to="/product/1">
            <div className="d-flex align-items-center cartItemimgWrapper">
              <div className="imgWrapper">
                <img
                  src="https://bk.shajgoj.com/storage/2025/07/32568.jpg"
                  alt="/"
                  className="w-100"
                />
              </div>

              <div className="info px-3">
                <h6>Himalaya Brightening  Face Wash</h6>
                <Rating
                  name="read-only"
                  value={3.5}
                  precision={0.5}
                  size="small"
                  readOnly
                />
              </div>
            </div>
          </Link>
        </td>
        <td >৳99.00</td>
        <td ><QuantityBox /></td>
        <td >৳99.00</td>
        <td>
          <span className="remove"><IoClose /></span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

            </div>
            <div className="col-md-3">
              <div className="card border shadow p-3 cartDetails">
                <h4>CART SUMMARY</h4>
                <div className="d-flex align-items-center mb-3">
                  <span>Total Cash </span>
                  <span className="ml-auto text-red font-weight-bold">৳99.00 </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Shipping </span>
                  <span className="ml-auto"><b>Free</b></span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Estimate for </span>
                  <span className="ml-auto"><b>Cumilla</b> </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Grand-Total </span>
                  <span className="ml-auto text-red font-weight-bold">৳99.00 </span>
                </div>

                <Button className="btn-blue btn-lg btn-big "><IoMdCart />&nbsp;Add To Cart</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Cart;

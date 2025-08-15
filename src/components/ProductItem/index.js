import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { BsArrowsFullscreen } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";



const ProductItem = () => {
  return (
    <div className="item productItem">
                      <div className="imgWrapper">
                        <img
                          src="https://bk.shajgoj.com/storage/2025/01/ng-saffron-fw-02-min.jpg"
                          alt="p1"
                          className="w-100"
                        />
                        <span className="badge badge-primary">50%</span>
                        <div className="actions">
                            <Button><BsArrowsFullscreen /> </Button>
                            <Button><FaRegHeart style={{ fontSize: "20px" }} /> </Button>
                        </div>
                      </div>
                     <div className="info">
                         <h4>Himalaya Natural Glow Saffron Face Wash</h4>
                      <span className="text-danger d-block">In Stock</span>
                      <Rating className="mt-2 mb-2" name="read-only" value={4} readOnly size="small" precision={0.5}/>
                      <div className="d-flex">
                            <span className="oldPrice">৳225.00</span>
                            <span className="newPrice text-danger ml-2">৳115.00</span>
                        </div>
                     </div>
                    </div>
  )
}

export default ProductItem;


import Button from "@mui/material/Button";
import { IoCloseSharp } from "react-icons/io5";
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';
import { useContext} from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import QuantityBox from "../QuantityBox";
import { MyContext } from "../../App";
import ProductZoom from "../ProductZoom";
import { IoMdCart } from "react-icons/io";

const ProductModal=(props)=>{

  
  const context=useContext(MyContext);

  return(
    <>
     <Dialog open={true} className="productModal" onClose={()=>context.setisOpenProductModal(false)}>
            <Button className="close_" onClick={()=>context.setisOpenProductModal(false)}><IoCloseSharp /></Button>
            <h4 class="mb-1 font-weight-bold">Himalaya Brightening Vitamin C Strawberry Face Wash</h4>
            <div className="d-flex align-items-center">
             <div className="d-flex align-items-center mr-4">
               <span>Brands:</span>
              <span className="ml-2"><b>Himalaya</b></span>
             </div>


              <Rating name="read-only" value={5} readOnly size="small"  precision={0.5} />
            </div>
           
           <hr/>
           <div className="row mt-2 productDetailModal">
              <div className="col-md-5">
                <ProductZoom/>
              </div>
               <div className="col-md-7">
                <div className="d-flex info align-items-center mb-3">
                  <span className="oldPrice lg mr-2">৳200.00</span>
                  <span className="newPrice text-danger lg">৳99.00</span>
                </div>
                <span className="badge bg-success">IN STOCK</span>
                <p className="mt-3">Himalaya Brightening Vitamin C Bluberry Face Wash-100ml Country of Origin: Bangladesh.</p>
                <div className="d-flex align-items-center">
               <QuantityBox/>
                 <Button className="btn-blue btn-lg btn-big "><IoMdCart />&nbsp;Add To Cart</Button>
                </div>

                <div className="d-flex align-items-center mt-3 actions mt-5">
                  <Button className="btn-round btn-sml" variant="outlined"><FaRegHeart />&nbsp;ADD TO WHISHLIST</Button>
                  <Button className="btn-round btn-sml ml-3" variant="outlined"><FaCodeCompare />&nbsp;COMPARE</Button>
                </div>
               </div>
           </div>
           
          </Dialog></>

  )
}
export default ProductModal;
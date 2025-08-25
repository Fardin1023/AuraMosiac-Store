import Rating from "@mui/material/Rating";
import { BsArrowsFullscreen } from "react-icons/bs";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { useContext} from "react";
import { MyContext } from "../../App";


const ProductItem =()=>{

  const context=useContext(MyContext);
  const viewProductDetails=(id)=>{
    context.setisOpenProductModal(true);
  }

  

  
  return(
    <>
      <div className="item productItem">
      <div className="imgWrapper">
        <img src="https://bk.shajgoj.com/storage/2025/07/32567.jpg" alt="p1"className="w-100"/>

        <span className="badge badge-primary">51%</span>

        <div className="actions">
          <Button onClick={()=>viewProductDetails(1)}><BsArrowsFullscreen /></Button>
          <Button><FaRegHeart /></Button>
          </div>
      </div>

      <div className="info">
        <h4>Himalaya Brightening Vitamin C Strawberry Face Wash</h4>
        <span className="text-success d-block">In Stock</span>
        <Rating className="mt-2 mb-2" name="read-only" value={5} readOnly size="small" precision={0.5}/>

        <div className="d-flex"></div>
        <span className="oldPrice">৳200.00</span>
        <span className="newPrice text-danger ml-2">৳99.00</span>
      </div>
    </div>
    

    {/*<ProductModal/>*/}
    </>
  )

}
export default ProductItem;
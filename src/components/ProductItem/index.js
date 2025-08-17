import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { BsArrowsFullscreen } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { useContext } from "react";
import { MyContext } from "../../App";

const ProductItem = () => {
  const context = useContext(MyContext);

  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };

  return (
    <>
      <div className="item productItem">
        <div className="imgWrapper">
          <img
            src="https://bk.shajgoj.com/storage/2025/01/ng-saffron-fw-02-min.jpg"
            alt="p1"
            className="w-100"
          />
          <span className="badge badge-primary">50%</span>
          <div className="actions">
            <Button onClick={() => viewProductDetails(1)}>
              <BsArrowsFullscreen />{" "}
            </Button>
            <Button>
              <FaRegHeart style={{ fontSize: "20px" }} />{" "}
            </Button>
          </div>
        </div>
        <div className="info">
          <h4>Himalaya Natural Glow Saffron Face Wash</h4>
          <span className="text-danger d-block">In Stock</span>
          <Rating
            className="mt-2 mb-2"
            name="read-only"
            value={4}
            readOnly
            size="small"
            precision={0.5}
          />
          <div className="d-flex">
            <span className="oldPrice">৳225.00</span>
            <span className="newPrice text-danger ml-2">৳115.00</span>
          </div>
        </div>
      </div>

      {/*<ProductModal/>*/}
    </>
  );
};

export default ProductItem;

export const ProductItem2 = () => {
  const context = useContext(MyContext);

  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://bk.shajgoj.com/storage/2018/05/Skin-Cafe-Aloe-Vera-Gel.jpg"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">15%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(2)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Skin Cafe Pure & Natural Aloe Vera gel</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳500.00</span>
          <span className="newPrice text-danger ml-2">৳425.00</span>
        </div>
      </div>
    </div>
  );
};

export const ProductItem3 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };

  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://bk.shajgoj.com/storage/2022/07/Rajkonna-Light-Moisturizer-With-Rice-Water-And-Licorice-Extract-1.jpg"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">44%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(3)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Hydration Combo (Moisturizer + Skin Cafe Aloe Vera Gel)</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳795.00</span>
          <span className="newPrice text-danger ml-2">৳449.00</span>
        </div>
      </div>
    </div>
  );
};

export const ProductItem4 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://www.handicraftsbd.com/assets/admin/img/products/small/9151831579.jpg"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">28%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(4)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Clay made water mug</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳365.00</span>
          <span className="newPrice text-danger ml-2">৳160</span>
        </div>
      </div>
    </div>
  );
};
export const ProductItem5 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://www.handicraftsbd.com/assets/admin/img/products/small/4154690224.jpg"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">40%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(5)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>মাল্টি কালার কুরুশের তৈরি শোল্ডার ব্যাগ</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳2500.00</span>
          <span className="newPrice text-danger ml-2">৳1400</span>
        </div>
      </div>
    </div>
  );
};
export const ProductItem6 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://www.hostoshilpo.com/wp-content/uploads/2025/01/58543492_2658794801013427_5737934741038956544_n-700x525.jpg"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">8%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(6)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Nakshi Katha Black Color</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳2,650.00</span>
          <span className="newPrice text-danger ml-2">৳2,450.00</span>
        </div>
      </div>
    </div>
  );
};
export const ProductItem7 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://i0.wp.com/www.satvai.com/wp-content/uploads/2025/06/AMS1924_03.webp?w=800&ssl=1"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">5%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(7)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Fiberglass Planters-Stylish Model</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳5000.00</span>
          <span className="newPrice text-danger ml-2">৳৳ 4,300.00</span>
        </div>
      </div>
    </div>
  );
};
export const ProductItem8 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://i0.wp.com/www.satvai.com/wp-content/uploads/2025/01/20140213_090157_225x225-1.jpg?w=225&ssl=1"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">6%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(8)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Golden Shower Flower Plant</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳600.00</span>
          <span className="newPrice text-danger ml-2">৳480.00</span>
        </div>
      </div>
    </div>
  );
};
export const ProductItem9 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://i0.wp.com/www.satvai.com/wp-content/uploads/2025/06/81OOlt9mt6L._AC_UF350350_QL80_DpWeblab_.jpg?w=350&ssl=1"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">15%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(9)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Fiberglass Planters-Stylish Model</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳4600.00</span>
          <span className="newPrice text-danger ml-2">3,600.00</span>
        </div>
      </div>
    </div>
  );
};
export const ProductItem10 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://i0.wp.com/www.satvai.com/wp-content/uploads/2019/08/images-9.jpg?w=225&ssl=1"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">25%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(10)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Bromeliad orchid</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳900.00</span>
          <span className="newPrice text-danger ml-2">৳ 650.00</span>
        </div>
      </div>
    </div>
  );
};
export const ProductItem11 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://i0.wp.com/www.satvai.com/wp-content/uploads/2024/10/download-17.jpg?fit=225%2C225&ssl=1"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">48%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(11)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>China Doll Tree Indoor</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳1600.00</span>
          <span className="newPrice text-danger ml-2">৳880.00</span>
        </div>
      </div>
    </div>
  );
};
export const ProductItem12 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://www.upoharbd.com/images/uploads/Handycraft/hc_34_Gorur_gari.jpg"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">12%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(12)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Gorur gari</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳4600.00</span>
          <span className="newPrice text-danger ml-2">৳3,142.73</span>
        </div>
      </div>
    </div>
  );
};
export const ProductItem13 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://www.upoharbd.com/images/uploads/Handycraft/frame_3..jpg"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">5%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(13)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Home photo frame</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳6000.00</span>
          <span className="newPrice text-danger ml-2">৳5,460.92</span>
        </div>
      </div>
    </div>
  );
};
export const ProductItem14 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://www.upoharbd.com/images/uploads/Handycraft/deer_m.jpg"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">10%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(14)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Metal Deer Showpiece</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳4000.00</span>
          <span className="newPrice text-danger ml-2">৳3,174.81</span>
        </div>
      </div>
    </div>
  );
};
export const ProductItem15 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://bk.shajgoj.com/storage/2024/03/Cosrx-AHABHA-Clarifying-Treatment-Toner.jpg"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">25%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(15)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Cosrx AHA/BHA Clarifying Treatment Toner</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳৳950.00</span>
          <span className="newPrice text-danger ml-2">৳715.00</span>
        </div>
      </div>
    </div>
  );
};
export const ProductItem16 = () => {
  const context = useContext(MyContext);
  const viewProductDetails = (id) => {
    context.setProductId(id);
    context.setisOpenProductModal(true);
  };
  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img
          src="https://bk.shajgoj.com/storage/2023/11/Tocobo-Vita-Berry-Pore-Toner1-1.jpg"
          alt="p1"
          className="w-100"
        />
        <span className="badge badge-primary">8%</span>
        <div className="actions">
          <Button onClick={() => viewProductDetails(16)}>
            <BsArrowsFullscreen />{" "}
          </Button>
          <Button>
            <FaRegHeart style={{ fontSize: "20px" }} />{" "}
          </Button>
        </div>
      </div>
      <div className="info">
        <h4>Tocobo Vita Berry Pore Toner</h4>
        <span className="text-danger d-block">In Stock</span>
        <Rating
          className="mt-2 mb-2"
          name="read-only"
          value={4}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          <span className="oldPrice">৳2000.00</span>
          <span className="newPrice text-danger ml-2">৳1850.00</span>
        </div>
      </div>
    </div>
  );
};



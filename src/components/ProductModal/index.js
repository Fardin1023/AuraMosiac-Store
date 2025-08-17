import React, { useContext, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { IoCloseSharp } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import Slider from "react-slick";
import "react-inner-image-zoom/lib/styles.min.css";
import InnerImageZoom from "react-inner-image-zoom";
import QuantityBox from "../QuantityBox";
import { FaRegHeart } from "react-icons/fa6";
import { IoMdGitCompare } from "react-icons/io";
import { MyContext } from "../../App";

const products = {
  1: {
    name: "Himalaya Natural Glow Saffron Face Wash",
    brand: "Himalaya",
    oldPrice: "৳225.00",
    newPrice: "৳115.00",
    discount: "50%",
    description:
      "Himalaya’s Natural Glow Saffron Face Wash is a soap-free, formulation that brightens and rejuvenates your skin.",
    images: [
      "https://bk.shajgoj.com/storage/2025/01/ng-saffron-fw-03-min.jpg",
      "https://bk.shajgoj.com/storage/2025/01/ng-saffron-fw-01-min.jpg",
      "https://bk.shajgoj.com/storage/2025/07/27095.jpg",
    ],
  },
  2: {
    name: "Skin Cafe Pure & Natural Aloe Vera gel",
    brand: "Skin Cafe",
    oldPrice: "৳500.00",
    newPrice: "৳425.00",
    discount: "15%",
    description: "Pure and natural Aloe Vera gel for skin hydration and soothing.",
    images: ["https://bk.shajgoj.com/storage/2018/05/Skin-Cafe-Aloe-Vera-Gel.jpg"],
  },
  3: {
    name: "Hydration Combo (Moisturizer + Skin Cafe Aloe Vera Gel)",
    brand: "Various",
    oldPrice: "৳795.00",
    newPrice: "৳449.00",
    discount: "44%",
    description:
      "Combo pack for hydration (Moisturizer + Skin Cafe Aloe Vera Gel).",
    images: [
      "https://bk.shajgoj.com/storage/2022/07/Rajkonna-Light-Moisturizer-With-Rice-Water-And-Licorice-Extract-1.jpg",
    ],
  },
  4: {
    name: "Clay made water mug",
    brand: "Handicraft",
    oldPrice: "৳365.00",
    newPrice: "৳160",
    discount: "28%",
    description: "Handmade clay water mug.",
    images: [
      "https://www.handicraftsbd.com/assets/admin/img/products/small/9151831579.jpg",
    ],
  },
  5: {
    name: "মাল্টি কালার কুরুশের তৈরি শোল্ডার ব্যাগ",
    brand: "Handicraft",
    oldPrice: "৳2500.00",
    newPrice: "৳1400",
    discount: "40%",
    description: "Multi color kurush shoulder bag.",
    images: [
      "https://www.handicraftsbd.com/assets/admin/img/products/small/4154690224.jpg",
    ],
  },
  6: {
    name: "Nakshi Katha Black Color",
    brand: "Handicraft",
    oldPrice: "৳2,650.00",
    newPrice: "৳2,450.00",
    discount: "8%",
    description: "Nakshi Katha black color textile.",
    images: [
      "https://www.hostoshilpo.com/wp-content/uploads/2025/01/58543492_2658794801013427_5737934741038956544_n-700x525.jpg",
    ],
  },
  7: {
    name: "Fiberglass Planters-Stylish Model",
    brand: "Satvai",
    oldPrice: "৳5000.00",
    newPrice: "৳৳ 4,300.00",
    discount: "5%",
    description: "Stylish fiberglass planter.",
    images: [
      "https://i0.wp.com/www.satvai.com/wp-content/uploads/2025/06/AMS1924_03.webp?w=800&ssl=1",
    ],
  },
  8: {
    name: "Golden Shower Flower Plant",
    brand: "Satvai",
    oldPrice: "৳600.00",
    newPrice: "৳480.00",
    discount: "6%",
    description: "Golden shower (Cassia) plant.",
    images: [
      "https://i0.wp.com/www.satvai.com/wp-content/uploads/2025/01/20140213_090157_225x225-1.jpg?w=225&ssl=1",
    ],
  },
  9: {
    name: "Fiberglass Planters-Stylish Model",
    brand: "Satvai",
    oldPrice: "৳4600.00",
    newPrice: "৳3,600.00",
    discount: "15%",
    description: "Another fiberglass planter model.",
    images: [
      "https://i0.wp.com/www.satvai.com/wp-content/uploads/2025/06/81OOlt9mt6L._AC_UF350350_QL80_DpWeblab_.jpg?w=350&ssl=1",
    ],
  },
  10: {
    name: "Bromeliad orchid",
    brand: "Plant",
    oldPrice: "৳900.00",
    newPrice: "৳ 650.00",
    discount: "25%",
    description: "Bromeliad orchid plant.",
    images: [
      "https://i0.wp.com/www.satvai.com/wp-content/uploads/2019/08/images-9.jpg?w=225&ssl=1",
    ],
  },
  11: {
    name: "China Doll Tree Indoor",
    brand: "Plant",
    oldPrice: "৳1600.00",
    newPrice: "৳880.00",
    discount: "48%",
    description: "China doll tree for indoor decoration.",
    images: [
      "https://i0.wp.com/www.satvai.com/wp-content/uploads/2024/10/download-17.jpg?fit=225%2C225&ssl=1",
    ],
  },
  12: {
    name: "Gorur gari",
    brand: "Handicraft",
    oldPrice: "৳4600.00",
    newPrice: "৳3,142.73",
    discount: "12%",
    description: "Handicraft gorur gari.",
    images: [
      "https://www.upoharbd.com/images/uploads/Handycraft/hc_34_Gorur_gari.jpg",
    ],
  },
  13: {
    name: "Home photo frame",
    brand: "Handicraft",
    oldPrice: "৳6000.00",
    newPrice: "৳5,460.92",
    discount: "5%",
    description: "Wooden home photo frame.",
    images: [
      "https://www.upoharbd.com/images/uploads/Handycraft/frame_3..jpg",
    ],
  },
  14: {
    name: "Metal Deer Showpiece",
    brand: "Handicraft",
    oldPrice: "৳4000.00",
    newPrice: "৳3,174.81",
    discount: "10%",
    description: "Metal deer showpiece for home decor.",
    images: [
      "https://www.upoharbd.com/images/uploads/Handycraft/deer_m.jpg",
    ],
  },
  15: {
    name: "Cosrx AHA/BHA Clarifying Treatment Toner",
    brand: "Cosrx",
    oldPrice: "৳950.00",
    newPrice: "৳715.00",
    discount: "25%",
    description:
      "Cosrx AHA/BHA Clarifying Treatment Toner for clearer pores.",
    images: [
      "https://bk.shajgoj.com/storage/2024/03/Cosrx-AHABHA-Clarifying-Treatment-Toner.jpg",
    ],
  },
  16: {
    name: "Tocobo Vita Berry Pore Toner",
    brand: "Tocobo",
    oldPrice: "৳2000.00",
    newPrice: "৳1850.00",
    discount: "8%",
    description: "Vita berry pore toner.",
    images: [
      "https://bk.shajgoj.com/storage/2023/11/Tocobo-Vita-Berry-Pore-Toner1-1.jpg",
    ],
  },
};

const ProductModal = () => {
  const zoomSliderBig = useRef();
  const zoomSlider = useRef();

  const context = useContext(MyContext);
  const product = products[context.productId];
  if (!product) return null;

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    fade: false,
    arrows: true,
  };
  var settings2 = {
    dots: false,
    infinite: false,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    arrows: false,
  };
  const goto = (index) => {
    if (zoomSlider.current) zoomSlider.current.slickGoTo(index);
    if (zoomSliderBig.current) zoomSliderBig.current.slickGoTo(index);
  };

  return (
    <Dialog
      open={context.isOpenProductModal}
      className="productModal"
      onClose={() => context.setisOpenProductModal(false)}
    >
      <Button
        className="close_"
        onClick={() => context.setisOpenProductModal(false)}
      >
        <IoCloseSharp />
      </Button>
      <h4 className="mb-1 font-weight-bold">{product.name}</h4>
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center mr-4">
          <span>Brands:</span>
          <span className="ml-2">
            <b>{product.brand}</b>
          </span>
        </div>

        <Rating
          name="read-only"
          value={3}
          size="small"
          precision={0.5}
          readOnly
        />
      </div>
      <hr />
      <div className="row mt-2 productDetaileModal">
        <div className="col-md-5">
          <div className="productZoom position-relative">
            <div className="badge badge-primary">{product.discount}</div>
            <Slider {...settings2} className="zoomSliderBig" ref={zoomSliderBig}>
              {product.images.map((img, i) => (
                <div className="item" key={i}>
                  <InnerImageZoom zoomType="hover" zoomScale={1} src={img} />
                </div>
              ))}
            </Slider>
          </div>
          <Slider {...settings} className="zoomSlider" ref={zoomSlider}>
            {product.images.map((img, i) => (
              <div className="item" key={i}>
                <img
                  src={img}
                  alt="pro"
                  className="w-100"
                  onClick={() => goto(i)}
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="col-md-7 d-flex align-items-start justify-content-start">
          <div className="info text-left">
            <span className="oldPrice lg">{product.oldPrice}</span>
            <span className="newPrice text-danger lg ml-2">
              {product.newPrice}
            </span>
          </div>
          <span className="badge bg-success">IN STOCK</span>
          <p className="mt-3">{product.description}</p>
          <div className="d-flex align-items-center">
            <QuantityBox />

            <Button className="btn-blue btn-lg btn-big btn-round ml-3">
              Add to Cart
            </Button>
          </div>

          <div className="d-flex align-items-center mt-5 actions">
            <Button className="btn-round btn-sml" variant="outlined">
              <FaRegHeart /> &nbsp;ADD TO WISHLIST
            </Button>
            <Button className="btn-round btn-sml ml-3" variant="outlined">
              <IoMdGitCompare /> &nbsp;COMPARE
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
export default ProductModal;



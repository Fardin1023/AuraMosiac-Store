import React, { useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { IoCloseSharp } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import Slider from "react-slick";
import "react-inner-image-zoom/lib/styles.min.css";
import InnerImageZoom from "react-inner-image-zoom";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

const ProductModal = (props) => {
  const zoomSliderBig = useRef();
  const zoomSlider = useRef();
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
    zoomSlider.current.slickGoTo(index);
    zoomSliderBig.current.slickGoTo(index);
  };
  return (
    <Dialog
      open={true}
      className="productModal"
      onClose={() => props.closeProductModal()}
    >
      <Button className="close_" onClick={() => props.closeProductModal()}>
        <IoCloseSharp />
      </Button>
      <h4 class="mb-1 font-weight-bold">
        {" "}
        Himalaya Natural Glow Saffron Face Wash
      </h4>
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center mr-4">
          <span>Brands:</span>
          <span className="ml-2">
            <b>Himalaya</b>
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
          <div className="productZoom">
            <Slider
              {...settings2}
              className="zoomSliderBig"
              ref={zoomSliderBig}
            >
              <div className="item">
                <InnerImageZoom
                  zoomType="hover"
                  zoomScale={1}
                  src={`https://bk.shajgoj.com/storage/2025/01/ng-saffron-fw-03-min.jpg`}
                />
              </div>
              <div className="item">
                <InnerImageZoom
                  zoomType="hover"
                  zoomScale={1}
                  src={`https://bk.shajgoj.com/storage/2025/01/ng-saffron-fw-01-min.jpg`}
                />
              </div>
              <div className="item">
                <InnerImageZoom
                  zoomType="hover"
                  zoomScale={1}
                  src={`https://bk.shajgoj.com/storage/2025/07/27095.jpg`}
                />
              </div>
            </Slider>
          </div>
          <Slider {...settings} className="zoomSlider" ref={zoomSlider}>
            <div className="item">
              <img
                src={`https://bk.shajgoj.com/storage/2025/01/ng-saffron-fw-03-min.jpg`}
                alt="pro"
                className="w-100"
                onClick={() => goto(0)}
              />
            </div>
            <div className="item">
              <img
                src={`https://bk.shajgoj.com/storage/2025/01/ng-saffron-fw-01-min.jpg`}
                alt="pro"
                className="w-100"
                onClick={() => goto(1)}
              />
            </div>
            <div className="item">
              <img
                src={`https://bk.shajgoj.com/storage/2025/07/27095.jpg`}
                alt="pro"
                className="w-100"
                onClick={() => goto(2)}
              />
            </div>
          </Slider>
        </div>

        {/* Right Column */}

          <div className="col-md-7 d-flex align-items-start justify-content-start">
          <div className="info text-left">
            <span className="oldPrice lg">৳225.00</span>
            <span className="newPrice text-danger lg ml-2">৳112.00</span>
          </div>
          <span className="badge bg-success">IN STOCK</span>
          <p className="mt-3">
            Himalaya’s Natural Glow Saffron Face Wash is a soap-free,
            formulation that brightens and rejuvenates your skin.
          </p>
          <div className="d-flex align-items-center">
            <div className="quantityDrop d-flex align-items-center">
              <Button><FaMinus /></Button>
              <input type="text"/>
              <Button><FaPlus /></Button>
            </div>
            <Button className="btn-blue btn-lg btn-big btn-round">Add to Cart</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
export default ProductModal;



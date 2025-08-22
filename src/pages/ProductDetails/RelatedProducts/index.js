import { Swiper, SwiperSlide } from "swiper/react";
import { FaArrowRightLong } from "react-icons/fa6";
import Button from "@mui/material/Button";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductItem from "../../../components/ProductItem";

const RelatedProducts=(props)=>{
    return(
        <>
            <div className="d-flex align-items-center mt-3">
                <div className="info w-75">
                  <h3 className="mb-0 hd">{props.title}</h3>
                  
                </div>
                <Button className="viewAllBtn ml-auto">
                  View All <FaArrowRightLong />
                </Button>
              </div>
              <div className="product_row w-100 mt-4">
                <Swiper
                  slidesPerView={3}
                  spaceBetween={0}
                  slidesPerGroup={3}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  {" "}
                  <SwiperSlide>
                    <ProductItem />
                  </SwiperSlide>
                  <SwiperSlide>
                    <ProductItem />
                  </SwiperSlide>
                  <SwiperSlide>
                    <ProductItem />
                  </SwiperSlide>
                  <SwiperSlide>
                    <ProductItem />
                  </SwiperSlide>
                  <SwiperSlide>
                    <ProductItem />
                  </SwiperSlide>
                  <SwiperSlide>
                    <ProductItem />
                  </SwiperSlide>
                  <SwiperSlide>
                    <ProductItem />
                  </SwiperSlide>
                  
                </Swiper>
              </div>

        </>
    )
}
export default RelatedProducts;
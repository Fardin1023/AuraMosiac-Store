import HomeBanner from "../../components/HomeBanner";
import banner1 from "../../assets/images/banner1.png";
import banner2 from "../../assets/images/banner2.png";
import banner3 from "../../assets/images/banner3.png";
import banner4 from "../../assets/images/banner4.png";
import Button from '@mui/material/Button';
import { FaArrowRightLong } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from 'swiper/modules';
import ProductItem, { ProductItem10, ProductItem11, ProductItem12, ProductItem13, ProductItem14, ProductItem15, ProductItem16, ProductItem2, ProductItem3, ProductItem4, ProductItem5, ProductItem6, ProductItem7, ProductItem8, ProductItem9 } from "../../components/ProductItem";
import HomeCat from "../../components/HomeCat";


const Header = () => {
  return (
    <>
      <HomeBanner />
        <HomeCat/>
      <section className="homeProducts">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="sticky">
                <div className="banner">
                <img src={banner1} alt="banner" className="cursor w-100" />
              </div>
              <div className="banner mt-4">
                <img src={banner2} alt="banner" className="cursor w-100" />
              </div>
              </div>
            </div>
            <div className="col-md-9 productRow">
              <div className="d-flex align-items-center">
                <div className="info w-75">
                  <h3 className="mb-0 hd">BEST SELLERS</h3>
                  <p className="text-light text-sml mb-0 text-dark">
                    Do not miss the ongoing offers until the end of Summer{" "}
                  </p>
                </div>
                <Button className="viewAllBtn ml-auto">
                  View All <FaArrowRightLong />
                </Button>
              </div>
              <div className="product_row w-100 mt-4">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={0}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  {" "}
                 <SwiperSlide>
                   <ProductItem/>
                  </SwiperSlide>
                  <SwiperSlide>
                   <ProductItem2/>
                  </SwiperSlide>
                  <SwiperSlide>
                   <ProductItem3/>
                  </SwiperSlide>
                 <SwiperSlide>
                   <ProductItem4/>
                  </SwiperSlide>
                  <SwiperSlide>
                   <ProductItem5/>
                  </SwiperSlide>
                  <SwiperSlide>
                   <ProductItem6/>
                  </SwiperSlide>
                  <SwiperSlide>
                   <ProductItem7/>
                  </SwiperSlide>
                  <SwiperSlide>
                   <ProductItem8/>
                  </SwiperSlide>
                </Swiper>
              </div>





               <div className="d-flex align-items-center mt-5">
                <div className="info w-75">
                  <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                  <p className="text-light text-sml mb-0 text-dark">
                    New products with updated stocks{" "}
                  </p>
                </div>
                <Button className="viewAllBtn ml-auto">
                  View All <FaArrowRightLong />
                </Button>
              </div>
              <div className="product_row productRow2 w-100 mt-4 d-flex">
                <ProductItem9/>
                <ProductItem10/>
                <ProductItem11/>
                <ProductItem12/>
                <ProductItem13/>
                <ProductItem14/>
                <ProductItem15/>
                <ProductItem16/>
              </div>

              <div className="d-flex mt-4 mb-5 bannerSec">
                <div className="banner">
                <img src={banner3} alt="banner3"className="cursor w-100"/>
              </div>
              <div className="banner">
                <img src={banner4} alt="banner4"className="cursor w-100"/>
              </div>
              </div>


            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Header;






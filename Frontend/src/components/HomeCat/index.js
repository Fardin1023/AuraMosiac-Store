import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from 'swiper/modules';
import logo2 from "../../assets/images/logo2.png";
import logo3 from "../../assets/images/logo3.png";
import logo4 from "../../assets/images/logo4.png";
import logo5 from "../../assets/images/logo5.png";
import logo6 from "../../assets/images/logo6.png";
import logo7 from "../../assets/images/logo7.png";
import logo8 from "../../assets/images/logo8.png";

const HomeCat =() =>{
return(
     <section className="homeCat">
        <div className="container">
            <h3 class="mb-0 hd">Featured Products</h3>
            <Swiper
  slidesPerView={6}
  spaceBetween={20}
  navigation={true}
  slidesPerGroup={1}
  pagination={{
    clickable: true,
  }}
  modules={[Navigation]}
  className="mySwiper"
>
                 <SwiperSlide>
                    <div className="item">
                        <img src={logo2} alt="logo2" />
                    </div>
                    <h6>Skincare Products</h6>
                 </SwiperSlide>
                 <SwiperSlide>
                    <div className="item">
                        <img src={logo3} alt="logo2" />
                    </div>
                    <h6>Plants</h6>
                 </SwiperSlide>
                 <SwiperSlide>
                    <div className="item">
                        <img src={logo4} alt="logo2" />
                    </div>
                    <h6>Handicraft Items</h6>
                 </SwiperSlide>
                 <SwiperSlide>
                    <div className="item">
                        <img src={logo5} alt="logo2" />
                    </div>
                    <h6>Beauty Accessories</h6>
                 </SwiperSlide>
                 <SwiperSlide>
                    <div className="item">
                        <img src={logo6} alt="logo2" />
                    </div>
                    <h6>Kitchen Essentials</h6>
                 </SwiperSlide>
                 <SwiperSlide>
                    <div className="item">
                        <img src={logo7} alt="logo2" />
                    </div>
                    <h6>Stationery</h6>
                 </SwiperSlide>
                 <SwiperSlide>
                    <div className="item">
                        <img src={logo8} alt="logo2" />
                    </div>
                    <h6>Pet Supplies</h6>
                 </SwiperSlide>
                 </Swiper>
        </div>
      </section>
)
}

export default HomeCat;

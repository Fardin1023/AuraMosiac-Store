import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import InnerImageZoom from "react-inner-image-zoom";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import 'react-inner-image-zoom/lib/styles.min.css';

const ProductZoom = () => {
  const [slideIndex,setSlideIndex] = useState(0);
  const zoomSlider = useRef();
  const zoomSliderBig = useRef();

  const goto = (index) => {
    setSlideIndex(index);
    if (zoomSlider.current) zoomSlider.current.slideTo(index);
    if (zoomSliderBig.current) zoomSliderBig.current.slideTo(index);
  };

  return (
    <div className="productZoom">
      <div className="productZoom position-relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          navigation={true}
          slidesPerGroup={1}
          modules={[Navigation]}
          className="zoomSliderBig"
          ref={(zoomSliderBig)}
        >
          <SwiperSlide>
            <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src="https://bk.shajgoj.com/storage/2025/07/32567.jpg"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src="https://bk.shajgoj.com/storage/2025/01/vit-c-face-wash-4.jpg"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item">
              <InnerImageZoom
                zoomType="hover"
                zoomScale={1}
                src="https://bk.shajgoj.com/storage/2025/01/vit-c-face-wash-3.jpg"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      </div>
  );
};

export default ProductZoom;

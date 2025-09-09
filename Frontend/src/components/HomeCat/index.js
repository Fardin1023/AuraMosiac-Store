import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { getCategories } from "../../api/api"; 
import { useNavigate } from "react-router-dom";

const HomeCat = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  return (
    <section className="homeCat">
      <div className="container">
        <h3 className="mb-0 hd">Featured Categories</h3>

        <Swiper
          slidesPerView={6}
          spaceBetween={20}
          navigation={true}
          slidesPerGroup={1}
          pagination={{ clickable: true }}
          modules={[Navigation]}
          className="mySwiper"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat._id}>
              <div
                className="item cursor"
                onClick={() => navigate(`/cat/${cat._id}`)}
              >
                <img
                  src={cat.images?.[0] || "https://via.placeholder.com/150"}
                  alt={cat.name}
                  className="w-100"
                />
              </div>
              <h6>{cat.name}</h6>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeCat;

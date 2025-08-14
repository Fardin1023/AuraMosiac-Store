
import Slider from "react-slick";


const HomeBanner = () => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay:true,
    autoplaySpeed:3000,
  };
  return (
    <div className="homeBannerSection">
      <Slider {...settings}>
        <div className="item">
          <img
            src="https://thepowergroup.com/wp-content/uploads/2019/09/The-Power-Group-Skincare-Laura-Mercier.jpg"
            className="w-100"
          />
          </div>
           <div className="item">
          <img
            src="https://www.gfebusiness.org/blog/wp-content/uploads/2019/11/Handicrafts-Handloom-Exports-Corporation-of-India.jpg"
            className="w-100"
          /></div>
          <div className="item">
          <img
            src="https://i.cdn.newsbytesapp.com/images/l6120250804110553.jpeg"
            className="w-100"
          /></div>
      </Slider>
    </div>
  );
};

export default HomeBanner;

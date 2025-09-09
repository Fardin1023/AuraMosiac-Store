import { useEffect, useState, useContext } from "react";
import { getProducts, getFeaturedProducts } from "../../api/api";
import HomeBanner from "../../components/HomeBanner";
import banner1 from "../../assets/images/banner1.png";
import banner2 from "../../assets/images/banner2.png";
import banner3 from "../../assets/images/banner3.png";
import banner4 from "../../assets/images/banner4.png";
import news from "../../assets/images/news.png";
import Button from "@mui/material/Button";
import { FaArrowRightLong } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductItem from "../../components/ProductItem";
import HomeCat from "../../components/HomeCat";
import { IoMailUnreadOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";

const Header = () => {
  const { wishlist, user, openLoginGate } = useContext(MyContext);

  const [bestSellers, setBestSellers] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  // Fisher–Yates shuffle (non-mutating)
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  useEffect(() => {
    const load = async () => {
      try {
        // fetch both blocks together
        const [bestRes, allRes] = await Promise.all([
          getFeaturedProducts(6),
          getProducts(),
        ]);

        const best = Array.isArray(bestRes.data) ? bestRes.data : [];
        const all = Array.isArray(allRes.data) ? allRes.data : [];

        setBestSellers(best);

        // dedupe: remove anything that appears in best sellers
        const bestIds = new Set(best.map((p) => p._id || p.id));
        const onlyNew = all.filter((p) => !bestIds.has(p._id || p.id));

        // randomize order so it doesn’t mirror best sellers visually
        const randomized = shuffle(onlyNew);

        // cap how many you want to show in the grid
        setNewProducts(randomized.slice(0, 8));
      } catch (e) {
        console.error("Home load error:", e);
      }
    };

    load();
  }, []);

  // 🔐 intercept gifting CTA
  const handleGiftingClick = (e) => {
    if (!user) {
      e.preventDefault();
      openLoginGate("Gifting Studio is for members. Sign in to try it!");
    }
  };

  return (
    <>
      <HomeBanner />
      <HomeCat />

      {/* ================================
           Gifting Studio CTA (new)
         ================================ */}
      <section className="container" style={{ marginTop: 18, marginBottom: 18 }}>
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            padding: "18px 20px",
            background:
              "linear-gradient(135deg, rgba(255,77,109,0.12), rgba(107,255,181,0.12))",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(600px 200px at -10% 50%, rgba(255,77,109,0.10), transparent 60%), radial-gradient(600px 200px at 110% 50%, rgba(107,255,181,0.10), transparent 60%)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: 1,
                textTransform: "uppercase",
                opacity: 0.8,
                marginBottom: 4,
              }}
            >
              🎁 New
            </div>
            <h3 style={{ margin: 0, lineHeight: 1.25 }}>
              Try <span style={{ color: "#ff4d6d" }}>Gifting Studio</span> — AI-crafted bundles for your special ones
            </h3>
            <p style={{ margin: "6px 0 0 0", opacity: 0.8 }}>
              Answer a few quick questions and let our AI suggest single items or
              2–3 product combos by taste, relation, and budget.
            </p>
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <Link to="/gifting" onClick={handleGiftingClick}>
              <Button className="btn-blue btn-lg" style={{ borderRadius: 999 }}>
                Start Gifting <FaArrowRightLong style={{ marginLeft: 8 }} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="homeProducts ">
        <div className="container">
          <div className="row">
            {/* Left Banners */}
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

            {/* Right Side Products */}
            <div className="col-md-9 productRow">
              {/* quick access to Wishlist */}
              <div className="d-flex justify-content-end mb-3">
                <Link to="/wishlist" onClick={(e)=>{ if(!user){ e.preventDefault(); openLoginGate("Sign in to view your wishlist."); }}}>
                  <Button className="viewAllBtn">❤️ My Wishlist ({wishlist.length})</Button>
                </Link>
              </div>

              {/* BEST SELLERS */}
              <div className="d-flex align-items-center">
                <div className="info w-75">
                  <h3 className="mb-0 hd">BEST SELLERS</h3>
                  <p className="text-light text-sml mb-0 text-dark">
                    Do not miss the ongoing offers until the end of Summer{" "}
                  </p>
                </div>
                {/* View All -> All products listing */}
                <Link to="/listing/All" className="ml-auto">
                  <Button className="viewAllBtn">
                    View All <FaArrowRightLong />
                  </Button>
                </Link>
              </div>

              <div className="product_row w-100 mt-4">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={10}
                  navigation
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  {bestSellers.map((product) => (
                    <SwiperSlide key={product._id || product.id}>
                      <ProductItem product={product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* NEW PRODUCTS */}
              <div className="d-flex align-items-center mt-5">
                <div className="info w-75">
                  <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                  <p className="text-light text-sml mb-0 text-dark">
                    New products with updated stocks{" "}
                  </p>
                </div>
                {/* View All -> All products listing */}
                <Link to="/listing/All" className="ml-auto">
                  <Button className="viewAllBtn">
                    View All <FaArrowRightLong />
                  </Button>
                </Link>
              </div>
              <div className="product_row productRow2 w-100 mt-4 d-flex">
                {newProducts.map((product) => (
                  <ProductItem key={product._id || product.id} product={product} />
                ))}
              </div>

              {/* Bottom Banners */}
              <div className="d-flex mt-4 mb-5 bannerSec">
                <div className="banner">
                  <img src={banner3} alt="banner3" className="cursor w-100" />
                </div>
                <div className="banner">
                  <img src={banner4} alt="banner4" className="cursor w-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-mod-6">
              <p className="text-white mb-1">৳120 discount for your first order</p>
              <h3 className="text-white">Join our newsletter and get ....</h3>
              <p className="text-light">
                Join our email subscription now to get updates
                <br /> on promotions and coupons.
              </p>
              <form>
                <IoMailUnreadOutline />
                <input type="text" placeholder="Your email ....." />
                <Button>Subscribe</Button>
              </form>
            </div>
            <div className="col-mod-6">
              <img src={news} alt="news" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;

import Sidebar from "../../components/Sidebar";
import banner6 from "../../assets/images/banner6.png";
import Button from "@mui/material/Button";
import { IoMdMenu } from "react-icons/io";
import { PiDotsNineBold } from "react-icons/pi";
import { BsFillGridFill } from "react-icons/bs";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { FaAngleDown } from "react-icons/fa6";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";
import ProductItem from "../../components/ProductItem";
import Pagination from "@mui/material/Pagination";
import { useParams } from "react-router-dom";
import {
  getProductsByCategory,
  getCategoryById,
  getProductsByCategoryName,
} from "../../api/api";

const Listing = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [productView, setProductView] = useState("four");
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const openDropdown = Boolean(anchorEl);

  // The page can be reached via /cat/:id (id) OR /listing/:category (category)
  const { id, category: categoryName } = useParams();

  useEffect(() => {
    const load = async () => {
      try {
        // Prefer ID route
        if (id) {
          const catRes = await getCategoryById(id);
          setCategory(catRes.data);
          const prodRes = await getProductsByCategory(id);
          setProducts(prodRes.data || []);
          return;
        }
        // Fallback: category name route
        if (categoryName) {
          const decoded = decodeURIComponent(categoryName);
          setCategory({ name: decoded });
          const prodRes = await getProductsByCategoryName(decoded);
          setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
        }
      } catch (err) {
        console.error("Listing load error:", err?.response?.data || err.message);
        setProducts([]);
      }
    };
    load();
  }, [id, categoryName]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <section className="product_Listing_Page">
        <div className="container">
          <div className="productListing d-flex">
            <Sidebar />

            <div className="content_right">
              <div className="bannerWrapper text-center">
                <img src={banner6} alt="banner6" className="bannerImage" />
              </div>

              <h3 className="mt-3 mb-3">{category?.name || "Products"}</h3>

              <div className="showBy mt-3 mb-3 d-flex justify-content-start">
                <div className="d-flex align-items-center btnWrapper">
                  <Button
                    className={productView === "one" && "act"}
                    onClick={() => setProductView("one")}
                  >
                    <IoMdMenu />
                  </Button>
                  <Button
                    className={productView === "two" && "act"}
                    onClick={() => setProductView("two")}
                  >
                    <PiDotsNineBold />
                  </Button>
                  <Button
                    className={productView === "three" && "act"}
                    onClick={() => setProductView("three")}
                  >
                    <BsFillGridFill />
                  </Button>
                  <Button
                    className={productView === "four" && "act"}
                    onClick={() => setProductView("four")}
                  >
                    <TfiLayoutGrid3Alt />
                  </Button>
                </div>

                <div className="ml-auto showByFilter">
                  <Button onClick={handleClick}>
                    Show 9 <FaAngleDown />
                  </Button>
                  <Menu
                    className="w-100 showPerPageDropdown"
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openDropdown}
                    onClose={handleClose}
                    slotProps={{ list: { "aria-labelledby": "basic-button" } }}
                  >
                    <MenuItem onClick={handleClose}>10</MenuItem>
                    <MenuItem onClick={handleClose}>20</MenuItem>
                    <MenuItem onClick={handleClose}>30</MenuItem>
                    <MenuItem onClick={handleClose}>40</MenuItem>
                    <MenuItem onClick={handleClose}>50</MenuItem>
                  </Menu>
                </div>
              </div>

              <div className={`productListing`}>
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductItem key={product._id} product={product} />
                  ))
                ) : (
                  <p>No products match your filters.</p>
                )}
              </div>

              <div className="d-flex align-items-center justify-content-center mt-5">
                <Pagination count={10} color="primary" size="large" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Listing;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductItem from "../../components/ProductItem";
import {
  searchProducts,
  getProductsByCategoryName,
  getProducts,
} from "../../api/api";

import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { BsFillGridFill } from "react-icons/bs";
import { PiDotsNineBold } from "react-icons/pi";
import { IoMdMenu } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";

const money = (v) => (isNaN(Number(v)) ? "0" : Number(v).toFixed(0));

const SORT_LABELS = {
  price_asc: "Price: Low → High",
  price_desc: "Price: High → Low",
  rating_desc: "Rating: High → Low",
  newest: "Newest First",
};

const ProductListing = () => {
  const params = useParams();
  const routeCategory = decodeURIComponent(
    (params.categoryName || params.category || "").trim()
  );

  // 🔹 Special pseudo-categories
  const isNewArrivals = routeCategory.toLowerCase() === "new arrivals";
  const isAll = routeCategory.toLowerCase() === "all";

  // view/grid controls
  const [productView, setProductView] = useState("four");

  // items + pagination
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(true);

  // sorting
  const [sort, setSort] = useState(isNewArrivals ? "newest" : "price_asc");

  // filters
  const [brandOptions, setBrandOptions] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  // menus
  const [anchorEl, setAnchorEl] = useState(null); // (disabled) page-size
  const openDropdown = Boolean(anchorEl);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // NEW: sort menu
  const [anchorSortEl, setAnchorSortEl] = useState(null);
  const openSort = Boolean(anchorSortEl);
  const handleSortClick = (e) => setAnchorSortEl(e.currentTarget);
  const handleSortClose = () => setAnchorSortEl(null);
  const chooseSort = (key) => {
    setSort(key);
    setAnchorSortEl(null);
  };

  // ---------- Initial load: seed brands + price range ----------
  useEffect(() => {
    let cancelled = false;
    const seed = async () => {
      setLoading(true);
      setItems([]);
      setTotal(0);
      setPages(0);
      setPage(1);
      setSelectedBrands([]);
      setMinRating(0);
      setInStockOnly(false);
      setSort(isNewArrivals ? "newest" : "price_asc");

      try {
        // Try a category-only search (fast path)
        let base = [];
        try {
          const sres = await searchProducts(
            isNewArrivals
              ? { sort: "newest", page: 1, limit: 1000 }
              : isAll
              ? { sort: "price_asc", page: 1, limit: 1000 } // ← ALL products
              : { categoryName: routeCategory, sort: "price_asc", page: 1, limit: 1000 }
          );
          base = Array.isArray(sres.data?.items) ? sres.data.items : [];
        } catch {
          // Fallback paths
          if (isNewArrivals) {
            const all = await getProducts();
            const list = Array.isArray(all.data) ? all.data : [];
            base = list.sort(
              (a, b) =>
                new Date(b.createdAt || b.dateCreated || 0) -
                new Date(a.createdAt || a.dateCreated || 0)
            );
          } else if (isAll) {
            const all = await getProducts();
            base = Array.isArray(all.data) ? all.data : [];
          } else {
            try {
              const cres = await getProductsByCategoryName(routeCategory);
              base = Array.isArray(cres.data) ? cres.data : [];
            } catch {
              const all = await getProducts();
              const list = Array.isArray(all.data) ? all.data : [];
              base = list.filter((p) =>
                (p?.category?.name || "")
                  .toLowerCase()
                  .includes(routeCategory.toLowerCase())
              );
            }
          }
        }

        if (cancelled) return;

        const brands = [...new Set(base.map((p) => p.brand).filter(Boolean))];
        setBrandOptions(brands);

        const prices = base.map((p) => Number(p.price || 0));
        const lo = prices.length ? Math.min(...prices) : 0;
        const hi = prices.length ? Math.max(...prices) : 0;
        setMinPrice(lo);
        setMaxPrice(hi);
        setPriceRange([lo, hi]);

        // Initial search with proper default sort
        await doSearch(1, {
          brands: [],
          price: [lo, hi],
          rating: 0,
          inStock: false,
          sort: isNewArrivals ? "newest" : "price_asc",
        });
      } catch (e) {
        console.error("Seed load error:", e);
        setItems([]);
        setTotal(0);
        setPages(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    seed();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCategory]);

  // ---------- Server search ----------
  const doSearch = async (
    toPage = page,
    {
      brands = selectedBrands,
      price = priceRange,
      rating = minRating,
      inStock = inStockOnly,
      sort: sortKey = sort,
    } = {}
  ) => {
    setLoading(true);
    try {
      const params = {
        categoryName: isNewArrivals || isAll ? undefined : routeCategory,
        sort: sortKey,
        page: toPage,
        limit,
      };

      const [lo, hi] = price || [];
      if (Array.isArray(brands) && brands.length) {
        params.brands = brands.join(",");
      }
      if (!isNaN(lo)) params.minPrice = lo;
      if (!isNaN(hi)) params.maxPrice = hi;
      if (rating > 0) params.minRating = rating;
      if (inStock) params.inStock = true;

      const res = await searchProducts(params);
      setItems(res.data?.items || []);
      setTotal(res.data?.total || 0);
      setPages(res.data?.pages || 0);
      setPage(res.data?.page || toPage);
    } catch (e) {
      console.error("Search error:", e);
      setItems([]);
      setTotal(0);
      setPages(0);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Run when filters/sort change ----------
  useEffect(() => {
    if (maxPrice <= minPrice) return; // wait for seed
    doSearch(1, {
      brands: selectedBrands,
      price: priceRange,
      rating: minRating,
      inStock: inStockOnly,
      sort,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrands, minRating, priceRange, inStockOnly, sort]);

  const handlePageChange = (_, p) => {
    doSearch(p);
  };

  const toggleBrand = (b) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  const resetFilters = () => {
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
    setPriceRange([minPrice, maxPrice]);
    setSort(isNewArrivals ? "newest" : "price_asc");
  };

  return (
    <section className="product_Listing_Page">
      <div className="container">
        <div className="productListing d-flex">
          {/* ========== Sidebar Filters ========== */}
          <div className="sidebar">
            <div className="sticky">
              <div className="filterBox">
                <h6>Quick Filters</h6>
                <p className="text-muted" style={{ marginBottom: 8 }}>
                  {isAll ? (
                    <>Narrow results for <strong>All Products</strong></>
                  ) : (
                    <>Narrow results for <strong>{routeCategory}</strong></>
                  )}
                </p>
              </div>

              {/* Price */}
              <div className="filterBox">
                <h6>Filter by Price</h6>
                <div style={{ padding: "6px 6px 4px 6px" }}>
                  <Slider
                    value={priceRange}
                    onChange={(_, v) => setPriceRange(v)}
                    valueLabelDisplay="auto"
                    min={minPrice}
                    max={maxPrice}
                    disableSwap
                  />
                  <div className="d-flex justify-content-between">
                    <small>From: Tk {money(priceRange[0])}</small>
                    <small>To: Tk {money(priceRange[1])}</small>
                  </div>
                </div>
              </div>

              {/* Quality (rating) */}
              <div className="filterBox">
                <h6>Quality (Rating)</h6>
                {[4, 3, 2, 1].map((r) => (
                  <FormControlLabel
                    key={r}
                    control={
                      <Checkbox
                        size="small"
                        checked={minRating === r}
                        onChange={() =>
                          setMinRating((prev) => (prev === r ? 0 : r))
                        }
                      />
                    }
                    label={`${r}★ & up`}
                  />
                ))}
              </div>

              {/* In stock only */}
              <div className="filterBox">
                <h6>Availability</h6>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                  }
                  label="In Stock only"
                />
              </div>

              {/* Brands */}
              <div className="filterBox">
                <h6>Brands</h6>
                <div className="scrol">
                  <ul>
                    {brandOptions.length === 0 && (
                      <li className="text-muted">No brand data</li>
                    )}
                    {brandOptions.map((b) => (
                      <li key={b}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={selectedBrands.includes(b)}
                              onChange={() => toggleBrand(b)}
                            />
                          }
                          label={b}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button variant="outlined" className="btn-sml" onClick={resetFilters}>
                Reset filters
              </Button>
            </div>
          </div>

          {/* ========== Right Content ========== */}
          <div className="content_right">
            <h3 className="mt-3 mb-1">
              {isAll ? "All Products" : routeCategory || "Products"}
            </h3>
            <p className="text-muted mb-3">
              Showing {items.length} of {total} items (Sort: {SORT_LABELS[sort]})
            </p>

            {/* view + sort */}
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

              {/* Sort By */}
              <div className="ml-3 showByFilter">
                <Button onClick={handleSortClick}>
                  Sort: {SORT_LABELS[sort]} <FaAngleDown className="ml-1" />
                </Button>
                <Menu
                  id="sort-menu"
                  anchorEl={anchorSortEl}
                  open={openSort}
                  onClose={handleSortClose}
                >
                  <MenuItem onClick={() => chooseSort("price_asc")}>
                    Price: Low → High
                  </MenuItem>
                  <MenuItem onClick={() => chooseSort("price_desc")}>
                    Price: High → Low
                  </MenuItem>
                  <MenuItem onClick={() => chooseSort("rating_desc")}>
                    Rating: High → Low
                  </MenuItem>
                  <MenuItem onClick={() => chooseSort("newest")}>
                    Newest First
                  </MenuItem>
                </Menu>
              </div>

              {/* (Disabled) page-size dropdown kept for layout parity */}
              <div className="ml-auto showByFilter">
                <Button onClick={handleClick}>
                  Show {limit} <FaAngleDown className="ml-1" />
                </Button>
                <Menu
                  className="w-100 showPerPageDropdown"
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openDropdown}
                  onClose={handleClose}
                  slotProps={{ list: { "aria-labelledby": "basic-button" } }}
                >
                  <MenuItem disabled>12</MenuItem>
                  <MenuItem disabled>24</MenuItem>
                  <MenuItem disabled>36</MenuItem>
                </Menu>
              </div>
            </div>

            {/* products */}
            {loading ? (
              <p>Loading products…</p>
            ) : items.length === 0 ? (
              <p>No products match your filters.</p>
            ) : (
              <div className="productListing">
                {items.map((p) => (
                  <ProductItem key={p._id} product={p} itemView={productView} />
                ))}
              </div>
            )}

            {/* pagination */}
            {pages > 1 && (
              <div className="d-flex align-items-center justify-content-center mt-5">
                <Pagination
                  count={pages}
                  page={page}
                  color="primary"
                  size="large"
                  onChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;

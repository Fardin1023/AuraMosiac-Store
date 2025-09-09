import React, { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaArrowRightLong } from "react-icons/fa6";
import Button from "@mui/material/Button";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductItem from "../../../components/ProductItem";
import { Link } from "react-router-dom";
import {
  getProductsByCategoryName,
  getProducts,
  getRelatedProducts, // ✅ use API helper
} from "../../../api/api";

/**
 * Props (all optional):
 * - title: section title
 * - currentProduct: product object from ProductDetails (to infer category & exclude itself)
 * - category: fallback category name string (e.g., "skincare")
 * - categoryId: (optional) direct category _id to use for /related endpoint
 * - excludeId: (optional) product id to exclude for /related endpoint
 * - mode: when "recent", you can show recently viewed (left as-is for now)
 */
const RelatedProducts = ({
  title = "Related Products",
  currentProduct,
  category = "skincare",
  categoryId,
  excludeId,
  mode,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---- figure out category name + ids safely ----
  const catName = useMemo(() => {
    // populated object -> name
    const fromObj =
      typeof currentProduct?.category === "object"
        ? currentProduct?.category?.name
        : undefined;

    // plain string or fallback prop
    const fromString =
      typeof currentProduct?.category === "string"
        ? currentProduct?.category
        : undefined;

    return String(fromObj || fromString || category || "")
      .trim()
      .toLowerCase();
  }, [currentProduct?.category, category]);

  const catId =
    categoryId ||
    (typeof currentProduct?.category === "object"
      ? currentProduct?.category?._id
      : undefined);

  const selfId = excludeId || currentProduct?._id || currentProduct?.id;

  useEffect(() => {
    if (mode === "recent") {
      // you can keep your recent logic here if you add it later
      setItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      let data = [];

      // 1) Best path: server related by categoryId + excludeId
      if (catId && selfId) {
        try {
          const res = await getRelatedProducts(catId, selfId);
          const json = Array.isArray(res.data) ? res.data : [];
          if (json.length) data = json;
        } catch {
          /* swallow and fall back */
        }
      }

      // 2) Next: by category NAME (one-hop backend route)
      if (!data.length && catName) {
        try {
          const r = await getProductsByCategoryName(catName);
          const list = Array.isArray(r.data) ? r.data : [];
          data = list;
        } catch {
          /* fall back */
        }
      }

      // 3) Last resort: load all and filter by category name (populated) or text heuristics
      if (!data.length) {
        try {
          const all = await getProducts();
          const list = Array.isArray(all.data) ? all.data : [];
          const kw = [
            "skin",
            "skincare",
            "face",
            "wash",
            "cleanser",
            "cream",
            "serum",
            "moisturizer",
            "sunscreen",
            "toner",
            "mask",
          ];
          data = list.filter((p) => {
            const cName = String(p?.category?.name || p?.category || "")
              .toLowerCase()
              .trim();
            const text = `${p.name || ""} ${p.title || ""} ${
              p.description || ""
            }`.toLowerCase();
            return cName.includes(catName) || kw.some((k) => text.includes(k));
          });
        } catch {
          /* ignore */
        }
      }

      // Exclude itself if still present
      if (selfId) {
        data = data.filter((p) => (p._id || p.id) !== selfId);
      }

      // Limit
      data = data.slice(0, 12);

      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [catId, selfId, catName, mode]);

  const viewAllTo = `/listing/${encodeURIComponent(catName || "products")}`;

  return (
    <>
      <div className="d-flex align-items-center mt-3">
        <div className="info w-75">
          <h3 className="mb-0 hd">{title}</h3>
        </div>

        <Link to={viewAllTo}>
          <Button className="viewAllBtn ml-auto">
            View All <FaArrowRightLong />
          </Button>
        </Link>
      </div>

      <div className="product_row w-100 mt-4">
        {loading ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-muted">
            No related products found{catName ? ` for “${catName}”` : ""}.
          </p>
        ) : (
          <Swiper
            spaceBetween={20}
            slidesPerGroup={1}
            navigation
            modules={[Navigation]}
            className="mySwiper"
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {items.map((p) => (
              <SwiperSlide key={p._id || p.id}>
                <ProductItem product={p} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default RelatedProducts;

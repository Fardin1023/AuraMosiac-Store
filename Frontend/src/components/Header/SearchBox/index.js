import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts, getProducts } from "../../../api/api";
import { IoSearch } from "react-icons/io5";

const DEBOUNCE_MS = 300;

const SearchBox = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState({ products: [], categories: [], brands: [] });
  const [activeIndex, setActiveIndex] = useState(-1);
  const boxRef = useRef(null);
  const reqIdRef = useRef(0);

  const flat = useMemo(() => {
    const out = [];
    hits.categories.forEach((c) => out.push({ type: "category", value: c }));
    hits.brands.forEach((b) => out.push({ type: "brand", value: b }));
    hits.products.forEach((p) => out.push({ type: "product", value: p }));
    return out;
  }, [hits]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!q || q.trim().length < 2) {
      setHits({ products: [], categories: [], brands: [] });
      setLoading(false);
      return;
    }

    const myReqId = ++reqIdRef.current;
    setLoading(true);

    const t = setTimeout(async () => {
      try {
        let items = [];
        try {
          const r = await searchProducts({ q, limit: 20 });
          items = Array.isArray(r.data?.items) ? r.data.items : [];
        } catch {
          const rAll = await getProducts();
          const all = Array.isArray(rAll.data) ? rAll.data : [];
          const qq = q.toLowerCase();
          items = all.filter((p) => {
            const name = `${p.name || p.title || ""}`.toLowerCase();
            const brand = `${p.brand || ""}`.toLowerCase();
            const desc = `${p.description || ""}`.toLowerCase();
            const cat = `${p?.category?.name || p.category || ""}`.toLowerCase();
            return name.includes(qq) || brand.includes(qq) || desc.includes(qq) || cat.includes(qq);
          });
        }

        if (reqIdRef.current !== myReqId) return;

        const categories = [
          ...new Set(
            items
              .map((p) => p?.category?.name || p.category)
              .filter(Boolean)
              .map((s) => String(s).trim())
          ),
        ].slice(0, 4);

        const brands = [...new Set(items.map((p) => p.brand).filter(Boolean))].slice(0, 6);
        const products = items.slice(0, 6);

        setHits({ products, categories, brands });
      } catch {
        setHits({ products: [], categories: [], brands: [] });
      } finally {
        if (reqIdRef.current === myReqId) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [q]);

  const go = (item) => {
    setOpen(false);
    setActiveIndex(-1);

    if (item.type === "product") {
      const id = item.value?._id || item.value?.id;
      if (id) navigate(`/product/${id}`);
      return;
    }
    if (item.type === "category") {
      navigate(`/listing/${encodeURIComponent(item.value)}`);
      return;
    }
    if (item.type === "brand") {
      navigate(
        `/listing/${encodeURIComponent("Skincare")}?brand=${encodeURIComponent(item.value)}`
      );
      return;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const target =
      flat[activeIndex] ||
      flat[0] ||
      (q.trim() ? { type: "category", value: q.trim() } : null);
    if (target) go(target);
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(flat.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < flat.length) go(flat[activeIndex]);
      else onSubmit(e);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="searchBox" ref={boxRef}>
      <form onSubmit={onSubmit} className="searchForm">
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search brand, category or product…"
          aria-label="Search"
        />
        <button type="submit" className="btnSearch" aria-label="Search">
          {loading ? <span className="spinner" /> : <IoSearch />}
        </button>
      </form>

      {open && (q?.trim()?.length ?? 0) >= 2 && (
        <div className="searchDropdown">
          {loading ? (
            <div className="searchLoading">
              <span className="spinner big" />
              <span className="ml-2">Searching…</span>
            </div>
          ) : flat.length === 0 ? (
            <div className="searchEmpty">No results for “{q}”.</div>
          ) : (
            <>
              {hits.categories.length > 0 && (
                <div className="group">
                  <div className="groupTitle">Categories</div>
                  {hits.categories.map((c) => (
                    <div
                      key={`c-${c}`}
                      className={
                        "rowItem" +
                        (flat[activeIndex]?.type === "category" &&
                        flat[activeIndex]?.value === c
                          ? " active"
                          : "")
                      }
                      onMouseEnter={() => {
                        const fIdx = flat.findIndex(
                          (x) => x.type === "category" && x.value === c
                        );
                        setActiveIndex(fIdx);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        go({ type: "category", value: c });
                      }}
                    >
                      <span className="badge">Category</span>
                      <span className="label">{c}</span>
                    </div>
                  ))}
                </div>
              )}

              {hits.brands.length > 0 && (
                <div className="group">
                  <div className="groupTitle">Brands</div>
                  {hits.brands.map((b) => (
                    <div
                      key={`b-${b}`}
                      className={
                        "rowItem" +
                        (flat[activeIndex]?.type === "brand" &&
                        flat[activeIndex]?.value === b
                          ? " active"
                          : "")
                      }
                      onMouseEnter={() => {
                        const fIdx = flat.findIndex(
                          (x) => x.type === "brand" && x.value === b
                        );
                        setActiveIndex(fIdx);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        go({ type: "brand", value: b });
                      }}
                    >
                      <span className="badge">Brand</span>
                      <span className="label">{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {hits.products.length > 0 && (
                <div className="group">
                  <div className="groupTitle">Products</div>
                  {hits.products.map((p) => {
                    const name = p.name || p.title || "Product";
                    const img =
                      (Array.isArray(p.images) && p.images[0]) ||
                      p.thumbnail ||
                      p.image ||
                      "";
                    const id = p._id || p.id;

                    return (
                      <div
                        key={`p-${id}`}
                        className={
                          "rowItem" +
                          (flat[activeIndex]?.type === "product" &&
                          (flat[activeIndex]?.value?._id === id ||
                            flat[activeIndex]?.value?.id === id)
                            ? " active"
                            : "")
                        }
                        onMouseEnter={() => {
                          const fIdx = flat.findIndex(
                            (x) =>
                              x.type === "product" &&
                              (x.value?._id === id || x.value?.id === id)
                          );
                          setActiveIndex(fIdx);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          go({ type: "product", value: p });
                        }}
                      >
                        {!!img && <img src={img} alt="" className="thumb" />}
                        <span className="label">{name}</span>
                        <span className="price">
                          {p.price != null ? `৳${Number(p.price).toFixed(0)}` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;

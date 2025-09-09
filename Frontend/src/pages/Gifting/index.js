import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import {
  getProducts,
  getProductsByCategoryName,
  getCategories,
} from "../../api/api";
import { MyContext } from "../../App";
import { FaGift, FaRotateRight, FaCirclePlus, FaWandMagicSparkles } from "react-icons/fa6";

/* -----------------------------
   Helpers
----------------------------- */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const idOf = (p) => p._id || p.id;
const imgOf = (p) =>
  (Array.isArray(p.images) && p.images[0]) ||
  p.thumbnail ||
  p.image ||
  "https://via.placeholder.com/600x400?text=Gift+Item";
const nameOf = (p) => p.name || p.title || "Product";
const priceOf = (p) => Number(p.price || p.newPrice || 0);
const descOf = (p) => String(p.description || "").toLowerCase();
const brandOf = (p) => String(p.brand || "").toLowerCase();
const catNameOf = (p) =>
  (p.category && (p.category.name || p.category.title)) || "";

/** Prioritize categories based on choices */
const planCategories = ({ gender, relation }) => {
  const base = [];
  if (gender === "male") base.push("Handcraft", "Skincare", "Plants", "Gifting");
  else if (gender === "female") base.push("Skincare", "Handcraft", "Plants", "Gifting");
  else base.push("Gifting", "Skincare", "Handcraft", "Plants");

  if (relation === "relative") base.unshift("Gifting", "Handcraft");
  else if (relation === "friend") base.unshift("Skincare", "Plants");

  const seen = new Set();
  return base.filter((x) => {
    const k = String(x || "").trim().toLowerCase();
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

/* ---------- prompt parsing ---------- */
const parseBudget = (text) => {
  const m =
    /(?:under|below|<=|≤|less than|upto|up to)\s*(?:tk|৳)?\s*(\d{2,6})/i.exec(
      text
    );
  if (m) return { max: Number(m[1]) || undefined };
  const only = /(?:tk|৳)\s*(\d{2,6})/i.exec(text);
  if (only) return { max: Number(only[1]) || undefined };
  return {};
};
const parseMinRating = (text) => {
  const m =
    /(?:rating|stars?|star)\s*(?:>=|at least|over|above|\+)?\s*(\d(?:\.\d)?)/i.exec(
      text
    ) ||
    /(\d(?:\.\d)?)\s*\+\s*(?:rating|stars?)/i.exec(text) ||
    />=\s*(\d(?:\.\d)?)/i.exec(text);
  if (m) {
    const val = Math.max(0, Math.min(5, Number(m[1])));
    return isNaN(val) ? 0 : val;
  }
  return 0;
};
const parseBrand = (text) => {
  const m = /(?:brand|by|from)\s+([a-z0-9\- ]{2,})/i.exec(text);
  if (m) return m[1].trim();
  return "";
};

/* -----------------------------
   Component
----------------------------- */
const Gifting = () => {
  const { addToCart } = useContext(MyContext) || {};

  // Mode: "prompt" OR "questions"
  const [mode, setMode] = useState("prompt");

  // Questions mode states
  const [gender, setGender] = useState("");
  const [relation, setRelation] = useState("");

  // Common states
  const [bundleSize, setBundleSize] = useState(2); // 1 / 2 / 3
  const [budgetMax, setBudgetMax] = useState(1000); // per-item cap; null = no cap

  // Prompt mode
  const [prompt, setPrompt] = useState("");
  const [allCategoryNames, setAllCategoryNames] = useState([]);

  const [pool, setPool] = useState([]);
  const [bundle, setBundle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // tiny animations
  useEffect(() => {
    const css = `
      @keyframes giftPop { 0% { transform: scale(.95); opacity:.0 } 100% { transform: scale(1); opacity:1 } }
      @keyframes bowBounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
      @keyframes rotateSlow { 0%{ transform: rotate(0) } 100%{ transform: rotate(360deg) } }
    `;
    const tag = document.createElement("style");
    tag.innerHTML = css;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  // Load categories for smarter prompt → category mapping
  useEffect(() => {
    (async () => {
      try {
        const res = await getCategories();
        const names = (res.data || [])
          .map((c) => c?.name)
          .filter(Boolean)
          .map((s) => String(s).trim());
        setAllCategoryNames(names);
      } catch {
        setAllCategoryNames([]);
      }
    })();
  }, []);

  const canGenerateQuestions = mode === "questions" ? Boolean(gender && relation) : true;

  /* -----------------------------
     Data loading
  ----------------------------- */
  const fetchCandidates = async (usePrompt, useQuestions) => {
    setError("");
    try {
      const lcPrompt = String(prompt || "").toLowerCase();

      // Categories from questions
      const plannedCats = useQuestions ? planCategories({ gender, relation }) : [];

      // Extra categories inferred from prompt
      const promptCats =
        usePrompt && lcPrompt
          ? allCategoryNames.filter((n) =>
              lcPrompt.includes(String(n).toLowerCase())
            )
          : [];

      const wantCats = [...new Set([...(promptCats || []), ...plannedCats])];

      let items = [];
      if (wantCats.length) {
        const results = await Promise.allSettled(
          wantCats.map((c) => getProductsByCategoryName(c))
        );
        items = results
          .filter((r) => r.status === "fulfilled")
          .flatMap((r) => (Array.isArray(r.value?.data) ? r.value.data : []));
      }
      // fallback to all products
      if (!items.length) {
        const allRes = await getProducts();
        items = Array.isArray(allRes.data) ? allRes.data : [];
      }

      // de-dupe and prefer in-stock
      const byId = new Map();
      for (const p of items) {
        const id = idOf(p);
        if (!id) continue;
        if (!byId.has(id)) byId.set(id, p);
      }
      const unique = Array.from(byId.values());
      const stockFirst = [
        ...unique.filter((p) => (p.countInStock ?? 1) > 0),
        ...unique.filter((p) => (p.countInStock ?? 1) <= 0),
      ];

      setPool(stockFirst);
      return stockFirst;
    } catch (e) {
      console.error("Gift candidates load error:", e);
      setError("Sorry, I couldn’t fetch gift ideas right now.");
      setPool([]);
      return [];
    }
  };

  /* -----------------------------
     Filtering per mode
  ----------------------------- */
  const filteredByMode = (items) => {
    // 1) Always respect explicit per-item budget (if not null)
    let filtered = items;
    if (budgetMax !== null) filtered = filtered.filter((p) => priceOf(p) <= Number(budgetMax));

    if (mode === "prompt") {
      const lc = String(prompt || "").toLowerCase();
      const tokens = lc.split(/[^a-z0-9]+/).filter(Boolean);

      const budgetFromPrompt = parseBudget(lc);
      const minRating = parseMinRating(lc);
      const brand = parseBrand(lc);

      // if slider says "No limit", prompt can add a cap
      const cap = budgetMax === null ? budgetFromPrompt.max || null : null;
      if (cap) filtered = filtered.filter((p) => priceOf(p) <= Number(cap));

      if (minRating) filtered = filtered.filter((p) => Number(p.rating || 0) >= minRating);
      if (brand) filtered = filtered.filter((p) => brandOf(p).includes(brand.toLowerCase()));

      if (tokens.length) {
        const rx = new RegExp(tokens.join("|"), "i");
        filtered = filtered.filter((p) => {
          const blob =
            `${nameOf(p)} ${descOf(p)} ${brandOf(p)} ${catNameOf(p)}`.toLowerCase();
          return rx.test(blob);
        });
      }
    }

    // relax if too strict
    if (filtered.length < bundleSize) return items;
    return filtered;
  };

  const pickBundle = (items, size) => {
    const n = Math.max(1, Math.min(3, Number(size) || 2));
    const source = filteredByMode(items);
    const chosen = [];
    for (const p of shuffle(source)) {
      if (chosen.length >= n) break;
      chosen.push(p);
    }
    return chosen;
  };

  const generateGift = async () => {
    if (mode === "questions" && !canGenerateQuestions) {
      setError("Please choose both gender and relation.");
      return;
    }
    setLoading(true);
    const items = pool.length
      ? pool
      : await fetchCandidates(mode === "prompt", mode === "questions");
    setTimeout(() => {
      const chosen = pickBundle(items, bundleSize);
      setBundle(chosen);
      setLoading(false);
    }, 900);
  };

  const onRegenerate = () => {
    if (!pool.length) return generateGift();
    setLoading(true);
    setTimeout(() => {
      setBundle(pickBundle(pool, bundleSize));
      setLoading(false);
    }, 700);
  };

  /* -----------------------------
     Pricing (with bundle discount)
  ----------------------------- */
  const subtotal = useMemo(
    () => bundle.reduce((s, p) => s + priceOf(p), 0),
    [bundle]
  );
  const discountPct = useMemo(() => {
    if (bundleSize === 2) return 0.25;
    if (bundleSize === 3) return 0.45;
    return 0;
  }, [bundleSize]);
  const discountLabel = useMemo(() => {
    if (bundleSize === 2) return "25% bundle off";
    if (bundleSize === 3) return "45% bundle off";
    return "No discount";
  }, [bundleSize]);
  const discountAmt = subtotal * discountPct;
  const total = Math.max(0, subtotal - discountAmt);

  const addBundleToCart = () => {
    if (!addToCart) return;
    bundle.forEach((p) => addToCart(p, 1));
  };

  /* -----------------------------
     UI
  ----------------------------- */
  const promptChips = [
    "Luxury skincare under Tk 1500, rating 4.5+ for mom",
    "Eco-friendly handcraft gift for a friend under Tk 1000",
    "Low-maintenance plant for office desk, rating 4+",
    "Men’s self-care set under Tk 1200, brand The Ordinary",
    "Minimalist gifts for a relative, under Tk 800",
  ];

  return (
    <section className="section" style={{ paddingTop: 24 }}>
      <div className="container" style={{ maxWidth: 1080 }}>
        <div
          className="card shadow-sm"
          style={{ overflow: "hidden", borderRadius: 16, animation: "giftPop .35s ease both" }}
        >
          {/* Header */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(255,77,109,0.12), rgba(107,255,181,0.12))",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "#fff",
              }}
            >
              <FaGift style={{ fontSize: 18, color: "#ff4d6d" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Gifting Studio</div>
              <div className="text-muted" style={{ fontSize: 13 }}>
                Generate gifts via <b>Prompt</b> or <b>Questions</b>. I’ll craft bundles that match your vibe & budget.
                <span className="ml-2" style={{ fontWeight: 600 }}>
                  (2 items: 25% off • 3 items: 45% off)
                </span>
              </div>
            </div>
            <div className="ml-auto">
              <Link to="/" className="text-muted">← Back to Home</Link>
            </div>
          </div>

          {/* Body */}
          <div className="p-3 p-md-4">
            <div className="row">
              {/* Left: Controls */}
              <div className="col-md-5">
                <div className="card p-3" style={{ borderRadius: 14 }}>
                  {/* Mode Toggle */}
                  <div className="d-flex mb-3" style={{ gap: 8 }}>
                    <Button
                      className={`btn-round ${mode === "prompt" ? "btn-green" : "btn-outline-secondary"}`}
                      onClick={() => setMode("prompt")}
                    >
                      Prompt
                    </Button>
                    <Button
                      className={`btn-round ${mode === "questions" ? "btn-green" : "btn-outline-secondary"}`}
                      onClick={() => setMode("questions")}
                    >
                      Questions
                    </Button>
                  </div>

                  {/* ---- PROMPT MODE ---- */}
                  {mode === "prompt" && (
                    <>
                      {/* Prompt box */}
                      <div className="mb-3">
                        <div className="small text-muted mb-1">Describe your gift</div>
                        <div className="d-flex align-items-start">
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              display: "grid",
                              placeItems: "center",
                              background: "#fff",
                              marginRight: 10,
                              border: "1px solid #eee",
                            }}
                          >
                            <FaWandMagicSparkles style={{ color: "#ff4d6d" }} />
                          </div>
                          <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={3}
                            className="form-control"
                            placeholder="e.g., luxury skincare under Tk 1500, rating 4.5+ for mom"
                            style={{ resize: "vertical" }}
                          />
                        </div>

                        <div className="mt-2 d-flex" style={{ gap: 6, flexWrap: "wrap" }}>
                          {promptChips.map((c) => (
                            <button
                              key={c}
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => setPrompt(c)}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Bundle size */}
                      <div className="mb-3">
                        <div className="small text-muted mb-1">Bundle Size</div>
                        <div className="d-flex" style={{ gap: 8, flexWrap: "wrap" }}>
                          {[1, 2, 3].map((n) => (
                            <Button
                              key={n}
                              className={`btn-round ${bundleSize === n ? "btn-green" : "btn-outline-secondary"}`}
                              onClick={() => setBundleSize(n)}
                            >
                              {n === 1 ? "Single" : n === 2 ? "2 products" : "3 products"}
                            </Button>
                          ))}
                        </div>
                        <div className="small text-muted mt-1">
                          {bundleSize === 1 ? "No discount" : bundleSize === 2 ? "25% off bundle" : "45% off bundle"}
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="mb-3">
                        <div className="small text-muted mb-1">Per-item Budget</div>
                        <div className="d-flex" style={{ gap: 8, flexWrap: "wrap" }}>
                          {[500, 1000, 1500, 2000].map((b) => (
                            <Button
                              key={b}
                              className={`btn-round ${budgetMax === b ? "btn-green" : "btn-outline-secondary"}`}
                              onClick={() => setBudgetMax(b)}
                            >
                              Under Tk {b}
                            </Button>
                          ))}
                          <Button
                            className={`btn-round ${budgetMax == null ? "btn-green" : "btn-outline-secondary"}`}
                            onClick={() => setBudgetMax(null)}
                            title="No price cap"
                          >
                            No limit
                          </Button>
                        </div>

                        <div className="mt-3">
                          <div className="small text-muted mb-1">Custom cap</div>
                          <input
                            type="range"
                            min={200}
                            max={5000}
                            step={50}
                            value={budgetMax ?? 5000}
                            onChange={(e) =>
                              setBudgetMax(
                                Number(e.target.value) === 5000 ? null : Number(e.target.value)
                              )
                            }
                            style={{ width: "100%" }}
                            disabled={budgetMax === null ? true : false}
                          />
                          <div className="d-flex">
                            <div className="small text-muted">Tk 200</div>
                            <div className="small text-muted ml-auto">Tk 5000</div>
                          </div>
                          <div className="mt-1">
                            {budgetMax === null ? (
                              <span className="small">No cap applied (your prompt can also add a cap)</span>
                            ) : (
                              <span className="small">
                                Current cap: <b>Tk {budgetMax}</b> per item
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ---- QUESTIONS MODE ---- */}
                  {mode === "questions" && (
                    <>
                      {/* Step 1: Gender */}
                      <div className="mb-3">
                        <div className="small text-muted mb-1">Step 1</div>
                        <div className="h5 mb-2">Who are you giving to?</div>
                        <div className="d-flex" style={{ gap: 8, flexWrap: "wrap" }}>
                          {["male", "female"].map((g) => (
                            <Button
                              key={g}
                              className={`btn-round ${gender === g ? "btn-green" : "btn-outline-secondary"}`}
                              onClick={() => setGender(g)}
                            >
                              {g === "male" ? "Male" : "Female"}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Step 2: Relation */}
                      <div className="mb-3">
                        <div className="small text-muted mb-1">Step 2</div>
                        <div className="h5 mb-2">Relation</div>
                        <div className="d-flex" style={{ gap: 8, flexWrap: "wrap" }}>
                          {["friend", "relative"].map((r) => (
                            <Button
                              key={r}
                              className={`btn-round ${relation === r ? "btn-green" : "btn-outline-secondary"}`}
                              onClick={() => setRelation(r)}
                              disabled={!gender}
                            >
                              {r === "friend" ? "Friend" : "Relative"}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Step 3: Bundle size */}
                      <div className="mb-3">
                        <div className="small text-muted mb-1">Step 3</div>
                        <div className="h5 mb-2">Bundle Size</div>
                        <div className="d-flex" style={{ gap: 8, flexWrap: "wrap" }}>
                          {[1, 2, 3].map((n) => (
                            <Button
                              key={n}
                              className={`btn-round ${bundleSize === n ? "btn-green" : "btn-outline-secondary"}`}
                              onClick={() => setBundleSize(n)}
                              disabled={!gender || !relation}
                            >
                              {n === 1 ? "Single" : n === 2 ? "2 products" : "3 products"}
                            </Button>
                          ))}
                        </div>
                        <div className="small text-muted mt-1">
                          {bundleSize === 1 ? "No discount" : bundleSize === 2 ? "25% off bundle" : "45% off bundle"}
                        </div>
                      </div>

                      {/* Step 4: Budget */}
                      <div className="mb-3">
                        <div className="small text-muted mb-1">Step 4</div>
                        <div className="h5 mb-2">Per-item Budget</div>
                        <div className="d-flex" style={{ gap: 8, flexWrap: "wrap" }}>
                          {[500, 1000, 1500, 2000].map((b) => (
                            <Button
                              key={b}
                              className={`btn-round ${budgetMax === b ? "btn-green" : "btn-outline-secondary"}`}
                              onClick={() => setBudgetMax(b)}
                              disabled={!gender || !relation}
                            >
                              Under Tk {b}
                            </Button>
                          ))}
                          <Button
                            className={`btn-round ${budgetMax == null ? "btn-green" : "btn-outline-secondary"}`}
                            onClick={() => setBudgetMax(null)}
                            disabled={!gender || !relation}
                            title="No price cap"
                          >
                            No limit
                          </Button>
                        </div>

                        <div className="mt-3">
                          <div className="small text-muted mb-1">Custom cap</div>
                          <input
                            type="range"
                            min={200}
                            max={5000}
                            step={50}
                            value={budgetMax ?? 5000}
                            onChange={(e) =>
                              setBudgetMax(
                                Number(e.target.value) === 5000 ? null : Number(e.target.value)
                              )
                            }
                            style={{ width: "100%" }}
                            disabled={!gender || !relation || budgetMax === null}
                          />
                          <div className="d-flex">
                            <div className="small text-muted">Tk 200</div>
                            <div className="small text-muted ml-auto">Tk 5000</div>
                          </div>
                          <div className="mt-1">
                            {budgetMax === null ? (
                              <span className="small">No cap applied</span>
                            ) : (
                              <span className="small">
                                Current cap: <b>Tk {budgetMax}</b> per item
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  <div className="d-flex" style={{ gap: 8, flexWrap: "wrap" }}>
                    <Button
                      className="btn-blue"
                      onClick={generateGift}
                      disabled={!canGenerateQuestions}
                      title="Generate gift"
                    >
                      Generate Gift
                    </Button>
                    <Button
                      className="btn-outline-secondary"
                      onClick={() => {
                        setPrompt("");
                        setGender("");
                        setRelation("");
                        setBundleSize(2);
                        setBudgetMax(1000);
                        setBundle([]);
                        setPool([]);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                  {error && <div className="text-danger mt-2">{error}</div>}
                </div>
              </div>

              {/* Right: Result */}
              <div className="col-md-7 mt-4 mt-md-0">
                <div
                  className="card p-3 p-md-4"
                  style={{ borderRadius: 14, minHeight: 320, position: "relative" }}
                >
                  {loading && (
                    <div
                      className="d-flex flex-column align-items-center justify-content-center"
                      style={{ position: "absolute", inset: 0 }}
                    >
                      {/* Gift loading animation */}
                      <div
                        style={{
                          width: 96,
                          height: 96,
                          borderRadius: 16,
                          background: "linear-gradient(135deg, #ffb3c0, #ff4d6d)",
                          position: "relative",
                          display: "grid",
                          placeItems: "center",
                          color: "#fff",
                          animation: "giftPop .4s ease both, rotateSlow 6s linear infinite",
                          filter: "drop-shadow(0 6px 18px rgba(255,77,109,.35))",
                        }}
                      >
                        🎁
                        <div
                          style={{
                            position: "absolute",
                            top: -10,
                            width: 40,
                            height: 16,
                            borderRadius: 8,
                            background: "#6bffb5",
                            animation: "bowBounce 1.4s ease-in-out infinite",
                          }}
                        />
                      </div>
                      <div className="mt-3 text-muted">Crafting your gift…</div>
                    </div>
                  )}

                  {!loading && bundle.length > 0 && (
                    <>
                      <div className="d-flex align-items-center mb-2">
                        <div className="h5 mb-0">Your AI-crafted Gift</div>
                        <Button
                          onClick={onRegenerate}
                          className="btn-outline-secondary btn-round ml-auto"
                          title="Regenerate"
                        >
                          <FaRotateRight className="mr-2" /> Regenerate
                        </Button>
                      </div>

                      <div className="row">
                        {bundle.map((p) => {
                          const id = idOf(p);
                          return (
                            <div className="col-sm-6 mb-3" key={id}>
                              <div
                                className="card h-100"
                                style={{ borderRadius: 12, animation: "giftPop .35s ease both" }}
                              >
                                <Link to={`/product/${id}`}>
                                  <img
                                    src={imgOf(p)}
                                    alt={nameOf(p)}
                                    className="card-img-top"
                                    style={{
                                      height: 160,
                                      objectFit: "cover",
                                      borderTopLeftRadius: 12,
                                      borderTopRightRadius: 12,
                                      cursor: "pointer",
                                    }}
                                  />
                                </Link>
                                <div className="card-body d-flex flex-column">
                                  <div className="font-weight-bold mb-1">{nameOf(p)}</div>
                                  <div className="text-muted mb-1">
                                    Rating: {(Number(p.rating || 0)).toFixed(1)} ★
                                  </div>
                                  <div className="text-muted mb-3">৳{priceOf(p).toFixed(2)}</div>
                                  <div className="mt-auto d-flex">
                                    <Button
                                      className="btn-green btn-round"
                                      onClick={() => addToCart && addToCart(p, 1)}
                                    >
                                      <FaCirclePlus className="mr-2" />
                                      Add to cart
                                    </Button>
                                    <Link to={`/product/${id}`} className="btn btn-outline-primary btn-round ml-2">
                                      View
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Pricing with discount */}
                      <div className="border-top pt-3">
                        <div className="d-flex align-items-center mb-1">
                          <span className="text-muted">Subtotal</span>
                          <span className="ml-auto text-muted">৳{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <span className="text-success">{discountLabel}</span>
                          <span className="ml-auto text-success">− ৳{discountAmt.toFixed(2)}</span>
                        </div>
                        <div className="d-flex align-items-center h5 mb-0">
                          <span>Total</span>
                          <span className="ml-auto">৳{total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-3 d-flex" style={{ gap: 8, flexWrap: "wrap" }}>
                        <Button className="btn-blue btn-lg" onClick={addBundleToCart}>
                          Add bundle to cart
                        </Button>
                        <Button
                          className="btn-outline-secondary"
                          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                          title="Change inputs"
                        >
                          Change inputs
                        </Button>
                      </div>
                      <div className="small text-muted mt-2">
                        Note: The discount shown is for this bundle. We can wire it into checkout totals if you’d like.
                      </div>
                    </>
                  )}

                  {!loading && bundle.length === 0 && (
                    <div className="text-muted text-center" style={{ padding: "24px 0" }}>
                      Choose <b>Prompt</b> or <b>Questions</b>, then click <b>Generate Gift</b>.
                    </div>
                  )}
                </div>

                {/* Delivery notice */}
                <div className="small text-muted mt-2">
                  🚚 Orders typically deliver within <b>3 working days</b>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </section>
  );
};

export default Gifting;

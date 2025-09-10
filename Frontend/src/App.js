import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap-4-react';
import Home from "./pages/Home";
import Header from './components/Header';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Listing from './pages/Listing';
import ProductDetails from './pages/ProductDetails';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal'; 
import Cart from './pages/Cart';
import SignIn from './pages/SignIn';
import ChatBot from './components/ChatBot';
import Auth from "./pages/Auth";
import ProductListing from './pages/ProductListing';
import OrderConfirmation from "./pages/OrderConfirmation";
import CompleteProfile from "./pages/CompleteProfile"; 
import About from "./pages/About";
import Contact from"./pages/Contact";
import Wishlist from "./pages/Wishlist"; 
import History from "./pages/History";
import Gifting from "./pages/Gifting"; // ← NEW
import Swal from "sweetalert2";
import { IoHome } from "react-icons/io5"; // ← Home icon

const MyContext = createContext();

function AppContent() {
  const [cityList,setCityList]=useState([]);
  const [selectedCity,setselectedCity]=useState('');
  const [isOpenProductModal,setisOpenProductModal]=useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isHeaderFooterShow,setisHeaderFooterShow]=useState(true);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(() => {         
    try { return JSON.parse(localStorage.getItem("aura_mosaic_wishlist")) || []; }
    catch { return []; }
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'theme-green');

  const location = useLocation();
  const navigate = useNavigate(); // ← used by Home FAB

  // 🔐 Gate: pretty, animated login prompt (NO redirect here)
  const openLoginGate = async (message = "Please sign in to continue.") => {
    const res = await Swal.fire({
      title: "Hey there! 👋",
      html: `
        <div style="display:flex;align-items:center;gap:12px;justify-content:center;margin-bottom:8px;">
          <div style="font-size:28px;animation:pop .6s ease both;">🔐</div>
          <div style="text-align:left">
            <div style="font-weight:700;margin-bottom:2px;">You need an account</div>
            <div style="opacity:.8;">${message}</div>
          </div>
        </div>
        <style>
          @keyframes pop{0%{transform:scale(.85);opacity:.2}100%{transform:scale(1);opacity:1}}
        </style>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Sign in / Register",
      cancelButtonText: "Not now",
      reverseButtons: true,
      focusConfirm: false,
      allowOutsideClick: true,
    });
    return res.isConfirmed; // ← caller decides what to do
  };

  useEffect(()=>{
    getCity("http://localhost:5000/cities");
  },[]);
  
  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-green', 'theme-pink');
    body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (location.pathname === "/register" || location.pathname === "/signIn") {
      setisHeaderFooterShow(false);
    } else {
      setisHeaderFooterShow(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"));
    }
  }, [user]);

  const getCity = async (url) => {
    await axios.get(url).then((res) => {
      setCityList(res.data)
      console.log(res.data)
    })
  }

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("aura_mosaic_cart"));
      if (saved && Array.isArray(saved)) {
        setCart(saved);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("aura_mosaic_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("aura_mosaic_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // 🔐 Gate add-to-cart
  const addToCart = (product, qty = 1) => {
    if (!user) {
      openLoginGate("Adding items to cart is for members. Create an account in seconds!");
      return false; // tell callers we didn't add
    }

    const id =
      product._id ||
      product.id ||
      product.productId ||
      product.slug ||
      String(product.name);

    const name = product.name || product.title || "Unnamed Product";
    const price = Number(product.price) || 0;
    const image =
      (Array.isArray(product.images) && product.images[0]) ||
      product.thumbnail ||
      product.image ||
      "";

    setCart(prev => {
      const found = prev.find(i => i.id === id);
      if (found) {
        return prev.map(i =>
          i.id === id ? { ...i, qty: Math.min(99, (i.qty || 1) + qty) } : i
        );
      }
      return [...prev, { id, name, price, image, qty: Math.max(1, qty) }];
    });
    return true;
  };

  // 🔐 Gate wishlist
  const addToWishlist = (product) => {
    if (!user) {
      openLoginGate("Wishlist is a premium feature. Sign in to save your favorite products!");
      return false; // not added
    }

    const id =
      product._id ||
      product.id ||
      product.productId ||
      product.slug ||
      String(product.name);
    if (!id) return false;

    const name = product.name || product.title || "Unnamed Product";
    const price = Number(product.price) || 0;
    const image =
      (Array.isArray(product.images) && product.images[0]) ||
      product.thumbnail ||
      product.image ||
      "";

    let added = false;
    setWishlist(prev => {
      if (prev.some(i => i.id === id)) return prev;
      added = true;
      return [...prev, { id, name, price, image }];
    });
    return added;
  };

  const removeFromWishlist = (id) => {
    if (!user) {
      openLoginGate("Please sign in to manage your wishlist.");
      return;
    }
    setWishlist(prev => prev.filter(i => i.id !== id));
  };

  const isWishlisted = (id) => wishlist.some(i => i.id === id);

  const values={
    cityList,
    setCityList,
    selectedCity,
    setselectedCity,
    isOpenProductModal,
    setisOpenProductModal,
    isHeaderFooterShow,
    setisHeaderFooterShow,
    selectedProduct,
    setSelectedProduct,
    user,
    setUser,
    cart,
    setCart,
    addToCart,
    theme,
    setTheme,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    openLoginGate, // 👈 expose for components that need to gate navigation
  };

  /* side rails (unchanged) */
  const offerLines = [
    "Mega Deals • Up to 65% OFF",
    "Handcraft Specials • New Arrivals",
    "Plants Weekend • Buy 2 Get 1",
    "Skincare Combos • Save More",
    "Free Shipping on Tk. 500+",
  ];
  const proverbLines = [
    "Good things take time.",
    "Quality isn’t an act — it’s a habit.",
    "Small steps every day.",
    "Simplicity is sophistication.",
    "Happiness is handmade.",
  ];

  const [offerIndex, setOfferIndex] = useState(0);
  const [provIndex, setProvIndex] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => {
      setOfferIndex((i) => (i + 1) % offerLines.length);
    }, 3500);
    const t2 = setInterval(() => {
      setProvIndex((i) => (i + 1) % proverbLines.length);
    }, 4000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  // ✅ ProtectedRoute that runs the gate + redirect ONCE in an effect
  const RequireAuth = ({ children }) => {
    const [asked, setAsked] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
      if (!user && !asked) {
        setAsked(true);
        (async () => {
          const ok = await openLoginGate("This page is for members. Sign in to continue.");
          nav(ok ? "/register" : "/", { replace: true });
        })();
      }
    }, [user, asked, nav]);

    if (!user) return null;
    return children;
  };

  // Show Home FAB on all pages except the homepage
  const showHomeFab = location.pathname !== "/";

  return (
    <MyContext.Provider value={values}>
      {isHeaderFooterShow && <Header/>}

      {isHeaderFooterShow && (
        <>
          <div className="side-rail rail-left" aria-hidden>
            <div className="rail-inner">
              <span key={offerIndex} className="rail-text">{offerLines[offerIndex]}</span>
            </div>
          </div>
          <div className="side-rail rail-right" aria-hidden>
            <div className="rail-inner rail-inner-right">
              <span key={provIndex} className="rail-text">{proverbLines[provIndex]}</span>
            </div>
          </div>
        </>
      )}
    
      <Routes>
        <Route path="/" exact={true} element={<Home/>} />
        <Route path="/cat/:id" exact={true} element={<Listing/>} />
        <Route path="/product/:id" exact={true} element={<ProductDetails/>} />
        <Route path="/listing/:category" element={<ProductListing />} /> 
        <Route path="/gifting" element={<RequireAuth><Gifting /></RequireAuth>} />
        <Route path="/register" element={<Auth />} />
        <Route path="/cart" exact={true} element={<Cart/>} />
        <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>} /> 
        <Route path="/history" element={<History />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route exact={true} path='/signIn' element={<SignIn/>} />
        <Route path="/welcome" element={<CompleteProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {isHeaderFooterShow && <Footer/>}
      {isOpenProductModal && <ProductModal/>}

      {isHeaderFooterShow && <ChatBot />}
      {showHomeFab && (
        <button
          key={location.pathname}       
          className="home-fab pop-in"
          aria-label="Go to homepage"
          title="Home"
          onClick={() => navigate('/')}
        >
          <IoHome />
        </button>
      )}
    </MyContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
export {MyContext};

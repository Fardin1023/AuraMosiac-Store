import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

const MyContext =createContext();

function App() {
  const [cityList,setCityList]=useState([]);
  const [selectedCity,setselectedCity]=useState('');
  const [isOpenProductModal,setisOpenProductModal]=useState(false);
  const [isHeaderFooterShow,setisHeaderFooterShow]=useState(true);


  useEffect(()=>{
    getCity("http://localhost:5000/cities");
  },[])
  const getCity = async (url) => {
    await axios.get(url).then((res) => {
      setCityList(res.data)
      console.log(res.data)
    })
  }

  const values={
    cityList,
    setCityList,
    selectedCity,
    setselectedCity,
    isOpenProductModal,
    setisOpenProductModal,
    isHeaderFooterShow,
    setisHeaderFooterShow


  }
  return (
    <div>
    <BrowserRouter>
    <MyContext.Provider value={values}>
      {
        isHeaderFooterShow===true && <Header/>
      }
    
    <Routes>
      <Route path="/" exact ={true} element={<Home/>} />
      <Route path="/cat/:id" exact ={true} element={<Listing/>} />
      <Route path="/product/:id" exact ={true} element={<ProductDetails/>} />
      <Route path="/cart" exact ={true} element={<Cart/>} />
      <Route exact={true} path='/signIn' element={<SignIn/>} />

    </Routes>
    {
        isHeaderFooterShow===true && <Footer/>
      }
    
    {
      isOpenProductModal ===true && <ProductModal/>
    }
    </MyContext.Provider>
    </BrowserRouter>
    </div>
  );
}

export default App;
export {MyContext}

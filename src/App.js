import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap-4-react';
import Home from "./pages/Home";
import Header from './components/Header';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import ProductModal from '../../aura/src/components/ProductModal';


const MyContext =createContext();

function App() {
  const [cityList,setCityList]=useState([]);
  const [selectedCity,setselectedCity]=useState('');
  const [isOpenProductModal, setisOpenProductModal] =useState(false);
  const [productId, setProductId] = useState(null);
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
    productId,
   setProductId


  }
  return (
    <div>
    <BrowserRouter>
    <MyContext.Provider value={values}>
    <Header/>
    <Routes>
      <Route path="/" exact ={true} element={<Home/>} />
    </Routes>
    {
                      isOpenProductModal===true && <ProductModal/>
                    }
    </MyContext.Provider>
    </BrowserRouter>
    </div>
  );
}

export default App;
export {MyContext}


import { Route, Routes } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './App.css';
import Home from './Pages/Home/Home';
import Cart from './Pages/Cart/Cart';
import SingleProduct from './Pages/singleProduct/singleProduct';


function App() {
  return (
    <div className="">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Cart' element={<Cart/>}/> 
        <Route path='/singleProduct' element={<SingleProduct/>}/> 
      </Routes>
    </div>
  );
}

export default App;

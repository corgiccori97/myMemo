import Home from './Home';
import { Route, Routes } from 'react-router-dom';
import Join from './Routes/Join';
import SignIn from './Routes/SignIn';
import Header from './Components/Header';
import { useState, useEffect } from 'react'; 
import Signout from './Routes/Signout';

// 페이지별
function App() {
  return (
    <div className="w-full max-h-full color-bg">
      <div className="leaf leaf-1"></div>
      <div className="leaf leaf-2"></div>
      <div className="leaf leaf-3"></div>
      <div className="leaf leaf-4"></div>
      <div className="leaf leaf-5"></div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/join" element={<Join />}></Route>             
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/signout" element={<Signout />}></Route>
      </Routes>
    </div>
  );
}

export default App;

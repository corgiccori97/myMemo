import Home from './Home';
import { Route, Routes } from 'react-router-dom';
import Join from './Routes/Join';
import SignIn from './Routes/SignIn';
import Header from './Components/Header';
import { useState, useEffect } from 'react'; 
import Signout from './Routes/Signout';
import { authenticatedState } from './atoms';
import { useRecoilValue } from 'recoil';

// 페이지별
function App() {
  const authenticated = useRecoilValue(authenticatedState);
  
  //// 추후에 삭제할 코드!!!
  // const [authenticated, setAuthenticated] = useState(false);
  // useEffect(() => {
  //     fetch('http://localhost:3001/check-session', {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //         },
  //         credentials: 'include'
  //     })
  //     .then((res) => res.json())
  //     .then((json) => {
  //         if (json.sessionExists === true) {
  //             setAuthenticated(true);
  //         }
  //     })
  // }, []);

  return (
    <div className="w-full max-h-full color-bg z-0">
      <div className="leaf leaf-1"></div>
      <div className="leaf leaf-2"></div>
      <div className="leaf leaf-3"></div>
      <div className="leaf leaf-4"></div>
      <div className="leaf leaf-5"></div>
      <Header authenticated={ authenticated } />
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

import Home from './Home';
import { Route, Routes } from 'react-router-dom';
import Join from './Routes/Join';
import SignIn from './Routes/SignIn';
import Header from './Components/Header';
import { useState, useEffect } from 'react'; 

// 페이지별
function App() {
  const [checkSession, SetCheckSession] = useState(false);
  
  useEffect(() => {
      console.log("check-session start");
      fetch('http://localhost:3001/check-session')
      .then(res => res.json())
      .then(json => {
          console.log(json);
          if (json.sessionExists === true) {
              SetCheckSession(true);
          }
      })
  }, []);

  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/join" element={<Join />}></Route>             
      <Route path="/signin" element={<SignIn />}></Route>
    </Routes>
    </>
  );
}

export default App;

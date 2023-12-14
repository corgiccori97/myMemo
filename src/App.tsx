import Home from './Home';
import { Route, Routes } from 'react-router-dom';
import Join from './Routes/Join';
import SignIn from './Routes/SignIn';
import Header from './Components/Header';
import { useEffect } from 'react'; 
import Signout from './Routes/Signout';
import { authenticatedState } from './atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import Notebook from './Components/Notebook';

// 페이지별
function App() {
  const [, setAuthenticated] = useRecoilState(authenticatedState);
  useEffect(() => {
      fetch('http://localhost:3001/check-session', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include'
      })
      .then((res) => res.json())
      .then((json) => {
          if (json.sessionExists === true) {
            setAuthenticated(true);
          } else {
            setAuthenticated(false);
          }
      })
  }, []);

  return (
      <div className="w-screen max-h-full bg-[url('./assets/background.JPG')] bg-cover">
        <div className="h-screen text-center relative flex flex-col">
          <Header authenticated={ useRecoilValue(authenticatedState) } />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/join" element={<Join />}></Route>             
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signout" element={<Signout />}></Route>
            <Route path="/notebook/:id" element={<Notebook /> }></Route>
          </Routes>
        </div>
      </div>
  );
}

export default App;

import Home from './Home';
import { Route, Routes } from 'react-router-dom';
import Join from './Routes/Join';
import SignIn from './Routes/SignIn';

// 페이지별
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/join" element={<Join />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
    </Routes>
    </>
  );
}

export default App;

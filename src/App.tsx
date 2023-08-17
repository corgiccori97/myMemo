import Home from './Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Join from './Routes/Join';

// 페이지별
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/join" element={<Join />}></Route>
    </Routes>
    </>
  );
}

export default App;

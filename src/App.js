import { Routes, Route } from "react-router-dom";

import "./App.scss";
import MapSelection from "./components/mapSelection/MapSelection";
import WaldoImgContainer from "./components/waldoImgContainer/WaldoImgContainer";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<MapSelection />} />
        <Route path='/map/:mapID' element={<WaldoImgContainer />} />
      </Routes>
    </div>
  );
}

export default App;

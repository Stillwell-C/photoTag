import { Routes, Route } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";

import "./App.scss";
import MapSelection from "./components/mapSelection/MapSelection";
import WaldoImgContainer from "./components/waldoImgContainer/WaldoImgContainer";
import { WaldoInfoContext } from "./DataContext";
import { dataDocRef } from "./firebase";

function App() {
  const [waldoInfo, setWaldoInfo] = useState(null);

  const memoizedWaldoInfo = useMemo(() => ({ waldoInfo }), [waldoInfo]);

  useEffect(() => {
    const getData = async () => {
      try {
        const recievedData = await getDoc(dataDocRef);
        setWaldoInfo(recievedData.data());
      } catch (err) {
        console.log(err.message);
      }
    };

    getData();
  }, []);

  return (
    <div className='App'>
      <WaldoInfoContext.Provider value={memoizedWaldoInfo}>
        <Routes>
          <Route path='/' element={<MapSelection />} />
          <Route path='/map/:mapID' element={<WaldoImgContainer />} />
        </Routes>
      </WaldoInfoContext.Provider>
    </div>
  );
}

export default App;

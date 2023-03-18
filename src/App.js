import { Routes, Route } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { getDoc } from "firebase/firestore";

import "./App.scss";
import MapSelection from "./components/mapSelection/MapSelection";
import WaldoImgContainer from "./components/waldoImgContainer/WaldoImgContainer";
import { WaldoInfoContext } from "./DataContext";
import { dataDocRef } from "./firebase";
import ErrorPage from "./components/errorPage/ErrorPage";
import LeaderBoard from "./components/leaderBoard/LeaderBoard";
import Navbar from "./components/navbar/Navbar";

function App() {
  const [waldoInfo, setWaldoInfo] = useState(null);

  //Removed this temporarily because it was interferring with testing
  //TODO: figure out how to implement with functioning tests
  const memoizedWaldoInfo = useMemo(() => ({ waldoInfo }), [waldoInfo]);
  console.log("memo", memoizedWaldoInfo);

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
      <Navbar />
      <WaldoInfoContext.Provider value={memoizedWaldoInfo}>
        <Routes>
          <Route path='/' element={<MapSelection />} />
          <Route path='/map/:mapID' element={<WaldoImgContainer />} />
          <Route path='/leaderboards' element={<LeaderBoard />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </WaldoInfoContext.Provider>
    </div>
  );
}

export default App;

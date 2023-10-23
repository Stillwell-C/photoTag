import { Routes, Route } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { getDoc } from "firebase/firestore";

import "./App.scss";
import MapSelection from "./components/mapSelection/MapSelection";
import WaldoImgContainer from "./components/waldoImgContainer/WaldoImgContainer";
import { dataDocRef } from "./firebase";
import ErrorPage from "./components/errorPage/ErrorPage";
import LeaderBoard from "./components/leaderBoard/LeaderBoard";
import Navbar from "./components/navbar/Navbar";
import ContextProviderLayout from "./components/ContextProviderLayout";
import LoadingPage from "./components/loadingPage/LoadingPage";
import Layout from "./components/Layout";

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
      <Routes>
        <Route element={<Layout />}>
          <Route path='/'>
            <Route index element={<MapSelection />} />
            <Route element={<ContextProviderLayout />}>
              <Route path='/map/:mapID' element={<WaldoImgContainer />} />
            </Route>
            <Route path='/leaderboards' element={<LeaderBoard />} />
            <Route path='/loading' element={<LoadingPage />} />

            <Route path='*' element={<ErrorPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;

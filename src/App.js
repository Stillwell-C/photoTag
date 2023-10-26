import { Routes, Route } from "react-router-dom";

import "./App.scss";
import MapSelection from "./components/mapSelection/MapSelection";
import WaldoImgContainer from "./components/waldoImgContainer/WaldoImgContainer";
import ErrorPage from "./components/errorPage/ErrorPage";
import LeaderBoard from "./components/leaderBoard/LeaderBoard";
import ContextProviderLayout from "./components/ContextProviderLayout";
import LoadingPage from "./components/loadingPage/LoadingPage";
import Layout from "./components/Layout";

function App() {
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

import { Routes, Route } from "react-router-dom";

import MapSelection from "./components/mapSelection/MapSelection";
import WaldoImgContainer from "./components/waldoImgContainer/WaldoImgContainer";
import ErrorPage from "./components/errorPage/ErrorPage";
import LeaderBoard from "./components/leaderBoard/LeaderBoard";
import ContextProviderLayout from "./components/ContextProviderLayout";
import LoadingPage from "./components/loadingPage/LoadingPage";
import Layout from "./components/Layout";

function App() {
  return (
    <div className='font-serif min-h-screen bg-neutral-50 dark:bg-zinc-900 dark:text-neutral-50 min-w-full '>
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

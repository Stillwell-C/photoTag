import { useEffect, useState } from "react";

import LoadingPage from "../loadingPage/LoadingPage";
// import "./leaderboard.scss";
import photoTagApi from "../../app/api/photoTagApi";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

type SingleLeader = {
  _id: string;
  playerName: string;
  seconds: number;
  mapId: string;
  timer: string;
};

interface SingleMapData {
  mapName: string;
  leaderData: SingleLeader[];
}

const LeaderBoard = () => {
  const [leaderData, setLeaderData] = useState<SingleMapData[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  const navigate = useNavigate();

  const getMapData = async () => {
    try {
      const { data } = await photoTagApi.get("/leaderboard");
      setLeaderData(data);
      setLoading(false);
    } catch (e) {
      const err = e as AxiosError;
      setLoading(false);
      if (err?.response) {
        navigate("/error", {
          state: { errorCode: err?.response?.status },
        });
      } else {
        navigate("/error", {
          state: { errorCode: err?.code },
        });
      }
    }
  };

  useEffect(() => {
    getMapData();
  }, []);

  const leaderBoardMapCards = leaderData?.map((singleBoard) => (
    <article
      className='responsive-card w-full h-80 text-center rounded-lg px-4 shadow-lg '
      key={singleBoard?.mapName}
    >
      <table className='w-full border-collapse mb-8'>
        <caption className='text-2xl font-semibold mt-4 underline '>
          {singleBoard?.mapName}
        </caption>
        <thead className='flex justify-center'>
          <tr className='flex-grow flex justify-around items-center text-xl mb-4'>
            <th>Player</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody className='flex flex-col gap-1'>
          {singleBoard?.leaderData?.slice(0, 5).map((entry, index) => (
            <tr className='flex justify-center items-center' key={entry._id}>
              <td className=' text-xl flex-1 '>{entry.playerName}</td>
              <td className='text-xl flex-1'>{entry.timer}</td>
            </tr>
          ))}
          {!(singleBoard?.leaderData?.length > 0) && (
            <tr className='flex justify-center items-center'>
              <td className='text-xl flex-1'>No data yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </article>
  ));

  return (
    <>
      {loading && <LoadingPage />}
      {leaderData.length > 0 && (
        <div className=' w-full flex item-center justify-center flex-col text-center'>
          <h2 className='text-5xl font-semibold mb-12'>Leaderboards</h2>
          <div className='flex pb-4 items-start justify-center flex-wrap w-full max-w-7xl gap-7 md:px-4'>
            {leaderBoardMapCards}
          </div>
        </div>
      )}
    </>
  );
};

export default LeaderBoard;

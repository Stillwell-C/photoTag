import { useEffect, useState } from "react";

import LoadingPage from "../loadingPage/LoadingPage";
import "./leaderboard.scss";
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
    <article className='single-leaderboard' key={singleBoard?.mapName}>
      <table>
        <caption>{singleBoard?.mapName}</caption>
        <tbody>
          <tr className='entry-header'>
            <th>Player</th>
            <th>Time</th>
          </tr>
          {singleBoard?.leaderData?.slice(0, 5).map((entry, index) => (
            <tr className='entry-div' key={entry._id}>
              <td className='entryName'>{entry.playerName}</td>
              <td className='entryTime'>{entry.timer}</td>
            </tr>
          ))}
          {!(singleBoard?.leaderData?.length > 0) && (
            <tr className='entry-div'>
              <td className='no-data'>No data yet</td>
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
        <div className='container'>
          <h2 className='title'>Leaderboards</h2>
          <div className='leaderboard-container'>{leaderBoardMapCards}</div>
        </div>
      )}
    </>
  );
};

export default LeaderBoard;

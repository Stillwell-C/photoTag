import { useEffect, useState } from "react";

import LoadingPage from "../loadingPage/LoadingPage";
import "./leaderboard.scss";
import photoTagApi from "../../app/api/photoTagApi";

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

  const getMapData = async () => {
    const { data } = await photoTagApi.get("/leaderboard");
    setLeaderData(data);
    setLoading(false);
    console.log(data);
  };

  useEffect(() => {
    getMapData();
  }, []);

  return (
    <>
      {loading && <LoadingPage />}
      {!loading && leaderData.length > 0 && (
        <div className='container'>
          <h2 className='title'>Leaderboards</h2>
          <div className='leaderboard-container'>
            {leaderData?.map((singleBoard) => (
              <div className='single-leaderboard' key={singleBoard?.mapName}>
                <h3>{singleBoard?.mapName}</h3>
                <div className='entry-header'>
                  <div>Player</div>
                  <div>Time</div>
                </div>
                <div className='leaderboard-div'>
                  {singleBoard?.leaderData?.map((entry, index) => (
                    <div className='entry-div' key={entry._id}>
                      <div className='entryName'>{entry.playerName}</div>
                      <div className='entryTime'>{entry.timer}</div>
                    </div>
                  ))}
                  {!(singleBoard?.leaderData?.length > 0) && (
                    <div className='no-data'>No data yet</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default LeaderBoard;

import { useContext, useEffect, useState } from "react";
import { WaldoInfoContext } from "../../DataContext";

import { db, getTopDocs } from "../../firebase";
import LoadingPage from "../loadingPage/LoadingPage";
import "./leaderboard.scss";

const LeaderBoard = () => {
  const { waldoInfo } = useContext(WaldoInfoContext);
  const [leaderData, setLeaderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (waldoInfo !== null) queryBoards();
  }, [waldoInfo]);

  const queryBoards = async () => {
    setLoading(true);
    const mapLoadList = waldoInfo.mapLoadList;
    const mapArr = [];
    for (let mapName of mapLoadList) {
      try {
        const data = await getTopDocs(waldoInfo.images[mapName].leaderboard);
        const dataArr = [];
        data.forEach((doc) => dataArr.push({ id: doc.id, ...doc.data() }));
        mapArr.push({ ...waldoInfo.images[mapName], data: dataArr });
      } catch (err) {
        console.log(err.message);
      }
    }
    setLeaderData(mapArr);
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingPage />}
      {!loading && (
        <div className='container'>
          <h2 className='title'>Leaderboards</h2>
          <div className='leaderboard-container'>
            {leaderData.map((singleBoard) => (
              <div className='single-leaderboard' key={singleBoard.id}>
                <h3>{singleBoard.name}</h3>
                <div className='entry-header'>
                  <div>Player</div>
                  <div>Time</div>
                </div>
                <div className='leaderboard-div'>
                  {singleBoard.data.map((entry) => (
                    <div className='entry-div' key={entry.id}>
                      <div className='entryName'>{entry.name}</div>
                      <div className='entryTime'>{entry.timer}</div>
                    </div>
                  ))}
                  {singleBoard.data.length < 1 && (
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

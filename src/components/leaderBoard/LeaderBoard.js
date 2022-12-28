import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "../../firebase";
import LoadingPage from "../loadingPage/LoadingPage";
import "./leaderboard.scss";

const LeaderBoard = () => {
  const snowLead = query(
    collection(db, "snowLeaderboard"),
    orderBy("seconds"),
    limit(5)
  );
  const cityLead = query(
    collection(db, "cityLeaderboard"),
    orderBy("seconds"),
    limit(5)
  );
  const deptLead = query(
    collection(db, "deptLeaderboard"),
    orderBy("seconds"),
    limit(5)
  );
  const muskLead = query(
    collection(db, "musketeersLeaderboard"),
    orderBy("seconds"),
    limit(5)
  );

  const [leaderData, setLeaderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const queryBoards = async () => {
      try {
        const snowCol = await getDocs(snowLead);
        const snowArr = [];
        snowCol.forEach((doc) => snowArr.push({ id: doc.id, ...doc.data() }));
        const cityCol = await getDocs(cityLead);
        const cityArr = [];
        cityCol.forEach((doc) => cityArr.push({ id: doc.id, ...doc.data() }));
        const deptCol = await getDocs(deptLead);
        const deptArr = [];
        deptCol.forEach((doc) => deptArr.push({ id: doc.id, ...doc.data() }));
        const muskCol = await getDocs(muskLead);
        const muskArr = [];
        muskCol.forEach((doc) => muskArr.push({ id: doc.id, ...doc.data() }));
        setLeaderData({
          snowMap: snowArr,
          cityMap: cityArr,
          deptMap: deptArr,
          muskMap: muskArr,
        });
        setLoading(false);
      } catch (err) {
        console.log(err.message);
      }
    };
    queryBoards();
  }, []);

  return (
    <>
      {loading && <LoadingPage />}
      {!loading && (
        <div className='container'>
          <h2 className='title'>LeaderBoard</h2>
          <div className='leaderboard-container'>
            <div className='leaderboard-line'>
              <div className='single-leaderboard'>
                <h3>Ski Slope</h3>
                <div className='leaderboard-div'>
                  {leaderData.snowMap.map((entry) => (
                    <div className='entry-div' key={entry.id}>
                      <div className='entryName'>{entry.name}</div>
                      <div className='entryTime'>{entry.timer}</div>
                    </div>
                  ))}
                  {leaderData.snowMap.length < 1 && (
                    <div className='no-data'>No data yet</div>
                  )}
                </div>
              </div>
              <div className='single-leaderboard'>
                <h3>City</h3>
                <div className='leaderboard-div'>
                  {leaderData.cityMap.map((entry) => (
                    <div className='entry-div' key={entry.id}>
                      <div className='entryName'>{entry.name}</div>
                      <div className='entryTime'>{entry.timer}</div>
                    </div>
                  ))}
                  {leaderData.cityMap.length < 1 && (
                    <div className='no-data'>No data yet</div>
                  )}
                </div>
              </div>
            </div>
            <div className='leaderboard-line'>
              <div className='single-leaderboard'>
                <h3>Deptartment Store</h3>
                <div className='leaderboard-div'>
                  {leaderData.deptMap.map((entry) => (
                    <div className='entry-div' key={entry.id}>
                      <div className='entryName'>{entry.name}</div>
                      <div className='entryTime'>{entry.timer}</div>
                    </div>
                  ))}
                  {leaderData.deptMap.length < 1 && (
                    <div className='no-data'>No data yet</div>
                  )}
                </div>
              </div>
              <div className='single-leaderboard'>
                <h3>Swashbuckling Musketeers</h3>
                <div className='leaderboard-div'>
                  {leaderData.muskMap.map((entry) => (
                    <div className='entry-div' key={entry.id}>
                      <div className='entryName'>{entry.name}</div>
                      <div className='entryTime'>{entry.timer}</div>
                    </div>
                  ))}
                  {leaderData.muskMap.length < 1 && (
                    <div className='no-data'>No data yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaderBoard;

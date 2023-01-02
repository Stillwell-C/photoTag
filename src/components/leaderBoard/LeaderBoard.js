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
        // setLeaderData({
        //   snowMap: snowArr,
        //   cityMap: cityArr,
        //   deptMap: deptArr,
        //   muskMap: muskArr,
        // });
        setLeaderData([
          { id: "snowMap", data: snowArr, name: "Ski Slope" },
          { id: "cityMap", data: cityArr, name: "City" },
          { id: "deptMap", data: deptArr, name: "Department Store" },
          { id: "muskMap", data: muskArr, name: "Swashbuckling Musketeers" },
        ]);
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

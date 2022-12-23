import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import snowMap from "../../assets/waldoSnow.jpg";
import cityMap from "../../assets/waldoCity.jpg";
import deptMap from "../../assets/waldoDeptStore.jpg";
import musketeersMap from "../../assets/waldoMusketeers.jpg";

import odlaw from "../../assets/odlaw-face.jpg";
import waldo from "../../assets/waldo-face.webp";
import whitebeard from "../../assets/whitebeard-face.jpeg";
import loadingImg from "../../assets/loading.jpg";
import "./waldoImgContainer.scss";

const WaldoImg1 = () => {
  const { mapID } = useParams();

  const [charCoords, setCharCoords] = useState({});

  const snowCoords = {
    waldoMinX: 83.6,
    waldoMaxX: 87.5,
    waldoMinY: 44.8,
    waldoMaxY: 49.2,
    whitebeardMinX: 6.0,
    whitebeardMaxX: 9,
    whitebeardMinY: 46.75,
    whitebeardMaxY: 49.5,
    odlawMinX: 31,
    odlawMaxX: 32.5,
    odlawMinY: 39.45,
    odlawMaxY: 41.5,
  };

  const cityCoords = {
    waldoMinX: 41.8,
    waldoMaxX: 44.8,
    waldoMinY: 45,
    waldoMaxY: 50,
    whitebeardMinX: 65,
    whitebeardMaxX: 67.5,
    whitebeardMinY: 47.2,
    whitebeardMaxY: 49,
    odlawMinX: 57.6,
    odlawMaxX: 59.6,
    odlawMinY: 58.4,
    odlawMaxY: 60.8,
  };
  const deptCoords = {
    waldoMinX: 40.9,
    waldoMaxX: 43.2,
    waldoMinY: 10.35,
    waldoMaxY: 13.5,
    whitebeardMinX: 68.05,
    whitebeardMaxX: 69.65,
    whitebeardMinY: 2.05,
    whitebeardMaxY: 4,
    odlawMinX: 18.95,
    odlawMaxX: 20.35,
    odlawMinY: 44.75,
    odlawMaxY: 48.05,
  };
  const muskCoords = {
    waldoMinX: 52.17,
    waldoMaxX: 53.15,
    waldoMinY: 49.75,
    waldoMaxY: 51.2,
    whitebeardMinX: 93.25,
    whitebeardMaxX: 94.79,
    whitebeardMinY: 17.95,
    whitebeardMaxY: 20.2,
    odlawMinX: 14.7,
    odlawMaxX: 15.5,
    odlawMinY: 22.41,
    odlawMaxY: 23.95,
  };

  const [mapSelection, setMapSelection] = useState();
  const [clickCoord, setClickCoord] = useState({});
  const [found, setFound] = useState({
    waldo: false,
    whitebeard: false,
    odlaw: false,
  });
  const [charOpac, setCharOpac] = useState({
    waldo: 1,
    whitebeard: 1,
    odlaw: 1,
  });
  const [loading, setLoading] = useState(false);
  const [gameover, setGameover] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState("");
  const [popupStyle, setPopupStyle] = useState({});
  const [playerMessage, setPlayerMessage] = useState(
    "Click the screen to find the characters."
  );

  useEffect(() => {
    //TODO eventually use this to retrieve correct coords
    //TODO find a better way of doing this - a reducer or soemthign.
    //This will eventually retrieve info from online
    switch (mapID) {
      case "snowMap":
        setMapSelection(snowMap);
        setCharCoords(snowCoords);
        break;
      case "cityMap":
        setMapSelection(cityMap);
        setCharCoords(cityCoords);
        break;
      case "deptMap":
        setMapSelection(deptMap);
        setCharCoords(deptCoords);
        break;
      case "musketeersMap":
        setMapSelection(musketeersMap);
        setCharCoords(muskCoords);
        break;
      default:
        console.log("Map name error.");
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (!gameover) {
      interval = setInterval(() => {
        setSeconds(seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [seconds, gameover]);

  useEffect(() => {
    handleTime(seconds);
  }, [seconds]);

  useEffect(() => {
    if (
      found.waldo === true &&
      found.whitebeard === true &&
      found.odlaw === true
    ) {
      setGameover(true);
      setPlayerMessage("Good job, you're all done");
    }
  }, [found]);

  const handleTime = (secondCount) => {
    const hour = Math.floor(secondCount / 3600).toString();
    const min = Math.floor((secondCount % 3600) / 60).toString();
    const sec = Math.floor((secondCount % 3600) % 60).toString();

    const hourDisp = hour > 0 ? (hour > 9 ? hour : "0" + hour) : "00";
    const minDisp = min > 0 ? (min > 9 ? min : "0" + min) : "00";
    const secDisp = sec > 0 ? (sec > 9 ? sec : "0" + sec) : "00";

    setTimer(`${hourDisp}:${minDisp}:${secDisp}`);
  };

  const handleClickCoord = (e) => {
    if (gameover) return;
    const rect = e.target.getBoundingClientRect();
    const rectRatio = rect.width / 100;
    const xCoord =
      Math.round(((e.clientX - rect.left) / rectRatio) * 100) / 100;
    const yCoord = Math.round(((e.clientY - rect.top) / rectRatio) * 100) / 100;
    const popupStyle = {
      left: `${((e.clientX - rect.left - 25) * 100) / rect.width}%`,
      top: `${((e.clientY - rect.top - 25) * 100) / rect.height}%`,
      display: "flex",
    };
    setPopupStyle(popupStyle);
    setClickCoord({ x: xCoord, y: yCoord });
  };

  const handleButtonClick = (char) => {
    setPopupStyle({ display: "none" });
    const minX = `${char}MinX`;
    const maxX = `${char}MaxX`;
    const minY = `${char}MinY`;
    const maxY = `${char}MaxY`;
    if (
      clickCoord.x >= charCoords[minX] &&
      clickCoord.x <= charCoords[maxX] &&
      clickCoord.y >= charCoords[minY] &&
      clickCoord.y <= charCoords[maxY]
    ) {
      setCharOpac({ ...charOpac, [char]: 0.5 });
      setPlayerMessage(
        `You found ${char.slice(0, 1).toUpperCase() + char.slice(1)}`
      );
      setFound({ ...found, [char]: true });
      return;
    }
    setPlayerMessage("Keep looking");
  };

  return (
    <div className='container'>
      {loading && (
        <div className='loadingDiv'>
          <img src={loadingImg} alt='Waldo for loading screen' />
          <p className='loadingText'>Loading...</p>
        </div>
      )}
      {!loading && (
        <>
          <div className='gameInfo'>
            <div className='timerDiv'>{timer}</div>
            <div className='playerMessage'>{playerMessage}</div>
            <div className='characterDisplay'>
              <img
                src={waldo}
                alt='Character Waldo'
                style={{ opacity: charOpac.waldo }}
              />
              <img
                src={odlaw}
                alt='Character Odlaw'
                style={{ opacity: charOpac.odlaw }}
              />
              <img
                src={whitebeard}
                alt='Character Whitebeard'
                style={{ opacity: charOpac.whitebeard }}
              />
            </div>
          </div>

          <div className='imgDiv'>
            <img
              src={mapSelection}
              alt='Large crowd with waldo among them'
              onClick={handleClickCoord}
              id='waldoPic'
            />
            <div className='popup' style={popupStyle}>
              <div className='popupCircle'></div>
              <div className='popupButtons'>
                <button
                  disabled={!gameover ? false : true}
                  onClick={() => handleButtonClick("waldo")}
                >
                  Waldo
                </button>
                <button
                  disabled={!gameover ? false : true}
                  onClick={() => handleButtonClick("whitebeard")}
                >
                  Whitebeard
                </button>
                <button
                  disabled={!gameover ? false : true}
                  onClick={() => handleButtonClick("odlaw")}
                >
                  Odlaw
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {gameover && (
        <>
          <div className='modalContainer'>
            <div className='modalHeader'>Congratulations!</div>
            <div className='modalBody'>
              <div className='modalInfo'>Your time was {timer}</div>
              <div className='modalForm'>
                <form>
                  <label htmlFor='name'>Submit your score:</label>
                  <div className='inputDiv'>
                    <input type='text' id='name' placeholder='Name' />
                    <button type='submit'>Submit</button>
                  </div>
                </form>
              </div>
              <Link to='/'>
                <button className='homeButton'>Back to home</button>
              </Link>
            </div>
          </div>
          <div className='overlay'></div>
        </>
      )}
    </div>
  );
};

export default WaldoImg1;

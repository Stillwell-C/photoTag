import React, { useEffect, useState } from "react";
import waldoSnow from "../../assets/waldoSnow.jpg";
import odlaw from "../../assets/odlaw-face.jpg";
import waldo from "../../assets/waldo-face.webp";
import whitebeard from "../../assets/whitebeard-face.jpeg";
import loadingImg from "../../assets/loading.jpg";
import "./waldoImgContainer.scss";

const WaldoImg1 = () => {
  const [charCoords, setCharCoords] = useState({
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
  });
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
    console.log(clickCoord);
  };

  const handleButtonClick = (char) => {
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
              src={waldoSnow}
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
              <button className='homeButton'>Back to home</button>
            </div>
          </div>
          <div className='overlay'></div>
        </>
      )}
    </div>
  );
};

export default WaldoImg1;

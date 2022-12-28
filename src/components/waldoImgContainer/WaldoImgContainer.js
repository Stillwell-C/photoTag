import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

import "./waldoImgContainer.scss";
import { WaldoInfoContext } from "../../DataContext";
import { storage, db } from "../../firebase";
import LoadingPage from "../loadingPage/LoadingPage";

const WaldoImg1 = () => {
  const { mapID } = useParams();
  const { waldoInfo } = useContext(WaldoInfoContext);

  const [charCoords, setCharCoords] = useState({});

  const [mapSelection, setMapSelection] = useState();
  const [charFaces, setCharFaces] = useState({});
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
  const [mapLoading, setMapLoading] = useState(true);
  const [facesLoading, setFacesLoading] = useState(true);
  const [gameover, setGameover] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState("");
  const [popupStyle, setPopupStyle] = useState({});
  const [playerMessage, setPlayerMessage] = useState(
    "Click the screen to find the characters."
  );
  const [inputVal, setInputVal] = useState("");
  const [collectionRef, setCollectionRef] = useState();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadBackgroundImg = async (mapName) => {
      try {
        const backgroundImg = await getDownloadURL(
          ref(storage, waldoInfo.images[mapName])
        );
        setMapSelection(backgroundImg);
        setFacesLoading(false);
      } catch (err) {
        console.log("Background Img: ", err.message);
      }
    };
    const loadCharacterImg = async () => {
      try {
        const waldo = await getDownloadURL(
          ref(storage, waldoInfo.images.waldoFace)
        );
        const odlaw = await getDownloadURL(
          ref(storage, waldoInfo.images.odlawFace)
        );
        const whitebeard = await getDownloadURL(
          ref(storage, waldoInfo.images.whitebeardFace)
        );
        const wenda = await getDownloadURL(
          ref(storage, waldoInfo.images.wendaFace)
        );

        setCharFaces({
          waldoFace: waldo,
          odlawFace: odlaw,
          whitebeardFace: whitebeard,
          wendaFace: wenda,
        });
        setMapLoading(false);
      } catch (err) {
        console.log("Character Img: ", err.message);
      }
    };

    if (waldoInfo !== null) {
      loadCharacterImg();
      switch (mapID) {
        case "snowMap":
          loadBackgroundImg("waldoSnow");
          setCharCoords(waldoInfo.coords.snowCoords);
          setCollectionRef(collection(db, "snowLeaderboard"));
          break;
        case "cityMap":
          loadBackgroundImg("waldoCity");
          setCharCoords(waldoInfo.coords.cityCoords);
          setCollectionRef(collection(db, "cityLeaderboard"));
          break;
        case "deptMap":
          loadBackgroundImg("waldoDeptStore");
          setCharCoords(waldoInfo.coords.deptCoords);
          setCollectionRef(collection(db, "deptLeaderboard"));
          break;
        case "musketeersMap":
          loadBackgroundImg("waldoMusketeers");
          setCharCoords(waldoInfo.coords.muskCoords);
          setCollectionRef(collection(db, "musketeersLeaderboard"));
          break;
        default:
          console.log("Loading Error.");
      }
    }
  }, [waldoInfo]);

  useEffect(() => {
    let interval = null;
    if (!gameover && !mapLoading && !facesLoading) {
      interval = setInterval(() => {
        setSeconds(seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [seconds, gameover, mapLoading, facesLoading]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisableSubmit(true);
    try {
      setSubmitErrorMsg("");
      await addDoc(collectionRef, {
        name: inputVal,
        seconds: seconds,
        timer: timer,
      });
      navigate("/");
    } catch (err) {
      setDisableSubmit(false);
      setSubmitErrorMsg("Submission error. Please try again.");
      console.log(err.message);
    }
  };

  return (
    <div className='container'>
      {(facesLoading || mapLoading) && <LoadingPage />}
      {!facesLoading && !mapLoading && (
        <>
          <div className='gameInfo'>
            <div className='timerDiv'>{timer}</div>
            <div className='playerMessage'>{playerMessage}</div>
            <div className='characterDisplay'>
              <img
                src={charFaces.waldoFace}
                alt='Character Waldo'
                style={{ opacity: charOpac.waldo }}
              />
              <img
                src={charFaces.odlawFace}
                alt='Character Odlaw'
                style={{ opacity: charOpac.odlaw }}
              />
              <img
                src={charFaces.whitebeardFace}
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
                <form onSubmit={handleSubmit}>
                  <label htmlFor='name'>Submit your score:</label>
                  <div className='inputDiv'>
                    <input
                      onChange={(e) => setInputVal(e.target.value)}
                      type='text'
                      id='name'
                      placeholder='Name'
                    />
                    <button type='submit' disabled={disableSubmit}>
                      Submit
                    </button>
                  </div>
                  <div className='errorMsg'>{submitErrorMsg}</div>
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

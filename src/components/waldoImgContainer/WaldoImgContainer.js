import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

import "./waldoImgContainer.scss";
import { WaldoInfoContext } from "../../DataContext";
import { storage, db } from "../../firebase";
import LoadingPage from "../loadingPage/LoadingPage";
import Modal from "../modal/Modal";

const WaldoImg1 = () => {
  const { mapID } = useParams();
  const { waldoInfo } = useContext(WaldoInfoContext);

  const [charCoords, setCharCoords] = useState({});

  const [mapSelection, setMapSelection] = useState();
  const [mapAltText, setMapAltText] = useState("");
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
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadBackgroundImg = async (mapName) => {
      try {
        const backgroundImg = await getDownloadURL(
          ref(storage, waldoInfo.images[mapName])
        );
        setMapSelection(backgroundImg);
        setMapAltText(waldoInfo.imgAltText[mapName]);
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
    if (!inputVal.length) {
      setSubmitErrorMsg("Error. Please input a name");
      return;
    }
    setDisableSubmit(true);
    try {
      setSubmitErrorMsg("");
      setSubmitting(true);
      await addDoc(collectionRef, {
        name: inputVal,
        seconds: seconds,
        timer: timer,
      });
      navigate("/");
    } catch (err) {
      setSubmitting(false);
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
              alt={mapAltText}
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
        <Modal
          timer={timer}
          handleSubmit={handleSubmit}
          setInputVal={setInputVal}
          disableSubmit={disableSubmit}
          submitErrorMsg={submitErrorMsg}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default WaldoImg1;

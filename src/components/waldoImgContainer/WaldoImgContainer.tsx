import React, { useEffect, useReducer, MouseEvent, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./waldoImgContainer.scss";

import {
  reducer,
  initialState,
  REDUCER_ACTION_TYPE,
  FoundType,
  usePhotoTag,
} from "../../Context/PhotoTagContext";
import LoadingPage from "../loadingPage/LoadingPage";
import Modal from "../modal/Modal";

import waldoFace from "../../assets/waldo-face.webp";
import wendaFace from "../../assets/wenda-face.png";
import odlawFace from "../../assets/odlaw-face.jpg";
import whitebeardFace from "../../assets/whitebeard-face.jpeg";
import photoTagApi from "../../app/api/photoTagApi";
import { AxiosError } from "axios";

type Coordinate = {
  [key: string]: number;
};

interface MapData {
  data: {
    _id: string;
    mapName: string;
    imgKey: string;
    coordinates: Coordinate;
  };
}

const WaldoImg1 = () => {
  const { mapID } = useParams();

  const {
    state,
    setCharCoords,
    setMapData,
    setClickCoords,
    setFound,
    setMapLoading,
    setGameover,
    setSeconds,
    setTimer,
    setPopupStyle,
    setPlayerMessage,
    setInputVal,
    setSubmitErrorMsg,
    setSubmitting,
  } = usePhotoTag();

  const navigate = useNavigate();

  const [buttonStyle, setButtonStyle] = useState<string>("");

  const createImgURL = (imgKey: string): string =>
    `https://res.cloudinary.com/danscxcd2/image/upload/${imgKey}`;

  const getMapData = async () => {
    try {
      const { data }: MapData = await photoTagApi.get(`/map/${mapID}`);
      setCharCoords(data.coordinates);
      setMapData({
        mapName: data.mapName,
        imgURL: createImgURL(data.imgKey),
      });
      setMapLoading(false);
    } catch (e) {
      const err = e as AxiosError;
      console.log(err);
      if (err?.response?.status === 404) {
        navigate("/error", {
          state: { errorCode: err?.response?.status },
          replace: true,
        });
      } else if (err?.response) {
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

  useEffect(() => {
    let interval: undefined | NodeJS.Timeout;
    if (!state.gameover && !state.mapLoading) {
      interval = setInterval(() => {
        setSeconds(state.seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.seconds, state.gameover, state.mapLoading]);

  useEffect(() => {
    handleTime(state.seconds);
  }, [state.seconds]);

  useEffect(() => {
    if (
      state.found.waldo === true &&
      state.found.whitebeard === true &&
      state.found.odlaw === true &&
      state.found.wenda === true
    ) {
      setGameover(true);
      setPlayerMessage("Good job, you're all done.");
    }
  }, [state.found]);

  const handleTime = (secondCount: number): void => {
    const hour: string = Math.floor(secondCount / 3600).toString();
    const min: string = Math.floor((secondCount % 3600) / 60).toString();
    const sec: string = Math.floor((secondCount % 3600) % 60).toString();

    const hourDisp: string =
      parseInt(hour) > 0 ? (parseInt(hour) > 9 ? hour : "0" + hour) : "00";
    const minDisp: string =
      parseInt(min) > 0 ? (parseInt(min) > 9 ? min : "0" + min) : "00";
    const secDisp: string =
      parseInt(sec) > 0 ? (parseInt(sec) > 9 ? sec : "0" + sec) : "00";

    setTimer(`${hourDisp}:${minDisp}:${secDisp}`);
  };

  const handleClickCoord = (e: MouseEvent<HTMLImageElement>): void => {
    console.log(state.clickCoords);
    if (state.gameover) return;
    // const rect = e.target.getBoundingClientRect();
    const rect = e.currentTarget.getBoundingClientRect();
    const rectRatio = rect.width / 100;
    const xCoord =
      Math.round(((e.clientX - rect.left) / rectRatio) * 100) / 100;
    const yCoord = Math.round(((e.clientY - rect.top) / rectRatio) * 100) / 100;
    const leftDistance = ((e.clientX - rect.left - 25) * 100) / rect.width;
    const topDistance = ((e.clientY - rect.top - 25) * 100) / rect.height;
    const left = leftDistance <= 50 ? "left" : "right";
    const top = topDistance <= 50 ? "top" : "bottom";
    const popupStyle = {
      left: `${leftDistance}%`,
      top: `${topDistance}%`,
      display: "flex",
    };
    setButtonStyle(`${left} ${top}`);
    setPopupStyle(popupStyle);
    setClickCoords({ x: xCoord, y: yCoord });
  };

  const handleButtonClick = (char: string): void => {
    const charName = char.slice(0, 1).toUpperCase() + char.slice(1);
    setPopupStyle({ display: "none" });
    const minX = `${char}MinX`;
    const maxX = `${char}MaxX`;
    const minY = `${char}MinY`;
    const maxY = `${char}MaxY`;
    if (
      state.clickCoords.x >= state.charCoords[minX] &&
      state.clickCoords.x <= state.charCoords[maxX] &&
      state.clickCoords.y >= state.charCoords[minY] &&
      state.clickCoords.y <= state.charCoords[maxY]
    ) {
      if (state.found[char as keyof FoundType]) {
        setPlayerMessage(`You already found ${charName}.`);
        return;
      }
      setPlayerMessage(`You found ${charName}.`);
      setFound(char);
      return;
    }
    setPlayerMessage("Keep looking");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!state.inputVal.length) {
      setSubmitErrorMsg("Error. Please input a name");
      return;
    }
    if (state.inputVal.length >= 20) {
      setSubmitErrorMsg("Error. Please a name 20 characters or less");
      return;
    }
    try {
      setSubmitErrorMsg("");
      setSubmitting(true);

      await photoTagApi.post(`/leaderboard`, {
        playerName: state.inputVal,
        seconds: state.seconds,
        timer: state.timer,
        mapID,
      });
      navigate("/");
    } catch (e) {
      const err = e as AxiosError;
      setSubmitting(false);
      setSubmitErrorMsg("Submission error. Please try again.");
      console.log(err.message);
    }
  };

  const handleInput = (input: string): void => {
    setInputVal(input);
  };

  const characterArr = [
    { img: waldoFace, name: "waldo" },
    { img: wendaFace, name: "wenda" },
    { img: odlawFace, name: "odlaw" },
    { img: whitebeardFace, name: "whitebeard" },
  ];
  const characterImages = characterArr.map((character) => (
    <div
      className='character-img-div'
      style={{
        opacity:
          state.found[character.name as keyof FoundType] === true ? 0.5 : 1,
      }}
    >
      <img src={character.img} alt={character.name} key={character.name} />
    </div>
  ));

  const timer = (
    <div className='timerDiv'>
      <span>{state.timer}</span>
    </div>
  );
  const playerMessage = (
    <div className='playerMessage'>
      <span>{state.playerMessage}</span>
    </div>
  );
  const characterImageDiv = (
    <div className='characterDisplay'>{characterImages}</div>
  );

  return (
    <div className='container'>
      {state.mapLoading && <LoadingPage />}
      {!state.mapLoading && (
        <>
          <div className='gameInfo'>
            {timer}
            {playerMessage}
            {characterImageDiv}
          </div>

          <div className='imgDiv'>
            <img
              src={state?.mapData?.imgURL}
              alt={`Map for level: ${state?.mapData?.mapName}`}
              onClick={handleClickCoord}
              id='waldoPic'
            />
            <div className='popup' style={state.popupStyle} data-testid='popup'>
              <div className='popupCircle'>
                <div className={`popupButtons ${buttonStyle}`}>
                  {characterArr.map((char) => (
                    <button
                      disabled={state.gameover ? true : false}
                      onClick={() => handleButtonClick(char.name)}
                      key={char.name}
                    >
                      {char.name.slice(0, 1).toUpperCase() + char.name.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className='gameInfo-layover-top'>
              {playerMessage}
              {timer}
            </div>
            <div className='gameInfo-layover-bottom'>{characterImageDiv}</div>
          </div>
        </>
      )}
      {state.gameover && (
        <Modal
          timer={state.timer}
          handleSubmit={handleSubmit}
          handleInput={handleInput}
          submitErrorMsg={state.submitErrorMsg}
          submitting={state.submitting}
        />
      )}
    </div>
  );
};

export default WaldoImg1;

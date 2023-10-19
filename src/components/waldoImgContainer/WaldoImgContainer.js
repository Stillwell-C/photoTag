import React, { useEffect, useReducer } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";

import "./waldoImgContainer.scss";

import { reducer, ACTION, initialState } from "./waldoImgContainerReducer";
import LoadingPage from "../loadingPage/LoadingPage";
import Modal from "../modal/Modal";

import waldoFace from "../../assets/waldo-face.webp";
import wendaFace from "../../assets/wenda-face.png";
import odlawFace from "../../assets/odlaw-face.jpg";
import whitebeardFace from "../../assets/whitebeard-face.jpeg";
import photoTagApi from "../../app/api/photoTagApi";

const WaldoImg1 = () => {
  const { mapID } = useParams();

  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();

  const createImgURL = (imgKey) =>
    `https://res.cloudinary.com/danscxcd2/image/upload/${imgKey}`;

  const getMapData = async () => {
    const { data } = await photoTagApi.get(`/map/${mapID}`);
    dispatch({
      type: ACTION.CHAR_COORDS,
      payload: data.coordinates,
    });
    dispatch({
      type: ACTION.MAP_DATA,
      payload: {
        mapName: data.mapName,
        imgURL: createImgURL(data.imgKey),
        id: data._id,
      },
    });
    dispatch({ type: ACTION.MAP_LOADING, payload: false });

    console.log(data);
  };

  useEffect(() => {
    getMapData();
  }, []);

  useEffect(() => {
    let interval = null;
    if (!state.gameover && !state.mapLoading) {
      interval = setInterval(() => {
        dispatch({ type: ACTION.SECONDS, payload: state.seconds + 1 });
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
      dispatch({ type: ACTION.GAMEOVER, payload: true });
      dispatch({
        type: ACTION.PLAYER_MESSAGE,
        payload: "Good job, you're all done.",
      });
    }
  }, [state.found]);

  const handleTime = (secondCount) => {
    const hour = Math.floor(secondCount / 3600).toString();
    const min = Math.floor((secondCount % 3600) / 60).toString();
    const sec = Math.floor((secondCount % 3600) % 60).toString();

    const hourDisp = hour > 0 ? (hour > 9 ? hour : "0" + hour) : "00";
    const minDisp = min > 0 ? (min > 9 ? min : "0" + min) : "00";
    const secDisp = sec > 0 ? (sec > 9 ? sec : "0" + sec) : "00";

    dispatch({
      type: ACTION.TIMER,
      payload: `${hourDisp}:${minDisp}:${secDisp}`,
    });
  };

  const handleClickCoord = (e) => {
    console.log(state.clickCoords);
    if (state.gameover) return;
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
    dispatch({ type: ACTION.POPUPSTYLE, payload: popupStyle });
    dispatch({ type: ACTION.CLICK_COORDS, payload: { x: xCoord, y: yCoord } });
  };

  const handleButtonClick = (char) => {
    const charName = char.slice(0, 1).toUpperCase() + char.slice(1);
    dispatch({ type: ACTION.POPUPSTYLE, payload: { display: "none" } });
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
      if (state.found[char]) {
        dispatch({
          type: ACTION.PLAYER_MESSAGE,
          payload: `You already found ${charName}.`,
        });
        return;
      }
      dispatch({
        type: ACTION.PLAYER_MESSAGE,
        payload: `You found ${charName}.`,
      });
      dispatch({ type: ACTION.FOUND, payload: char });
      return;
    }
    dispatch({ type: ACTION.PLAYER_MESSAGE, payload: "Keep looking" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.inputVal.length) {
      dispatch({
        type: ACTION.SUBMIT_ERROR_MSG,
        payload: "Error. Please input a name",
      });
      return;
    }
    if (state.inputVal.length >= 20) {
      dispatch({
        type: ACTION.SUBMIT_ERROR_MSG,
        payload: "Error. Please input shorter name",
      });
      return;
    }
    dispatch({ type: ACTION.DISABLE_SUBMIT, payload: true });
    try {
      dispatch({ type: ACTION.SUBMIT_ERROR_MSG, payload: "" });
      dispatch({ type: ACTION.SUBMITTING, payload: true });
      await addDoc(state.collectionRef, {
        name: state.inputVal,
        seconds: state.seconds,
        timer: state.timer,
      });
      navigate("/");
    } catch (err) {
      dispatch({ type: ACTION.SUBMITTING, payload: false });
      dispatch({ type: ACTION.DISABLE_SUBMIT, payload: false });
      dispatch({
        type: ACTION.SUBMIT_ERROR_MSG,
        payload: "Submission error. Please try again.",
      });
      console.log(err.message);
    }
  };

  const handleInput = (input) => {
    dispatch({ type: ACTION.INPUT_VAL, payload: input });
  };

  const characterArr = [
    { img: waldoFace, name: "waldo" },
    { img: wendaFace, name: "wenda" },
    { img: odlawFace, name: "odlaw" },
    { img: whitebeardFace, name: "whitebeard" },
  ];
  const characterImages = characterArr.map((character) => (
    <img
      src={character.img}
      alt={character.name}
      style={{ opacity: state.found[character.name] === true ? 0.5 : 1 }}
      key={character.name}
    />
  ));

  return (
    <div className='container'>
      {state.mapLoading && <LoadingPage />}
      {!state.mapLoading && (
        <>
          <div className='gameInfo'>
            <div className='timerDiv'>{state.timer}</div>
            <div className='playerMessage'>{state.playerMessage}</div>
            <div className='characterDisplay'>{characterImages}</div>
          </div>

          <div className='imgDiv'>
            <img
              src={state.mapData.imgURL}
              alt={`Map for level: ${state.mapData.mapName}`}
              onClick={handleClickCoord}
              id='waldoPic'
            />
            <div className='popup' style={state.popupStyle} data-testid='popup'>
              <div className='popupCircle'></div>
              <div className='popupButtons'>
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
        </>
      )}
      {state.gameover && (
        <Modal
          timer={state.timer}
          handleSubmit={handleSubmit}
          handleInput={handleInput}
          disableSubmit={state.disableSubmit}
          submitErrorMsg={state.submitErrorMsg}
          submitting={state.submitting}
        />
      )}
    </div>
  );
};

export default WaldoImg1;

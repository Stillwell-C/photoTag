import React, { useEffect, useState, useContext, useReducer } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

import "./waldoImgContainer.scss";
import { WaldoInfoContext } from "../../DataContext";
import { storage, db } from "../../firebase";
import LoadingPage from "../loadingPage/LoadingPage";
import Modal from "../modal/Modal";

const reducer = (state, action) => {
  switch (action.type) {
    case "charCoords":
      return { ...state, charCoords: action.payload };
    case "mapSelection":
      return { ...state, mapSelection: action.payload };
    case "mapAltText":
      return { ...state, mapAltText: action.payload };
    case "charFaces":
      return { ...state, charFaces: action.payload };
    case "clickCoords":
      return { ...state, clickCoords: action.payload };
    case "found":
      return { ...state, found: { ...state.found, [action.payload]: true } };
    case "charOpac":
      return {
        ...state,
        charOpac: { ...state.charOpac, [action.payload]: 0.5 },
      };
    case "mapLoading":
      return { ...state, mapLoading: action.payload };
    case "facesLoading":
      return { ...state, facesLoading: action.payload };
    case "gameover":
      return { ...state, gameover: !state.gameover };
    case "seconds":
      return { ...state, seconds: action.payload };
    case "timer":
      return { ...state, timer: action.payload };
    case "popupStyle":
      return { ...state, popupStyle: action.payload };
    case "playerMessage":
      return { ...state, playerMessage: action.payload };
    case "inputVal":
      return { ...state, inputVal: action.payload };
    case "collectionRef":
      return { ...state, collectionRef: action.payload };
    case "disableSubmit":
      return { ...state, disableSubmit: action.payload };
    case "submitErrorMsg":
      return { ...state, submitErrorMsg: action.payload };
    case "submitting":
      return { ...state, submitting: action.payload };
    default:
      console.log(action.type);
      throw new Error();
  }
};

const ACTION = {
  CHAR_COORDS: "charCoords",
  MAP_SELECTION: "mapSelection",
  MAP_ALT_TEXT: "mapAltText",
  CHAR_FACES: "charFaces",
  CLICK_COORDS: "clickCoords",
  FOUND: "found",
  CHAR_OPAC: "charOpac",
  MAP_LOADING: "mapLoading",
  FACES_LOADING: "facesLoading",
  GAMEOVER: "gameover",
  SECONDS: "seconds",
  TIMER: "timer",
  POPUPSTYLE: "popupStyle",
  PLAYER_MESSAGE: "playerMessage",
  INPUT_VAL: "inputVal",
  COLLECTION_REF: "collectionRef",
  DISABLE_SUBMIT: "disableSubmit",
  SUBMIT_ERROR_MSG: "submitErrorMsg",
  SUBMITTING: "submitting",
};

const initialState = {
  charCoords: {},
  mapSelection: null,
  mapAltText: "",
  charFaces: {},
  clickCoords: {},
  found: {
    waldo: false,
    whitebeard: false,
    odlaw: false,
    wenda: false,
  },
  charOpac: {
    waldo: 1,
    whitebeard: 1,
    odlaw: 1,
  },
  mapLoading: true,
  facesLoading: true,
  gameover: false,
  seconds: 0,
  timer: "",
  popupStyle: {},
  playerMessage: "Click the screen to find the characters.",
  inputVal: "",
  collectionRef: null,
  disableSubmit: false,
  submitErrorMsg: "",
  submitting: false,
};

const WaldoImg1 = () => {
  const { mapID } = useParams();
  const { waldoInfo } = useContext(WaldoInfoContext);

  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();

  useEffect(() => {
    const loadBackgroundImg = async (mapName) => {
      try {
        const backgroundImg = await getDownloadURL(
          ref(storage, waldoInfo.images[mapName])
        );
        dispatch({ type: ACTION.MAP_SELECTION, payload: backgroundImg });
        dispatch({
          type: ACTION.MAP_ALT_TEXT,
          payload: waldoInfo.imgAltText[mapName],
        });
        dispatch({ type: ACTION.FACES_LOADING, payload: false });
      } catch (err) {
        console.log("Background Img: ", err.message);
        dispatch({ type: ACTION.FACES_LOADING, payload: true });
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

        dispatch({
          type: ACTION.CHAR_FACES,
          payload: {
            waldoFace: waldo,
            odlawFace: odlaw,
            whitebeardFace: whitebeard,
            wendaFace: wenda,
          },
        });
        dispatch({ type: ACTION.MAP_LOADING, payload: false });
      } catch (err) {
        console.log("Character Img: ", err.message);
        dispatch({ type: ACTION.MAP_LOADING, payload: true });
      }
    };

    if (waldoInfo !== null) {
      loadCharacterImg();
      switch (mapID) {
        case "snowMap":
          loadBackgroundImg("waldoSnow");
          dispatch({
            type: ACTION.CHAR_COORDS,
            payload: waldoInfo.coords.snowCoords,
          });
          dispatch({
            type: ACTION.COLLECTION_REF,
            payload: collection(db, "snowLeaderboard"),
          });
          break;
        case "cityMap":
          loadBackgroundImg("waldoCity");
          dispatch({
            type: ACTION.CHAR_COORDS,
            payload: waldoInfo.coords.cityCoords,
          });
          dispatch({
            type: ACTION.COLLECTION_REF,
            payload: collection(db, "cityLeaderboard"),
          });
          break;
        case "deptMap":
          loadBackgroundImg("waldoDeptStore");
          dispatch({
            type: ACTION.CHAR_COORDS,
            payload: waldoInfo.coords.deptCoords,
          });
          dispatch({
            type: ACTION.COLLECTION_REF,
            payload: collection(db, "deptLeaderboard"),
          });
          break;
        case "musketeersMap":
          loadBackgroundImg("waldoMusketeers");
          dispatch({
            type: ACTION.CHAR_COORDS,
            payload: waldoInfo.coords.muskCoords,
          });
          dispatch({
            type: ACTION.COLLECTION_REF,
            payload: collection(db, "musketeersLeaderboard"),
          });
          break;
        default:
          console.log("Loading Error.");
      }
    }
  }, [waldoInfo]);

  useEffect(() => {
    let interval = null;
    if (!state.gameover && !state.mapLoading && !state.facesLoading) {
      interval = setInterval(() => {
        dispatch({ type: ACTION.SECONDS, payload: state.seconds + 1 });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.seconds, state.gameover, state.mapLoading, state.facesLoading]);

  useEffect(() => {
    handleTime(state.seconds);
  }, [state.seconds]);

  useEffect(() => {
    if (
      state.found.waldo === true &&
      state.found.whitebeard === true &&
      state.found.odlaw === true
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
      dispatch({ type: ACTION.CHAR_OPAC, payload: char });
      dispatch({
        type: ACTION.PLAYER_MESSAGE,
        payload: `You found ${char.slice(0, 1).toUpperCase() + char.slice(1)}.`,
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

  return (
    <div className='container'>
      {(state.facesLoading || state.mapLoading) && <LoadingPage />}
      {!state.facesLoading && !state.mapLoading && (
        <>
          <div className='gameInfo'>
            <div className='timerDiv'>{state.timer}</div>
            <div className='playerMessage'>{state.playerMessage}</div>
            <div className='characterDisplay'>
              <img
                src={state.charFaces.waldoFace}
                alt={waldoInfo.imgAltText.waldoFace}
                style={{ opacity: state.charOpac.waldo }}
              />
              <img
                src={state.charFaces.odlawFace}
                alt={waldoInfo.imgAltText.odlawFace}
                style={{ opacity: state.charOpac.odlaw }}
              />
              <img
                src={state.charFaces.whitebeardFace}
                alt={waldoInfo.imgAltText.whitebeardFace}
                style={{ opacity: state.charOpac.whitebeard }}
              />
            </div>
          </div>

          <div className='imgDiv'>
            <img
              src={state.mapSelection}
              alt={state.mapAltText}
              onClick={handleClickCoord}
              id='waldoPic'
            />
            <div className='popup' style={state.popupStyle}>
              <div className='popupCircle'></div>
              <div className='popupButtons'>
                <button
                  disabled={!state.gameover ? false : true}
                  onClick={() => handleButtonClick("waldo")}
                >
                  Waldo
                </button>
                <button
                  disabled={!state.gameover ? false : true}
                  onClick={() => handleButtonClick("whitebeard")}
                >
                  Whitebeard
                </button>
                <button
                  disabled={!state.gameover ? false : true}
                  onClick={() => handleButtonClick("odlaw")}
                >
                  Odlaw
                </button>
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

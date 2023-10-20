import React, {
  useReducer,
  createContext,
  ReactElement,
  useContext,
} from "react";

export const enum REDUCER_ACTION_TYPE {
  CHAR_COORDS,
  MAP_DATA,
  CLICK_COORDS,
  FOUND,
  MAP_LOADING,
  GAMEOVER,
  SECONDS,
  TIMER,
  POPUPSTYLE,
  PLAYER_MESSAGE,
  INPUT_VAL,
  SUBMIT_ERROR_MSG,
  SUBMITTING,
}

type PopupStyleType = {
  display: string;
  left?: string;
  right?: string;
};

type ClickCoordsType = {
  x: number;
  y: number;
};

type CharCoordsType = {
  [key: string]: number;
};

export type FoundType = {
  waldo: boolean;
  whitebeard: boolean;
  odlaw: boolean;
  wenda: boolean;
};

type MapDataType = {
  mapName: string;
  imgURL: string;
};

type ReducerAction =
  | { type: REDUCER_ACTION_TYPE.CHAR_COORDS; payload: CharCoordsType }
  | { type: REDUCER_ACTION_TYPE.MAP_DATA; payload: MapDataType }
  | { type: REDUCER_ACTION_TYPE.CLICK_COORDS; payload: ClickCoordsType }
  | { type: REDUCER_ACTION_TYPE.FOUND; payload: string }
  | { type: REDUCER_ACTION_TYPE.MAP_LOADING; payload: boolean }
  | { type: REDUCER_ACTION_TYPE.GAMEOVER; payload: boolean }
  | { type: REDUCER_ACTION_TYPE.SECONDS; payload: number }
  | { type: REDUCER_ACTION_TYPE; payload: string }
  | { type: REDUCER_ACTION_TYPE.POPUPSTYLE; payload: PopupStyleType }
  | { type: REDUCER_ACTION_TYPE.PLAYER_MESSAGE; payload: string }
  | { type: REDUCER_ACTION_TYPE.INPUT_VAL; payload: string }
  | { type: REDUCER_ACTION_TYPE.SUBMIT_ERROR_MSG; payload: string }
  | { type: REDUCER_ACTION_TYPE.SUBMITTING; payload: boolean };

type StateType = {
  charCoords: CharCoordsType;
  mapData: MapDataType;
  clickCoords: ClickCoordsType;
  found: FoundType;
  mapLoading: boolean;
  gameover: boolean;
  seconds: number;
  timer: string;
  popupStyle: PopupStyleType;
  playerMessage: string;
  inputVal: string;
  submitErrorMsg: string;
  submitting: boolean;
};

export const initialState: StateType = {
  charCoords: {},
  mapData: {
    mapName: "",
    imgURL: "",
  },
  clickCoords: {
    x: 0,
    y: 0,
  },
  found: {
    waldo: false,
    whitebeard: false,
    odlaw: false,
    wenda: false,
  },
  mapLoading: true,
  gameover: false,
  seconds: 0,
  timer: "",
  popupStyle: { display: "none" },
  playerMessage: "Click the screen to find the characters.",
  inputVal: "",
  submitErrorMsg: "",
  submitting: false,
};

const isMapData = (data: any): data is MapDataType => {
  return (data as MapDataType).mapName !== undefined;
};

const isClickCoords = (data: any): data is ClickCoordsType => {
  return (data as ClickCoordsType).x !== undefined;
};

const isPopupStyle = (data: any): data is PopupStyleType => {
  return (data as PopupStyleType).display !== undefined;
};

export const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.CHAR_COORDS:
      return { ...state, charCoords: action.payload as CharCoordsType };
    case REDUCER_ACTION_TYPE.MAP_DATA:
      if (isMapData(action.payload)) {
        return { ...state, mapData: action.payload };
      }
      return state;
    case REDUCER_ACTION_TYPE.CLICK_COORDS:
      if (isClickCoords(action.payload)) {
        return { ...state, clickCoords: action.payload };
      }
      return state;
    case REDUCER_ACTION_TYPE.FOUND:
      return { ...state, found: { ...state.found, [action.payload]: true } };
    case REDUCER_ACTION_TYPE.MAP_LOADING:
      if (typeof action.payload === "boolean") {
        return { ...state, mapLoading: action.payload };
      }
      return { ...state };
    case REDUCER_ACTION_TYPE.GAMEOVER:
      return { ...state, gameover: !state.gameover };
    case REDUCER_ACTION_TYPE.SECONDS:
      if (typeof action.payload === "number") {
        return { ...state, seconds: action.payload };
      }
      return { ...state };
    case REDUCER_ACTION_TYPE.TIMER:
      return { ...state, timer: action.payload };
    case REDUCER_ACTION_TYPE.POPUPSTYLE:
      if (isPopupStyle(action.payload)) {
        return { ...state, popupStyle: action.payload };
      }
      return state;
    case REDUCER_ACTION_TYPE.PLAYER_MESSAGE:
      return { ...state, playerMessage: action.payload };
    case REDUCER_ACTION_TYPE.INPUT_VAL:
      return { ...state, inputVal: action.payload };
    case REDUCER_ACTION_TYPE.SUBMIT_ERROR_MSG:
      return { ...state, submitErrorMsg: action.payload };
    case REDUCER_ACTION_TYPE.SUBMITTING:
      if (typeof action.payload === "boolean") {
        return { ...state, submitting: action.payload };
      }
      return { ...state };
    default:
      throw new Error();
  }
};

const usePhotoTagContext = (initialState: StateType) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setCharCoords = (charCoords: CharCoordsType) =>
    dispatch({ type: REDUCER_ACTION_TYPE.CHAR_COORDS, payload: charCoords });

  const setMapData = (mapData: MapDataType) =>
    dispatch({ type: REDUCER_ACTION_TYPE.MAP_DATA, payload: mapData });

  const setClickCoords = (clickCoords: ClickCoordsType) =>
    dispatch({ type: REDUCER_ACTION_TYPE.CLICK_COORDS, payload: clickCoords });

  const setFound = (found: string) =>
    dispatch({ type: REDUCER_ACTION_TYPE.FOUND, payload: found });

  const setMapLoading = (mapLoading: boolean) =>
    dispatch({ type: REDUCER_ACTION_TYPE.MAP_LOADING, payload: mapLoading });

  const setGameover = (gameover: boolean) =>
    dispatch({ type: REDUCER_ACTION_TYPE.GAMEOVER, payload: gameover });

  const setSeconds = (seconds: number) =>
    dispatch({ type: REDUCER_ACTION_TYPE.SECONDS, payload: seconds });

  const setTimer = (timer: string) =>
    dispatch({ type: REDUCER_ACTION_TYPE.TIMER, payload: timer });

  const setPopupStyle = (popupStyle: PopupStyleType) =>
    dispatch({ type: REDUCER_ACTION_TYPE.POPUPSTYLE, payload: popupStyle });

  const setPlayerMessage = (playerMessage: string) =>
    dispatch({
      type: REDUCER_ACTION_TYPE.PLAYER_MESSAGE,
      payload: playerMessage,
    });

  const setInputVal = (inputVal: string) =>
    dispatch({ type: REDUCER_ACTION_TYPE.INPUT_VAL, payload: inputVal });

  const setSubmitErrorMsg = (submitErrMsg: string) =>
    dispatch({
      type: REDUCER_ACTION_TYPE.SUBMIT_ERROR_MSG,
      payload: submitErrMsg,
    });

  const setSubmitting = (submittting: boolean) =>
    dispatch({ type: REDUCER_ACTION_TYPE.SUBMITTING, payload: submittting });

  return {
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
  };
};

type UsePhotoTagContextType = ReturnType<typeof usePhotoTagContext>;

const initContextState: UsePhotoTagContextType = {
  //Initial values for context
  state: initialState,
  //These are not types
  //Initialize functions
  setCharCoords: (charCoords: CharCoordsType) => {},
  setMapData: (mapData: MapDataType) => {},
  setClickCoords: (clickCoords: ClickCoordsType) => {},
  setFound: (found: string) => {},
  setMapLoading: (mapLoading: boolean) => {},
  setGameover: (gameover: boolean) => {},
  setSeconds: (seconds: number) => {},
  setTimer: (timer: string) => {},
  setPopupStyle: (popupStyle: PopupStyleType) => {},
  setPlayerMessage: (playerMessage: string) => {},
  setInputVal: (inputVal: string) => {},
  setSubmitErrorMsg: (submitErrMsg: string) => {},
  setSubmitting: (submittting: boolean) => {},
};

export const PhotoTagContext =
  createContext<UsePhotoTagContextType>(initContextState);

type ChildrenType = {
  children?: ReactElement[] | ReactElement | undefined;
};

export const PhotoTagProvider = ({ children }: ChildrenType): ReactElement => {
  return (
    <PhotoTagContext.Provider value={usePhotoTagContext(initialState)}>
      {children}
    </PhotoTagContext.Provider>
  );
};

type UsePhotoTagHookType = {
  state: StateType;
  setCharCoords: (charCoords: CharCoordsType) => void;
  setMapData: (mapData: MapDataType) => void;
  setClickCoords: (clickCoords: ClickCoordsType) => void;
  setFound: (found: string) => void;
  setMapLoading: (mapLoading: boolean) => void;
  setGameover: (gameover: boolean) => void;
  setSeconds: (seconds: number) => void;
  setTimer: (timer: string) => void;
  setPopupStyle: (popupStyle: PopupStyleType) => void;
  setPlayerMessage: (playerMessage: string) => void;
  setInputVal: (inputVal: string) => void;
  setSubmitErrorMsg: (submitErrMsg: string) => void;
  setSubmitting: (submittting: boolean) => void;
};

export const usePhotoTag = (): UsePhotoTagHookType => {
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
  } = useContext(PhotoTagContext);

  return {
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
  };
};

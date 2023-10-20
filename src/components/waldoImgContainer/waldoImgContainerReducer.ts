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
  DISABLE_SUBMIT,
  SUBMIT_ERROR_MSG,
  SUBMITTING
}

type popupStyleType = {
  display: string,
  left?: string,
  right?: string,
}

type clickCoordsType = {
  x: number,
  y: number
}

type charCoordsType = {
  [key: string]: number
}

export type foundType = {
    waldo: boolean,
    whitebeard: boolean,
    odlaw: boolean,
    wenda: boolean,
}

export type mapDataType = {
  mapName: string;
  imgURL: string;
}

type ReducerAction = {type: REDUCER_ACTION_TYPE.CHAR_COORDS, payload: charCoordsType} | {type: REDUCER_ACTION_TYPE.MAP_DATA, payload: mapDataType} | {type: REDUCER_ACTION_TYPE.CLICK_COORDS, payload: clickCoordsType} | {type: REDUCER_ACTION_TYPE.FOUND, payload: string} | {type: REDUCER_ACTION_TYPE.MAP_LOADING, payload: boolean} | {type: REDUCER_ACTION_TYPE.GAMEOVER, payload: boolean} | {type: REDUCER_ACTION_TYPE.SECONDS, payload: number} | {type: REDUCER_ACTION_TYPE, payload: string} | {type: REDUCER_ACTION_TYPE.POPUPSTYLE, payload: popupStyleType} | {type: REDUCER_ACTION_TYPE.PLAYER_MESSAGE, payload: string} | {type: REDUCER_ACTION_TYPE.INPUT_VAL, payload: string} | {type: REDUCER_ACTION_TYPE.DISABLE_SUBMIT, payload: boolean} | {type: REDUCER_ACTION_TYPE.SUBMIT_ERROR_MSG, payload: string} | {type: REDUCER_ACTION_TYPE.SUBMITTING, payload: boolean}


interface initialStateData {
  charCoords: charCoordsType,
  mapData: mapDataType,
  clickCoords: clickCoordsType,
  found: foundType,
  mapLoading: boolean,
  gameover: boolean,
  seconds: number,
  timer: string,
  popupStyle: popupStyleType,
  playerMessage: string,
  inputVal: string,
  disableSubmit: boolean,
  submitErrorMsg: string,
  submitting: boolean,
}

export const initialState: initialStateData = {
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
  disableSubmit: false,
  submitErrorMsg: "",
  submitting: false,
};

export const reducer = (state: typeof initialState, action: ReducerAction): typeof initialState => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.CHAR_COORDS:
      return { ...state, charCoords: action.payload as charCoordsType };
    case REDUCER_ACTION_TYPE.MAP_DATA:
      return { ...state, mapData: action.payload as mapDataType };
    case REDUCER_ACTION_TYPE.CLICK_COORDS:
      return { ...state, clickCoords: action.payload as clickCoordsType};
    case REDUCER_ACTION_TYPE.FOUND:
      return { ...state, found: { ...state.found, [action.payload]: true } };
    case REDUCER_ACTION_TYPE.MAP_LOADING:
      if (typeof action.payload === "boolean") {
      return { ...state, mapLoading: action.payload };
      }
      return { ...state}
    case REDUCER_ACTION_TYPE.GAMEOVER:
      return { ...state, gameover: !state.gameover };
    case REDUCER_ACTION_TYPE.SECONDS:
      if (typeof action.payload === "number") {
      return { ...state, seconds: action.payload };
      }
      return { ...state}
    case REDUCER_ACTION_TYPE.TIMER:
      return { ...state, timer: action.payload };
    case REDUCER_ACTION_TYPE.POPUPSTYLE:
      return { ...state, popupStyle: action.payload as popupStyleType};
    case REDUCER_ACTION_TYPE.PLAYER_MESSAGE:
      return { ...state, playerMessage: action.payload };
    case REDUCER_ACTION_TYPE.INPUT_VAL:
      return { ...state, inputVal: action.payload };
    case REDUCER_ACTION_TYPE.DISABLE_SUBMIT:
      if (typeof action.payload === "boolean") {
      return { ...state, disableSubmit: action.payload };
      }
      return { ...state}
    case REDUCER_ACTION_TYPE.SUBMIT_ERROR_MSG:
      return { ...state, submitErrorMsg: action.payload };
    case REDUCER_ACTION_TYPE.SUBMITTING:
      if (typeof action.payload === "boolean") {
      return { ...state, submitting: action.payload };
      }
      return { ...state}
    default:
      throw new Error();
  }
};
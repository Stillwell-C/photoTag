export const reducer = (state, action) => {
  switch (action.type) {
    case "charCoords":
      return { ...state, charCoords: action.payload };
    case "mapData":
      return { ...state, mapData: action.payload };
    case "clickCoords":
      return { ...state, clickCoords: action.payload };
    case "found":
      return { ...state, found: { ...state.found, [action.payload]: true } };
    case "mapLoading":
      return { ...state, mapLoading: action.payload };
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

export const ACTION = {
  CHAR_COORDS: "charCoords",
  MAP_DATA: "mapData",
  CLICK_COORDS: "clickCoords",
  FOUND: "found",
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

export const initialState = {
  charCoords: {},
  mapData: null,
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
    wenda: 1,
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

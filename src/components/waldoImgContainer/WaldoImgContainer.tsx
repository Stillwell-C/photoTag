import { useEffect, MouseEvent, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FoundType, usePhotoTag } from "../../Context/PhotoTagContext";
import LoadingPage from "../loadingPage/LoadingPage";
import Modal from "../modal/Modal";

import waldoFace from "../../assets/waldo-face.webp";
import wendaFace from "../../assets/wenda-face.png";
import odlawFace from "../../assets/odlaw-face.jpg";
import whitebeardFace from "../../assets/whitebeard-face.jpeg";
import photoTagApi from "../../app/api/photoTagApi";
import { AxiosError } from "axios";
import ClickPopup from "../clickPopup/ClickPopup";

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

const WaldoImgContainer = () => {
  const { mapID } = useParams();
  const playerMessageRef = useRef<HTMLSpanElement>(null);

  const {
    state,
    setCharCoords,
    setMapData,
    setClickCoords,
    setMapLoading,
    setGameover,
    setSeconds,
    setTimer,
    setPopupStyle,
    setPlayerMessage,
    setButtonStyle,
  } = usePhotoTag();

  const [shiftLayover, setShiftLayover] = useState(false);
  const [magnify, setMagnify] = useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    playerMessageRef?.current?.focus();
  }, [state.playerMessage]);

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

  const characterArr = [
    { img: waldoFace, name: "waldo" },
    { img: wendaFace, name: "wenda" },
    { img: odlawFace, name: "odlaw" },
    { img: whitebeardFace, name: "whitebeard" },
  ];

  const characterImages = characterArr.map((character) => (
    <div
      className=' max-w-64p max-h-64p h-12 w-12 md:h-16 md:w-16 border-solid border border-slate-800 dark:lg:border-amber-500 bg-white rounded-full flex items-center justify-center overflow-hidden'
      style={{
        opacity:
          state.found[character.name as keyof FoundType] === true ? 0.5 : 1,
      }}
      key={character.name}
    >
      <img
        className='h-11 w-11 md:h-14 md:w-14 max-h-full max-w-full rounded-full object-contain '
        src={character.img}
        alt={`${character.name} has ${
          state.found[character.name as keyof FoundType] === false ? "not" : ""
        } been found`}
      />
    </div>
  ));

  const timer = (
    <div className='timerDiv'>
      <span>{state.timer}</span>
    </div>
  );
  const playerMessage = (
    <div className='playerMessage'>
      <span aria-live='assertive' ref={playerMessageRef}>
        {state.playerMessage}
      </span>
    </div>
  );
  const characterImageDiv = (
    <div className='flex items-center gap-1 pointer-events-none'>
      {characterImages}
    </div>
  );

  const smallScreenWarning =
    "For better functionality turn device sideways or use a larger screen.";

  return (
    <>
      {state.mapLoading && (
        <div className='max-lg:h-screen max-lg:flex max-lg:items-center'>
          <LoadingPage />
        </div>
      )}
      {!state.mapLoading && (
        <div
          className={`w-full lg:max-h-screen max-sm:max-h-screen max-lg:min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-zinc-900 ${
            magnify ? "sm:max-lg:w-200%" : "max-lg:w-full"
          }`}
        >
          <>
            <div className='hidden px-2 lg:flex items-center justify-between w-full mb-4 flex-shrink-0 [&>*]:flex-1 [&>*]:text-xl [&_.timerDiv]:flex [&_.timerDiv]:items-center [&_.timerDiv]:justify-end [&_.characterDisplay]:justify-start [&_.playerMessage]:text-center '>
              {timer}
              {playerMessage}
              {characterImageDiv}
            </div>

            <div
              className={`lg:max-h-imgPlusScreen relative flex flex-col items-center justify-center lg:mx-2 lg:mb-8 max-lg:w-full`}
            >
              <img
                src={state?.mapData?.imgURL}
                alt={`Map for level: ${state?.mapData?.mapName}`}
                onClick={handleClickCoord}
                id='waldoPic'
                className='object-contain w-full lg:max-h-imgPlusScreen'
                //may need point events all
              />
              <ClickPopup characterArr={characterArr} />
            </div>
          </>
        </div>
      )}
      {!state.mapLoading && (
        <div className='relative'>
          <div className='fixed pointer-events-none flex justify-between top-0 mb-0 text-white w-full text-xl [&>*]:bg-black/60 lg:hidden'>
            {playerMessage}
            {timer}
          </div>

          {state.seconds <= 5 && (
            <div className='sm:hidden fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-white bg-black/75 text-xl text-center'>
              {smallScreenWarning}
            </div>
          )}

          <div
            className={`lg:hidden fixed pointer-events-none flex justify-between bottom-0 w-full p-0.5 ${
              shiftLayover ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className='self-end pointer-all'>
              <button
                className='hidden sm:block bg-zinc-800 text-white rounded-md p-1.5 hover:bg-zinc-600'
                onClick={() => setMagnify((prev) => !prev)}
                aria-label={
                  magnify
                    ? "Decrease image size to normal size"
                    : "Double image size"
                }
              >
                {magnify ? "1X" : "2X"}
              </button>
            </div>

            <div
              className='cursor-pointer pointer-all px-1'
              data-testid='layover-bottom'
              onClick={() => {
                setShiftLayover((prev) => !prev);
              }}
            >
              {characterImageDiv}
            </div>
          </div>
        </div>
      )}
      {state.gameover && <Modal mapID={mapID} />}
    </>
  );
};

export default WaldoImgContainer;

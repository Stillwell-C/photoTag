import React, { useEffect } from "react";
import { usePhotoTag, FoundType } from "../../Context/PhotoTagContext";

type Character = { img: string; name: string };

type ClickPopupPropType = {
  characterArr: Character[];
};

const ClickPopup = ({ characterArr }: ClickPopupPropType) => {
  const { state, setPopupStyle, setPlayerMessage, setFound } = usePhotoTag();

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

  useEffect(() => {
    //This will close modal with escape key
    function keyListener(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPopupStyle({ display: "none" });
      }
    }

    document.addEventListener("keydown", keyListener);

    return () => document.removeEventListener("keydown", keyListener);
  }, []);

  return (
    <div
      className='absolute hidden gap-1 pointer-events-none'
      style={state.popupStyle}
      data-testid='popup'
      role='dialog'
    >
      <div className='relative justify-self-center self-start rounded-full h-8 w-8 md:h-12 md:w-12 border-4 border-solid border-black'>
        <div
          className={`absolute flex flex-col bg-neutral-200/75 py-3 px-4 gap-2 rounded-lg ${state.buttonStyle}`}
        >
          {characterArr.map((char) => (
            <button
              disabled={state.gameover ? true : false}
              onClick={() => handleButtonClick(char.name)}
              key={char.name}
              aria-label={`click to select ${char.name}`}
              className=' cursor-pointer px-2 py-1 border-none rounded-md bg-blue-600 text-white hover:bg-blue-500'
              style={{ pointerEvents: "all" }}
            >
              {char.name.slice(0, 1).toUpperCase() + char.name.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClickPopup;

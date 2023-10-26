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
      className='popup'
      style={state.popupStyle}
      data-testid='popup'
      role='dialog'
    >
      <div className='popupCircle'>
        <div className={`popupButtons ${state.buttonStyle}`}>
          {characterArr.map((char) => (
            <button
              disabled={state.gameover ? true : false}
              onClick={() => handleButtonClick(char.name)}
              key={char.name}
              aria-label={`click to select ${char.name}`}
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

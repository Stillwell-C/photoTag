import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { initialState } from "../../../Context/PhotoTagContext";
import * as context from "../../../Context/PhotoTagContext";
import ClickPopup from "../ClickPopup";
import userEvent from "@testing-library/user-event";

const mockSetInputVal = jest.fn();
const mockSetSubmitErrorMsg = jest.fn();
const mockSetSubmitting = jest.fn();

const mockInitialState = initialState;

const mockContextFunctions = {
  setInputVal: mockSetInputVal,
  setSubmitErrorMsg: mockSetSubmitErrorMsg,
  setSubmitting: mockSetSubmitting,
  setCharCoords: jest.fn(),
  setMapData: jest.fn(),
  setClickCoords: jest.fn(),
  setFound: jest.fn(),
  setMapLoading: jest.fn(),
  setGameover: jest.fn(),
  setSeconds: jest.fn(),
  setTimer: jest.fn(),
  setPopupStyle: jest.fn(),
  setPlayerMessage: jest.fn(),
  setButtonStyle: jest.fn(),
};

const characterArr = [
  { img: "fakeURL", name: "waldo" },
  { img: "fakeURL", name: "wenda" },
  { img: "fakeURL", name: "odlaw" },
  { img: "fakeURL", name: "whitebeard" },
];

describe("Click popup component", () => {
  afterEach(() => jest.restoreAllMocks());

  const setup = () => {
    render(
      <BrowserRouter>
        <ClickPopup characterArr={characterArr} />
      </BrowserRouter>
    );
  };

  it("Renders one button for each character", () => {
    setup();
    const waldoButton = screen.getByText("Waldo");
    const wendaButton = screen.getByText("Wenda");
    const odlawButton = screen.getByText("Odlaw");
    const whitebeardButton = screen.getByText("Whitebeard");
    expect(
      waldoButton && wendaButton && odlawButton && whitebeardButton
    ).toBeInTheDocument();
  });

  it("Buttons are disabled if gameover is true", () => {
    const mockContext = {
      state: { ...mockInitialState, gameover: true },
      ...mockContextFunctions,
    };
    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);

    setup();

    const waldoButton = screen.getByText("Waldo");
    const wendaButton = screen.getByText("Wenda");
    const odlawButton = screen.getByText("Odlaw");
    const whitebeardButton = screen.getByText("Whitebeard");

    expect(
      waldoButton && wendaButton && odlawButton && whitebeardButton
    ).toBeDisabled();
  });

  it("Is visible when popupStyle is set to display: flex", () => {
    const setPopupStyleMock = jest.fn();
    const mockContext = {
      state: { ...mockInitialState, popupStyle: { display: "flex" } },
      ...mockContextFunctions,
      setPopupStyle: setPopupStyleMock,
    };
    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);
    setup();

    const popup = screen.getByRole("dialog");
    expect(popup).toBeVisible();
  });

  it("Is not visible when popupStyle is set to display: none", () => {
    const setPopupStyleMock = jest.fn();
    const mockContext = {
      state: { ...mockInitialState },
      ...mockContextFunctions,
      setPopupStyle: setPopupStyleMock,
    };
    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);

    setup();

    const popup = screen.getByTestId("popup");
    expect(popup).not.toBeVisible();
  });

  it("Closes popup by setting popupStyle to none upon escape button click", async () => {
    const setPopupStyleMock = jest.fn();
    const mockContext = {
      state: { ...mockInitialState },
      ...mockContextFunctions,
      setPopupStyle: setPopupStyleMock,
    };
    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);
    setup();

    await userEvent.keyboard("{Escape}");
    expect(setPopupStyleMock).toBeCalled();
    expect(setPopupStyleMock).toBeCalledWith({ display: "none" });
  });

  it("Does not close popup by setting popupStyle to none if button other than escape button click", async () => {
    const setPopupStyleMock = jest.fn();
    const mockContext = {
      state: { ...mockInitialState },
      ...mockContextFunctions,
      setPopupStyle: setPopupStyleMock,
    };
    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);
    setup();

    await userEvent.keyboard("{Enter}");
    expect(setPopupStyleMock).not.toBeCalled();
  });

  it("Sets playerMessage to 'Keep Looking' if player coords are not clicked", async () => {
    const setPlayerMessageMock = jest.fn();
    const mockContext = {
      state: {
        ...mockInitialState,
        clickCoords: {
          x: 4,
          y: 4,
        },
        charCoords: {
          ...mockInitialState.charCoords,
          charCoordsWaldoMinX: 1,
          charCoordsWaldoMaxX: 3,
          charCoordsWaldoMinY: 1,
          charCoordsWaldoMaxY: 3,
        },
      },
      ...mockContextFunctions,
      setPlayerMessage: setPlayerMessageMock,
    };
    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);
    setup();
    const waldoButton = screen.getByText("Waldo");
    await userEvent.click(waldoButton);
    expect(setPlayerMessageMock).toBeCalledWith("Keep looking");
  });

  it("Sets playerMessage to 'You found [character]' and setFound with character name if player coords are clicked", async () => {
    const setPlayerMessageMock = jest.fn();
    const setFoundMock = jest.fn();
    const mockContext = {
      state: {
        ...mockInitialState,
        clickCoords: {
          x: 2,
          y: 2,
        },
        charCoords: {
          ...mockInitialState.charCoords,
          waldoMinX: 1,
          waldoMaxX: 3,
          waldoMinY: 1,
          waldoMaxY: 3,
        },
      },
      ...mockContextFunctions,
      setPlayerMessage: setPlayerMessageMock,
      setFound: setFoundMock,
    };
    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);
    setup();
    const waldoButton = screen.getByText("Waldo");
    await userEvent.click(waldoButton);
    expect(setPlayerMessageMock).toBeCalledWith("You found Waldo.");
    expect(setFoundMock).toBeCalledWith("waldo");
  });

  it("Sets playerMessage to 'You already found [character]' and doesn't setFound with character name if player coords are clicked when player has already been found", async () => {
    const setPlayerMessageMock = jest.fn();
    const setFoundMock = jest.fn();
    const mockContext = {
      state: {
        ...mockInitialState,
        clickCoords: {
          x: 2,
          y: 2,
        },
        charCoords: {
          ...mockInitialState.charCoords,
          waldoMinX: 1,
          waldoMaxX: 3,
          waldoMinY: 1,
          waldoMaxY: 3,
        },
        found: {
          ...mockInitialState.found,
          waldo: true,
        },
      },
      ...mockContextFunctions,
      setPlayerMessage: setPlayerMessageMock,
      setFound: setFoundMock,
    };
    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);
    setup();
    const waldoButton = screen.getByText("Waldo");
    await userEvent.click(waldoButton);
    expect(setPlayerMessageMock).toBeCalledWith("You already found Waldo.");
    expect(setFoundMock).not.toBeCalled();
  });
});

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";
import { initialState } from "../../../Context/PhotoTagContext";
import photoTagApi from "../../../app/api/photoTagApi";
import WaldoImgContainer from "../WaldoImgContainer";
import * as context from "../../../Context/PhotoTagContext";
import { usePhotoTag } from "../../../Context/PhotoTagContext";
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

const exampleMapData = {
  data: {
    _id: "652f650570b6a54dd23f2f29",
    mapName: "Ski Slope",
    imgKey: "h4nm4gu6clhqbrn27vfw.jpg",
    coordinates: {
      odlawMaxX: 32.5,
      odlawMaxY: 41.5,
      odlawMinX: 31,
      odlawMinY: 39.45,
      waldoMaxX: 87.5,
      waldoMaxY: 49.2,
      waldoMinX: 83.6,
      waldoMinY: 44.8,
      wendaMaxX: 49.5,
      wendaMaxY: 28.15,
      wendaMinX: 48,
      wendaMinY: 25.5,
      whitebeardMaxX: 9,
      whitebeardMaxY: 49.5,
      whitebeardMinX: 6,
      whitebeardMinY: 46.75,
    },
  },
};

const apiGetMock = jest.spyOn(photoTagApi, "get");

// Mock for useNavigate. This is used for API errors
const mockedUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUseNavigate,
}));

describe("WaldoImgContainer component", () => {
  const setup = () => {
    render(
      //   <BrowserRouter>
      //     <WaldoImgContainer />
      //   </BrowserRouter>

      <MemoryRouter initialEntries={[`/map/testmap`]}>
        <Routes>
          <Route path={`/map/:mapID`} element={<WaldoImgContainer />} />
        </Routes>
      </MemoryRouter>
    );
  };

  afterEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());

  it("renders a loading screen before API response", () => {
    apiGetMock.mockResolvedValue(exampleMapData);

    setup();
    const img = screen.getByAltText(/loading/i);
    const text = screen.getByText(/Loading.../i);
    expect(img).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  describe("After API response", () => {
    it("Handles API error with 404 response by navigating to a new page", async () => {
      apiGetMock.mockRejectedValue({
        response: { status: 404 },
      });
      setup();
      await waitFor(() => expect(mockedUseNavigate).toBeCalledTimes(1));
    });

    it("Handles API error with non-404 response by navigating to a new page", async () => {
      apiGetMock.mockRejectedValue({
        response: { status: 400 },
      });
      setup();
      await waitFor(() => expect(mockedUseNavigate).toBeCalledTimes(1));
    });

    it("Handles API error without response by navigating to a new page", async () => {
      apiGetMock.mockRejectedValue({});
      setup();
      await waitFor(() => expect(mockedUseNavigate).toBeCalledTimes(1));
    });

    it("sets timer based on the current seconds", async () => {
      const setTimerMock = jest.fn();
      const mockContext = {
        state: { ...mockInitialState, mapLoading: false, seconds: 13 },
        ...mockContextFunctions,
        setTimer: setTimerMock,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      apiGetMock.mockResolvedValue(exampleMapData);

      setup();
      expect(setTimerMock).toBeCalledWith("00:00:13");
    });

    // it("calls setSeconds to update the timer with the correct number of seconds", async () => {
    //   const setSecondsMock = jest.fn();
    //   const mockContext = {
    //     state: {
    //       ...mockInitialState,
    //       mapLoading: false,
    //       seconds: 13,
    //       gameover: false,
    //     },
    //     ...mockContextFunctions,
    //     setSeconds: setSecondsMock,
    //   };

    //   jest
    //     .spyOn(context, "usePhotoTag")
    //     .mockImplementationOnce(() => mockContext);

    //   apiGetMock.mockResolvedValue(exampleMapData);

    //   setup();
    //   await waitFor(() => expect(setSecondsMock).toBeCalled());
    // });

    it("Saves map data recieved from API to context and runs setMapLoading to false", async () => {
      const setCharCoordsMock = jest.fn();
      const setMapDataMock = jest.fn();
      const setMapLoadingMock = jest.fn();

      const mockContext = {
        state: mockInitialState,
        ...mockContextFunctions,
        setCharCoords: setCharCoordsMock,
        setMapData: setMapDataMock,
        setMapLoading: setMapLoadingMock,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      apiGetMock.mockResolvedValue(exampleMapData);

      setup();

      await waitFor(() =>
        expect(setCharCoordsMock).toBeCalledWith(
          exampleMapData.data.coordinates
        )
      );

      await waitFor(() => {
        expect(setMapDataMock).toBeCalledWith(
          expect.objectContaining({
            mapName: expect.stringMatching(exampleMapData.data.mapName),
            imgURL: expect.stringContaining(exampleMapData.data.imgKey),
          })
        );
      });

      await waitFor(() => {
        expect(setMapLoadingMock).toBeCalledWith(false);
      });
    });

    it("renders text prompting player to click the screen when loading is complete", async () => {
      const mockContext = {
        state: { ...mockInitialState, mapLoading: false },
        ...mockContextFunctions,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      apiGetMock.mockResolvedValue(exampleMapData);

      setup();

      //Finds two messages which will render depending on screen size
      const playerMessage = await screen.findAllByText(
        /Click the screen to find the characters/i
      );

      expect(playerMessage).toHaveLength(2);
    });

    it("renders images for each character upon loading with an opacity of 1", async () => {
      const mockContext = {
        state: { ...mockInitialState, mapLoading: false },
        ...mockContextFunctions,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      apiGetMock.mockResolvedValue(exampleMapData);

      setup();

      const characters = ["odlaw", "waldo", "wenda", "whitebeard"];

      for (let character of characters) {
        const images = screen.getAllByAltText(
          new RegExp(`${character} has not been found`, "i")
        );

        expect(images).toHaveLength(2);
        images.map((image) => {
          return expect(image).toHaveStyle({ opacity: "1;" });
        });
      }
    });

    it("renders a main game image", () => {
      const mockContext = {
        state: { ...mockInitialState, mapLoading: false },
        ...mockContextFunctions,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      apiGetMock.mockResolvedValue(exampleMapData);

      setup();

      const mainImg = screen.getByAltText(/^Map for level:/i);

      expect(mainImg).toBeInTheDocument();
    });

    it("renders a character selection popup that is not visible initially", async () => {
      const mockContext = {
        state: {
          ...mockInitialState,
          mapLoading: false,
        },
        ...mockContextFunctions,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      apiGetMock.mockResolvedValue(exampleMapData);

      setup();

      await screen.findAllByText(/click the screen to find the characters/i);

      const popup = screen.getByTestId(/popup/i);
      expect(popup).toBeInTheDocument();
      expect(popup).not.toBeVisible();
    });

    it("handles click on the main image by settting popup & button styles and setting the coordinates for the click", async () => {
      const mockSetButtonStyle = jest.fn();
      const mockSetPopupStyle = jest.fn();
      const mockSetClickCoords = jest.fn();

      const mockContext = {
        state: {
          ...mockInitialState,
          mapLoading: false,
        },
        ...mockContextFunctions,
        setButtonStyle: mockSetButtonStyle,
        setPopupStyle: mockSetPopupStyle,
        setClickCoords: mockSetClickCoords,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      apiGetMock.mockResolvedValue(exampleMapData);

      setup();

      const mainImg = screen.getByAltText(/^Map for level:/i);
      await userEvent.click(mainImg);

      expect(mockSetButtonStyle).toHaveBeenCalledTimes(1);
      expect(mockSetButtonStyle).toHaveBeenCalledWith(
        expect.stringMatching(/^left|right|top|bottom{2}$/i)
      );
      expect(mockSetPopupStyle).toHaveBeenCalledTimes(1);
      expect(mockSetPopupStyle).toHaveBeenCalledWith(
        expect.objectContaining({
          left: expect.any(String),
          top: expect.any(String),
          display: expect.stringMatching(/flex/i),
        })
      );
      expect(mockSetClickCoords).toHaveBeenCalledTimes(1);
      expect(mockSetClickCoords).toHaveBeenCalledWith(
        expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number),
        })
      );
    });

    it("changes image alt text and opacity when a character has been found", async () => {
      const mockContext = {
        state: {
          ...mockInitialState,
          mapLoading: false,
          found: {
            odlaw: false,
            waldo: false,
            wenda: true,
            whitebeard: true,
          },
        },
        ...mockContextFunctions,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      apiGetMock.mockResolvedValue(exampleMapData);

      setup();

      const notFoundCharacters = ["odlaw", "waldo"];
      const foundCharacters = ["wenda", "whitebeard"];

      for (let character of notFoundCharacters) {
        const images = screen.getAllByAltText(
          new RegExp(`${character} has not been found`, "i")
        );

        expect(images).toHaveLength(2);
      }

      for (let character of foundCharacters) {
        const images = screen.getAllByAltText(
          new RegExp(`${character} has been found`, "i")
        );

        expect(images).toHaveLength(2);

        images.map((image) => {
          return expect(image).toHaveStyle({ opacity: ".5;" });
        });
      }
    });

    // it("Moves lower character image layover when clicked", async () => {
    //   const mockSetShiftLayover = jest.fn();

    //   const mockContext = {
    //     state: {
    //       ...mockInitialState,
    //       mapLoading: false,
    //     },
    //     ...mockContextFunctions,
    //     setShiftLayover: mockSetShiftLayover,
    //   };

    //   jest
    //     .spyOn(context, "usePhotoTag")
    //     .mockImplementationOnce(() => mockContext);

    //   apiGetMock.mockResolvedValue(exampleMapData);

    //   setup();

    //   const bottomLayover = await screen.findByTestId("layover-bottom");
    //   screen.debug();
    //   await userEvent.click(bottomLayover);
    //   screen.debug();

    //   expect(mockSetShiftLayover).toBeCalled();
    // });

    it("Sets gameover & gives gameover message when all players are found", async () => {
      const mockSetGameover = jest.fn();
      const mockSetPlayerMessage = jest.fn();

      const mockContext = {
        state: {
          ...mockInitialState,
          mapLoading: false,
          found: {
            waldo: true,
            whitebeard: true,
            odlaw: true,
            wenda: true,
          },
        },
        ...mockContextFunctions,
        setGameover: mockSetGameover,
        setPlayerMessage: mockSetPlayerMessage,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      apiGetMock.mockResolvedValue(exampleMapData);

      setup();

      await screen.findAllByText(/click the screen to find the characters/i);

      expect(mockSetGameover).toBeCalledTimes(1);
      expect(mockSetGameover).toBeCalledWith(true);
      expect(mockSetPlayerMessage).toBeCalledTimes(1);
      expect(mockSetPlayerMessage).toBeCalledWith(
        expect.stringMatching(/Good job, you're all done/i)
      );
    });

    it("renders the modal component when gameover is set to true", async () => {
      const mockContext = {
        state: {
          ...mockInitialState,
          mapLoading: false,
          gameover: true,
        },
        ...mockContextFunctions,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      apiGetMock.mockResolvedValue(exampleMapData);

      setup();

      await screen.findAllByText(/click the screen to find the characters/i);

      const modalHeader = await screen.findByRole("heading", {
        name: /congratulations!/i,
      });

      expect(modalHeader).toBeInTheDocument();
    });
  });
});

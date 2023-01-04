import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as firebaseFunctions from "../../firebase";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import WaldoImgContainer from "./WaldoImgContainer";
import { WaldoInfoContext } from "../../DataContext";
import * as ReducerFile from "./waldoImgContainerReducer";

describe("WaldoImgContainer component", () => {
  afterEach(() => jest.resetAllMocks);
  it("renders a loading screen initially", async () => {
    spyURL();
    renderWithContext();

    const img = screen.getByAltText(/Waldo for loading screen/i);
    const text = screen.getByText(/Loading.../i);
    expect(img && text).toBeInTheDocument();

    await screen.findByText(/click/i);
  });

  describe("WaldoImgContainer component after data is loaded asychronously", () => {
    afterEach(() => jest.resetAllMocks());
    it("renders text prompting player to click the screen upon loading", async () => {
      spyURL();
      renderWithContext();

      const promptText = await screen.findByText(
        /click the screen to find the characters/i
      );
      screen.debug();

      expect(promptText).toBeInTheDocument();
    });

    it("renders images for each character upon loading", async () => {
      spyURL();
      renderWithContext();

      await screen.findByText(/click the screen to find the characters/i);

      const odlaw = screen.getByAltText(/Face of character Odlaw/i);
      const waldo = screen.getByAltText(/Face of character waldo/i);
      const wenda = screen.getByAltText(/Face of character wenda/i);
      const whitebeard = screen.getByAltText(/Face of character whitebeard/i);

      expect(odlaw && waldo && wenda && whitebeard).toBeInTheDocument();
    });

    it("renders images for each character upon loading with an opacity of 1", async () => {
      spyURL();
      renderWithContext();

      await screen.findByText(/click the screen to find the characters/i);

      const odlaw = screen.getByAltText(/Face of character Odlaw/i);
      const waldo = screen.getByAltText(/Face of character waldo/i);
      const wenda = screen.getByAltText(/Face of character wenda/i);
      const whitebeard = screen.getByAltText(/Face of character whitebeard/i);

      expect(odlaw && waldo && wenda && whitebeard).toHaveStyle("opacity: 1");
    });

    //TODO: figure out how to click screen and test opacity change

    it("renders a character selection popup that is not visible initially", async () => {
      spyURL();
      renderWithContext();

      await screen.findByText(/click the screen to find the characters/i);

      const popup = screen.getByTestId(/popup/i);
      expect(popup).toBeInTheDocument();
      expect(popup).not.toBeVisible();
    });

    it("renders a non-hidden popup with four buttons when image is clicked", async () => {
      spyURL();
      renderWithContext();

      await screen.findByText(/click the screen to find the characters/i);

      const mainImg = screen.getByAltText(/where's waldo ski slope/i);

      userEvent.click(mainImg);

      const popup = screen.getByTestId(/popup/i);
      expect(popup).toBeInTheDocument();
      expect(popup).toBeVisible();

      const odlawBtn = screen.getByRole("button", { name: /odlaw/i });
      const waldoBtn = screen.getByRole("button", { name: /waldo/i });
      const wendaBtn = screen.getByRole("button", { name: /wenda/i });
      const whitebeardBtn = screen.getByRole("button", {
        name: /whitebeard/i,
      });

      expect(
        odlawBtn && waldoBtn && wendaBtn && whitebeardBtn
      ).toBeInTheDocument();
    });

    // it("hides the character selection popup after popup button click", async () => {
    //   spyURL();
    //   renderWithContext();

    //   await screen.findByText(/click the screen to find the characters/i);

    //   const mainImg = screen.getByAltText(/where's waldo ski slope/i);

    //   userEvent.click(mainImg);

    //   const popup = screen.getByTestId(/popup/i);
    //   const odlawBtn = screen.getByRole("button", { name: /odlaw/i });

    //   userEvent.click(odlawBtn);

    //   expect(popup).not.toBeVisible();
    // });

    it("renders a timer that starts out at 0", async () => {
      spyURL();
      renderWithContext();

      await screen.findByText(/click the screen to find the characters/i);

      const timer = screen.getByText(/00:00:00/);
      expect(timer).toBeInTheDocument();
    });

    it("renders a timer that increments by 1 every second", async () => {
      spyURL();
      renderWithContext();

      await screen.findByText(/click the screen to find the characters/i);

      await ((waitFor) => {
        const timer = screen.getByText(/00:00:03/);
        expect(timer).toBeInTheDocumesnt();
      },
      3000);
    });

    it("calls reducer when screen is clicked", async () => {
      spyURL();
      renderWithContext();
      await screen.findByText(/click the screen to find the characters/i);

      const spyReducer = jest
        .spyOn(ReducerFile, "reducer")
        .mockImplementation(() => reducerObj);

      const mainImg = screen.getByAltText(/where's waldo ski slope/i);

      userEvent.click(mainImg);
      expect(spyReducer).toBeCalled();
    });

    // it("calls reducer when screen popup button is clicked", async () => {
    //   spyURL();
    //   renderWithContext();

    //   await screen.findByText(/click the screen to find the characters/i);

    //   //   const mainImg = screen.getByAltText(/where's waldo ski slope/i);

    //   //   userEvent.click(mainImg);

    //   const spyReducer = jest
    //     .spyOn(ReducerFile, "reducer")
    //     .mockImplementation(() => reducerObj);

    //   const odlawBtn = screen.getByRole("button", { name: /odlaw/i });
    //   userEvent.click(odlawBtn);

    //   expect(spyReducer).toBeCalled();
    // });
  });
});

const renderWithContext = (mapID = "snowMap") => {
  const waldoInfo = {
    waldoInfo: {
      images: {
        waldoCity: {
          storageRef: "gs://todo-project-6cd99.appspot.com/waldoCity.jpg",
          id: "cityMap",
          name: "City",
          altText: "Where's Waldo city map",
          leaderboard: "cityLeaderboard",
        },
        waldoDeptStore: {
          storageRef: "gs://todo-project-6cd99.appspot.com/waldoDeptStore.jpg",
          id: "deptMap",
          name: "Department Store",
          altText: "Where's Waldo department store map",
          leaderboard: "deptLeaderboard",
        },
        waldoMusketeers: {
          storageRef: "gs://todo-project-6cd99.appspot.com/waldoMusketeers.jpg",
          id: "muskMap",
          name: "Swashbuckling Musketeers",
          altText: "Where's Waldo swashbuckling musketeers map",
          leaderboard: "musketeersLeaderboard",
        },
        waldoSnow: {
          storageRef: "gs://todo-project-6cd99.appspot.com/waldoSnow.jpg",
          id: "snowMap",
          name: "Ski Slope",
          altText: "Where's Waldo ski slope map",
          leaderboard: "snowLeaderboard",
        },
        odlawFace: {
          altText: "Face of character Odlaw",
          id: "odlawFace",
          name: "odlaw",
          storageRef: "gs://todo-project-6cd99.appspot.com/odlaw-face.jpg",
        },
        waldoFace: {
          altText: "Face of character waldo",
          id: "waldoFace",
          name: "waldo",
          storageRef: "gs://todo-project-6cd99.appspot.com/waldo-face.webp",
        },
        wendaFace: {
          altText: "Face of character Wenda",
          id: "wendaFace",
          name: "wenda",
          storageRef: "gs://todo-project-6cd99.appspot.com/wenda-face.png",
        },
        whitebeardFace: {
          altText: "Face of character Whitebeard",
          id: "whitebeardFace",
          name: "whitebeard",
          storageRef:
            "gs://todo-project-6cd99.appspot.com/whitebeard-face.jpeg",
        },
      },
      mapLoadList: [
        "waldoCity",
        "waldoSnow",
        "waldoDeptStore",
        "waldoMusketeers",
      ],
      charLoadList: [
        { face: "odlawFace", name: "Odlaw" },
        { face: "waldoFace", name: "Waldo" },
        { face: "wendaFace", name: "Wenda" },
        { face: "whitebeardFace", name: "Whitebeard" },
      ],
      coords: {
        cityCoords: {
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
        deptCoords: {
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
        muskCoords: {
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
        snowCoords: {
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
    },
  };

  return render(
    <MemoryRouter initialEntries={[`/map/${mapID}`]}>
      <WaldoInfoContext.Provider value={waldoInfo}>
        <Routes>
          <Route path={`/map/:mapID`} element={<WaldoImgContainer />} />
        </Routes>
      </WaldoInfoContext.Provider>
    </MemoryRouter>
  );
};

const spyURL = jest
  .spyOn(firebaseFunctions, "getURL")
  .mockImplementation(() => "../../assets/waldoSnow.jpg");

const reducerObj = {
  charCoords: {
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
  mapSelection: "../../assets/waldoSnow.jpg",
  mapAltText: "Where's Waldo ski slope map",
  charFaces: [
    {
      altText: "Face of character Odlaw",
      id: "odlawFace",
      name: "odlaw",
      storageRef: "gs://todo-project-6cd99.appspot.com/odlaw-face.jpg",
    },
    {
      altText: "Face of character waldo",
      id: "waldoFace",
      name: "waldo",
      storageRef: "gs://todo-project-6cd99.appspot.com/waldo-face.webp",
    },
    {
      altText: "Face of character Wenda",
      id: "wendaFace",
      name: "wenda",
      storageRef: "gs://todo-project-6cd99.appspot.com/wenda-face.png",
    },
    {
      altText: "Face of character Whitebeard",
      id: "whitebeardFace",
      name: "whitebeard",
      storageRef: "gs://todo-project-6cd99.appspot.com/whitebeard-face.jpeg",
    },
  ],
  clickCoords: { x: 14, y: 36 },
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
  mapLoading: false,
  facesLoading: false,
  gameover: false,
  seconds: 1,
  timer: "00:00:01",
  popupStyle: { display: "flex" },
  playerMessage: "Click the screen to find the characters.",
  inputVal: "",
  collectionRef: null,
  disableSubmit: false,
  submitErrorMsg: "",
  submitting: false,
};

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as firebaseFunctions from "../../firebase";
import { BrowserRouter } from "react-router-dom";

import LeaderBoard from "./LeaderBoard";
import { WaldoInfoContext } from "../../DataContext";

describe("LeaderBoard component", () => {
  it("renders a loading screen initially", async () => {
    jest
      .spyOn(firebaseFunctions, "getTopDocs")
      .mockImplementation(() => topDocs);
    renderWithContext();
    const img = screen.getByAltText(/Waldo for loading screen/i);
    const text = screen.getByText(/Loading.../i);
    expect(img).toBeInTheDocument();
    expect(text).toBeInTheDocument();

    //This is to avoid getting act error messages
    await screen.findByText(/city/i);
    jest.restoreAllMocks();
  });
  describe("LeaderBoard component after data is loaded asychronously", () => {
    afterEach(() => jest.restoreAllMocks());
    it("Renders a header after data has loaded", async () => {
      jest
        .spyOn(firebaseFunctions, "getTopDocs")
        .mockImplementation(() => topDocs);
      renderWithContext();
      const header = await screen.findByText(/Leaderboards/i);
      expect(header).toBeInTheDocument();
    });
    it("Renders lists for each four maps after data has loaded", async () => {
      jest
        .spyOn(firebaseFunctions, "getTopDocs")
        .mockImplementation(() => topDocs);
      renderWithContext();
      const city = await screen.findByText(/city/i);
      const ski = await screen.findByText(/ski slope/i);
      const dept = await screen.findByText(/department store/i);
      const musk = await screen.findByText(/swashbuckling musketeers/i);
      expect(city && ski && dept && musk).toBeInTheDocument();
    });
    it("Renders a player and time column in each list", async () => {
      jest
        .spyOn(firebaseFunctions, "getTopDocs")
        .mockImplementation(() => topDocs);
      renderWithContext();
      const playerColumn = await screen.findAllByText(/player/i);
      const timeColumn = await screen.findAllByText(/time/i);
      expect(playerColumn).toHaveLength(4);
      expect(timeColumn).toHaveLength(4);
    });
    it("Renders the top 5 players in each list", async () => {
      jest
        .spyOn(firebaseFunctions, "getTopDocs")
        .mockImplementation(() => topDocs);
      renderWithContext();
      const player1 = await screen.findAllByText(/test1/i);
      const player2 = await screen.findAllByText(/test2/i);
      const player3 = await screen.findAllByText(/test3/i);
      const player4 = await screen.findAllByText(/test4/i);
      const player5 = await screen.findAllByText(/test5/i);
      expect(player1 && player2 && player3 && player4 && player5).toHaveLength(
        4
      );
    });
  });
});

const renderWithContext = () => {
  const waldoInfo = {
    waldoInfo: {
      images: {
        waldoCity: {
          storageRef: "gs://todo-project-6cd99.appspot.com/waldoCity.jpg",
          id: "cityMap",
          name: "City",
          altText: "Where's Waldo city map",
        },
        waldoDeptStore: {
          storageRef: "gs://todo-project-6cd99.appspot.com/waldoDeptStore.jpg",
          id: "deptMap",
          name: "Department Store",
          altText: "Where's Waldo department store map",
        },
        waldoMusketeers: {
          storageRef: "gs://todo-project-6cd99.appspot.com/waldoMusketeers.jpg",
          id: "muskMap",
          name: "Swashbuckling Musketeers",
          altText: "Where's Waldo swashbuckling musketeers map",
        },
        waldoSnow: {
          storageRef: "gs://todo-project-6cd99.appspot.com/waldoSnow.jpg",
          id: "snowMap",
          name: "Ski Slope",
          altText: "Where's Waldo ski slope map",
        },
      },
      mapLoadList: [
        "waldoCity",
        "waldoSnow",
        "waldoDeptStore",
        "waldoMusketeers",
      ],
    },
  };

  return render(
    <BrowserRouter>
      <WaldoInfoContext.Provider value={waldoInfo}>
        <LeaderBoard />
      </WaldoInfoContext.Provider>
    </BrowserRouter>
  );
};

const topDocs = [
  {
    id: "asdf",
    data: function () {
      return { name: "Test1", seconds: 3, timer: "00:00:03" };
    },
  },
  {
    id: "zxcv",
    data: function () {
      return { name: "Test2", seconds: 4, timer: "00:00:04" };
    },
  },
  {
    id: "qwer",
    data: function () {
      return { name: "Test3", seconds: 5, timer: "00:00:05" };
    },
  },
  {
    id: "tyui",
    data: function () {
      return { name: "Test4", seconds: 6, timer: "00:00:06" };
    },
  },
  {
    id: "hjkl",
    data: function () {
      return { name: "Test5", seconds: 7, timer: "00:00:07" };
    },
  },
];

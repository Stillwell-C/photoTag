import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import LeaderBoard from "../LeaderBoard";
import photoTagApi from "../../../app/api/photoTagApi";
import {
  emptyBoardData,
  multiBoardData,
  singleBoardData,
  tooManyPlayersData,
} from "../LeaderboardTestData";

//Mock for API Get requests
const apiGetMock = jest.spyOn(photoTagApi, "get");

// Mock for useNavigate. This is used for API errors
const mockedUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUseNavigate,
}));

describe("LeaderBoard component", () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <LeaderBoard />
      </BrowserRouter>
    );
  };

  afterEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());

  it("renders a loading screen before API response", async () => {
    apiGetMock.mockResolvedValue(multiBoardData);

    setup();
    const img = screen.getByAltText(/loading/i);
    const text = screen.getByText(/Loading.../i);
    expect(img).toBeInTheDocument();
    expect(text).toBeInTheDocument();

    //Avoid act error
    await screen.findByRole("heading", {
      name: "Leaderboards",
    });
  });

  describe("renders leaderboards upon API response", () => {
    it("Renders a header after data has loaded", async () => {
      apiGetMock.mockResolvedValue(multiBoardData);
      setup();
      const header = await screen.findByRole("heading", {
        name: "Leaderboards",
      });
      expect(header).toBeInTheDocument();
    });
    it("Renders a card for each map recieved from the API", async () => {
      apiGetMock.mockResolvedValue(multiBoardData);
      setup();
      const mapCardHeading = await screen.findAllByText(/^map/i);
      expect(mapCardHeading).toHaveLength(4);
    });
    it("Only renders the number of maps recieved from the API", async () => {
      apiGetMock.mockResolvedValue(singleBoardData);
      setup();
      const mapCardHeading = await screen.findAllByText(/^map/i);
      expect(mapCardHeading).toHaveLength(1);
    });
    it("Renders 'No Data Yet' message if map has no player data", async () => {
      apiGetMock.mockResolvedValue(emptyBoardData);
      setup();
      const noDataMsg = await screen.findByText(/no data yet/i);
      expect(noDataMsg).toBeInTheDocument();
    });
    it("Renders a maximum of 5 players", async () => {
      apiGetMock.mockResolvedValue(tooManyPlayersData);
      setup();
      const displayedPlayers = await screen.findAllByText(/00:00:00/i);
      expect(displayedPlayers).toHaveLength(5);
    });
    it("Renders a player and time column in each list", async () => {
      apiGetMock.mockResolvedValue(singleBoardData);
      setup();
      const playerColumn = await screen.findAllByText(/^player/i);
      const timeColumn = await screen.findAllByText(/00:00:00/i);
      //An extra to account for the title
      expect(playerColumn).toHaveLength(6);
      expect(timeColumn).toHaveLength(5);
    });
    it("Handles error by navigating to a new page", async () => {
      apiGetMock.mockRejectedValue({
        code: "ERR_NETWORK",
        name: "AxiosError",
      });
      setup();
      await waitFor(() => expect(mockedUseNavigate).toBeCalledTimes(1));
    });
  });
});

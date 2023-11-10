import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MapSelection from "../MapSelection";
import { BrowserRouter } from "react-router-dom";
import photoTagApi from "../../../app/api/photoTagApi";

// Mock for useNavigate. This is used for API errors
const mockedUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUseNavigate,
}));

//Mock for API Get requests
const apiGetMock = jest.spyOn(photoTagApi, "get");

const exampleData = {
  data: [
    {
      map_id: "652f650570b6a54dd23f2f29",
      mapname: "Ski Slope",
      imgkey: "h4nm4gu6clhqbrn27vfw.jpg",
    },
    {
      map_id: "652f650570b6a54dd23f2f28",
      mapname: "Ski Slope",
      imgkey: "h4nm4gu6clhqbrn27vfw.jpg",
    },
    {
      map_id: "652f650570b6a54dd23f2f27",
      mapname: "Ski Slope",
      imgkey: "h4nm4gu6clhqbrn27vfw.jpg",
    },
    {
      map_id: "652f650570b6a54dd23f2f26",
      mapname: "Ski Slope",
      imgkey: "h4nm4gu6clhqbrn27vfw.jpg",
    },
  ],
};

const exampleDataDouble = {
  data: [
    {
      map_id: "652f650570b6a54dd23f2f29",
      mapname: "Ski Slope",
      imgkey: "h4nm4gu6clhqbrn27vfw.jpg",
    },
    {
      map_id: "652f650570b6a54dd23f2f28",
      mapname: "Ski Slope",
      imgkey: "h4nm4gu6clhqbrn27vfw.jpg",
    },
  ],
};

describe("Map Selection component", () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <MapSelection />
      </BrowserRouter>
    );
  };

  it("renders correct heading", async () => {
    apiGetMock.mockResolvedValue(exampleData);

    setup();
    const header = screen.getByText(/map selection/i);
    expect(header).toBeInTheDocument();

    await screen.findAllByAltText(/Ski slope/i);
  });

  it("renders loading animation initially", async () => {
    apiGetMock.mockResolvedValue(exampleData);

    setup();
    const loadingText = screen.getAllByTestId(/loading-animation/i);
    expect(loadingText).toHaveLength(4);

    await screen.findAllByAltText(/Ski slope/i);
  });

  describe("Map selection component after intended images are loaded asynchronously", () => {
    afterEach(() => jest.clearAllMocks());

    it("Fetches data from API when map data not present in state", async () => {
      apiGetMock.mockResolvedValue(exampleData);

      setup();

      await screen.findAllByAltText(/Ski slope/i);
      expect(apiGetMock).toBeCalledTimes(1);
    });

    it("Does not render the loading animation after images have been loaded", async () => {
      apiGetMock.mockImplementation(() => Promise.resolve(exampleData));

      setup();
      await screen.findAllByAltText(/Ski slope/i);
      const loadingImgs = screen.queryAllByTestId(/loading-animation/i);
      expect(loadingImgs).toHaveLength(0);
    });

    it("Renders images with alt text, not a loading placeholder, when data is recieved from API", async () => {
      apiGetMock.mockResolvedValue(exampleData);

      setup();
      const loadedMapImages = await screen.findAllByAltText(/ski slope/i);
      const loadingImgs = screen.queryAllByTestId(/loading-animation/i);

      expect(loadedMapImages).toHaveLength(4);
      expect(loadingImgs).toHaveLength(0);
    });

    it("Renders a single image for each map recieved from API", async () => {
      apiGetMock.mockResolvedValue(exampleDataDouble);

      setup();
      const loadedMapImages = await screen.findAllByAltText(/ski slope/i);
      expect(loadedMapImages).toHaveLength(2);
    });

    it("Renders a message if no maps are recieved from API", async () => {
      apiGetMock.mockResolvedValue({ data: [] });

      setup();
      const loadedMapImages = await screen.findByText(
        /No maps found. Please try again later/i
      );
      expect(loadedMapImages).toBeInTheDocument();
    });

    it("Handles API error with response by navigating to a new page", async () => {
      apiGetMock.mockRejectedValue({
        response: { status: 404 },
      });
      setup();
      await waitFor(() => expect(mockedUseNavigate).toBeCalledTimes(1));
    });

    it("Handles error without response by navigating to a new page", async () => {
      apiGetMock.mockRejectedValue({});
      setup();
      await waitFor(() => expect(mockedUseNavigate).toBeCalledTimes(1));
    });
  });
});

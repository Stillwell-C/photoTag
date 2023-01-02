import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MapSelection from "./MapSelection";
import * as firebaseFunctions from "../../firebase";
import { BrowserRouter } from "react-router-dom";

import { WaldoInfoContext } from "../../DataContext";

describe("Map Selection component", () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <MapSelection />
      </BrowserRouter>
    );
  };

  it("renders correct heading", () => {
    renderWithContext();
    const header = screen.getByText(/map selection/i);
    expect(header).toBeInTheDocument();
  });

  it("renders four images initially with alt text loading placeholder", () => {
    renderWithContext();
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(4);
    const altText = screen.getAllByAltText(/loading placeholder/i);
    expect(altText).toHaveLength(4);
  });

  it("renders word loading over the images", () => {
    renderWithContext();
    const loadingText = screen.getAllByText(/loading/i);
    expect(loadingText).toHaveLength(4);
  });

  describe("Map selection component after intended images are loaded asynchronously", () => {
    afterEach(() => jest.restoreAllMocks());

    it("Does not render the word loading over the images", async () => {
      jest
        .spyOn(firebaseFunctions, "getURL")
        .mockImplementation(() => "../../assets/loading.jpg");

      renderWithContext();

      await screen.findByAltText(/Where's waldo city map/i);
      const loadingImgs = screen.queryAllByText(/loading/i);
      expect(loadingImgs).toHaveLength(0);
    });

    it("Renders images with descriptive alt text, not loading placeholder", async () => {
      jest
        .spyOn(firebaseFunctions, "getURL")
        .mockImplementation(() => "../../assets/loading.jpg");

      renderWithContext();
      await screen.findByAltText(/Where's waldo city map/i);
      const cityMap = screen.getByAltText(/Where's waldo city map/i);
      const loadingImgs = screen.queryAllByAltText(/loading/i);
      expect(cityMap).toBeInTheDocument();
      expect(loadingImgs).toHaveLength(0);
    });

    it("Continues to render loading images when getURL returns nothing", async () => {
      jest.spyOn(firebaseFunctions, "getURL");

      renderWithContext();

      await waitFor(() => {
        const altText = screen.getAllByAltText(/loading placeholder/i);
        expect(altText).toHaveLength(4);
      });
    });
  });
});

const renderWithContext = () => {
  const waldoInfo = {
    waldoInfo: {
      images: {
        waldoCity: "gs://todo-project-6cd99.appspot.com/waldoCity.jpg",
        waldoDeptStore:
          "gs://todo-project-6cd99.appspot.com/waldoDeptStore.jpg",
        waldoMusketeers:
          "gs://todo-project-6cd99.appspot.com/waldoMusketeers.jpg",
        waldoSnow: "gs://todo-project-6cd99.appspot.com/waldoSnow.jpg",
      },
      imgAltText: {
        waldoCity: "Where's waldo city map",
        waldoDeptStore: "Where's waldo department store map",
        waldoMusketeers: "Where's waldo swashbuckling musketeers map",
        waldoSnow: "Where's waldo ski slope map",
      },
    },
  };

  return render(
    <BrowserRouter>
      <WaldoInfoContext.Provider value={waldoInfo}>
        <MapSelection />
      </WaldoInfoContext.Provider>
    </BrowserRouter>
  );
};

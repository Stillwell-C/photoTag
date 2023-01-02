import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import LoadingPage from "./LoadingPage";

describe("Error Page component", () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <LoadingPage />
      </BrowserRouter>
    );
  };

  it("renders correct heading", () => {
    setup();
    const header = screen.getByText(/loading.../i);
    expect(header).toBeInTheDocument();
  });

  it("renders an image", () => {
    setup();
    const loadingImg = screen.getByRole("img", {
      name: /Waldo for loading screen/i,
    });
    expect(loadingImg).toBeInTheDocument();
  });
});

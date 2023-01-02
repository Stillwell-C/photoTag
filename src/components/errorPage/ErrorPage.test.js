import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import ErrorPage from "./ErrorPage";

describe("Error Page component", () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>
    );
  };

  it("renders correct heading", () => {
    setup();
    const header = screen.getByText(/error. this page does not exist/i);
    expect(header).toBeInTheDocument();
  });

  it("renders an image", () => {
    setup();
    const errorImg = screen.getByRole("img", {
      name: /Error. This page does not exist./i,
    });
    expect(errorImg).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import Navbar from "./Navbar";

describe("Error Page component", () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it("renders correct links", () => {
    setup();
    const homeLink = screen.getByRole("link", { name: /home/i });
    const boardsLink = screen.getByRole("link", { name: /leaderboards/i });
    expect(homeLink).toBeInTheDocument();
    expect(boardsLink).toBeInTheDocument();
  });
});

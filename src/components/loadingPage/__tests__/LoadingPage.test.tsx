import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import LoadingPage from "../LoadingPage";

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
    const header = screen.getByRole("heading", { name: "Loading..." });
    expect(header).toBeInTheDocument();
  });

  it("renders an image with alt text 'loading'", () => {
    setup();
    const loadingImg = screen.getByRole("img", {
      name: /loading/i,
    });
    expect(loadingImg).toBeInTheDocument();
  });
});

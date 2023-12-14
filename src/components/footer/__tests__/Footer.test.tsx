import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "../Footer";
import { BrowserRouter } from "react-router-dom";

describe("Footer component", () => {
  it("displays a link to my github", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    const link = screen.getByRole("link", { name: /stillwell-c/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://github.com/Stillwell-C/");
  });
});

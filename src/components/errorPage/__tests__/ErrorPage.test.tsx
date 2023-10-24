import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import ErrorPage from "../ErrorPage";

type LocationDataType = {
  state: {
    errorCode: string | number;
  };
};

const locationData: LocationDataType = {
  state: {
    errorCode: "ERR_NETWORK",
  },
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => locationData,
}));

describe("Error Page component", () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correct heading", () => {
    setup();
    const header = screen.getByRole("heading", { name: "Error" });
    expect(header).toBeInTheDocument();
  });

  it("renders default error message when not provided with an error code", () => {
    locationData.state.errorCode = "";

    setup();
    const errorMsg = screen.getByText(/Something went wrong/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it("renders network error message when provided with error code 'ERR_NETWORK'", () => {
    locationData.state.errorCode = "ERR_NETWORK";

    setup();
    const errorMsg = screen.getByText(/Network Error. Please try again later/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it("renders network error message when provided with error code '500'", () => {
    locationData.state.errorCode = 500;

    setup();
    const errorMsg = screen.getByText(/Network Error. Please try again later/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it("renders page does not exist error message when provided with error code '404'", () => {
    locationData.state.errorCode = 404;

    setup();
    const errorMsg = screen.getByText(/this page does not exist/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it("renders an image", () => {
    setup();
    const errorImg = screen.getByRole("img");
    expect(errorImg).toBeInTheDocument();
  });
});

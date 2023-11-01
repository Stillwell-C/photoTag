import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { initialState } from "../../../Context/PhotoTagContext";
import * as context from "../../../Context/PhotoTagContext";

import Modal from "../Modal";
import userEvent from "@testing-library/user-event";
import photoTagApi from "../../../app/api/photoTagApi";

//Context Mock
const mockSetInputVal = jest.fn();
const mockSetSubmitErrorMsg = jest.fn();
const mockSetSubmitting = jest.fn();

const mockInitialState = initialState;

const mockContextFunctions = {
  setInputVal: mockSetInputVal,
  setSubmitErrorMsg: mockSetSubmitErrorMsg,
  setSubmitting: mockSetSubmitting,
  setCharCoords: jest.fn(),
  setMapData: jest.fn(),
  setClickCoords: jest.fn(),
  setFound: jest.fn(),
  setMapLoading: jest.fn(),
  setGameover: jest.fn(),
  setSeconds: jest.fn(),
  setTimer: jest.fn(),
  setPopupStyle: jest.fn(),
  setPlayerMessage: jest.fn(),
  setButtonStyle: jest.fn(),
};

//API Mock
const apiPostMock = jest.spyOn(photoTagApi, "post");

//UseNavigate Mock
// Mock for useNavigate. This is used for API errors
const mockedUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUseNavigate,
}));

describe("Error Page component", () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <Modal mapID='testID' />
      </BrowserRouter>
    );
  };

  afterEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());

  it("renders correct heading", () => {
    setup();
    const header = screen.getByRole("heading", { name: /congratulations!/i });
    expect(header).toBeInTheDocument();
  });

  it("renders a form with with a label, input, and submit button", () => {
    setup();
    const label = screen.getByText(/submit your score:/i);
    const input = screen.getByPlaceholderText(/name/i);
    const button = screen.getByRole("button", { name: /submit/i });

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("renders a back to home button", () => {
    setup();
    const button = screen.getByRole("link", { name: /back to home/i });
    expect(button).toBeInTheDocument();
  });

  it("renders the correct timer", () => {
    const mockContext = {
      state: { ...mockInitialState, timer: "00:00:13" },
      ...mockContextFunctions,
    };

    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);

    setup();
    const timerDisplay = screen.getByText(/Your time was 00:00:13/i);
    expect(timerDisplay).toBeInTheDocument();
  });

  it("calls setInputValue for each entry into the input", async () => {
    const mockContext = {
      state: { ...mockInitialState },
      ...mockContextFunctions,
    };
    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);
    setup();
    const input: HTMLInputElement = screen.getByPlaceholderText(/name/i);
    await userEvent.type(input, "abc");
    expect(mockSetInputVal).toBeCalledWith("abc");
    expect(input.value).toBe("abc");
  });

  it("submit button is enabled when an input is made", async () => {
    //Typing into input not updating context. So input value is mocked.
    const mockContext = {
      state: { ...mockInitialState, inputVal: "abc" },
      ...mockContextFunctions,
    };

    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);

    setup();
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    expect(submitBtn).not.toBeDisabled();
  });

  it("sets error message & does not call post if inputVal is too long", async () => {
    const mockContext = {
      state: { ...mockInitialState, inputVal: "abcdefghijklmnopqrstuvqxyz" },
      ...mockContextFunctions,
    };

    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);

    setup();
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitBtn);
    expect(mockSetSubmitErrorMsg).toBeCalled();
    expect(mockSetSubmitErrorMsg).toBeCalledWith(
      "Error. Please input a name 20 characters or less"
    );
    expect(apiPostMock).not.toBeCalled();
  });

  it("sets error message & does not call post if inputVal is not input", async () => {
    const mockContext = {
      state: { ...mockInitialState, inputVal: "" },
      ...mockContextFunctions,
    };

    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);

    setup();
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitBtn);

    expect(apiPostMock).not.toBeCalled();
    expect(mockSetSubmitErrorMsg).toBeCalled();
    expect(mockSetSubmitErrorMsg).toBeCalledWith("Error. Please input a name");
  });

  it("sets error message if API Post call fails", async () => {
    const mockContext = {
      state: {
        ...mockInitialState,
        inputVal: "testName",
        seconds: 13,
        timer: "00:00:13",
        mapID: "testID",
      },
      ...mockContextFunctions,
    };

    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);

    apiPostMock.mockRejectedValue({
      code: "ERR_NETWORK",
      name: "AxiosError",
    });

    setup();

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitBtn);

    expect(mockSetSubmitting).toBeCalled();
    expect(mockSetSubmitErrorMsg).toBeCalled();
    expect(mockSetSubmitErrorMsg).toBeCalledWith(
      "Submission error. Please try again."
    );
  });

  it("displays error message if error message is set", () => {
    const mockContext = {
      state: {
        ...mockInitialState,
        submitErrorMsg: "Error. Please input a name 20 characters or less",
      },
      ...mockContextFunctions,
    };

    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);

    setup();
    const errorMsg = screen.getByText(
      /Error. Please input a name 20 characters or less/i
    );
    expect(errorMsg).toBeInTheDocument();
  });

  it("calls post route with data from the context and navigates to another page", async () => {
    const mockContext = {
      state: {
        ...mockInitialState,
        inputVal: "testName",
        seconds: 13,
        timer: "00:00:13",
        mapID: "testID",
      },
      ...mockContextFunctions,
    };

    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);

    setup();

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitBtn);

    expect(apiPostMock).toBeCalled();
    expect(apiPostMock).toBeCalledWith("/leaderboard", {
      playerName: "testName",
      seconds: 13,
      timer: "00:00:13",
      mapID: "testID",
    });

    expect(mockedUseNavigate).toBeCalled();
  });

  it('navigates to a new page when "Back to Home" button is clicked', async () => {
    const mockContext = {
      state: {
        ...mockInitialState,
      },
      ...mockContextFunctions,
    };

    jest
      .spyOn(context, "usePhotoTag")
      .mockImplementationOnce(() => mockContext);

    setup();

    const homeButton = screen.getByRole("link", { name: /back to home/i });
    await userEvent.click(homeButton);

    expect(mockedUseNavigate).toBeCalled();
  });

  describe("should correctly display loading animation", () => {
    it("displays loading animation when submitting is true", () => {
      const mockContext = {
        state: {
          ...mockInitialState,
          submitting: true,
        },
        ...mockContextFunctions,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      setup();

      const loadingAnimation = screen.getByTestId("loading-animation");
      expect(loadingAnimation).toBeInTheDocument();
    });

    it("does not display a header, timer, form, or home button when submitting is true", () => {
      const mockContext = {
        state: {
          ...mockInitialState,
          submitting: true,
        },
        ...mockContextFunctions,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      setup();

      const header = screen.queryByText(/congratulations!/i);
      expect(header).not.toBeInTheDocument();
      const timerDisplay = screen.queryByText(/Your time was/i);
      expect(timerDisplay).not.toBeInTheDocument();
      const label = screen.queryByText(/submit your score:/i);
      const input = screen.queryByPlaceholderText(/name/i);
      const submitButton = screen.queryByRole("button", { name: /submit/i });
      expect(label).not.toBeInTheDocument();
      expect(input).not.toBeInTheDocument();
      expect(submitButton).not.toBeInTheDocument();
      const button = screen.queryByRole("button", { name: /back to home/i });
      expect(button).not.toBeInTheDocument();
    });

    it("does not display loading animation when submitting is false", () => {
      const mockContext = {
        state: {
          ...mockInitialState,
          submitting: false,
        },
        ...mockContextFunctions,
      };

      jest
        .spyOn(context, "usePhotoTag")
        .mockImplementationOnce(() => mockContext);

      setup();

      const loadingAnimation = screen.queryByTestId("loading-animation");
      expect(loadingAnimation).not.toBeInTheDocument();
    });
  });
});

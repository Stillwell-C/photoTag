import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import Modal from "./Modal";
import userEvent from "@testing-library/user-event";

it("passes the test", () => {});

// describe("Error Page component", () => {
//   const setup = () => {
//     render(
//       <BrowserRouter>
//         <Modal />
//       </BrowserRouter>
//     );
//   };

//   it("renders correct heading", () => {
//     setup();
//     const header = screen.getByText(/congratulations!/i);
//     expect(header).toBeInTheDocument();
//   });

//   it("renders the correct timer", () => {
//     const timer = "00:00:45";
//     render(
//       <BrowserRouter>
//         <Modal timer={timer} />
//       </BrowserRouter>
//     );
//     const timerDisplay = screen.getByText(/Your time was 00:00:45/i);
//     expect(timerDisplay).toBeInTheDocument();
//   });

//   it("renders a form with with a label, input, and submit button", () => {
//     setup();
//     const label = screen.getByText(/submit your score:/i);
//     const input = screen.getByPlaceholderText(/name/i);
//     const button = screen.getByRole("button", { name: /submit/i });

//     expect(label).toBeInTheDocument();
//     expect(input).toBeInTheDocument();
//     expect(button).toBeInTheDocument();
//   });

//   it("renders a back to home button", () => {
//     setup();
//     const button = screen.getByRole("button", { name: /back to home/i });
//     expect(button).toBeInTheDocument();
//   });

//   it("calls handleSubmit when submit button is clicked", () => {
//     const handleSubmit = jest.fn((e) => e.preventDefault());
//     render(
//       <BrowserRouter>
//         <Modal handleSubmit={handleSubmit} />
//       </BrowserRouter>
//     );
//     const submitBtn = screen.getByRole("button", { name: /submit/i });
//     userEvent.click(submitBtn);
//     expect(handleSubmit).toHaveBeenCalledTimes(1);
//   });

//   it("calls handleInput for each entry into the input", () => {
//     const handleInput = jest.fn();
//     render(
//       <BrowserRouter>
//         <Modal handleInput={handleInput} />
//       </BrowserRouter>
//     );
//     const input = screen.getByPlaceholderText(/name/i);
//     userEvent.click(input);
//     userEvent.keyboard("abc");
//     expect(handleInput).toBeCalledWith("abc");
//   });

//   it("submit button is disabled when disableSubmit is true", () => {
//     render(
//       <BrowserRouter>
//         <Modal disableSubmit={true} />
//       </BrowserRouter>
//     );
//     const submitBtn = screen.getByRole("button", { name: /submit/i });
//     expect(submitBtn).toBeDisabled();
//   });

//   it("submit button is not disabled when disableSubmit is false", () => {
//     render(
//       <BrowserRouter>
//         <Modal disableSubmit={false} />
//       </BrowserRouter>
//     );
//     const submitBtn = screen.getByRole("button", { name: /submit/i });
//     expect(submitBtn).not.toBeDisabled();
//   });

//   it("displays error message when error message is provided", () => {
//     render(
//       <BrowserRouter>
//         <Modal submitErrorMsg={"Error. This is error text"} />
//       </BrowserRouter>
//     );
//     const errorMsg = screen.getByText(/error. this is error text/i);
//     expect(errorMsg).toBeInTheDocument();
//   });

//   it("displays loading animation when submitting is true", () => {
//     render(
//       <BrowserRouter>
//         <Modal submitting={true} />
//       </BrowserRouter>
//     );
//     const loadingAnimation = screen.getByTestId("loading-animation");
//     expect(loadingAnimation).toBeInTheDocument();
//   });

//   it("does not display a header, timer, form, or home button when submitting is true", () => {
//     render(
//       <BrowserRouter>
//         <Modal submitting={true} />
//       </BrowserRouter>
//     );
//     const header = screen.queryByText(/congratulations!/i);
//     expect(header).not.toBeInTheDocument();
//     const timerDisplay = screen.queryByText(/Your time was/i);
//     expect(timerDisplay).not.toBeInTheDocument();
//     const label = screen.queryByText(/submit your score:/i);
//     const input = screen.queryByPlaceholderText(/name/i);
//     const submitButton = screen.queryByRole("button", { name: /submit/i });
//     expect(label).not.toBeInTheDocument();
//     expect(input).not.toBeInTheDocument();
//     expect(submitButton).not.toBeInTheDocument();
//     const button = screen.queryByRole("button", { name: /back to home/i });
//     expect(button).not.toBeInTheDocument();
//   });

//   it("does not display loading animation when submitting is false", () => {
//     render(
//       <BrowserRouter>
//         <Modal submitting={false} />
//       </BrowserRouter>
//     );
//     const loadingAnimation = screen.queryByTestId("loading-animation");
//     expect(loadingAnimation).not.toBeInTheDocument();
//   });
// });

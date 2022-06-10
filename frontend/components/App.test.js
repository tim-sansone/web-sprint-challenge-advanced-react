import React from "react";

import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event"

import AppClass from "./AppClass"



test("renders AppClass without errors", () => {
  render(<AppClass />)
})

test("AppClass loads with appropriate elements", () => {
  render(<AppClass />)

  const xyMessage = screen.getByText(/coordinates \(2, 2\)/i);
  const moveMessage = screen.getByText(/you moved 0 times/i);
  const marker = screen.getByText(/b/i);
  const upButton = screen.getByText(/up/i);
  const downButton = screen.getByText(/down/i);
  const leftButton = screen.getByText(/left/i);
  const rightButton = screen.getByText(/right/i);
  const resetButton = screen.getByText(/reset/i);
  const emailInput = screen.getByPlaceholderText(/type email/i);
  const submitButton = document.querySelector("#submit");

  expect(xyMessage).toBeInTheDocument();
  expect(moveMessage).toBeInTheDocument();
  expect(marker).toBeInTheDocument();
  expect(upButton).toBeInTheDocument();
  expect(downButton).toBeInTheDocument();
  expect(leftButton).toBeInTheDocument();
  expect(rightButton).toBeInTheDocument();
  expect(resetButton).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();

})

test("typing in the input results in its value changing", async () => {
  render(<AppClass />)
  
  const emailInput = screen.getByPlaceholderText(/type email/i);
  await userEvent.type(emailInput, "This is my test input");
  
  const testInput = screen.getByDisplayValue("This is my test input");
  expect(testInput).toBeInTheDocument();
})

// test("if player plays the game correctly the win message displays", async () => {
//   render(<AppClass />)

//   const rightButton = screen.getByText(/right/i);
//   const downButton = screen.getByText(/down/i);
//   const emailInput = screen.getByPlaceholderText(/type email/i);
//   const submitButton = document.querySelector("#submit");

//   await userEvent.click(rightButton);
//   await userEvent.click(downButton);
//   await userEvent.type(emailInput, "john@doe.com");
//   await userEvent.click(submitButton);
  
//   const messageField = document.querySelector("#message");
//   console.log(messageField).textContent;

  
//   await userEvent.type(emailInput, "john@doe.com")
  
  

//   const message = screen.getByText("john win #72");
//   expect(message).toBeInTheDocument();

// })
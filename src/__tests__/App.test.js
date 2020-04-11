import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import api from "../services/api";

const apiMock = new MockAdapter(api);

import App from "../App";

const wait = (amount = 0) => {
  return new Promise((resolve) => setTimeout(resolve, amount));
};

const actWait = async (amount = 0) => {
  await act(async () => {
    await wait(amount);
  });
};

describe("App component", () => {
  it("should be able to add new repository", async () => {
    const { getByText, getByTestId } = render(<App />);

    apiMock.onGet("repositories").reply(200, []);

    apiMock.onPost("repositories").reply(200, {
      id: "123",
      url: "https://github.com/josepholiveira",
      title: "Desafio ReactJS",
      techs: ["React", "Node.js"],
      likes: 0
    });

    await actWait();

    fireEvent.click(getByText("Add"));

    await actWait();

    expect(getByTestId("repository-list")).toContainElement(
      getByText("Desafio ReactJS")
    );
  });

  it("sould be able to like repository", async () => {
    const { getByText, getByTestId } = render(<App />);

    apiMock.onGet("repositories").reply(200, [
      {
        id: "123",
        url: "https://github.com/josepholiveira",
        title: "Desafio ReactJS",
        techs: ["React", "Node.js"],
        likes: 0
      },
    ]);

    apiMock.onPost("repositories/123/like").reply(200, {
      id: "123",
      url: "https://github.com/josepholiveira",
      title: "Desafio ReactJS",
      techs: ["React", "Node.js"],
      likes: 1
    })

    await actWait();

    fireEvent.click(getByText(/\b(\w*Like\w*)\b/g));

    await actWait();

    expect(getByTestId("repository-list")).toContainElement(
      getByText("1 Like")
    );

  });

  it("should be able to remove repository", async () => {
    const { getByText, getByTestId } = render(<App />);

    apiMock.onGet("repositories").reply(200, [
      {
        id: "123",
        url: "https://github.com/josepholiveira",
        title: "Desafio ReactJS",
        techs: ["React", "Node.js"],
        likes: 0
      },
    ]);

    apiMock.onDelete("repositories/123").reply(204);

    await actWait();

    fireEvent.click(getByText("Remove"));

    await actWait();

    expect(getByTestId("repository-list")).toBeEmpty();
  });
});

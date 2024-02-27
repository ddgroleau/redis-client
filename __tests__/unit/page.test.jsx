import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "../../../app/page";

describe("Page", () => {
  it("has Hello World!", () => {
    render(<Page />);
    const heading = screen.getByText("Hello World!");
    expect(heading).toBeInTheDocument();
  });
});

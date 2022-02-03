import * as React from "react";
import { mount } from "@cypress/react";
import BatchSelection from "./batch-selection.component";
import IconButton from "../icon-button/icon-button.component";
import { positionOfElement } from "../../../cypress/support/helper";
import Icon from "../icon/icon.component";

import {
  batchSelectionCounter,
  batchSelectionComponent,
  batchSelectionButtonsByPosition,
} from "../../../cypress/locators/batch-selection/index";

context("Tests for BatchSelection component", () => {
  describe("check BatchSelection component count", () => {
    it.each(["0", "10", "100"])(
      "check BatchSelection component %s selected Count",
      (selectedCount) => {
        mount(<BatchSelection selectedCount={selectedCount} />);
        batchSelectionCounter().should(
          "have.text",
          `${selectedCount} selected`
        );
      }
    );

    it("should check hidden batch selection", () => {
      mount(<BatchSelection hidden />);
      batchSelectionComponent().should("have.attr", "hidden");
      batchSelectionComponent().should("not.be.visible");
    });

    it("should check disabled batch selection", () => {
      mount(<BatchSelection disabled />);
      batchSelectionComponent().should("have.attr", "disabled");
    });

    it.each([
      ["dark", "rgb(0, 51, 73)"],
      ["light", "rgb(179, 194, 200)"],
      ["white", "rgba(0, 0, 0, 0)"],
    ])(
      "check BatchSelection component %s colorTheme and it uses %s as a background color",
      (colorTheme, backgroundColor) => {
        mount(<BatchSelection colorTheme={colorTheme} />);
        batchSelectionComponent().should(
          "have.css",
          "background-color",
          backgroundColor
        );
      }
    );
  });

  describe("check BatchSelection button position", () => {
    it.each(["first", "second", "third"])(
      "check BatchSelection %s button position",
      (index) => {
        // and mount the story using @cypress/react library
        mount(
          <BatchSelection selectedCount={1} colorTheme="dark">
            <IconButton onAction={() => {}}>
              <Icon type="csv" />
            </IconButton>
            <IconButton onAction={() => {}}>
              <Icon type="bin" />
            </IconButton>
            <IconButton onAction={() => {}}>
              <Icon type="pdf" />
            </IconButton>
          </BatchSelection>
        );
        batchSelectionButtonsByPosition(positionOfElement(index))
          .parent()
          .focus();
      }
    );
  });
});

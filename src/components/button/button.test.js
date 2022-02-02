import * as React from "react";
import { mount } from "@cypress/react";
import Button from "./button.component";

import {
  buttonSubtextPreview,
  buttonDataComponent,
} from "../../../cypress/locators/button";

import { icon } from "../../../cypress/locators";
import { positionOfElement } from "../../../cypress/support/helper";

const testData = ["mp150ú¿¡üßä", "!@#$%^*()_+-=~[];:.,?{}&\"'<>"];

const ButtonAsASiblings = ({ label, ...props }) => {
  return (
    <div>
      <Button
        buttonType="secondary"
        // onClick={function noRefCheck(){}}
        {...props}
      >
        label
      </Button>
      <Button
        buttonType="secondary"
        ml={2}
        // onClick={function noRefCheck(){}}
        {...props}
      >
        {label}
      </Button>
    </div>
  );
};

context("Test for Button component", () => {
  describe("check Button component label input", () => {
    it.each(testData)(
      "should render Button with %s special characters",
      (label) => {
        mount(<Button>{label}</Button>);
        // then run our tests
        buttonDataComponent().should("have.text", label);
      }
    );

    it.each(testData)(
      "check Button as a sibling lable on preview is %s special characters",
      (label) => {
        mount(<ButtonAsASiblings>{label}</ButtonAsASiblings>);
        // then run our tests
        buttonDataComponent()
          .eq(positionOfElement("first"))
          .should("have.text", label);
        buttonDataComponent()
          .eq(positionOfElement("second"))
          .should("have.text", label);
      }
    );

    it("should check Button as a sibling is disabled", () => {
      mount(<ButtonAsASiblings disabled />);

      buttonDataComponent()
        .eq(positionOfElement("first"))
        .should("be.disabled")
        .and("have.attr", "disabled");
      buttonDataComponent()
        .eq(positionOfElement("second"))
        .should("be.disabled")
        .and("have.attr", "disabled");
    });

    it("should check Button as a sibling is enabled", () => {
      mount(<ButtonAsASiblings enabled />);

      buttonDataComponent().eq(positionOfElement("first")).should("be.enabled");
      buttonDataComponent()
        .eq(positionOfElement("second"))
        .should("be.enabled");
    });

    it.each(testData)(
      "should render Button subtext with %s special characters",
      (subtext) => {
        mount(<Button size="large" subtext={subtext} />);
        // then run our tests
        buttonSubtextPreview().should("have.text", subtext);
      }
    );

    it.each(testData)(
      "should render Button as a sibling subtext with %s special characters",
      (subtext) => {
        mount(<Button size="large" subtext={subtext} />);
        // then run our tests
        buttonSubtextPreview()
          .eq(positionOfElement("first"))
          .should("have.text", subtext);
        buttonSubtextPreview()
          .eq(positionOfElement("second"))
          .should("have.text", subtext);
      }
    );

    it.each([
      ["after", "0px"],
      ["before", "8px"],
    ])(
      "should set postion to %s for button as a sibling",
      (iconPosition, margin) => {
        mount(<ButtonAsASiblings iconPosition={iconPosition} />);
        // then run our tests
        icon()
          .eq(positionOfElement("first"))
          .should("have.css", "margin-right", margin);
        icon()
          .eq(positionOfElement("second"))
          .should("have.css", "margin-right", margin);
      }
    );
  });

  describe("Check click event for Button component", () => {
    it("should call click function in Actions Tab", () => {
      const callback = cy.stub();

      mount(<Button onClick={callback} />);
      // then run our tests
      buttonDataComponent().click({ force: true });
    });
  });
});

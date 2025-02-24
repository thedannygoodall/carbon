import * as React from "react";
import Button from "./button.component";

import {
  buttonSubtextPreview,
  buttonDataComponent,
} from "../../../cypress/locators/button";

import { icon, tooltipPreview } from "../../../cypress/locators";
import { positionOfElement, keyCode } from "../../../cypress/support/helper";
import CypressMountWithProviders from "../../../cypress/support/component-helper/cypress-mount";

const testData = ["mp150ú¿¡üßä", "!@#$%^*()_+-=~[];:.,?{}&\"'<>"];

const ButtonDifferentTypes = ({ ...props }) => {
  return (
    <div>
      <Button buttonType="primary" {...props}>
        Primary
      </Button>
      <Button buttonType="secondary" {...props}>
        Secondary
      </Button>
      <Button buttonType="tertiary" {...props}>
        Tertiary
      </Button>
      <Button buttonType="dashed" {...props}>
        Dashed
      </Button>
    </div>
  );
};

context("Test for Button component", () => {
  describe("Check props for Button component", () => {
    it.each(testData)(
      "should render Button label using %s special characters",
      (label) => {
        CypressMountWithProviders(<Button>{label}</Button>);

        buttonDataComponent().should("have.text", label);
      }
    );

    it.each(testData)(
      "should render Button subtext with %s special characters",
      (subtext) => {
        CypressMountWithProviders(<Button size="large" subtext={subtext} />);

        buttonSubtextPreview().should("have.text", subtext);
      }
    );

    it.each(testData)(
      "should render tooltip message with %s special characters",
      (tooltipMessage) => {
        CypressMountWithProviders(
          <Button
            iconType="bin"
            iconTooltipMessage={tooltipMessage}
            m="100px"
          />
        );

        buttonDataComponent().children().last().realHover();
        tooltipPreview().should("have.text", tooltipMessage);
      }
    );

    it.each([
      ["after", "left"],
      ["before", "right"],
    ])(
      "should set position to %s for icon in a button",
      (iconPosition, margin) => {
        CypressMountWithProviders(
          <Button iconType="add" iconPosition={iconPosition}>
            IconPosition
          </Button>
        );

        icon().should("have.css", `margin-${margin}`, "8px");
      }
    );

    it("should render Button with full width", () => {
      CypressMountWithProviders(<Button fullWidth />);

      buttonDataComponent().should("have.css", "width").and("eq", "1350px");
    });

    it.each([
      ["true", "white-space"],
      ["false", "flex-wrap"],
    ])(
      "should render the Button text without wrapping when noWrap is called",
      (booleanState, cssValue) => {
        CypressMountWithProviders(
          <Button noWrap={booleanState}> Long long long long long text </Button>
        );

        if (booleanState === true) {
          buttonDataComponent()
            .children()
            .children()
            .should("have.value", cssValue, "wrap");
        } else {
          buttonDataComponent()
            .children()
            .children()
            .should("not.have.value", cssValue, "wrap");
        }
      }
    );

    it("should check Button is disabled", () => {
      CypressMountWithProviders(<ButtonDifferentTypes disabled />);

      buttonDataComponent()
        .eq(positionOfElement("first"))
        .should("be.disabled")
        .and("have.attr", "disabled");
      buttonDataComponent()
        .eq(positionOfElement("second"))
        .should("be.disabled")
        .and("have.attr", "disabled");
      buttonDataComponent()
        .eq(positionOfElement("third"))
        .should("be.disabled")
        .and("have.attr", "disabled");
      buttonDataComponent()
        .eq(positionOfElement("fourth"))
        .should("be.disabled")
        .and("have.attr", "disabled");
    });

    it("should check Button is enabled", () => {
      CypressMountWithProviders(<ButtonDifferentTypes />);

      buttonDataComponent().eq(positionOfElement("first")).should("be.enabled");
      buttonDataComponent()
        .eq(positionOfElement("second"))
        .should("be.enabled");
      buttonDataComponent().eq(positionOfElement("third")).should("be.enabled");
      buttonDataComponent()
        .eq(positionOfElement("fourth"))
        .should("be.enabled");
    });
  });

  describe("Check events for Button component", () => {
    it("should call onClick event", () => {
      const callback = cy.stub();

      CypressMountWithProviders(<Button onClick={callback} />);

      buttonDataComponent()
        .click({ force: true })
        .then(() => {
          // eslint-disable-next-line no-unused-expressions
          expect(callback).to.have.been.calledOnce;
        });
    });

    it("should trigger onBlur event", () => {
      const callback = cy.stub();

      CypressMountWithProviders(<Button onBlur={callback} />);

      buttonDataComponent()
        .focus()
        .blur({ force: true })
        .then(() => {
          // eslint-disable-next-line no-unused-expressions
          expect(callback).to.have.been.calledOnce;
        });
    });

    it("should call the onKeyDown", () => {
      const callback = cy.stub();

      CypressMountWithProviders(<Button onKeyDown={callback} />);

      buttonDataComponent()
        .trigger("keydown", { force: true }, keyCode("rightarrow"))
        .then(() => {
          // eslint-disable-next-line no-unused-expressions
          expect(callback).to.have.been.calledOnce;
        });
    });

    it("should trigger onFocus event", () => {
      const callback = cy.stub();

      CypressMountWithProviders(<Button onFocus={callback} />);

      buttonDataComponent()
        .focus()
        .blur({ force: true })
        .then(() => {
          // eslint-disable-next-line no-unused-expressions
          expect(callback).to.have.been.calledOnce;
        });
    });
  });
});

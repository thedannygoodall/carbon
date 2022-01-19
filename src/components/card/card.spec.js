import React from "react";
import { mount, shallow } from "enzyme";
import TestRenderer from "react-test-renderer";
import Card from "./card.component";
import CardRow from "./card-row/card-row.component";
import CardFooter from "./card-footer/card-footer.component";
import {
  assertStyleMatch,
  testStyledSystemMargin,
} from "../../__spec_helper__/test-utils";
import Icon from "../icon";
import Link from "../link";
import { rootTagTest } from "../../__internal__/utils/helpers/tags/tags-specs";
import StyledCardFooter from "./card-footer/card-footer.style";
import { CARD_SIZES } from "./card.config";
import StyledCard from "./card.style";

describe("Card", () => {
  testStyledSystemMargin((props) => <Card {...props}>Content</Card>);

  describe("when the content is added as children", () => {
    it("then that content should be rendered inside the component", () => {
      const content = (
        <div>
          <span>content</span>
        </div>
      );
      const wrapper = renderCard({
        children: content,
      });

      expect(wrapper.containsMatchingElement(content)).toBe(true);
    });

    describe("when interactive prop is not provided", () => {
      it("should not provide `type` and `tabIndex` props", () => {
        const wrapper = mount(<Card> Card content </Card>);

        expect(wrapper.find(StyledCard).prop("type")).toBe(undefined);
        expect(wrapper.find(StyledCard).prop("tabIndex")).toBe(undefined);
      });
    });

    describe("when interactive prop is provided", () => {
      it("should provide `type` and `tabIndex` props", () => {
        const wrapper = mount(<Card interactive> Card content </Card>);

        expect(wrapper.find(StyledCard).prop("type")).toBe("button");
        expect(wrapper.find(StyledCard).prop("tabIndex")).toBe(0);
      });
    });

    describe.each(CARD_SIZES)(
      'and the "spacing" prop is set to %s',
      (spacing) => {
        it(`then CardRow and CardFooter children should have the "spacing" prop added and set to "${spacing}"`, () => {
          const content = [
            <CardRow className="mockedContent" key="content1">
              content
            </CardRow>,
            <CardFooter className="mockedContent" key="content2">
              content2
            </CardFooter>,
          ];
          const wrapper = renderCard({
            children: content,
            spacing,
          });
          expect(wrapper.find(".mockedContent").at(0).props().spacing).toBe(
            spacing
          );
          expect(wrapper.find(".mockedContent").at(1).props().spacing).toBe(
            spacing
          );
        });
      }
    );

    describe("when spacing prop is not set, styled-system props are used", () => {
      it("there is only one child row", () => {
        const cardRows = [
          <CardRow className="mockedContent" key="content1">
            content
          </CardRow>,
        ];
        const wrapper = renderCard({
          children: cardRows,
        });
        expect(
          wrapper.find(".mockedContent").at(0).props().pt
        ).not.toBeUndefined();
      });

      it("there is multiple child rows", () => {
        const cardRows = [
          <CardRow className="mockedContent" key="content1">
            content
          </CardRow>,
          <CardRow className="mockedContent" key="content2">
            content
          </CardRow>,
        ];
        const wrapper = renderCard({
          children: cardRows,
        });

        expect(
          wrapper.find(".mockedContent").at(0).props().py
        ).not.toBeUndefined();
      });

      it("there is one footer row child", () => {
        const cardFooter = [
          <CardFooter className="mockedContent" key="content1">
            content
          </CardFooter>,
        ];
        const wrapper = renderCard({
          children: cardFooter,
        });

        expect(wrapper.find(".mockedContent").at(0).props().py).toBeUndefined();
        expect(wrapper.find(".mockedContent").at(0).props().pt).toBeUndefined();
      });
    });
  });

  describe('when the "draggable" prop is set to true', () => {
    it('then a "drag" icon should be rendered', () => {
      const wrapper = renderCard({
        draggable: true,
      });

      expect(wrapper.find(Icon).exists()).toBe(true);
      expect(wrapper.find(Icon).props().type).toBe("drag");
    });
  });

  describe("CardFooter styling", () => {
    it("should match the expected styling when it has non-interactive content", () => {
      const cardFooter = TestRenderer.create(
        <CardFooter>
          <Link icon="link" href="https://carbon.sage.com/">
            View Stripe Dashboard
          </Link>
        </CardFooter>
      );

      expect(cardFooter).toMatchSnapshot();
    });

    it("should match the expected styling when it has interactive styling", () => {
      const cardFooter = TestRenderer.create(
        <CardFooter>
          <div id="non-interactive">View Stripe Dashboard</div>
        </CardFooter>
      );

      expect(cardFooter).toMatchSnapshot();
    });

    it("should render background transparent", () => {
      const cardFooter = mount(
        <CardFooter variant="transparent">
          <div id="non-interactive">View Stripe Dashboard</div>
        </CardFooter>
      );

      assertStyleMatch(
        {
          backgroundColor: "transparent",
        },
        cardFooter.find(StyledCardFooter)
      );
    });
  });

  describe('when the "action" prop is set', () => {
    describe('with the "interactive" prop set to true', () => {
      it('then the method passed in the "action" prop should be called after click is triggered', () => {
        const action = jest.fn();
        const wrapper = renderCard({
          interactive: true,
          action,
        });

        wrapper.simulate("click");

        expect(action).toHaveBeenCalled();
      });

      describe('and with the "draggable" prop set to true', () => {
        it('then the method passed in the "action" prop should not be called', () => {
          const action = jest.fn();
          const wrapper = renderCard({
            interactive: true,
            draggable: true,
            action,
          });

          wrapper.simulate("click");

          expect(action).not.toHaveBeenCalled();
        });
      });
    });

    describe('with the "interactive" prop not set', () => {
      it('then the method passed in the "action" prop should not be called', () => {
        const action = jest.fn();
        const wrapper = renderCard({
          action,
        });

        wrapper.simulate("click");

        expect(action).not.toHaveBeenCalled();
      });
    });
  });

  describe("when width is not passed as a prop", () => {
    const wrapper = renderCard();
    const elem = wrapper.find('[data-element="card"]');
    it("width fills containing element", () => {
      expect(elem).not.toHaveStyleRule("width");
    });
  });

  describe("when width is passed as a percentage value", () => {
    const widthPct = "50%";
    const wrapper = renderCard({ cardWidth: widthPct }, TestRenderer.create);

    it(`Card has style rule of width: ${widthPct}`, () => {
      assertStyleMatch(
        {
          width: widthPct,
        },
        wrapper.toJSON()
      );
    });
  });

  describe("when width is passed as a pixel value", () => {
    const widthPx = "500px";
    const wrapper = renderCard({ cardWidth: widthPx }, TestRenderer.create);

    it(`Card has style rule of width: ${widthPx}`, () => {
      assertStyleMatch(
        {
          width: widthPx,
        },
        wrapper.toJSON()
      );
    });
  });

  describe('when the "interactive" prop is set to true', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = renderCard({ interactive: true }, TestRenderer.create);
    });

    it("then the cursor when hovered over the Card should change to pointer", () => {
      assertStyleMatch(
        {
          cursor: "pointer",
        },
        wrapper.toJSON()
      );
    });

    it.each([
      ["hovered over", ":hover"],
      ["focused", ":focus"],
    ])(
      "then the Card when %s should have a specific box-shadow and no outline",
      (description, selector) => {
        assertStyleMatch(
          {
            boxShadow: "var(--boxShadow050)",
            outline: "none",
          },
          wrapper.toJSON(),
          selector
        );
      }
    );
  });

  describe('when the "draggable" prop is set to true', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = renderCard({ draggable: true }, TestRenderer.create);
    });

    it("then the cursor when hovered over the Card should change to move", () => {
      assertStyleMatch(
        {
          cursor: "move",
        },
        wrapper.toJSON()
      );
    });
  });

  it("include correct component and role data tags", () => {
    const wrapper = renderCard({ dataRole: "foo" }, shallow);

    rootTagTest(wrapper, "card", undefined, "foo");
  });

  it("include correct component and role tag when no prop passed", () => {
    const wrapper = renderCard({}, shallow);

    rootTagTest(wrapper, "card", undefined, undefined);
  });

  it("displays string when children prop has a string type", () => {
    const wrapper = renderCard({ children: "String passed as child" }, shallow);

    expect(wrapper.containsMatchingElement("String passed as child")).toBe(
      true
    );
  });
});

function renderCard(props = {}, renderer = shallow) {
  const children = props.children || <div />;

  return renderer(<Card {...props}>{children}</Card>);
}

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import { act } from "react-dom/test-utils";
import { mount as enzymeMount, shallow } from "enzyme";
import TestRenderer from "react-test-renderer";

import Drawer from "./drawer.component";
import { assertStyleMatch } from "../../__spec_helper__/test-utils";
import guid from "../../__internal__/utils/helpers/guid";
import {
  StyledDrawerSidebar,
  StyledDrawerContent,
  StyledDrawerChildren,
  StyledSidebarTitle,
  StyledButton,
  StyledSidebarHeader,
} from "./drawer.style";
import { noThemeSnapshot } from "../../__spec_helper__/enzyme-snapshot-helper";
import StickyFooter from "../../__internal__/sticky-footer";
import Button from "../button";

jest.mock("../../__internal__/utils/helpers/guid");
guid.mockImplementation(() => "guid-123");

let container = null;

const defaultProps = {
  expandedWidth: "20%",
  animationDuration: "0.5s",
  sidebar: (
    <ul>
      <li>link a</li>
      <li>link b</li>
      <li>link c</li>
    </ul>
  ),
};

const mount = (jsx) => {
  return enzymeMount(jsx, { attachTo: container });
};

const render = (props, renderer = mount) => {
  return renderer(
    <Drawer {...props}>
      content body content body content body content body content body content
      body content body
    </Drawer>
  );
};

const getElements = (wrapper) => {
  if (!wrapper) {
    return {};
  }

  return {
    drawer: wrapper.find(Drawer),
    sidebar: wrapper.find(StyledDrawerSidebar),
    content: wrapper.find(StyledDrawerContent),
    children: wrapper.find(StyledDrawerChildren),
    button: wrapper.find(StyledButton),
    title: wrapper.find(StyledSidebarTitle),
  };
};

describe("Drawer", () => {
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    jest.useFakeTimers();
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  describe("uncontrolled", () => {
    it("matches snapshot", () => {
      const wrapper = render(defaultProps, shallow);
      expect(noThemeSnapshot(wrapper)).toMatchSnapshot();
    });

    it("cleans ups timers on unmount", () => {
      const wrapper = render();
      wrapper.unmount();
      expect(clearTimeout).toHaveBeenCalled();
    });

    it("is expanded by default", () => {
      const wrapper = render();
      const { content } = getElements(wrapper);
      expect(content.prop("className").includes("open")).toEqual(true);
    });

    it("cleans ups timers on unmount", () => {
      const wrapper = render();
      wrapper.unmount();
      expect(clearTimeout).toHaveBeenCalled();
    });

    it("correctly sets aria attribute", () => {
      const ariaLabel = "test";
      const wrapper = render({ "aria-label": ariaLabel });
      const { drawer } = getElements(wrapper);
      expect(drawer.prop("aria-label")).toBe(ariaLabel);
    });

    it("renders drawer component correctly", () => {
      const dataAttr = "drawer";
      const wrapper = render({ "data-component": dataAttr });
      const { drawer } = getElements(wrapper);
      expect(drawer.prop("data-component")).toBe(dataAttr);
    });

    it("Drawer Sidebar should render as expected when not expanded", () => {
      const wrapper = render({ expanded: false });
      const { sidebar } = getElements(wrapper);
      assertStyleMatch(
        {
          display: "none",
          opacity: "0",
          overflowY: undefined,
        },
        sidebar
      );
    });

    it("Drawer Sidebar should render as expected when expanded", () => {
      const wrapper = render({ expanded: true });
      const { sidebar } = getElements(wrapper);
      assertStyleMatch(
        {
          display: "flex",
          flexDirection: "column",
          flex: "1 1 0%",
          overflowY: "auto",
        },
        sidebar
      );
    });

    describe("Drawer Content", () => {
      it("should render with correct styles", () => {
        const wrapper = render();
        const { content } = getElements(wrapper);
        assertStyleMatch(
          {
            minWidth: "var(--sizing500)",
            width: "var(--sizing500)",
          },
          content
        );
      });

      describe("when background color is not provided as a prop", () => {
        it("renders with default background color and border", () => {
          const wrapper = render();
          const { content } = getElements(wrapper);
          assertStyleMatch(
            {
              backgroundColor: "var(--colorsUtilityMajor040)",
              borderRight: "1px solid var(--colorsUtilityMajor075)",
            },
            content
          );
        });
      });

      it("children are rendered as expected", () => {
        const wrapper = render();
        const { children } = getElements(wrapper);
        assertStyleMatch(
          {
            flex: "1",
            overflow: "auto",
          },
          children
        );
      });
    });

    describe("Control Button", () => {
      it("renders with correct styles", () => {
        const snapshot = TestRenderer.create(<StyledButton />).toJSON();
        expect(snapshot).toMatchSnapshot();
      });
    });

    it("opens sidebar to specific width matching expandedWidth prop", () => {
      const expandedWidth = "50%";
      const wrapper = render({ expandedWidth, showControls: true });
      const { button, content } = getElements(wrapper);
      button.simulate("click");
      assertStyleMatch(
        {
          width: expandedWidth,
        },
        content.childAt(0),
        { modifier: "&.open" }
      );
    });

    describe("when height prop is provided", () => {
      it("should render height 100% by default", () => {
        const wrapper = render({ showControls: true });
        const { button } = getElements(wrapper);
        button.simulate("click");
        assertStyleMatch(
          {
            height: "100%",
          },
          wrapper
        );
      });

      it("should render custom height if provided", () => {
        const height = "50%";
        const wrapper = render({ height, showControls: true });
        const { button } = getElements(wrapper);
        button.simulate("click");
        assertStyleMatch(
          {
            height: "50%",
          },
          wrapper
        );
      });
    });

    describe("when title prop is provided", () => {
      it("Sidebar sets it as heading", () => {
        const heading = "My custom title";
        const wrapper = render({ title: heading });
        const { title } = getElements(wrapper);
        expect(title.text()).toBe(heading);
      });

      it("Sidebar renders heading with correct styles", () => {
        const heading = "My custom title";
        const wrapper = render({ title: heading });
        const { title } = getElements(wrapper);
        assertStyleMatch(
          {
            padding: "var(--spacing300) var(--spacing500)",
          },
          title
        );
      });
    });

    it("one click on button closes drawer sidebar", () => {
      const wrapper = render({ showControls: true });
      const { button } = getElements(wrapper);
      button.simulate("click");
      const { content } = getElements(wrapper);
      expect(content.childAt(0).hasClass("closed")).toBeTruthy();
    });

    it("two clicks on button closes and then opens drawer sidebar", () => {
      const wrapper = render({ showControls: true });
      let { button } = getElements(wrapper);
      button.simulate("click");
      let { content } = getElements(wrapper);
      expect(content.childAt(0).hasClass("closed")).toBeTruthy();
      button = getElements(wrapper).button;
      button.simulate("click");
      content = getElements(wrapper).content;
      expect(content.childAt(0).hasClass("open")).toBeTruthy();
    });

    it("sets class `open` on drawer that opened", () => {
      const wrapper = render({ defaultExpanded: false, showControls: true });
      const { button } = getElements(wrapper);
      act(() => {
        button.simulate("click");
        jest.runAllTimers();
      });
      wrapper.update();
      const { content } = getElements(wrapper);
      expect(content.childAt(0).hasClass("open")).toBeTruthy();
    });

    it("two clicks on button opens and then closes drawer sidebar", () => {
      const wrapper = render({ showControls: true });
      const { button } = getElements(wrapper);
      button.simulate("click");
      const { content } = getElements(wrapper);
      expect(content.childAt(0).hasClass("closed")).toBeTruthy();
    });

    it("sets class `open` on drawer that opened", () => {
      const wrapper = render({ showControls: true });
      const { content } = getElements(wrapper);
      expect(content.childAt(0).hasClass("open")).toBeTruthy();
    });

    it("sets class `closed` on drawer that closed", () => {
      const wrapper = render({ showControls: true });
      const { button } = getElements(wrapper);
      act(() => {
        button.simulate("click");
        jest.runAllTimers();
      });
      wrapper.update();
      const { content } = getElements(wrapper);
      expect(content.childAt(0).hasClass("closed")).toBeTruthy();
    });

    describe("with the stickyHeader prop set", () => {
      describe("when expanded", () => {
        it("should add the correct styles", () => {
          const wrapper = render({
            stickyHeader: true,
            showControls: true,
            title: "Test title",
          });

          assertStyleMatch(
            {
              position: "sticky",
              top: "0",
              borderBottom: "var(--sizing010) solid #ccd6db",
            },
            wrapper.find(StyledSidebarHeader)
          );
        });
      });

      describe("when closed", () => {
        it("should add the correct styles", () => {
          const wrapper = render({
            stickyHeader: true,
            showControls: true,
            title: "Test title",
            expanded: false,
          });

          assertStyleMatch(
            {
              position: "sticky",
              top: "0",
              borderBottom: undefined,
            },
            wrapper.find(StyledSidebarHeader)
          );
        });
      });
    });

    describe("with the footer prop set", () => {
      describe("when stickyFooter prop is false", () => {
        it("should not be sticky", () => {
          const wrapper = render({
            footer: <div>Some footer content</div>,
          });

          expect(wrapper.find(StickyFooter).props().disableSticky).toEqual(
            true
          );
        });
      });

      describe("when stickyFooter prop is true", () => {
        it("should be sticky", () => {
          const wrapper = render({
            footer: <div>Some footer content</div>,
            stickyFooter: true,
          });

          expect(wrapper.find(StickyFooter).props().disableSticky).toEqual(
            false
          );
        });
      });
    });

    describe("invariant", () => {
      beforeEach(() => {
        jest.spyOn(global.console, "error").mockImplementation(() => {});
      });

      afterEach(() => {
        global.console.error.mockReset();
      });

      it("throws if Drawer is changed from uncontrolled to controlled", () => {
        expect(() => {
          const wrapper = render({ expanded: undefined });
          wrapper.setProps({ expanded: true });
          wrapper.update();
        }).toThrow(
          "Drawer should not switch from uncontrolled to controlled (or vice versa). Decide between" +
            " using a controlled or uncontrolled Drawer element for the lifetime of the component"
        );
      });
    });
  });

  describe("controlled", () => {
    it("sidebar is open when expanded prop is provided", () => {
      const wrapper = render({ expanded: true });
      const { content } = getElements(wrapper);
      assertStyleMatch(
        {
          width: "40%",
        },
        content.childAt(0),
        { modifier: "&.open" }
      );
    });

    it("is collapsed when expanded prop is provided and is false", () => {
      const wrapper = render({ expanded: false });
      const { content } = getElements(wrapper);
      expect(content.prop("className").includes("closed")).toEqual(true);
    });

    it("drawer changes to closed when button is clicked", () => {
      const wrapper = render({ expanded: true, showControls: true });
      const { button } = getElements(wrapper);
      button.simulate("click");
      const { content } = getElements(wrapper);

      assertStyleMatch(
        {
          width: undefined,
        },
        content.childAt(0),
        { modifier: "&.closed" }
      );
    });

    it("drawer changes to open when button is clicked", () => {
      const onChange = jest.fn();
      const wrapper = render({
        expanded: false,
        showControls: true,
        onChange,
      });
      const { button } = getElements(wrapper);
      button.simulate("click");
      const { content } = getElements(wrapper);

      assertStyleMatch(
        {
          width: "40%",
        },
        content.childAt(0),
        { modifier: "&.open" }
      );
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("drawer opening sets timeout class", () => {
      const wrapper = render({
        expanded: false,
        showControls: true,
        animationDuration: "500ms",
      });
      const { button } = getElements(wrapper);
      button.simulate("click");
      const { content } = getElements(wrapper);
      expect(content.childAt(0).hasClass("opening")).toBeTruthy();
    });

    it("sets `closing` class on drawer when close icon was clicked", () => {
      const wrapper = render({
        expanded: true,
        showControls: true,
        animationDuration: "0.5s",
      });
      const { button } = getElements(wrapper);
      button.simulate("click");
      const { content } = getElements(wrapper);
      expect(content.childAt(0).hasClass("closing")).toBeTruthy();
    });

    it("sets animation speed to two seconds when string `numeric` value is given as a string", () => {
      const animationDuration = "2000";
      const wrapper = render({
        expanded: true,
        showControls: true,
        animationDuration,
      });
      const { button } = getElements(wrapper);
      button.simulate("click");
      const { content } = getElements(wrapper);
      expect(content.childAt(0).prop("animationDuration")).toBe(
        animationDuration
      );
    });

    it("sets animation speed to two seconds when string `ms` value is given as a string", () => {
      const animationDuration = "2000ms";
      const wrapper = render({
        expanded: true,
        showControls: true,
        animationDuration,
      });
      const { button } = getElements(wrapper);
      button.simulate("click");
      const { content } = getElements(wrapper);
      expect(content.childAt(0).prop("animationDuration")).toBe(
        animationDuration
      );
    });

    it("sets animation speed to two seconds when string `decimal` value is given as a string", () => {
      const animationDuration = "0.5s";
      const wrapper = render({
        expanded: true,
        showControls: true,
        animationDuration,
      });
      const { button } = getElements(wrapper);
      button.simulate("click");
      const { content } = getElements(wrapper);
      expect(content.childAt(0).prop("animationDuration")).toBe(
        animationDuration
      );
    });

    it("sets animation speed to two seconds when string `seconds` value is given as a string", () => {
      const animationDuration = "2s";
      const wrapper = render({
        expanded: true,
        showControls: true,
        animationDuration,
      });
      const { button } = getElements(wrapper);
      button.simulate("click");
      const { content } = getElements(wrapper);
      expect(content.childAt(0).prop("animationDuration")).toBe(
        animationDuration
      );
    });

    it("sets background color as red when backgroundColor prop is provided", () => {
      const color = "#FF0000";
      const wrapper = render({ backgroundColor: color });
      const { content } = getElements(wrapper);
      assertStyleMatch(
        {
          backgroundColor: color,
        },
        content.childAt(0)
      );
    });

    it("sets background color as white when backgroundColor prop is provided", () => {
      const color = "#FFFFFF";
      const wrapper = render({ backgroundColor: color });
      const { content } = getElements(wrapper);
      assertStyleMatch(
        {
          backgroundColor: color,
        },
        content.childAt(0)
      );
    });

    it("sets background as transparent when backgroundColor prop is provided", () => {
      const color = "transparent";
      const wrapper = render({ backgroundColor: color });
      const { content } = getElements(wrapper);
      assertStyleMatch({}, content.childAt(0));
    });

    describe("by an external control", () => {
      // eslint-disable-next-line react/prop-types
      const MockComponent = ({ expanded = false }) => {
        const [isExpanded, setIsExpanded] = React.useState(expanded);
        return (
          <>
            <Button onClick={() => setIsExpanded((p) => !p)}>Expand</Button>
            <Drawer sidebar="foo" expanded={isExpanded}>
              content body content body content body content body content body
              content body content body
            </Drawer>
          </>
        );
      };

      it("expands the sidebar", () => {
        const wrapper = mount(<MockComponent />);
        act(() => {
          wrapper.find(Button).prop("onClick")();
          jest.runAllTimers();
        });
        expect(
          wrapper.update().find(StyledDrawerSidebar).prop("isExpanded")
        ).toEqual(true);
      });

      it("toggles the opening animation and sets the expected class name", () => {
        const wrapper = mount(<MockComponent />);
        const button = wrapper.find(Button);
        button.simulate("click");
        const { content } = getElements(wrapper);
        expect(content.childAt(0).hasClass("opening")).toBeTruthy();
      });

      it("contracts the sidebar and toggles the closing animation", () => {
        const wrapper = mount(<MockComponent expanded />);
        act(() => {
          wrapper.find(Button).prop("onClick")();
          jest.runAllTimers();
        });
        expect(
          wrapper.update().find(StyledDrawerSidebar).prop("isExpanded")
        ).toEqual(false);
      });

      it("toggles the closing animation and sets the expected class name", () => {
        const wrapper = mount(<MockComponent expanded />);
        const button = wrapper.find(Button);
        button.simulate("click");
        const { content } = getElements(wrapper);
        expect(content.childAt(0).hasClass("closing")).toBeTruthy();
      });
    });

    describe("invariant", () => {
      beforeEach(() => {
        jest.spyOn(global.console, "error").mockImplementation(() => {});
      });

      afterEach(() => {
        global.console.error.mockReset();
      });

      it("throws if Drawer is changed from controlled to uncontrolled", () => {
        expect(() => {
          const wrapper = render({ expanded: true });
          wrapper.setProps({ expanded: undefined });
          wrapper.update();
        }).toThrow(
          "Drawer should not switch from uncontrolled to controlled (or vice versa). Decide between" +
            " using a controlled or uncontrolled Drawer element for the lifetime of the component"
        );
      });
    });
  });
});

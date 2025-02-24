import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { mount } from "enzyme";
import { createPopper } from "@popperjs/core";

import useResizeObserver from "../../hooks/__internal__/useResizeObserver";
import Popover from "./popover.component";
import StyledBackdrop from "./popover.style";
import CarbonScopedTokensProvider from "../../style/design-tokens/carbon-scoped-tokens-provider/carbon-scoped-tokens-provider.component";

jest.mock("@popperjs/core");
jest.mock("../../hooks/__internal__/useResizeObserver");

const Component = (props) => {
  const [ref, setRef] = useState({});

  const setRefCallback = useCallback((reference) => {
    setRef({ current: reference });
  }, []);

  return (
    <div ref={setRefCallback} id="popover-container">
      <Popover placement="bottom-start" {...props} reference={ref}>
        <div id="popover-children" />
      </Popover>
    </div>
  );
};

describe("Popover", () => {
  describe("portal", () => {
    it("creates a div and appends it to body on mount", () => {
      const createElementSpy = jest.spyOn(document, "createElement");
      const appendChildSpy = jest.spyOn(document.body, "appendChild");

      const wrapper = mount(<Component />);

      expect(createElementSpy).toHaveBeenCalledWith("div");

      const provider = wrapper.find(CarbonScopedTokensProvider).getDOMNode();

      const grandchild = document.createElement("div");
      grandchild.id = "popover-children";
      provider.appendChild(grandchild);
      expect(appendChildSpy.mock.calls[0][0].childNodes[0]).toEqual(provider);
    });
    it("does not render children in portal when disablePortal passed", () => {
      const createPortalSpy = jest.spyOn(ReactDOM, "createPortal");
      const wrapper = mount(<Component disablePortal />);
      wrapper.unmount();
      expect(createPortalSpy).not.toHaveBeenCalled();
    });

    it("renders children in portal", () => {
      const createPortalSpy = jest.spyOn(ReactDOM, "createPortal");
      const wrapper = mount(<Component />);

      const provider = wrapper.find(CarbonScopedTokensProvider).getDOMNode();

      const grandchild = document.createElement("div");
      grandchild.id = "popover-children";
      provider.appendChild(grandchild);

      expect(createPortalSpy.mock.calls[0][0].props.children.props.id).toBe(
        "popover-children"
      );
      expect(createPortalSpy.mock.calls[0][1].childNodes[0]).toEqual(provider);
    });

    it("removes created div from the body on unmount", () => {
      const removeChildSpy = jest.spyOn(document.body, "removeChild");

      const wrapper = mount(<Component />);

      wrapper.unmount();

      const child = document.createElement("div");

      expect(removeChildSpy).toHaveBeenCalledWith(child);
    });
  });

  describe("disableBackgroundUI", () => {
    it("renders content as a child of backdrop when background is disabled", () => {
      const wrapper = mount(<Component disableBackgroundUI />);
      expect(
        wrapper.find(StyledBackdrop).find("#popover-children").exists()
      ).toBe(true);
    });

    it("does not render backdrop when background is not disabled", () => {
      const wrapper = mount(<Component />);
      expect(wrapper.find(StyledBackdrop).exists()).toBe(false);
    });
  });

  describe("popper - ", () => {
    const destroyFunc = jest.fn();
    const updateFunc = jest.fn();

    createPopper.mockImplementation(() => ({
      destroy: destroyFunc,
      update: updateFunc,
    }));

    it("popper instance is initialized again after props change", () => {
      jest.clearAllMocks();

      const myWrapper = mount(<Component />);

      expect(createPopper).toHaveBeenCalledTimes(1);

      myWrapper.setProps({ placement: "bottom" });

      expect(createPopper).toHaveBeenCalledTimes(2);
    });

    it("popper instance is destroyed on unmount", () => {
      const myWrapper = mount(<Component />);

      myWrapper.unmount();

      expect(destroyFunc).toHaveBeenCalled();
    });

    it("popper instance is updated when reference element resizes", () => {
      mount(<Component />);

      useResizeObserver.mock.calls[
        useResizeObserver.mock.calls.length - 1
      ][1]();

      expect(updateFunc).toHaveBeenCalled();
    });

    it("createPopper is called with proper arguments", () => {
      const myWrapper = mount(<Component />);

      const ref = myWrapper.find("#popover-container").getDOMNode();
      const menu = myWrapper.find("#popover-children").getDOMNode();

      expect(createPopper.mock.calls[0][0]).toEqual(ref);
      expect(createPopper.mock.calls[0][1]).toEqual(menu);
      expect(createPopper.mock.calls[0][2]).toMatchObject({
        placement: "bottom-start",
      });
    });
  });
});

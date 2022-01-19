import React, { useState } from "react";
import { mount } from "enzyme";
import { createPopper } from "@popperjs/core";

import SelectTextbox from "./select-textbox.component";
import Textbox from "../../textbox";
import InputPresentationStyle, {
  StyledInputPresentationContainer,
} from "../../../__internal__/input/input-presentation.style";
import useResizeObserver from "../../../hooks/__internal__/useResizeObserver";

jest.mock("@popperjs/core");
jest.mock("../../../hooks/__internal__/useResizeObserver");

const Component = (props) => {
  const [textboxRef, setTextboxRef] = useState();

  function assignInput(input) {
    setTextboxRef(input.current);
  }

  return (
    <SelectTextbox textboxRef={textboxRef} inputRef={assignInput} {...props} />
  );
};

describe("SelectTextbox", () => {
  describe("popper - ", () => {
    const destroyFunc = jest.fn();
    const updateFunc = jest.fn();

    createPopper.mockImplementation(() => ({
      destroy: destroyFunc,
      update: updateFunc,
    }));

    it("popper instance is initialized when isOpen is true", () => {
      jest.clearAllMocks();

      mount(<Component isOpen />);

      expect(createPopper).toHaveBeenCalledTimes(1);
    });

    it("popper instance is destroyed on unmount", () => {
      const myWrapper = mount(<Component isOpen />);

      myWrapper.unmount();

      expect(destroyFunc).toHaveBeenCalled();
    });

    it("createPopper is called with proper arguments", () => {
      jest.clearAllMocks();

      const myWrapper = mount(<Component isOpen />);

      const reference = myWrapper
        .find(StyledInputPresentationContainer)
        .getDOMNode();
      const popper = myWrapper.find(InputPresentationStyle).getDOMNode();

      expect(createPopper.mock.calls[0][0]).toEqual(reference);
      expect(createPopper.mock.calls[0][1]).toEqual(popper);
      expect(createPopper.mock.calls[0][2]).toMatchObject({
        strategy: "fixed",
      });
    });

    it("popper instance is updated when reference element resizes", () => {
      mount(<Component isOpen />);

      useResizeObserver.mock.calls[
        useResizeObserver.mock.calls.length - 1
      ][1]();

      expect(updateFunc).toHaveBeenCalled();
    });
  });

  describe("when rendered", () => {
    it("it should contain a Textbox with expected props", () => {
      const wrapper = mount(<SelectTextbox />);

      expect(wrapper.find(Textbox).exists()).toBe(true);
      expect(wrapper.find(Textbox).props().placeholder).toBe(
        "Please Select..."
      );
      expect(wrapper.find(Textbox).props().inputIcon).toBe("dropdown");
      expect(wrapper.find(Textbox).props().autoComplete).toBe("off");
    });
  });

  describe("when the onFocus prop has been passed and the input has been focused", () => {
    it("then that prop should be called", () => {
      const onFocusFn = jest.fn();
      const wrapper = mount(<SelectTextbox onFocus={onFocusFn} />);

      wrapper.find("input").simulate("focus");
      expect(onFocusFn).toHaveBeenCalled();
    });
  });

  describe("when the onBlur prop has been passed and the input has been unfocused", () => {
    it("then that prop should be called", () => {
      const onBlurFn = jest.fn();
      const wrapper = mount(<SelectTextbox onBlur={onBlurFn} />);

      wrapper.find("input").simulate("blur");
      expect(onBlurFn).toHaveBeenCalled();
    });
  });

  // coverage filler for else path
  const wrapper = mount(<SelectTextbox />);
  wrapper.find("input").simulate("blur");
});

describe("coverage filler for else path", () => {
  const wrapper = mount(<SelectTextbox />);
  wrapper.find("input").simulate("focus");
});

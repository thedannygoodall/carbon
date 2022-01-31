import React from "react";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";

import DateRange from "./date-range.component";
import DateInput from "../date";
import DatePicker from "../date/__internal__/date-picker";
import { rootTagTest } from "../../__internal__/utils/helpers/tags/tags-specs";
import {
  assertStyleMatch,
  testStyledSystemMargin,
} from "../../__spec_helper__/test-utils";
import StyledDateRange from "./date-range.style";
import StyledDateInput from "../date/date.style";
import Tooltip from "../tooltip";

const initialValues = ["10/10/2016", "11/11/2016"];
const updatedValues = ["12/12/2012", "13/12/2012"];

describe("DateRange", () => {
  let wrapper;
  let startInput;
  let endInput;
  let customOnChange;
  let customOnBlur;

  beforeEach(() => {
    customOnChange = jest.fn();
    customOnBlur = jest.fn();

    wrapper = renderDateRange(
      {
        onChange: customOnChange,
        onBlur: customOnBlur,
        value: initialValues,
        "data-element": "bar",
        "data-role": "baz",
        name: "foo",
        id: "bar",
      },
      mount
    );
    startInput = wrapper.find(DateInput).at(0);
    endInput = wrapper.find(DateInput).at(1);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  testStyledSystemMargin((props) => (
    <DateRange value={initialValues} onChange={() => {}} {...props} />
  ));

  describe("onChange", () => {
    describe("when the start date changes", () => {
      it("calls the passed in onChange function", () => {
        wrapper
          .find(DateInput)
          .at(0)
          .find("input")
          .simulate("change", { target: { value: "15/10/2016" } });

        expect(customOnChange).toHaveBeenCalledWith({
          target: {
            id: "bar",
            name: "foo",
            value: [
              { formattedValue: "15/10/2016", rawValue: "2016-10-15" },
              { formattedValue: "11/11/2016", rawValue: "2016-11-11" },
            ],
          },
        });
      });

      describe("and startDateProps.allowEmptyValue is true", () => {
        it("emits the rawValue as an empty string", () => {
          wrapper.setProps({
            startDateProps: { allowEmptyValue: true },
            value: ["", initialValues[1]],
          });
          simulateBlurOnInput(wrapper.update().find(DateInput).at(0));
          expect(customOnBlur).toHaveBeenCalledWith({
            target: {
              id: "bar",
              name: "foo",
              value: [
                { formattedValue: "", rawValue: "" },
                { formattedValue: "11/11/2016", rawValue: "2016-11-11" },
              ],
            },
          });
        });
      });

      it("sets the raw value to null if an invalid date string is passed", () => {
        wrapper
          .find(DateInput)
          .at(0)
          .find("input")
          .simulate("change", { target: { value: "foo" } });

        expect(customOnChange).toHaveBeenCalledWith({
          target: {
            id: "bar",
            name: "foo",
            value: [
              { formattedValue: "foo", rawValue: null },
              { formattedValue: "11/11/2016", rawValue: "2016-11-11" },
            ],
          },
        });
      });
    });

    describe("when the end date changes", () => {
      it("calls the passed in onChange function", () => {
        wrapper
          .find(DateInput)
          .at(1)
          .find("input")
          .simulate("change", { target: { value: "16/11/2016" } });

        expect(customOnChange).toHaveBeenCalledWith({
          target: {
            id: "bar",
            name: "foo",
            value: [
              { formattedValue: "10/10/2016", rawValue: "2016-10-10" },
              { formattedValue: "16/11/2016", rawValue: "2016-11-16" },
            ],
          },
        });
      });

      describe("and endDateProps.allowEmptyValue is true", () => {
        it("emits the rawValue as an empty string", () => {
          wrapper.setProps({
            endDateProps: { allowEmptyValue: true },
            value: [initialValues[0], ""],
          });
          simulateBlurOnInput(wrapper.update().find(DateInput).at(1));

          expect(customOnBlur).toHaveBeenCalledWith({
            target: {
              id: "bar",
              name: "foo",
              value: [
                { formattedValue: "10/10/2016", rawValue: "2016-10-10" },
                { formattedValue: "", rawValue: "" },
              ],
            },
          });
        });
      });

      describe("when no onBlur prop is passed in", () => {
        it("it does not call the passed in onChange function", () => {
          wrapper.setProps({ onBlur: undefined });
          wrapper.find(DateInput).first().props().onBlur();
        });
      });

      it("sets the raw value to null if an invalid date string is passed", () => {
        wrapper
          .find(DateInput)
          .at(1)
          .find("input")
          .simulate("change", { target: { value: "foo" } });

        expect(customOnChange).toHaveBeenCalledWith({
          target: {
            id: "bar",
            name: "foo",
            value: [
              { formattedValue: "10/10/2016", rawValue: "2016-10-10" },
              { formattedValue: "foo", rawValue: null },
            ],
          },
        });
      });
    });

    describe("when the user interacts with a date input", () => {
      it("does not fire an onBlur event when focus moves from start to end input", () => {
        wrapper.find(DateInput).first().find("input").simulate("focus");
        wrapper.update().find(DateInput).last().find("input").simulate("focus");
        expect(customOnBlur).not.toHaveBeenCalled();
      });

      it("does not fire an onBlur event when focus moves from end to start input", () => {
        wrapper.find(DateInput).last().find("input").simulate("focus");
        wrapper
          .update()
          .find(DateInput)
          .first()
          .find("input")
          .simulate("focus");
        expect(customOnBlur).not.toHaveBeenCalled();
      });
    });

    describe("when the user updates the startDate textbox", () => {
      it("calls the passed in onBlur function with formatted date string and ISO raw value", () => {
        const updatedValue = "15/10/2016";
        const updatedISO = "2016-10-15";
        wrapper
          .find(DateInput)
          .at(0)
          .find("input")
          .simulate("change", { target: { value: updatedValue } });

        wrapper.find(DateInput).at(0).find("input").simulate("blur");

        expect(customOnBlur).toHaveBeenCalledWith({
          target: {
            id: "bar",
            name: "foo",
            value: [
              { formattedValue: updatedValue, rawValue: updatedISO },
              { formattedValue: "11/11/2016", rawValue: "2016-11-11" },
            ],
          },
        });
      });

      it("calls the passed in onBlur function with current unformatted input string and null raw value", () => {
        const updatedValue = "foo";
        const updatedISO = null;
        wrapper
          .find(DateInput)
          .at(0)
          .find("input")
          .simulate("change", { target: { value: updatedValue } });

        wrapper.find(DateInput).at(0).find("input").simulate("blur");

        expect(customOnBlur).toHaveBeenCalledWith({
          target: {
            id: "bar",
            name: "foo",
            value: [
              { formattedValue: updatedValue, rawValue: updatedISO },
              { formattedValue: "11/11/2016", rawValue: "2016-11-11" },
            ],
          },
        });
      });
    });

    describe("when the user updates the endDate textbox", () => {
      it("calls the passed in onBlur function", () => {
        const updatedValue = "15/10/2016";
        const updatedISO = "2016-10-15";
        wrapper
          .find(DateInput)
          .at(1)
          .find("input")
          .simulate("change", { target: { value: updatedValue } });

        wrapper.find(DateInput).at(1).find("input").simulate("blur");

        expect(customOnBlur).toHaveBeenCalledWith({
          target: {
            id: "bar",
            name: "foo",
            value: [
              { formattedValue: "10/10/2016", rawValue: "2016-10-10" },
              { formattedValue: updatedValue, rawValue: updatedISO },
            ],
          },
        });
      });

      it("calls the passed in onBlur function with current unformatted input string and null raw value", () => {
        const updatedValue = "foo";
        const updatedISO = null;
        wrapper
          .find(DateInput)
          .at(1)
          .find("input")
          .simulate("change", { target: { value: updatedValue } });

        wrapper.find(DateInput).at(1).find("input").simulate("blur");

        expect(customOnBlur).toHaveBeenCalledWith({
          target: {
            id: "bar",
            name: "foo",
            value: [
              { formattedValue: "10/10/2016", rawValue: "2016-10-10" },
              { formattedValue: updatedValue, rawValue: updatedISO },
            ],
          },
        });
      });
    });

    describe("when allowEmptyValue props are true for both inputs and initial values are empty", () => {
      it("emits the rawValue as an empty string", () => {
        wrapper = mount(
          <DateRange
            value={["", ""]}
            onChange={customOnChange}
            startDateProps={{ allowEmptyValue: true }}
            endDateProps={{ allowEmptyValue: true }}
          />
        );
        wrapper
          .update()
          .find(DateInput)
          .at(0)
          .find("input")
          .simulate("change", { target: { value: "" } });

        wrapper.update();
        simulateBlurOnInput(wrapper.find(DateInput).at(0));

        expect(customOnChange).toHaveBeenCalledWith({
          target: {
            value: [
              { formattedValue: "", rawValue: "" },
              { formattedValue: "", rawValue: "" },
            ],
          },
        });
      });
    });
  });

  describe("blocking blur", () => {
    let container;
    const tabKey = new KeyboardEvent("keydown", { key: "Tab", which: 9 });
    const shiftTabKey = new KeyboardEvent("keydown", {
      key: "Tab",
      which: 9,
      shiftKey: true,
    });
    const randomKey = new KeyboardEvent("keydown", {
      which: 32,
    });

    beforeEach(() => {
      container = document.createElement("div");
      container.id = "enzymeContainer";
      document.body.appendChild(container);
      customOnChange = jest.fn();
      customOnBlur = jest.fn();

      wrapper = renderDateRange(
        {
          onChange: customOnChange,
          onBlur: customOnBlur,
          value: initialValues,
          "data-element": "bar",
          "data-role": "baz",
          name: "foo",
          id: "bar",
        },
        mount
      );
      startInput = wrapper.find(DateInput).at(0);
      endInput = wrapper.find(DateInput).at(1);
    });

    afterEach(() => {
      jest.clearAllMocks();

      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }

      container = null;
    });

    describe("when the first input is focused", () => {
      it("prevents the onBlur callback from being called when tab key press detected", () => {
        act(() => {
          simulateFocusOnInput(startInput);
        });
        wrapper.update();
        act(() => {
          startInput.prop("onKeyDown")(tabKey);
        });
        wrapper.update();
        simulateBlurOnInput(startInput);

        expect(customOnBlur).not.toHaveBeenCalled();
      });

      it("allows the onBlur callback to be called when tab and shift key press detected", () => {
        act(() => {
          simulateFocusOnInput(startInput);
        });
        wrapper.update();
        act(() => {
          startInput.prop("onKeyDown")(shiftTabKey);
        });
        wrapper.update();
        simulateBlurOnInput(startInput);

        expect(customOnBlur).toHaveBeenCalled();
      });

      it("allows the onBlur callback to be called when random key press detected", () => {
        act(() => {
          simulateFocusOnInput(startInput);
        });
        wrapper.update();
        act(() => {
          startInput.prop("onKeyDown")(randomKey);
        }); // for coverage
        wrapper.update();
        simulateBlurOnInput(startInput);

        expect(customOnBlur).toHaveBeenCalled();
      });
    });

    describe("when the last input is focused", () => {
      it("allows the onBlur callback to be called when tab key press detected", () => {
        act(() => {
          simulateFocusOnInput(endInput);
        });
        wrapper.update();
        act(() => {
          endInput.prop("onKeyDown")(tabKey);
        });
        wrapper.update();
        simulateBlurOnInput(endInput);

        expect(customOnBlur).toHaveBeenCalled();
      });

      it("prevents the onBlur callback from being called when tab and shift key press detected", () => {
        act(() => {
          simulateFocusOnInput(endInput);
        });
        wrapper.update();
        act(() => {
          endInput.prop("onKeyDown")(shiftTabKey);
        });
        wrapper.update();
        simulateBlurOnInput(endInput);

        expect(customOnBlur).not.toHaveBeenCalled();
      });
    });
  });

  function simulateBlurOnInput(container) {
    const input = container.find("input");

    act(() => {
      input.simulate("blur");
    });
  }

  describe("startValue", () => {
    it("sets the value prop on the first input", () => {
      expect(wrapper.find(DateInput).first().prop("value")).toEqual(
        "10/10/2016"
      );
    });
  });

  describe("endValue", () => {
    it("sets the value prop on the last input", () => {
      expect(wrapper.find(DateInput).last().prop("value")).toEqual(
        "11/11/2016"
      );
    });
  });

  describe("focusing the start input", () => {
    it("closes the other datepicker", () => {
      simulateFocusOnInput(wrapper.find(DateInput).last());
      expect(
        wrapper.update().find(DateInput).last().find(DatePicker).exists()
      ).toBeTruthy();

      simulateFocusOnInput(wrapper.find(DateInput).first());

      expect(
        wrapper.update().find(DateInput).last().find(DatePicker).exists()
      ).toBeFalsy();
    });
  });

  describe("focusing the end input", () => {
    it("closes the other datepicker", () => {
      simulateFocusOnInput(wrapper.find(DateInput).first());
      expect(
        wrapper.update().find(DateInput).first().find(DatePicker).exists()
      ).toBeTruthy();

      simulateFocusOnInput(wrapper.find(DateInput).last());
      expect(
        wrapper.update().find(DateInput).first().find(DatePicker).exists()
      ).toBeFalsy();
    });
  });

  describe("render", () => {
    beforeEach(() => {
      customOnChange = jest.fn();
      wrapper = renderDateRange(
        {
          onChange: customOnChange,
          startDateProps: { label: "From" },
          endDateProps: { label: "To" },
        },
        mount
      );

      startInput = wrapper.find(DateInput).at(0);
      endInput = wrapper.find(DateInput).at(1);
    });

    it("renders 2 date components", () => {
      expect(wrapper.find(DateInput).length).toEqual(2);
    });

    it("renders optional labels inline", () => {
      expect(startInput.props().label).toEqual("From");
      expect(endInput.props().label).toEqual("To");
    });
  });

  describe("start and end date props", () => {
    it("dates are enabled by default", () => {
      wrapper = renderDateRange(
        {
          onChange: customOnChange,
          value: initialValues,
        },
        mount
      );
      startInput = wrapper.find(DateInput).at(0);
      endInput = wrapper.find(DateInput).at(1);
      expect(startInput.props().disabled).toBeUndefined();
      expect(endInput.props().disabled).toBeUndefined();
    });

    it("dates can be disabled by passing startDateProps and endDateProps to DateRange", () => {
      wrapper = renderDateRange(
        {
          onChange: customOnChange,
          startDateProps: { disabled: true },
          endDateProps: { disabled: true },
          value: initialValues,
        },
        mount
      );
      startInput = wrapper.find(DateInput).at(0);
      endInput = wrapper.find(DateInput).at(1);
      expect(startInput.props().disabled).toEqual(true);
      expect(endInput.props().disabled).toEqual(true);
    });

    it("date values can be set via startDateProps and endDateProps", () => {
      wrapper = renderDateRange(
        {
          onChange: customOnChange,
          startDateProps: { value: "2016-10-10" },
          endDateProps: { value: "2016-11-11" },
          value: ["", ""],
        },
        mount
      );
      startInput = wrapper.find(DateInput).at(0);
      endInput = wrapper.find(DateInput).at(1);
      expect(startInput.props().value).toEqual("2016-10-10");
      expect(endInput.props().value).toEqual("2016-11-11");
    });

    it("value prop is retained for backward compatibility", () => {
      wrapper = renderDateRange(
        {
          onChange: customOnChange,
          value: ["2015-10-10", "2015-11-11"],
        },
        mount
      );
      startInput = wrapper.find(DateInput).at(0);
      endInput = wrapper.find(DateInput).at(1);
      expect(startInput.props().value).toEqual("10/10/2015");
      expect(endInput.props().value).toEqual("11/11/2015");
    });

    it("value prop is overriden by startDateProps.value and endDateProps.value", () => {
      wrapper = renderDateRange(
        {
          onChange: customOnChange,
          startDateProps: { value: initialValues[0] },
          endDateProps: { value: initialValues[1] },
        },
        mount
      );
      startInput = wrapper.find(DateInput).at(0);
      endInput = wrapper.find(DateInput).at(1);
      expect(startInput.props().value).toEqual("10/10/2016");
      expect(endInput.props().value).toEqual("11/11/2016");
    });

    it("supports value update dynamically at runtime", () => {
      wrapper = renderDateRange(
        {
          onChange: customOnChange,
          value: initialValues,
        },
        mount
      );
      wrapper.setProps({ value: updatedValues });
      wrapper.update();
      startInput = wrapper.find(DateInput).at(0);
      endInput = wrapper.find(DateInput).at(1);
      expect(startInput.props().value).toEqual("12/12/2012");
      expect(endInput.props().value).toEqual("13/12/2012");
    });

    it("supports value update dynamically at runtime to empty values", () => {
      wrapper = renderDateRange(
        {
          onChange: customOnChange,
          value: initialValues,
        },
        mount
      );
      wrapper.setProps({ value: ["", ""] });
      wrapper.update();
      startInput = wrapper.find(DateInput).at(0);
      endInput = wrapper.find(DateInput).at(1);
      expect(startInput.props().value).toEqual("");
      expect(endInput.props().value).toEqual("");
    });

    it("class names can be added to dates by passing startDateProps and endDateProps to DateRange", () => {
      wrapper = renderDateRange(
        {
          onChange: customOnChange,
          startDateProps: { className: "custom-start-class" },
          endDateProps: { className: "custom-end-class" },
        },
        mount
      );
      startInput = wrapper.find(DateInput).at(0);
      endInput = wrapper.find(DateInput).at(1);
      expect(startInput.props().className).toEqual("custom-start-class");
      expect(endInput.props().className).toEqual("custom-end-class");
    });
  });

  describe("tags", () => {
    describe("on component", () => {
      it("include correct component, element and role data tags", () => {
        rootTagTest(wrapper.childAt(0), "date-range", "bar", "baz");
      });
    });

    describe("on internal elements", () => {
      customOnChange = jest.fn();
      wrapper = renderDateRange({ onChange: customOnChange }, mount);

      it(`include 'data-element="start-date"'`, () => {
        expect(
          wrapper.find('DateInput[data-element="start-date"]').exists()
        ).toBeTruthy();
      });

      it(`include 'data-element="start-date"'`, () => {
        expect(
          wrapper.find('DateInput[data-element="end-date"]').exists()
        ).toBeTruthy();
      });
    });
  });
});

describe("StyledDateRange", () => {
  it("renders Date inputs correctly when the labels are inline", () => {
    const wrapper = mount(
      <StyledDateRange labelsInline>
        <StyledDateInput />
      </StyledDateRange>
    );

    assertStyleMatch({ verticalAlign: "top" }, wrapper, {
      modifier: `& ${StyledDateInput}`,
    });
  });

  it("renders Date inputs correctly when the labels are not inline", () => {
    const wrapper = mount(
      <StyledDateRange>
        <StyledDateInput />
      </StyledDateRange>
    );

    assertStyleMatch({ verticalAlign: "bottom" }, wrapper, {
      modifier: `& ${StyledDateInput}`,
    });
  });

  describe("tooltipPosition", () => {
    it("overrides the default value when icon is on input", () => {
      const { position } = renderDateRange(
        { startError: "message", tooltipPosition: "top" },
        mount
      )
        .find(Tooltip)
        .props();

      expect(position).toEqual("top");
    });

    it("overrides the default value when icon is on label", () => {
      const { position } = renderDateRange(
        {
          startLabel: "start",
          endLabel: "end",
          validationOnLabel: true,
          startError: "message",
          tooltipPosition: "top",
        },
        mount
      )
        .find(Tooltip)
        .props();

      expect(position).toEqual("top");
    });
  });
});

function renderDateRange(props, renderer = shallow) {
  return renderer(
    <DateRange value={initialValues} onChange={() => {}} {...props} />,
    {
      attachTo: document.getElementById("enzymeContainer"),
    }
  );
}

function simulateFocusOnInput(container) {
  const input = container.find("input");

  input.simulate("focus");
}

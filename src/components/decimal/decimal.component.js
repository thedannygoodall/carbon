import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import styledSystemPropTypes from "@styled-system/prop-types";

import invariant from "invariant";
import Textbox from "../textbox";
import { filterStyledSystemMarginProps } from "../../style/utils";
import LocaleContext from "../../__internal__/i18n-context";

const marginPropTypes = filterStyledSystemMarginProps(
  styledSystemPropTypes.space
);
const Decimal = ({
  align = "right",
  defaultValue,
  precision = 2,
  inputWidth,
  readOnly,
  onChange,
  onBlur,
  onKeyPress,
  id,
  name,
  allowEmptyValue = false,
  required,
  locale,
  value,
  ...rest
}) => {
  const context = React.useContext(LocaleContext);

  const emptyValue = allowEmptyValue ? "" : "0.00";

  // const [isComponentControlled, setIsComponentControlled] = useState(
  //   !!defaultValue
  // );

  const [precisionValue] = useState(precision);

  const getSafeValueProp = useCallback(
    (isInitialValue) => {
      // We're intentionally preventing the use of number values to help prevent any unintentional rounding issues
      invariant(
        typeof value === "string",
        "Decimal `value` prop must be a string"
      );

      if (isInitialValue && !allowEmptyValue) {
        invariant(
          value !== "",
          "Decimal `value` must not be an empty string. Please use `allowEmptyValue` or `0.00`"
        );
      }
      return value;
    },
    [allowEmptyValue, value]
  );

  const getSeparator = useCallback(
    (separatorType) => {
      const numberWithGroupAndDecimalSeparator = 10000.1;
      return Intl.NumberFormat(locale || context.locale())
        .formatToParts(numberWithGroupAndDecimalSeparator)
        .find((part) => part.type === separatorType).value;
    },
    [context, locale]
  );

  const isNaN = useCallback((val) => {
    return Number.isNaN(Number(val));
  }, []);

  /**
   * Format a user defined value
   */
  const formatValue = useCallback(() => {
    if (isNaN(value)) {
      return value;
    }

    /* Guards against any white-space only strings like "   " being 
       mishandled and returned as `NaN` for visibleValue */
    if (value === "" || value.match(/\s+/g)) {
      return value;
    }

    const separator = getSeparator("decimal");
    const [integer, remainder] = value.split(".");

    const formattedInteger = Intl.NumberFormat(locale || context.locale(), {
      maximumFractionDigits: 0,
    }).format(integer);

    let formattedNumber = formattedInteger;
    if (remainder && remainder.length > precision) {
      formattedNumber += `${separator + remainder}`;
    } else if (remainder && remainder.length <= precision) {
      formattedNumber += `${
        separator + remainder + "0".repeat(precision - remainder.length)
      }`;
    } else {
      formattedNumber += `${
        precision ? separator + "0".repeat(precision) : ""
      }`;
    }
    return formattedNumber;
  }, [context, getSeparator, isNaN, locale, precision, value]);

  /**
   * Determine if the component is controlled at the time of call
   */
  const isControlled = defaultValue === undefined;

  useEffect(() => {
    if (precisionValue !== precision) {
      // eslint-disable-next-line no-console
      console.error(
        "Decimal `precision` prop has changed value. Changing the Decimal `precision` prop has no effect."
      );
    }
  }, [formatValue, getSafeValueProp, precision, precisionValue]);

  const removeDelimiters = useCallback(() => {
    const delimiterMatcher = new RegExp(`[\\${getSeparator("group")} ]*`, "g");
    return value.replace(delimiterMatcher, "");
  }, [getSeparator, value]);

  /**
   * Convert raw input to a standard decimal format
   */
  const toStandardDecimal = useCallback(
    (i18nValue) => {
      const valueWithoutNBS =
        getSeparator("group").match(/\s+/) && !i18nValue.match(/\s{2,}/)
          ? i18nValue.replace(/\s+/g, "")
          : i18nValue;
      /* If a value is passed in that is a number but has too many delimiters in succession, we want to handle this
    value without formatting it or removing delimiters. We also want to consider that,
    if a value consists of only delimiters, we want to treat that 
    value in the same way as if the value was NaN. We want to pass this value to the 
    formatValue function, before the delimiters can be removed. */
      const errorsWithDelimiter = new RegExp(
        `([^A-Za-z0-9]{2,})|(^[^A-Za-z0-9-]+)|([^0-9a-z-,.])|([^0-9-,.]+)|([W,.])$`,
        "g"
      );
      const separator = getSeparator("decimal");
      const separatorRegex = new RegExp(
        separator === "." ? `\\${separator}` : separator,
        "g"
      );
      if (
        valueWithoutNBS.match(errorsWithDelimiter) ||
        (valueWithoutNBS.match(separatorRegex) || []).length > 1
      ) {
        return valueWithoutNBS;
      }

      const withoutDelimiters = removeDelimiters(valueWithoutNBS);
      return withoutDelimiters.replace(new RegExp(`\\${separator}`, "g"), ".");
    },
    [getSeparator, removeDelimiters]
  );

  const [stateValue, setStateValue] = useState(
    isNaN(toStandardDecimal(value))
      ? value
      : formatValue(toStandardDecimal(value))
  );

  const buildCustomEvent = (val) => {
    return {
      target: {
        ...(name && { name }),
        ...(id && { id }),
        value: { formattedValue: val },
      },
    };
  };

  const handleOnChange = (ev) => {
    if (onChange) onChange(buildCustomEvent(ev.target.value));
  };

  const hasBlurred = React.useRef(false);

  const handleOnBlur = (ev) => {
    const { value: updatedValue } = ev.target;
    let event;
    hasBlurred.current = true;

    if (updatedValue) {
      const standardVisible = toStandardDecimal(updatedValue);
      const formattedValue = isNaN(standardVisible)
        ? updatedValue
        : formatValue(standardVisible);

      event = buildCustomEvent(formattedValue);
    } else {
      event = buildCustomEvent(emptyValue);
    }

    if (onBlur) onBlur(event);
    if (onChange) onChange(event);
  };

  useEffect(() => {
    const checkValue = isControlled ? value : defaultValue;

    if (isControlled && value !== stateValue) {
      setStateValue(checkValue);
    }

    if (!checkValue && hasBlurred.current) {
      hasBlurred.current = false;
      setStateValue(emptyValue);
    }
  }, [defaultValue, emptyValue, isControlled, stateValue, value]);

  return (
    <>
      <Textbox
        align={align}
        required={required}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        value={stateValue}
        data-component="decimal"
        {...rest}
      />
      <input
        name={name}
        value={toStandardDecimal(stateValue)}
        type="hidden"
        data-component="hidden-input"
      />
    </>
  );
};

Decimal.propTypes = {
  /** Styled-system margin props */
  ...marginPropTypes,
  /**
   * The default value alignment on the input
   */
  align: PropTypes.oneOf(["right", "left"]),
  /**
   * The decimal precision of the value in the input
   */
  // eslint-disable-next-line consistent-return
  precision: (props) => {
    if (
      !Number.isInteger(props.precision) ||
      props.precision < 0 ||
      props.precision > Decimal.maxPrecision
    ) {
      return new Error(
        "Precision prop must be a number greater than 0 or equal to or less than 15."
      );
    }
  },
  /**
   * The width of the input as a percentage
   */
  inputWidth: PropTypes.number,
  /**
   * If true, the component will be read-only
   */
  readOnly: PropTypes.bool,
  /**
   * The default value of the input if it's meant to be used as an uncontrolled component
   */
  defaultValue: PropTypes.string,
  /**
   * The value of the input if it's used as a controlled component
   */
  value: PropTypes.string,
  /**
   * Handler for change event if input is meant to be used as a controlled component
   */
  onChange: PropTypes.func,
  /**
   * Handler for blur event
   */
  onBlur: PropTypes.func,
  /**
   * Handler for key press event
   */
  onKeyPress: PropTypes.func,
  /**
   * The input name
   */
  name: PropTypes.string,
  /**
   * The input id
   */
  id: PropTypes.string,
  /**
   * Allow an empty value instead of defaulting to 0.00
   */
  allowEmptyValue: PropTypes.bool,
  /** Flag to configure component as mandatory */
  required: PropTypes.bool,
  /**
   * Override the locale string, default from I18nProvider
   */
  locale: PropTypes.string,
};

export default Decimal;

import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import invariant from "invariant";

import {
  filterStyledSystemMarginProps,
  filterOutStyledSystemSpacingProps,
} from "../../../style/utils";
import SelectTextbox, {
  formInputPropTypes,
} from "../select-textbox/select-textbox.component";
import guid from "../../../__internal__/utils/helpers/guid";
import withFilter from "../utils/with-filter.hoc";
import StyledSelect from "../select.style";
import SelectList from "../select-list/select-list.component";
import isExpectedOption from "../utils/is-expected-option";

const FilterableSelectList = withFilter(SelectList);

const FilterableSelect = React.forwardRef(
  (
    {
      value,
      defaultValue,
      id,
      name,
      children,
      onOpen,
      onChange,
      onFilterChange,
      onClick,
      onKeyDown,
      onFocus,
      onBlur,
      openOnFocus,
      noResultsMessage,
      disablePortal,
      listActionButton,
      onListAction,
      isLoading,
      disabled,
      readOnly,
      onListScrollBottom,
      tableHeader,
      multiColumn,
      "data-component": dataComponent,
      "data-element": dataElement,
      "data-role": dataRole,
      tooltipPosition,
      listPlacement = "bottom-start",
      flipEnabled = true,
      ...textboxProps
    },
    inputRef
  ) => {
    const [activeDescendantId, setActiveDescendantId] = useState();
    const selectListId = useRef(guid());
    const labelId = useRef(guid());
    const containerRef = useRef();
    const listboxRef = useRef();
    const isControlled = useRef(value !== undefined);
    const isMouseDownReported = useRef(false);
    const isInputFocused = useRef(false);
    const isMouseDownOnInput = useRef(false);
    const [textboxRef, setTextboxRef] = useState();
    const [isOpen, setOpen] = useState(false);
    const [textValue, setTextValue] = useState("");
    const [selectedValue, setSelectedValue] = useState(
      value || defaultValue || ""
    );
    const [highlightedValue, setHighlightedValue] = useState("");
    const [filterText, setFilterText] = useState("");

    const createCustomEvent = useCallback(
      (newValue) => {
        const customEvent = {
          target: {
            ...(name && { name }),
            ...(id && { id }),
            value: newValue,
          },
        };

        return customEvent;
      },
      [name, id]
    );

    const triggerChange = useCallback(
      (newValue) => {
        if (onChange) {
          onChange(createCustomEvent(newValue));
        }
      },
      [onChange, createCustomEvent]
    );

    const updateValues = useCallback(
      (newFilterText, isDeleteEvent) => {
        setSelectedValue((previousValue) => {
          const match = findElementWithMatchingText(newFilterText, children);
          const isFilterCleared = isDeleteEvent && newFilterText === "";

          if (!match || isFilterCleared) {
            setTextValue(newFilterText);
            triggerChange("");

            return "";
          }

          if (isDeleteEvent) {
            setTextValue(newFilterText);

            return match.props.value;
          }

          triggerChange(match.props.value);

          if (
            match.props.text
              .toLowerCase()
              .startsWith(newFilterText.toLowerCase())
          ) {
            setTextValue(match.props.text);
          } else {
            setTextValue(newFilterText);
          }

          if (isControlled.current) {
            return previousValue;
          }

          setHighlightedValue(match.props.value);

          return match.props.value;
        });
      },
      [children, triggerChange]
    );

    const setMatchingText = useCallback(
      (newValue, isClosing) => {
        const matchingOption = React.Children.toArray(children).find((child) =>
          isExpectedOption(child, newValue)
        );

        if (!matchingOption || matchingOption.props.text === undefined) {
          setTextValue(filterText || "");
        } else if (
          isClosing ||
          matchingOption.props.text
            .toLowerCase()
            .startsWith(filterText.toLowerCase())
        ) {
          setTextValue(matchingOption.props.text);
        }
      },
      [children, filterText]
    );

    const handleTextboxChange = useCallback(
      (event) => {
        const newValue = event.target.value;
        const isDeleteEvent =
          event.nativeEvent.inputType === "deleteContentBackward" ||
          event.nativeEvent.inputType === "deleteContentForward" ||
          event.nativeEvent.inputType === "delete";

        updateValues(newValue, isDeleteEvent);
        setFilterText(newValue);
        setOpen(true);
      },
      [updateValues]
    );

    const fillLastFilterCharacter = useCallback(
      (key) => {
        setFilterText((previousFilterText) => {
          if (
            previousFilterText.length === textValue.length - 1 &&
            key === textValue.slice(-1)
          ) {
            return textValue;
          }

          return previousFilterText;
        });
      },
      [textValue]
    );

    const handleTextboxKeydown = useCallback(
      (event) => {
        const { key } = event;

        if (onKeyDown) {
          onKeyDown(event);
        }

        if (readOnly) {
          return;
        }

        if (!event.defaultPrevented && isNavigationKey(key)) {
          event.preventDefault();
          setOpen(true);
        }

        fillLastFilterCharacter(key);
      },
      [fillLastFilterCharacter, onKeyDown, readOnly]
    );

    const handleGlobalClick = useCallback(
      (event) => {
        const notInContainer =
          containerRef.current && !containerRef.current.contains(event.target);
        const notInList =
          listboxRef.current && !listboxRef.current.contains(event.target);

        isMouseDownReported.current = false;

        if (notInContainer && notInList) {
          setMatchingText(selectedValue, true);
          setOpen(false);
        }
      },
      [setMatchingText, selectedValue]
    );

    useEffect(() => {
      const modeSwitchedMessage =
        "Input elements should not switch from uncontrolled to controlled (or vice versa). " +
        "Decide between using a controlled or uncontrolled input element for the lifetime of the component";
      const onChangeMissingMessage =
        "onChange prop required when using a controlled input element";

      invariant(
        isControlled.current === (value !== undefined),
        modeSwitchedMessage
      );
      invariant(
        !isControlled.current || (isControlled.current && onChange),
        onChangeMissingMessage
      );
      if (isControlled.current) {
        setSelectedValue((prevValue) => {
          if (value && prevValue !== value) {
            setMatchingText(value);
          }

          return value;
        });
        setHighlightedValue(value);
      } else {
        if (textValue !== selectedValue) {
          setMatchingText(selectedValue);
        }
        if (highlightedValue !== selectedValue) {
          setHighlightedValue(selectedValue);
        }
      }
      // prevent value update on filter change
      // selectedValue and highlightedValue omitted from deps, only want uncontrolled change if onChange/children update
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, onChange, children]);

    useEffect(() => {
      if (!isOpen) {
        setFilterText("");
      } else if (onOpen) {
        onOpen();
      }
    }, [isOpen, onOpen]);

    useEffect(() => {
      const hasListActionButton = listActionButton !== undefined;
      const onListActionMissingMessage =
        "onListAction prop required when using listActionButton prop";

      invariant(
        !hasListActionButton || (hasListActionButton && onListAction),
        onListActionMissingMessage
      );
    }, [listActionButton, onListAction]);

    useEffect(() => {
      if (isControlled.current) {
        setMatchingText(value);
      }
      // update text value only when children are changing
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, children]);

    useEffect(() => {
      if (onFilterChange) {
        onFilterChange(filterText);
      }
    }, [filterText, onFilterChange]);

    useEffect(() => {
      const clickEvent = "click";

      window.addEventListener(clickEvent, handleGlobalClick);

      return function cleanup() {
        window.removeEventListener(clickEvent, handleGlobalClick);
      };
    }, [handleGlobalClick]);

    useEffect(() => {
      const textStartsWithFilter = textValue
        .toLowerCase()
        .startsWith(filterText.toLowerCase());
      const isTextboxActive = !disabled && !readOnly;

      if (
        isTextboxActive &&
        textboxRef &&
        filterText.length &&
        textValue.length > filterText.length &&
        textStartsWithFilter
      ) {
        textboxRef.selectionStart = filterText.length;
      }
    }, [textValue, filterText, textboxRef, disabled, readOnly]);

    const onSelectOption = useCallback(
      (optionData) => {
        const {
          id: selectedOptionId,
          text,
          value: newValue,
          selectionType,
        } = optionData;

        if (selectionType === "tab") {
          setOpen(false);
          textboxRef.focus();

          return;
        }

        if (!isControlled.current) {
          setSelectedValue(newValue);
          setHighlightedValue(newValue);
        }

        setTextValue(text);
        triggerChange(newValue);
        setActiveDescendantId(selectedOptionId);

        if (selectionType !== "navigationKey") {
          setOpen(false);
          textboxRef.focus();
          textboxRef.select();
        }
      },
      [textboxRef, triggerChange]
    );

    const onSelectListClose = useCallback(() => {
      setOpen(false);
      setMatchingText(selectedValue, true);
    }, [selectedValue, setMatchingText]);

    function handleTextboxClick(event) {
      isMouseDownReported.current = false;

      if (onClick) {
        onClick(event);
      }
    }

    function handleDropdownIconClick(event) {
      isMouseDownReported.current = false;

      if (onClick) {
        onClick(event);
      }

      setOpen((isAlreadyOpen) => {
        return !isAlreadyOpen;
      });
    }

    function handleTextboxFocus(event) {
      const triggerFocus = () => onFocus(event);

      if (openOnFocus) {
        setOpen((isAlreadyOpen) => {
          if (isAlreadyOpen) {
            return true;
          }

          if (onOpen) {
            onOpen();
          }
          if (onFocus && !isInputFocused.current) {
            triggerFocus();
            isInputFocused.current = true;
          }

          if (isMouseDownReported.current && !isMouseDownOnInput.current) {
            return false;
          }

          return true;
        });
      } else if (onFocus && !isInputFocused.current) {
        triggerFocus();
        isInputFocused.current = true;
      }
    }

    function handleTextboxBlur(event) {
      isMouseDownOnInput.current = false;

      if (isMouseDownReported.current) {
        return;
      }

      isInputFocused.current = false;

      if (onBlur) {
        onBlur(event);
      }
    }

    function handleTextboxMouseDown(event) {
      isMouseDownReported.current = true;

      if (
        event.target.attributes["data-element"] &&
        event.target.attributes["data-element"].value === "input"
      ) {
        isMouseDownOnInput.current = true;
      }
    }

    function handleListMouseDown() {
      isMouseDownReported.current = true;
    }

    function findElementWithMatchingText(textToMatch, list) {
      return list.find((child) => {
        const { text } = child.props;

        return (
          text && text.toLowerCase().indexOf(textToMatch.toLowerCase()) !== -1
        );
      });
    }

    function handleOnListAction() {
      setOpen(false);
      onListAction();
    }

    function assignInput(input) {
      setTextboxRef(input.current);

      if (inputRef) {
        inputRef.current = input.current;
      }
    }

    function getTextboxProps() {
      return {
        id,
        name,
        disabled,
        readOnly,
        inputRef: assignInput,
        selectedValue,
        formattedValue: textValue,
        onClick: handleTextboxClick,
        iconOnClick: handleDropdownIconClick,
        iconOnMouseDown: handleTextboxMouseDown,
        onFocus: handleTextboxFocus,
        onBlur: handleTextboxBlur,
        onKeyDown: handleTextboxKeydown,
        onChange: handleTextboxChange,
        onMouseDown: handleTextboxMouseDown,
        tooltipPosition,
        ...filterOutStyledSystemSpacingProps(textboxProps),
      };
    }

    function isNavigationKey(key) {
      return (
        key === "ArrowDown" ||
        key === "ArrowUp" ||
        key === "Home" ||
        key === "End"
      );
    }
    const selectList = (
      <FilterableSelectList
        ref={listboxRef}
        id={selectListId.current}
        labelId={labelId.current}
        anchorElement={textboxRef && textboxRef.parentElement}
        onSelect={onSelectOption}
        onSelectListClose={onSelectListClose}
        onMouseDown={handleListMouseDown}
        filterText={filterText}
        highlightedValue={highlightedValue}
        noResultsMessage={noResultsMessage}
        disablePortal={disablePortal}
        listActionButton={listActionButton}
        onListAction={handleOnListAction}
        isLoading={isLoading}
        readOnly={readOnly}
        onListScrollBottom={onListScrollBottom}
        tableHeader={tableHeader}
        multiColumn={multiColumn}
        loaderDataRole="filterable-select-list-loader"
        listPlacement={listPlacement}
        flipEnabled={flipEnabled}
      >
        {children}
      </FilterableSelectList>
    );

    return (
      <StyledSelect
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        ref={containerRef}
        hasTextCursor
        readOnly={readOnly}
        disabled={disabled}
        data-component={dataComponent}
        data-role={dataRole}
        data-element={dataElement}
        isOpen={isOpen}
        {...filterStyledSystemMarginProps(textboxProps)}
      >
        <div ref={containerRef}>
          <SelectTextbox
            activeDescendantId={activeDescendantId}
            aria-controls={isOpen ? selectListId.current : undefined}
            isOpen={isOpen}
            hasTextCursor
            labelId={labelId.current}
            textboxRef={textboxRef}
            {...getTextboxProps()}
          />
        </div>
        {isOpen && selectList}
      </StyledSelect>
    );
  }
);

FilterableSelect.propTypes = {
  ...formInputPropTypes,
  /** Identifier used for testing purposes, applied to the root element of the component. */
  "data-component": PropTypes.string,
  /** Identifier used for testing purposes, applied to the root element of the component. */
  "data-element": PropTypes.string,
  /** Identifier used for testing purposes, applied to the root element of the component. */
  "data-role": PropTypes.string,
  /** Boolean to toggle where SelectList is rendered in relation to the Select Input */
  disablePortal: PropTypes.bool,
  /** The selected value(s), when the component is operating in controlled mode */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** The default selected value(s), when the component is operating in uncontrolled mode */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Child components (such as Option or OptionRow) for the SelectList */
  children: PropTypes.node.isRequired,
  /** A custom callback for when the input text changes */
  onFilterChange: PropTypes.func,
  /** A custom callback for when the dropdown menu opens */
  onOpen: PropTypes.func,
  /** If true the Component opens on focus */
  openOnFocus: PropTypes.bool,
  /** SelectList table header, should consist of multiple th elements.
  Works only in multiColumn mode */
  tableHeader: PropTypes.node,
  /** When true component will work in multi column mode.
  Children should consist of OptionRow components in this mode */
  multiColumn: PropTypes.bool,
  /** A custom message to be displayed when any option does not match the filter text */
  noResultsMessage: PropTypes.string,
  /** True for default text button or a Button Component to be rendered */
  listActionButton: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  /** A callback for when the Action Button is triggered */
  onListAction: PropTypes.func,
  /** If true the loader animation is displayed in the option list */
  isLoading: PropTypes.bool,
  /** A callback that is triggered when a user scrolls to the bottom of the list */
  onListScrollBottom: PropTypes.func,
  /** Overrides the default tooltip position */
  tooltipPosition: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  /** Placement of the select list in relation to the input element */
  listPlacement: PropTypes.oneOf([
    "auto",
    "auto-start",
    "auto-end",
    "top",
    "top-start",
    "top-end",
    "bottom",
    "bottom-start",
    "bottom-end",
    "right",
    "right-start",
    "right-end",
    "left",
    "left-start",
    "left-end",
  ]),
  /** Use the opposite list placement if the set placement does not fit */
  flipEnabled: PropTypes.bool,
};

FilterableSelect.defaultProps = {
  "data-component": "filterable-select",
};

export default FilterableSelect;

import { margin } from "styled-system";
import styled, { css } from "styled-components";

import StyledInputIconToggle from "../../__internal__/input-icon-toggle/input-icon-toggle.style";
import StyledInputPresentation from "../../__internal__/input/input-presentation.style";
import StyledInput from "../../__internal__/input/input.style";
import StyledIcon from "../icon/icon.style";
import StyledButton from "../button/button.style";
import { baseTheme } from "../../style/themes";
import StyledFormField from "../../__internal__/form-field/form-field.style";

const StyledSearch = styled.div`
  ${({
    isFocused,
    searchWidth,
    searchIsActive,
    searchHasValue,
    showSearchButton,
    theme,
    variant,
  }) => {
    const darkVariant = variant === "dark";
    const variantColor = darkVariant
      ? `${theme.search.darkVariantBorder}`
      : `${theme.search.passive}`;

    const iconColor =
      darkVariant &&
      ((searchHasValue && isFocused) ||
        (!searchHasValue && isFocused) ||
        (!isFocused && searchHasValue && showSearchButton));
    return css`
      ${margin}
      width: ${searchWidth ? `${searchWidth}` : "100%"};
      padding-bottom: 2px;
      background-color: transparent;
      border-bottom: 2px solid ${variantColor};
      display: inline-flex;
      font-size: 14px;
      font-weight: 700;
      :hover {
        border-bottom-color: var(--colorsActionMinor500);
        cursor: pointer;
      }
      ${(isFocused || searchHasValue) &&
      css`
        border-color: transparent;
        transition: background 0.2s ease;
        :hover {
          border-color: transparent;
        }
      `}
      ${isFocused &&
      !searchIsActive &&
      css`
        border-color: transparent;
      `}
      ${!isFocused &&
      searchHasValue &&
      !showSearchButton &&
      css`
        border-bottom: 2px solid ${variantColor};
        :hover {
          border-bottom-color: var(--colorsActionMinor500);
          cursor: pointer;
        }
      `}

      ${StyledInput} {
        ${darkVariant &&
        !isFocused &&
        css`
          ::-moz-placeholder {
            color: ${theme.search.darkVariantPlaceholder};
            opacity: 1;
          }
          ::placeholder {
            color: ${theme.search.darkVariantPlaceholder};
            color: var(
              --colorsUtilityYin030
            ); // TODO: WTF why this is not working
            color: pink;
          }
        `}

        ${darkVariant &&
        css`
          ${!isFocused &&
          searchHasValue &&
          !showSearchButton &&
          css`
            color: ${theme.search.darkVariantText};
            color: red;
            color: var(--colorsUtilityYang100);
          `}
          ${!isFocused &&
          !searchHasValue &&
          css`
            color: ${theme.search.darkVariantPlaceholder};
            color: pink;
          `}
        `}
      }

      ${StyledInputPresentation} {
        background-color: ${searchHasValue || isFocused
          ? "var(--colorsUtilityYang100)"
          : "transparent"};
        flex: 1;
        font-size: 14px;
        font-weight: 700;
        padding-bottom: 2px;
        padding-top: 1px;
        cursor: pointer;
        ${!isFocused &&
        !searchHasValue &&
        css`
          border: 1px solid transparent;
        `}
        ${!isFocused &&
        searchHasValue &&
        !showSearchButton &&
        css`
          border: 1px solid transparent;
          background-color: ${darkVariant
            ? "transparent"
            : "var(--colorsUtilityYang100)"};
        `}
      }

      ${StyledFormField} {
        flex: 1;
        z-index: ${theme.zIndex.smallOverlay};
      }
      ${StyledIcon} {
        color: ${iconColor
          ? "var(--colorsUtilityMajor400)"
          : "var(--colorsUtilityMajor200)"};
        ${!darkVariant &&
        css`
          color: "var(--colorsUtilityMajor400)";
        `}

        width: 20px;
        height: 20px;
        cursor: pointer;
        :hover {
          color: ${iconColor
            ? "var(--colorsUtilityMajor500)"
            : "var(--colorsUtilityMajor100)"};
          ${!darkVariant &&
          css`
            color: var(--colorsUtilityMajor500);
          `}
        }
      }

      ${StyledInputIconToggle} {
        ${searchHasValue &&
        css`
          margin-bottom: -1px;
        `}
      }
    `;
  }}
`;

StyledSearch.defaultProps = { theme: baseTheme };
export default StyledSearch;

export const StyledSearchButton = styled.div`
  display: inline-flex;
  border-bottom: none;
  & ${StyledButton} {
    background-color: var(--colorsActionMajor500);
    border-color: var(--colorsActionMajorTransparent);
    :hover {
      background: var(--colorsActionMajor600);
      border-color: var(--colorsActionMajorTransparent);
    }

    width: 40px;
    margin: 0px 0px;
    padding-bottom: 3px;
    :focus {
      z-index: ${({ theme }) => theme.zIndex.smallOverlay};
    }
  }
`;

export const StyledButtonIcon = styled.div`
  &&& ${StyledIcon} {
    color: white;
    margin-right: 0px;
  }
`;
StyledSearchButton.defaultProps = { theme: baseTheme };

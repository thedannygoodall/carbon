import styled, { css } from "styled-components";
import StyledButton from "../button/button.style";
import StyledIcon from "../icon/icon.style";

const horizontalPaddingSizes = {
  small: 5,
  medium: 10,
  large: 14,
};

const StyledSplitButtonToggle = styled(StyledButton)`
  ${({ buttonType, disabled, displayed, size }) => css`
    ${!disabled && displayed
      ? css`
          background-color: var(--colorsActionMajor500);
          border-color: var(--colorsActionMajor500);

          &,
          ${StyledIcon} {
            color: var(--colorsActionMajorYang100);
          }

          &:focus {
            border-left-color: var(--colorsSemanticFocus500);
          }
        `
      : ""}
    ${!disabled &&
    buttonType === "primary" &&
    `position: relative;
      &::before {
        content: '';
        width: 2px;
        height: 100%;
        background: var(--colorsActionMajorYang100);
        position: absolute;
        left: -2px;
        z-index: 2;
      }  
    `}
    ${buttonType === "secondary" && "border-left-width: 0;"}
    padding: 0 ${horizontalPaddingSizes[size]}px;

    ${StyledButton} + & {
      margin-left: 0;

      ${buttonType === "secondary" &&
      css`
        &:focus {
          margin-left: -3px;
        }
      `}
    }

    ${StyledButton} + & ${StyledIcon} {
      margin-left: 0;
    }
  `}
`;

export default StyledSplitButtonToggle;

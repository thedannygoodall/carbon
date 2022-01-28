import styled, { css } from "styled-components";
import { layout, flexbox } from "styled-system";
import menuConfigVariants from "./menu.config";

import {
  StyledVerticalWrapper,
  StyledDivider,
} from "../vertical-divider/vertical-divider.style";

const StyledMenuWrapper = styled.ul`
  line-height: 40px;
  list-style: none;
  margin: 0;
  padding: 0;
  outline: none;

  ${layout}
  ${flexbox}

  ${StyledVerticalWrapper} {
    ${({ menuType }) => css`
      display: inline-block;
      vertical-align: bottom;
      background-color: ${menuConfigVariants[menuType].background};

      ${menuType === "dark" &&
      css`
        color: ${menuConfigVariants[menuType].color};
      `}
    `}

    ${StyledDivider} {
      position: relative;
      top: -1px;
    }
  }

  ${({ inFullscreenView }) =>
    inFullscreenView &&
    css`
      padding-bottom: 24px;
    `}
`;

const StyledMenuItem = styled.li`
  ${layout}
  ${flexbox}
  
  ${({ inSubmenu }) => css`
    ${inSubmenu &&
    css`
      display: list-item;
    `}
  `}

    ${({ inFullscreenView }) =>
    inFullscreenView &&
    css`
      padding-top: 16px;
      padding-bottom: 16px;
    `}
`;

export { StyledMenuWrapper, StyledMenuItem };

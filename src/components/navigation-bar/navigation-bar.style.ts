import styled, { css } from "styled-components";
import { padding, flexbox, PaddingProps, FlexboxProps } from "styled-system";
import { baseTheme } from "../../style/themes";
import { StickyPosition, NavigationType } from "./navigation-bar.component";

type StyledNavigationBarProps = PaddingProps &
  FlexboxProps & {
    /** Color scheme of navigation component */
    navigationType?: NavigationType;
    /** Defines the position of sticky navigation bar */
    stickyPosition?: StickyPosition;
    /** Defines the offset of sticky navigation bar */
    stickyOffset?: string;
  };

const StyledNavigationBar = styled.nav<StyledNavigationBarProps>`
  display: flex;
  align-items: center;
  padding: 0 40px;
  line-height: 40px;

  & > * {
    box-sizing: border-box;
    height: 40px;
    vertical-align: middle;
  }

  @media only screen and (max-width: 1259px) {
    padding: 0 32px;
  }

  @media only screen and (max-width: 959px) {
    padding: 0 24px;
  }

  @media only screen and (max-width: 599px) {
    padding: 0 16px;
  }

  && {
    ${padding}
  }

  ${flexbox}

  .carbon-logo {
    margin-right: 10px;
  }

  ${({ stickyPosition, stickyOffset }) =>
    stickyPosition &&
    css`
      position: sticky;
      ${stickyPosition}: ${stickyOffset}
    `};

  ${({ navigationType, theme }) => css`
    min-height: 40px;
    z-index: ${theme.zIndex.nav};

    ${navigationType === "light" &&
    css`
      background-color: var(--colorsComponentsMenuSpringStandard500);
      border-bottom: var(--borderWidth100) solid
        var(--colorsComponentsMenuSpringChildAlt500);
    `}

    ${navigationType === "dark" &&
    css`
      background-color: var(--colorsComponentsMenuAutumnStandard500);
      color: var(--colorsComponentsMenuYang100);
    `}

    ${navigationType === "black" &&
    css`
      background-color: var(--colorsComponentsMenuWinterStandard500);
      color: var(--colorsComponentsMenuYang100);
    `}

    ${navigationType === "white" &&
    css`
      background-color: var(--colorsComponentsMenuSummerStandard500);
      border-bottom: var(--borderWidth100) solid
        var(--colorsComponentsMenuSummerChildAlt500);
    `}
  `}
`;

StyledNavigationBar.defaultProps = {
  theme: baseTheme,
};

export default StyledNavigationBar;

import styled, { css } from "styled-components";
import { space } from "styled-system";
import StyledButton from "../button/button.style";
import { StyledLink } from "../link/link.style";
import { baseTheme } from "../../style/themes";

export const StyledDl = styled.dl`
  ${space}

  ${({ asSingleColumn }) => css`
    ${!asSingleColumn &&
    css`
      display: grid;
      grid-template-rows: auto;
      grid-template-columns: ${({ w }) => `${w}% auto;`};
    `}
    ${asSingleColumn &&
    css`
      line-height: 21px;
    `}
  `}

  width: 100%;
  height: auto;
  background-color: transparent;
`;

StyledDl.defaultProps = {
  theme: baseTheme,
};

export const StyledDtDiv = styled.div`
  ${space}
  ${({ dtTextAlign }) => css`
    text-align: ${dtTextAlign};
  `}
`;

StyledDtDiv.defaultProps = {
  theme: baseTheme,
};

export const StyledDdDiv = styled.div`
  ${({ ddTextAlign }) => css`
    text-align: ${ddTextAlign};
  `}
`;

export const StyledDt = styled.dt`
  ${space}
  font-size: 14px;
  font-weight: 700;
  color: var(--colorsUtilityYin090);
`;

StyledDt.defaultProps = {
  theme: baseTheme,
};

export const StyledDd = styled.dd`
  font-size: 14px;
  font-weight: 700;
  color: var(--colorsUtilityYin065);
  margin-left: 0px;

  ${StyledButton} {
    padding: 0;
    border: none;
  }

  ${StyledLink} {
    a,
    button {
      font-weight: 700px;
      text-decoration: none;
    }
  }
  ${space}
`;

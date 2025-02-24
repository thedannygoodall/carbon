import styled, { css } from "styled-components";

import MessageStyle from "../message/message.style";
import MessageContentStyle from "../message/message-content/message-content.style";
import TypeIcon from "../message/type-icon/type-icon.style";
import StyledIconButton from "../icon-button/icon-button.style";
import Portal from "../portal/portal";
import baseTheme from "../../style/themes/base";

const StyledPortal = styled(Portal)`
  ${({ theme }) => css`
    position: fixed;
    top: 0;

    z-index: ${theme.zIndex.notification};

    ${({ isCenter }) =>
      isCenter &&
      css`
        margin-left: 50%;
        transform: translateX(-50%);
      `}
  `}
`;

StyledPortal.defaultProps = {
  theme: baseTheme,
};

const animationName = ".toast";
const ToastStyle = styled(MessageStyle)`
  ${({ maxWidth, isCenter }) => css`
    box-shadow: 0 10px 30px 0 rgba(0, 20, 29, 0.1),
      0 30px 60px 0 rgba(0, 20, 29, 0.1);
    line-height: 22px;
    margin-top: 30px;
    max-width: ${!maxWidth ? "300px" : maxWidth};
    position: relative;
    margin-right: ${isCenter ? "auto" : "30px"};
  `}
 

  &${animationName}-appear,
  &${animationName}-enter {
    opacity: 0;
    transform: scale(0.5)};
  }

  &${animationName}-appear.toast-appear-active,
  &${animationName}-enter.toast-enter-active {
    opacity: 1;
    transform: ${({ isCenter }) =>
      isCenter ? " scale(1) translateY(0)" : "scale(1)"};
    transition: all 300ms cubic-bezier(0.250, 0.250, 0.000, 1.500);
  }

  &${animationName}-exit.toast-exit-active {
    opacity: 0;
    margin-top: -40px;
    transition: all 150ms ease-out;
  }

  ${StyledIconButton} {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const ToastContentStyle = styled(MessageContentStyle)`
  padding: 8px 16px 8px 16px;

  ${({ isDismiss }) =>
    isDismiss &&
    css`
      padding-right: 48px;
    `}
`;

const ToastWrapper = styled.div`
  ${({ isCenter }) =>
    isCenter &&
    css`
      position: relative;
      width: auto;
      height: auto;
      justify-content: center;
      display: flex;
    `}
`;
export { ToastStyle, TypeIcon, ToastContentStyle, ToastWrapper, StyledPortal };

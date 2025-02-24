import React, { useRef, useEffect, useLayoutEffect, useCallback } from "react";
import PropTypes from "prop-types";

import createGuid from "../../__internal__/utils/helpers/guid/guid.js";
import Modal from "../modal";
import Heading from "../heading";

import useResizeObserver from "../../hooks/__internal__/useResizeObserver";
import {
  DialogStyle,
  DialogTitleStyle,
  DialogContentStyle,
  DialogInnerContentStyle,
} from "./dialog.style";
import FocusTrap from "../../__internal__/focus-trap";
import IconButton from "../icon-button";
import Icon from "../icon";
import Form from "../form";
import { TOP_MARGIN } from "./dialog.config";
import useLocale from "../../hooks/__internal__/useLocale";

const Dialog = ({
  className,
  children,
  open,
  height,
  size,
  title,
  disableEscKey,
  subtitle,
  disableAutoFocus,
  focusFirstElement,
  onCancel,
  showCloseIcon,
  bespokeFocusTrap,
  disableClose,
  help,
  role = "dialog",
  contentPadding = {},
  ...rest
}) => {
  const locale = useLocale();

  const dialogRef = useRef();
  const innerContentRef = useRef();
  const titleRef = useRef();
  const listenersAdded = useRef(false);
  const { current: titleId } = useRef(createGuid());
  const { current: subtitleId } = useRef(createGuid());

  const centerDialog = useCallback(() => {
    const {
      width: dialogWidth,
      height: dialogHeight,
    } = dialogRef.current.getBoundingClientRect();

    let midPointY = window.innerHeight / 2;
    let midPointX = window.innerWidth / 2;

    midPointY -= dialogHeight / 2;
    midPointX -= dialogWidth / 2;

    if (midPointY < TOP_MARGIN) {
      midPointY = TOP_MARGIN;
    }

    if (midPointX < TOP_MARGIN) {
      midPointX = TOP_MARGIN;
    }

    dialogRef.current.style.top = `${midPointY}px`;
    dialogRef.current.style.left = `${midPointX}px`;
  }, []);

  useResizeObserver(innerContentRef, centerDialog, !open);

  const addListeners = useCallback(() => {
    /* istanbul ignore else */
    if (!listenersAdded.current) {
      window.addEventListener("resize", centerDialog);
      listenersAdded.current = true;
    }
  }, [centerDialog]);

  const removeListeners = useCallback(() => {
    if (listenersAdded.current) {
      window.removeEventListener("resize", centerDialog);
      listenersAdded.current = false;
    }
  }, [centerDialog]);

  useEffect(() => {
    if (open) {
      addListeners();
    }

    if (!open) {
      removeListeners();
    }

    return () => {
      removeListeners();
    };
  }, [open, addListeners, removeListeners]);

  useLayoutEffect(() => {
    if (open) {
      centerDialog();
    }
  }, [centerDialog, open, height]);

  const closeIcon = () => {
    if (!showCloseIcon || !onCancel) return null;

    return (
      <IconButton
        data-element="close"
        aria-label={locale.dialog.ariaLabels.close()}
        onAction={onCancel}
        disabled={disableClose}
      >
        <Icon type="close" />
      </IconButton>
    );
  };

  const dialogTitle = () => {
    if (!title) return null;

    return (
      <DialogTitleStyle
        showCloseIcon={showCloseIcon}
        hasSubtitle={!!subtitle}
        ref={titleRef}
      >
        {typeof title === "string" ? (
          <Heading
            data-element="dialog-title"
            title={title}
            titleId={titleId}
            subheader={subtitle}
            subtitleId={subtitleId}
            divider={false}
            help={help}
          />
        ) : (
          title
        )}
      </DialogTitleStyle>
    );
  };

  let dialogHeight = height;

  if (height && height.match(/px$/)) {
    dialogHeight = height.replace("px", "");
  }

  const dialogProps = {
    size,
    dialogHeight,
    "aria-labelledby":
      title && typeof title === "string" ? titleId : rest["aria-labelledby"],
    "aria-describedby": subtitle ? subtitleId : rest["aria-describedby"],
    "aria-label": rest["aria-label"],
  };

  const componentTags = {
    "data-component": rest["data-component"] || "dialog",
    "data-element": rest["data-element"],
    "data-role": rest["data-role"],
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      disableEscKey={disableEscKey}
      disableClose={disableClose}
      className={className ? `${className} carbon-dialog` : "carbon-dialog"}
      {...componentTags}
    >
      <FocusTrap
        autoFocus={!disableAutoFocus}
        focusFirstElement={focusFirstElement}
        bespokeTrap={bespokeFocusTrap}
        wrapperRef={dialogRef}
      >
        <DialogStyle
          aria-modal
          ref={dialogRef}
          topMargin={TOP_MARGIN}
          {...dialogProps}
          data-component="dialog"
          data-element="dialog"
          data-role={rest["data-role"]}
          role={role}
          {...contentPadding}
        >
          {dialogTitle()}
          <DialogContentStyle {...contentPadding}>
            <DialogInnerContentStyle ref={innerContentRef} {...contentPadding}>
              {React.Children.map(children, (child) => {
                if (child?.type === Form) {
                  return React.cloneElement(child, {
                    dialogRef,
                  });
                }
                return child;
              })}
            </DialogInnerContentStyle>
          </DialogContentStyle>
          {closeIcon()}
        </DialogStyle>
      </FocusTrap>
    </Modal>
  );
};

Dialog.propTypes = {
  /** Prop to specify the aria-describedby property of the Dialog component */
  "aria-describedby": PropTypes.string,
  /**
   * Prop to specify the aria-label of the Dialog component.
   * To be used only when the title prop is not defined, and the component is not labelled by any internal element.
   */
  "aria-label": PropTypes.string,
  /**
   * Prop to specify the aria-labelledby property of the Dialog component
   * To be used when the title prop is a custom React Node,
   * or the component is labelled by an internal element other than the title.
   */
  "aria-labelledby": PropTypes.string,
  /** Dialog content */
  children: PropTypes.node,
  /** Custom class name  */
  className: PropTypes.string,
  /** Controls the open state of the component */
  open: PropTypes.bool.isRequired,
  /** A custom close event handler */
  onCancel: PropTypes.func,
  /** Determines if the Esc Key closes the Dialog */
  disableEscKey: PropTypes.bool,
  /** Determines if the Dialog can be closed */
  disableClose: PropTypes.bool,
  /** Allows developers to specify a specific height for the dialog. */
  height: PropTypes.string,
  /** Adds Help tooltip to Header */
  help: PropTypes.string,
  /** Title displayed at top of dialog */
  title: PropTypes.node,
  /** Subtitle displayed at top of dialog */
  subtitle: PropTypes.string,
  /** Size of dialog, default size is 750px */
  size: PropTypes.oneOf([
    "auto",
    "extra-small",
    "small",
    "medium-small",
    "medium",
    "medium-large",
    "large",
    "extra-large",
  ]),
  /** Determines if the close icon is shown */
  showCloseIcon: PropTypes.bool,
  /** Optional reference to an element meant to be focused on open */
  focusFirstElement: PropTypes.shape({ current: PropTypes.any }),
  /** Disables auto focus functionality on child elements */
  disableAutoFocus: PropTypes.bool,
  /**
   * Function to replace focus trap
   * @ignore
   * @private
   */
  bespokeFocusTrap: PropTypes.func,
  /** The ARIA role to be applied to the Dialog container */
  role: PropTypes.string,
  /** Padding to be set on the Dialog content */
  contentPadding: PropTypes.shape({
    p: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8]),
    px: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8]),
    py: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8]),
  }),
};

Dialog.defaultProps = {
  size: "medium",
  showCloseIcon: true,
  disableAutoFocus: false,
};

export default Dialog;

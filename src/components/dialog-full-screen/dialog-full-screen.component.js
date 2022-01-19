import React, { useRef } from "react";
import PropTypes from "prop-types";

import Modal from "../modal";
import Heading from "../heading";
import FullScreenHeading from "../../__internal__/full-screen-heading";
import StyledDialogFullScreen from "./dialog-full-screen.style";
import StyledContent from "./content.style";
import FocusTrap from "../../__internal__/focus-trap";
import IconButton from "../icon-button";
import Icon from "../icon";

const DialogFullScreen = ({
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  disableAutoFocus,
  focusFirstElement,
  open,
  children,
  title,
  subtitle,
  pagesStyling,
  headerChildren,
  showCloseIcon,
  disableContentPadding,
  disableEscKey,
  onCancel,
  contentRef,
  help,
  role = "region",
  ...rest
}) => {
  const dialogRef = useRef();
  const headingRef = useRef();

  const closeIcon = () => {
    if (!showCloseIcon || !onCancel) return null;

    return (
      <IconButton
        data-element="close"
        aria-label="Close button"
        onAction={onCancel}
      >
        <Icon type="close" />
      </IconButton>
    );
  };

  const dialogTitle = () => (
    <FullScreenHeading hasContent={title} ref={headingRef}>
      {typeof title === "string" ? (
        <Heading
          data-element="dialog-title"
          title={title}
          titleId="carbon-dialog-title"
          subheader={subtitle}
          subtitleId="carbon-dialog-subtitle"
          divider={false}
          help={help}
        />
      ) : (
        title
      )}
      {headerChildren}
    </FullScreenHeading>
  );

  const componentTags = {
    "data-component": "dialog-full-screen",
    "data-element": rest["data-element"],
    "data-role": rest["data-role"],
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      disableEscKey={disableEscKey}
      {...componentTags}
    >
      <FocusTrap
        autoFocus={!disableAutoFocus}
        focusFirstElement={focusFirstElement}
        wrapperRef={dialogRef}
      >
        <StyledDialogFullScreen
          aria-modal
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy || "carbon-dialog-title"}
          ref={dialogRef}
          data-element="dialog-full-screen"
          pagesStyling={pagesStyling}
          role={role}
        >
          {dialogTitle()}
          <StyledContent
            hasHeader={title !== undefined}
            data-element="content"
            ref={contentRef}
            disableContentPadding={disableContentPadding}
          >
            {children}
          </StyledContent>
          {closeIcon()}
        </StyledDialogFullScreen>
      </FocusTrap>
    </Modal>
  );
};

DialogFullScreen.defaultProps = {
  showCloseIcon: true,
  disableAutoFocus: false,
};

DialogFullScreen.propTypes = {
  /** Prop to specify the aria-describedby property of the DialogFullscreen component */
  "aria-describedby": PropTypes.string,
  /**
   * Prop to specify the aria-label of the DialogFullscreen component.
   * To be used only when the title prop is not defined, and the component is not labelled by any internal element.
   */
  "aria-label": PropTypes.string,
  /**
   * Prop to specify the aria-labeledby property of the DialogFullscreen component
   * To be used when the title prop is a custom React Node,
   * or the component is labelled by an internal element other than the title.
   */
  "aria-labelledby": PropTypes.string,
  /** Controls the open state of the component */
  open: PropTypes.bool.isRequired,
  /** A custom close event handler */
  onCancel: PropTypes.func,
  /** Optional reference to an element meant to be focused on open */
  focusFirstElement: PropTypes.shape({ current: PropTypes.any }),
  /** Disables auto focus functionality on child elements */
  disableAutoFocus: PropTypes.bool,
  /** Determines if the Esc Key closes the Dialog */
  disableEscKey: PropTypes.bool,
  /** Adds Help tooltip to Header */
  help: PropTypes.string,
  /** remove padding from content */
  disableContentPadding: PropTypes.bool,
  /** Child elements */
  children: PropTypes.node,
  /** Title displayed at top of dialog */
  title: PropTypes.node,
  /** Subtitle displayed at top of dialog */
  subtitle: PropTypes.string,
  /** Determines if the close icon is shown */
  showCloseIcon: PropTypes.bool,
  /** Container for components to be displayed in the header */
  headerChildren: PropTypes.node,
  /** For legacy styling when used with Pages component. Do not use this unless using Pages within a DialogFullScreen */
  pagesStyling: PropTypes.bool,
  /** Reference to the scrollable content element */
  contentRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  /** The ARIA role to be applied to the DialogFulscreen container */
  role: PropTypes.string,
};

export default DialogFullScreen;

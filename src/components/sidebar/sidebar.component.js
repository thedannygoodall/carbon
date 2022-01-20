import React, { useRef } from "react";
import PropTypes from "prop-types";

import Modal from "../modal";
import SidebarStyle from "./sidebar.style";
import IconButton from "../icon-button";
import Icon from "../icon";
import FocusTrap from "../../__internal__/focus-trap";
import SidebarHeader from "./__internal__/sidebar-header";
import Box from "../box";
import { SIDEBAR_SIZES, SIDEBAR_ALIGNMENTS } from "./sidebar.config";
import useLocale from "../../hooks/__internal__/useLocale";

export const SidebarContext = React.createContext({});

const Sidebar = React.forwardRef(
  (
    {
      "aria-describedby": ariaDescribedBy,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      open,
      disableEscKey,
      enableBackgroundUI,
      header,
      position,
      size,
      children,
      onCancel,
      role = "dialog",
      ...rest
    },
    ref
  ) => {
    const locale = useLocale();

    let sidebarRef = useRef();
    if (ref) sidebarRef = ref;
    const closeIcon = () => {
      if (!onCancel) return null;
      return (
        <IconButton
          aria-label={locale.sidebar.ariaLabels.close()}
          onAction={onCancel}
          data-element="close"
        >
          <Icon type="close" />
        </IconButton>
      );
    };

    const componentTags = {
      "data-component": "sidebar",
      "data-element": rest["data-element"],
      "data-role": rest["data-role"],
    };

    const sidebar = (
      <SidebarStyle
        aria-modal={!enableBackgroundUI}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        ref={sidebarRef}
        position={position}
        size={size}
        data-element="sidebar"
        onCancel={onCancel}
        role={role}
      >
        {closeIcon()}
        {header && <SidebarHeader>{header}</SidebarHeader>}
        <Box
          data-element="sidebar-content"
          p={4}
          pt="27px"
          scrollVariant="light"
          overflow="auto"
          flex="1"
        >
          <SidebarContext.Provider value={{ isInSidebar: true }}>
            {children}
          </SidebarContext.Provider>
        </Box>
      </SidebarStyle>
    );

    return (
      <Modal
        open={open}
        onCancel={onCancel}
        disableEscKey={disableEscKey}
        enableBackgroundUI={enableBackgroundUI}
        className="carbon-sidebar"
        {...componentTags}
      >
        {enableBackgroundUI ? (
          sidebar
        ) : (
          <FocusTrap wrapperRef={sidebarRef}>{sidebar}</FocusTrap>
        )}
      </Modal>
    );
  }
);

Sidebar.propTypes = {
  /** Prop to specify the aria-describedby property of the component */
  "aria-describedby": PropTypes.string,
  /** Prop to specify the aria-label of the component */
  "aria-label": PropTypes.string,
  /** Prop to specify the aria-labeledby property of the component */
  "aria-labelledby": PropTypes.string,
  /** Modal content */
  children: PropTypes.node,
  /** A custom close event handler */
  onCancel: PropTypes.func,
  /** Determines if the Esc Key closes the modal */
  disableEscKey: PropTypes.bool,
  /** A boolean to track the open state of the dialog */
  open: PropTypes.bool.isRequired,
  /** Set this prop to false to hide the translucent background when the dialog is open. */
  enableBackgroundUI: PropTypes.bool,
  /** Sets the position of sidebar, either left or right. */
  position: PropTypes.oneOf(SIDEBAR_ALIGNMENTS),
  /** Sets the size of the sidebar when open. */
  size: PropTypes.oneOf(SIDEBAR_SIZES),
  /** Node that will be used as sidebar header. */
  header: PropTypes.node,
  /** The ARIA role to be applied to the container */
  role: PropTypes.string,
};

Sidebar.defaultProps = {
  position: "right",
  size: "medium",
  enableBackgroundUI: false,
};

export default Sidebar;

import tokens from "@sage/design-tokens/js/base/common";
import atOpacity from "../../utils/at-opacity";

export default (palette) => {
  const baseWithOpacity = atOpacity(palette.productGreen);

  return {
    name: "base",

    palette,

    spacing: 8,

    space: [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80],

    colors: {
      // main
      base: palette.productGreen,
      primary: palette.genericGreenShade(15),
      secondary: palette.genericGreenShade(35),
      tertiary: palette.genericGreenShade(55),
      brand: palette.brilliantGreen,
      disabled: palette.genericGreenTint(40),
      whiteMix: palette.genericGreenTint(90),
      withOpacity: baseWithOpacity(0.55),
      loadingBarBackground: palette.genericGreenTint(70),

      // generic
      black: "#000000",
      slate: "#003349",
      white: "#FFFFFF",

      // element
      border: palette.slateTint(40),
      dashedBorder: "#99ADB6",
      dashedButtonText: "rgba(0, 0, 0, 0.9)",
      dashedHoverBackground: "#CCD6DB",
      focusedIcon: palette.slateTint(20),
      focusedLinkBackground: palette.goldTint(50),
      previewBackground: palette.slateTint(75),
      hoveredTabKeyline: palette.genericGreenTint(30),

      // status
      error: palette.errorRed,
      focus: palette.gold,
      info: palette.productBlueShade(3),
      success: palette.brilliantGreenShade(20),
      warning: palette.carrotOrange,
      destructive: {
        hover: palette.errorRedShade(20),
      },
      asterisk: palette.errorRed,
    },

    progressTracker: {
      background: palette.slateTint(90),
      innerBackground: palette.slateTint(40),
      trafficNeutral: palette.productBlueShade(3),
    },

    anchorNavigation: {
      divider: palette.slateTint(80),
      navItemHoverBackground: palette.slateTint(90),
    },

    accordion: {
      border: palette.slateTint(80),
      background: palette.slateTint(90),
    },

    tileSelect: {
      border: palette.slateTint(75),
      disabledBackground: palette.slateTint(90),
      hoverBackground: palette.slateTint(95),
      descriptionColor: palette.blackOpacity(0.55),
      disabledText: palette.blackOpacity(0.3),
    },

    batchSelection: {
      lightTheme: palette.slateTint(70),
    },

    hr: {
      background: palette.slateTint(80),
    },

    editor: {
      border: palette.slateTint(40),
      counter: "rgba(0,0,0,0.55)",
      placeholder: "rgba(0,0,0,0.30)",
      button: {
        hover: palette.slateTint(80),
      },
      toolbar: {
        background: palette.slateTint(95),
      },
    },

    menu: {
      focus: palette.slateTint(95),
      divider: palette.slateTint(90),
      itemColor: palette.blackOpacity(0.9),
      itemColorDisabled: palette.blackOpacity(0.3),

      light: {
        text: "#000000",
        background: palette.slateTint(90),
        selected: palette.slateTint(85),
        divider: palette.slateTint(80),
        alternate: palette.slateTint(90),
        title: palette.slateTint(25),
        submenuBackground: "#FFFFFF",
        searchIcon: palette.slateTint(55),
        searchIconHover: palette.slateTint(75),
      },

      dark: {
        text: "#FFFFFF",
        background: palette.slate,
        divider: palette.slateTint(10),
        submenuBackground: palette.slateShade(50),
        selected: palette.slateTint(10),
        alternate: palette.slate,
        title: palette.slateTint(60),
        searchIcon: palette.slateTint(55),
        searchIconHover: palette.slateTint(75),
      },

      black: {
        text: "#FFFFFF",
        background: palette.black,
        submenuBackground: palette.black,
        selected: palette.blackTint(15),
        divider: palette.blackTint(15),
        alternate: palette.blackTint(10),
        title: palette.slateTint(60),
        searchIcon: palette.slateTint(55),
        searchIconHover: palette.slateTint(75),
      },

      white: {
        text: "#000000",
        background: "#FFFFFF",
        selected: palette.slateTint(95),
        divider: palette.slateTint(70),
        alternate: palette.slateTint(80),
        submenuBackground: palette.slateTint(90),
        title: palette.slateTint(25),
        searchIcon: palette.slateTint(55),
        searchIconHover: palette.slateTint(75),
      },
    },

    card: {
      footerBackground: palette.slateTint(95),
      footerBorder: palette.slateTint(80),
    },

    carousel: {
      activeSelectorBackground: palette.slateTint(40),
      inactiveSelectorBackground: palette.slateTint(80),
    },

    flatTable: {
      light: {
        headerBackground: palette.slateTint(80),
        border: palette.slateTint(70),
      },

      dark: {
        headerBackground: palette.slateTint(20),
        border: palette.slateTint(40),
      },

      subRow: {
        background: palette.slateTint(98),
        shadow: "rgba(0, 20, 29, 0.1)",
      },

      transparentWhite: {
        headerBackground: "#fff",
        border: "#fff",
      },

      transparentBase: {
        headerBackground: palette.slateTint(95),
        border: palette.slateTint(95),
      },

      drawerSidebar: {
        headerBackground: palette.slateTint(93),
        hover: palette.slateTint(85),
        highlighted: palette.slateTint(80),
        selected: palette.slateTint(70),
      },

      hover: palette.slateTint(95),
      headerIconColor: palette.slateTint(60),
      headerAlternativeBackground: palette.slateTint(10),
      selected: palette.slateTint(85),
      highlighted: palette.slateTint(90),
    },

    help: {
      color: palette.blackOpacity(0.65),
      hover: palette.blackOpacity(0.9),
    },

    text: {
      color: palette.blackOpacity(0.9),
      placeholder: palette.blackOpacity(0.55),
      size: "14px",
    },

    readOnly: {
      textboxBackground: palette.slateTint(98),
      textboxBorder: palette.slateTint(80),
      textboxText: palette.blackOpacity(0.74),
    },

    content: {
      secondaryColor: palette.slateTint(40),
    },

    disabled: {
      border: palette.slateTint(80),
      button: palette.slateTint(90),
      disabled: palette.blackOpacity(0.55),
      input: palette.slateTint(95),
      text: palette.blackOpacity(0.3),
      buttonText: "rgba(0,0,0,.2)",
      background: palette.slateTint(90),
      switch: palette.slateTint(89.5),
    },

    draggableItem: {
      border: palette.slateTint(90),
    },

    checkable: {
      checked: "rgba(0,0,0,0.90)",
    },

    table: {
      primary: palette.slateTint(95),
      secondary: palette.slateTint(80),
      tertiary: palette.slateTint(10),
      header: palette.slateTint(20),
      hover: palette.slateTint(90),
      selected: palette.slateTint(85),
      zebra: palette.slateTint(98),
      dragging: palette.slateTint(90),
    },

    drawer: {
      background: palette.slateTint(93),
      divider: palette.slateTint(85),
    },

    pager: {
      active: "rgba(0,0,0,0.90)",
      disabled: "rgba(0,0,0,0.3)",
      alternate: palette.slateTint(93),
    },

    icon: {
      default: "rgba(0,0,0,0.65)",
      defaultHover: "rgba(0,0,0,0.90)",
      onLightBackground: palette.slateTint(40),
      onLightBackgroundHover: palette.slateTint(20),
      disabled: "rgba(0,0,0,0.30)",
    },

    popoverContainer: {
      iconColor: "rgba(0,0,0,0.90)",
    },

    navigationBar: {
      light: {
        background: palette.slateTint(90),
        borderBottom: palette.slateTint(85),
      },

      dark: {
        background: "#003349",
        borderBottom: "#003349",
      },

      black: {
        background: palette.blackOpacity(1),
      },

      white: {
        borderBottom: palette.slateTint(85),
      },
    },

    numeralDate: {
      passive: "#668592",
      error: "#C7384F",
    },

    portrait: {
      border: palette.slateTint(50),
      background: palette.slateTint(95),
      initials: "rgba(0,0,0,0.65)",
    },

    picklist: {
      locked: palette.slateTint(95),
      lockedContent: palette.slateTint(45),
      lockedText: palette.blackOpacity(0.6),
    },

    pill: {
      neutral: palette.slateTint(30),
      warning: palette.carrotOrangeTint(20),
      neutralBackgroundFocus: palette.slateTint(10),
      warningButtonFocus: palette.carrotOrange,
      errorButtonFocus: palette.errorRedShade(20),
    },

    scrollbar: {
      light: {
        thumb: palette.slateTint(40),
        track: palette.slateTint(95),
      },

      dark: {
        thumb: palette.slateTint(60),
        track: palette.slateTint(20),
      },
    },

    search: {
      active: palette.gold,
      button: "#255BC7",
      passive: palette.slateTint(45),
      icon: palette.slateTint(55),
      iconHover: palette.slateTint(20),
      searchActive: "#668592",
      darkVariantPlaceholder: palette.slateTint(55),
      darkVariantBorder: palette.slateTint(55),
      darkVariantText: "#FFFFFF",
      iconDarkVariant: palette.slateTint(55),
      iconDarkVariantHover: palette.slateTint(75),
    },

    select: {
      border: "#bfccd2",
      selected: palette.slateTint(95),
      optionHeader: palette.blackOpacity(0.55),
      tableHeaderBorder: palette.slateTint(80),
    },

    shadows: {
      depth1: "0 5px 5px 0 rgba(0,20,29,0.2), 0 10px 10px 0 rgba(0,20,29,0.1)",
      depth2:
        "0 10px 20px 0 rgba(0,20,29,0.2), 0 20px 40px 0 rgba(0,20,29,0.1)",
      depth3:
        "0 10px 30px 0 rgba(0,20,29,0.1), 0 30px 60px 0 rgba(0,20,29,0.1)",
      depth4:
        "0 10px 40px 0 rgba(0,20,29,0.04), 0 50px 80px 0 rgba(0,20,29,0.1)",
      /* no space after comma as it is stripped from the variable when used in the spec */
      cards: "0 3px 3px 0 rgba(0,20,29,0.2),0 2px 4px 0 rgba(0,20,29,0.15)",
      cardsIE:
        "0 3px 3px 0 rgba(0,20,29,0.2),0 2px 4px 0 rgba(0,20,29,0.15), 0 0 1px 0 rgba(0,20,29,0.15)",
    },

    stepSequence: {
      completedText: palette.genericGreenShade(15),
    },

    switch: {
      off: palette.slateTint(80),
      offDisabled: palette.slateTint(90),
      offHover: palette.slateTint(60),
      on: palette.slateTint(20),
      onDisabled: palette.slateTint(60),
      onHover: palette.slateTint(0),
      disabledFontColor: "rgba(0,0,0,0.30)",
    },

    tile: {
      border: palette.slateTint(80),
      footerBackground: palette.slateTint(95),
      separator: palette.slateTint(90),
    },

    tab: {
      background: palette.slateTint(80),
      altHover: palette.slateTint(85),
    },

    editorLinkPreview: {
      background: palette.slateTint(95),
      hoverBackground: palette.slateTint(80),
      border: palette.slateTint(90),
      url: palette.slateTint(10),
    },

    zIndex: {
      smallOverlay: 10,
      overlay: 1000,
      nav: 2999,
      modal: 3000,
      header: 4000,
      fullScreenModal: 5000,
      popover: 6000,
      notification: 7000,
      aboveAll: 9999,
    },

    get compatibility() {
      return {
        ...tokens,

        colorsActionMajor150: this.colors.loadingBarBackground,
        colorsActionMajor500: this.colors.primary,
        colorsActionMajor600: this.colors.secondary,

        colorsActionDisabled500: this.disabled.background,

        colorsSemanticFocus500: this.colors.focus,

        colorsSemanticNegative500: this.colors.error,
        colorsSemanticNegative600: this.colors.destructive.hover,

        colorsSemanticCaution500: this.colors.warning,

        colorsSemanticInfo500: this.colors.info,

        spacing000: `${this.space[0]}px`, // 0px
        spacing025: "2px",
        spacing050: "4px",
        spacing075: "6px",
        spacing100: `${this.space[1]}px`, // 8px
        spacing125: "10px",
        spacing150: "12px",
        spacing200: `${this.space[2]}px`, // 16px
        spacing250: "20px",
        spacing300: `${this.space[3]}px`, // 24px
        spacing400: `${this.space[4]}px`, // 32px
        spacing500: `${this.space[5]}px`, // 40px
        spacing600: `${this.space[6]}px`, // 48px
        spacing700: `${this.space[7]}px`, // 56px
        spacing800: `${this.space[8]}px`, // 64px
        spacing900: `${this.space[9]}px`, // 72px

        fontSizes100: this.text.size,
      };
    },
  };
};

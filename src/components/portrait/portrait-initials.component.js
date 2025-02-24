import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import tokens from "@sage/design-tokens/js/base/common";

import Browser from "../../__internal__/utils/helpers/browser";
import {
  StyledPortraitInitials,
  StyledPortraitInitialsImg,
  getColorsForInitials,
} from "./portrait.style";
import { PORTRAIT_SIZE_PARAMS } from "./portrait.config";

const PortraitInitials = ({
  initials,
  size,
  shape,
  darkBackground,
  alt,
  ...rest
}) => {
  const [cachedImageDataUrl, setCachedImageDataUrl] = useState();

  useEffect(() => {
    setCachedImageDataUrl(null);
  }, [initials, size, darkBackground]);

  const generateDataUrl = () => {
    if (cachedImageDataUrl) {
      return cachedImageDataUrl;
    }

    const { textColor, bgColor } = getColorsForInitials(darkBackground);

    let canvas = Browser.getDocument().createElement("canvas");
    const context = canvas.getContext("2d");

    let { dimensions } = PORTRAIT_SIZE_PARAMS[size];

    dimensions -= 2;

    // Set canvas with & height
    canvas.width = dimensions;
    canvas.height = dimensions;

    // Select a font family to support different language characters
    // like Arial
    context.font = `${Math.round(canvas.width / 2.4)}px Lato, Arial`;
    context.textAlign = "center";

    // Setup background and front color
    context.fillStyle = tokens[bgColor];
    context.fillRect(0, 0, dimensions, dimensions);
    context.fillStyle = tokens[textColor];
    context.fillText(
      initials.slice(0, 3).toUpperCase(),
      dimensions / 2,
      dimensions / 1.5
    );

    // Set image representation in default format (png)
    const dataURI = canvas.toDataURL();

    // Dispose canvas element
    canvas = null;

    setCachedImageDataUrl(dataURI);

    return dataURI;
  };

  return (
    <StyledPortraitInitials
      data-element="initials"
      size={size}
      shape={shape}
      {...rest}
    >
      <StyledPortraitInitialsImg src={generateDataUrl()} alt={alt} />
    </StyledPortraitInitials>
  );
};

PortraitInitials.propTypes = {
  /** The user's initials to render. */
  initials: PropTypes.string.isRequired,
  /** The size of the initials image. */
  size: PropTypes.oneOf(["XS", "S", "M", "ML", "L", "XL", "XXL"]).isRequired,
  /** Use a dark background. */
  darkBackground: PropTypes.bool,
  /** The shape of the Portrait. */
  shape: PropTypes.oneOf(["circle", "square"]),
  /** The `alt` HTML string. */
  alt: PropTypes.string,
};

PortraitInitials.defaultProps = {
  shape: "square",
};

export default PortraitInitials;

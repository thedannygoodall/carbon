import React from 'react';
import PropTypes from 'prop-types';
import StyledColorSampleBox from './style/color-sample-box.style';
import StyledTickIcon from '../tick-icon/tick-icon.style';

const ColorSampleBox = ({ color, checked }) => {
  return (
    <StyledColorSampleBox color={ color }>
      {checked && (
        <StyledTickIcon
          color={ color } checked
          type='tick'
        />
      )}
    </StyledColorSampleBox>
  );
};

ColorSampleBox.propTypes = {
  checked: PropTypes.bool,
  color: (props, propName) => {
    let error;
    const prop = props[propName];
    if (!prop.match(/\b[0-9A-Fa-f]{6}\b/g)) {
      error = new Error('Provide color in a hex format.');
    }
    return error;
  }
};

export default ColorSampleBox;

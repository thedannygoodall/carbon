import { THEMES } from '..';

export default (palette) => {
  return (
    {
      name: THEMES.classic,

      colors: {
        base: palette.productGreen,
        primary: palette.productGreenShade(21),
        secondary: palette.productGreenShade(41),
        tertiary: palette.productGreenShade(61),

        // element
        border: '#ccd6db',
        borderHover: '#99adb6',

        // generic
        baseBlue: '#255BC7',
        greyDarkBlue50: '#8099a4'
      },

      text: {
        color: '#255bc7'
      },

      label: {
        color: '#003349'
      },

      disabled: {
        input: '#1e499f',
        disabled: '#b3c2c8',
        border: '#4d7080'
      }
    }
  );
};

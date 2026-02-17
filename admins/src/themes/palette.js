// third-party
import { presetPalettes } from '@ant-design/colors';

// project imports
import ThemeOption from './theme';
import { extendPaletteWithChannels } from 'utils/colorUtils';

const greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];

// VoisiLab Custom Colors - matching the brand
const voisilab = [
  '#f9e6f9',  // 0 - très clair
  '#f0c7ef',  // 1
  '#e6a8e5',  // 2
  '#dd89db',  // 3 - clair
  '#d36ad1',  // 4
  '#a306a1',  // 5 - main (couleur du logo)
  '#8a0589',  // 6 - dark
  '#710471',  // 7
  '#580359',  // 8 - darker
  '#3f0241',  // 9
];

const voislabGreen = [
  '#e6f7f5',  // 0 - très clair
  '#b3e7de',  // 1
  '#80d7c7',  // 2
  '#4dc7b0',  // 3 - clair
  '#1ab799',  // 4
  '#16a085',  // 5 - main (vert d'accent)
  '#138a71',  // 6 - dark
  '#10745d',  // 7
  '#0d5e49',  // 8 - darker
  '#0a4835',  // 9
];

// ==============================|| GREY COLORS BUILDER ||============================== //

function buildGrey() {
  let greyPrimary = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000'
  ];
  let greyConstant = ['#fafafb', '#e6ebf1'];

  return [...greyPrimary, ...greyAscent, ...greyConstant];
}

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export function buildPalette(presetColor) {
  const lightColors = { ...presetPalettes, grey: buildGrey(), voisilab, voislabGreen };
  const lightPaletteColor = ThemeOption(lightColors, presetColor);

  const commonColor = { common: { black: '#000', white: '#fff' } };

  const extendedLight = extendPaletteWithChannels(lightPaletteColor);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'light',
      ...extendedCommon,
      ...extendedLight,
      text: {
        primary: extendedLight.grey[700],
        secondary: extendedLight.grey[500],
        disabled: extendedLight.grey[400]
      },
      action: { disabled: extendedLight.grey[300] },
      divider: extendedLight.grey[200],
      background: {
        paper: extendedLight.grey[0],
        default: extendedLight.grey.A50
      }
    }
  };
}

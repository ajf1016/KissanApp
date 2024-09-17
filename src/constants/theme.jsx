import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const COLORS = {
  // base colors
  primary: '#191919',
  secondary: '#EAB600',
  icon: '#BCC8D4',
  background: '#ffffff',
  place_holder: '#252525',
  green: '#009262',
  red: '#E02B1D',

  dark_gray: '#111',
  gray: '#A2A2A2',
  gray2: '#747474',
  gray3: '#D4D4D4',

  light_gray: '#ddd',

  danger: '#dc3545',
  info: '#17a2b8',
  warning: '#ffc107',
  button: '#cd9937',
  button_light: '#EBCD73',
  black: '#000000',
  white: '#fff',
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  padding2: 36,

  // font sizes
  largeTitle: 50,
  h1: 24,
  h2: 16,
  h3: 14,
  h4: 12,
  h5: 10,
  text1: 24,
  text2: 16,
  text3: 14,
  text4: 12,
  text5: 10,

  // app dimensions
  width,
  height,
  wp: wp,
  hp: hp,
};

export const FONTS = {
  bold: {
    fontFamily: 'Gordita Bold',
    // lineHeight: 20,
    color: COLORS.primary,
  },
  medium: {
    fontFamily: 'Gordita Medium',
    // lineHeight: 20,
    // color: COLORS.primary,
  },
  regular: {
    fontFamily: 'Gordita Regular',
    // lineHeight: 20,
    color: COLORS.primary,
  },
  light: {
    fontFamily: 'Gordita Light',
    // lineHeight: 20,
    color: COLORS.primary,
  },
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;

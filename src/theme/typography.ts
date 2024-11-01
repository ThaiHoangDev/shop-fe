export const fontSize = 14;

import { Open_Sans } from 'next/font/google';

export const openSans = Open_Sans({
  subsets: ['latin'],
});

const FontFamily = 'Lexend';

export const typography = {
  fontSize,
  // fontFamily: openSans.style.fontFamily,
  fontFamily: FontFamily,
  htmlFontSize: 16,
  body1: { fontSize },
  body2: { fontSize },
};

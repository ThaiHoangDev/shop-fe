// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import Logo from '/favicon/favicon.png';
import Image from 'next/image';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100%',
  height: '100%',
  position: 'fixed',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 30,
  backgroundColor: theme.palette.background.default,
}));

const LoadingDotAnimation = styled(Box)(({ theme }) => ({
  position: 'relative',
  left: '-9999px',
  width: '10px',
  height: '10px',
  borderRadius: '5px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  boxShadow: `9984px 0 0 0 ${theme.palette.primary.main}, 9999px 0 0 0 ${theme.palette.primary.main}, 10014px 0 0 0 ${theme.palette.primary.main}`,
  animation: `dot-loading 1.5s infinite linear`,

  '@keyframes dot-loading': {
    '0%': {
      boxShadow: `9984px 0 0 0 ${theme.palette.primary.main}, 9999px 0 0 0 ${theme.palette.primary.main}, 10014px 0 0 0 ${theme.palette.primary.main}`,
    },
    '16.667%': {
      boxShadow: `9984px -10px 0 0 ${theme.palette.primary.main}, 9999px 0 0 0 ${theme.palette.primary.main}, 10014px 0 0 0 ${theme.palette.primary.main}`,
    },
    '33.333%': {
      boxShadow: `9984px 0 0 0 ${theme.palette.primary.main}, 9999px 0 0 0 ${theme.palette.primary.main}, 10014px 0 0 0 ${theme.palette.primary.main}`,
    },
    '50%': {
      boxShadow: `9984px 0 0 0 ${theme.palette.primary.main}, 9999px -10px 0 0 ${theme.palette.primary.main}, 10014px 0 0 0 ${theme.palette.primary.main}`,
    },
    '66.667%': {
      boxShadow: `9984px 0 0 0 ${theme.palette.primary.main}, 9999px 0 0 0 ${theme.palette.primary.main}, 10014px 0 0 0 ${theme.palette.primary.main}`,
    },
    '83.333%': {
      boxShadow: `9984px 0 0 0 ${theme.palette.primary.main}, 9999px 0 0 0 ${theme.palette.primary.main}, 10014px -10px 0 0 ${theme.palette.primary.main}`,
    },
    '100%': {
      boxShadow: `9984px 0 0 0 ${theme.palette.primary.main}, 9999px 0 0 0 ${theme.palette.primary.main}, 10014px 0 0 0 ${theme.palette.primary.main}`,
    },
  },
}));
// ----------------------------------------------------------------------

export default function LoadingScreen() {
  return (
    <RootStyle>
      <Image width={150} height={150} src={'/favicon/favicon.png'} alt='logo' />
      <LoadingDotAnimation />
    </RootStyle>
  );
}

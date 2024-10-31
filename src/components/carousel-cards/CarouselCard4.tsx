import { FC } from 'react';
import { useRouter } from 'next/router';
import { Box, styled, Button } from '@mui/material';

// custom styled components
const CardWrapper = styled(Box)<{ img: string; mode: string }>(
  ({ theme, img, mode }) => ({
    minHeight: 700,
    display: 'flex',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(${img})`,
    backgroundPosition: 'center center' /* optional, center the image */,
    backgroundColor: mode === 'dark' ? '#000' : '#fff',
    color: mode === 'light' ? theme.palette.dark.main : '#fff',
    ...(theme.direction === 'rtl' && {
      textAlign: 'right',
      paddingRight: '5rem',
      justifyContent: 'flex-end',
      '& > .MuiBox-root': { padding: 0 },
    }),
    [theme.breakpoints.down('md')]: {
      padding: 24,
      textAlign: 'center',
      justifyContent: 'center',
      minHeight: 300,
    },
  })
);

// ===============================================================
type CarouselCard4Props = {
  title?: string;
  bgImage?: string;
  category?: string;
  discount?: number;
  buttonLink?: string;
  buttonText?: string;
  description?: string;
  mode?: 'dark' | 'light';
};
// ===============================================================

const CarouselCard4: FC<CarouselCard4Props> = ({
  title,
  bgImage,
  category,
  discount,
  buttonLink,
  buttonText,
  description,
  mode = 'dark',
}) => {
  const { push } = useRouter();

  return (
    <CardWrapper img={bgImage} mode={mode} sx={{ padding: '0px !important' }}>
      <Box margin={'auto'} marginTop={'450px'}>
        <Button
          color='primary'
          size='large'
          fullWidth
          sx={{
            backgroundColor: 'rgba(108, 144, 60, 1)',
            borderRadius: '32px',
            color: '#fff',
            fontSize: 24,
            fontWeight: '600',
          }}
          onClick={() => push(buttonLink ?? '')}>
          {buttonText}
        </Button>
      </Box>
    </CardWrapper>
  );
};

export default CarouselCard4;

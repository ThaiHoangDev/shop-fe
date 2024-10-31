import { FC } from 'react';
import { H4 } from 'components/Typography';
import { Box, styled } from '@mui/material';
import LazyImage from 'components/LazyImage';

// custom styled components
const Wrapper = styled(Box)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  overflow: 'hidden',
  borderRadius: '8px',
  width: '100%',
  '& img': { transition: 'all 0.3s' },
  ':hover': {
    img: { transform: 'scale(1.1)' },
    '& .category-title': {
      color: theme.palette.common.white,
      backgroundColor: '#87B44B',
    },
  },
}));

const CategoryTitle = styled(Box)({
  left: 10,
  right: 10,
  bottom: 20,
  maxWidth: 'fit-content',
  textAlign: 'center',
  borderRadius: '30px',
  margin: 'auto',
  position: 'absolute',
  transition: 'all 0.3s',
  padding: '8px 32px 8px 32px',
  backgroundColor: '#FFF',
});

// ============================================================
type CategoryCard1Props = { image: string; title: string };
// ============================================================

const CategoryCard1: FC<CategoryCard1Props> = ({ image, title }) => {
  return (
    <Wrapper position='relative'>
      <LazyImage
        src={image}
        width={400}
        height={400}
        alt='category'
        sx={{
          objectFit: 'cover',
          objectPosition: 'center center',
          maxHeight: { xs: 140, md: 200 },
          borderRadius: '8px',
        }}
      />

      <CategoryTitle className='category-title'>
        <H4>{title}</H4>
      </CategoryTitle>
    </Wrapper>
  );
};

export default CategoryCard1;

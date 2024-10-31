import { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Stack,
  Theme,
  styled,
  useMediaQuery,
} from '@mui/material';
import useWindowSize from 'hooks/useWindowSize';
import { H3 } from 'components/Typography';
import { FlexBetween } from 'components/flex-box';
import Carousel from 'components/carousel/Carousel';
import ProductItem from '@/components/product-cards/ProductItem';
import { carouselStyled } from 'components/carousel/styles';
import IconNewProduct from '@/components/icons/NewProduct';
import { useSelector } from '@/store/store';
import LazyImage from '@/components/LazyImage';
import { useRouter } from 'next/router';

// ======================================================================
// ======================================================================

const TitleText = styled(H3)(({ theme }) => ({
  fontSize: '20px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
  },
}));

const ButtonMore = styled(Button)(({ theme }) => ({
  padding: '5px 10px',
  whiteSpace: 'nowrap',

  [theme.breakpoints.down('sm')]: {
    borderRadius: '8px',
  },
}));
const NewProductLaunched: FC = () => {
  const width = useWindowSize();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const { push } = useRouter();

  const { products } = useSelector((state) => state.home);
  const [visibleSlides, setVisibleSlides] = useState(4);

  useEffect(() => {
    if (width < 426) setVisibleSlides(2);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 1024) setVisibleSlides(2);
    else if (width < 1200) setVisibleSlides(4);
    else setVisibleSlides(4);
  }, [width]);
  return (
    <Stack gap={2}>
      <FlexBetween>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconNewProduct sx={{ mr: 1 }} />
          <TitleText fontSize={20}>Sản phẩm mới ra mắt</TitleText>
        </Box>
        {!isMobile && (
          <ButtonMore
            color='primary'
            onClick={() => {
              push({
                pathname: `/category`,
                query: `products=new`,
              });
            }}>
            Xem Thêm
          </ButtonMore>
        )}
      </FlexBetween>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={3}>
          <LazyImage
            width={300}
            height={300}
            alt='category'
            className='new-product-image'
            src={`/assets/images/new_banner.png`}
            sx={{
              height: { lg: '292px', sm: '100%', xs: '200px' },
              width: '100%',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <Carousel
            totalSlides={products.slice(0, 10).length}
            visibleSlides={visibleSlides}
            sx={carouselStyled}
            showArrow={false}
            autoPlay
            spacing='10px'>
            {products.slice(0, 10).map((product) => (
              <ProductItem
                product={product}
                key={product.id}
                height={'160px'}
              />
            ))}
          </Carousel>
        </Grid>
      </Grid>

      {isMobile && (
        <ButtonMore
          color='primary'
          onClick={() => {
            push({
              pathname: `/category`,
              query: `products=new`,
            });
          }}>
          Xem thêm
        </ButtonMore>
      )}
    </Stack>
  );
};

export default NewProductLaunched;

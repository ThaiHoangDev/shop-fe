import { FC } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Theme,
  styled,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';

import { useSelector } from '@/store/store';

import Product from '@/models/Product.model';

import ProductItem from '@/components/product-cards/ProductItem';
import { H3 } from 'components/Typography';
import Start from '@/components/icons/Start';
import { useRouter } from 'next/router';

const WrapperImageBestSeller = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: 10,
  top: '-7%',
  img: {
    width: '130px',
    height: '130px',
  },
  [theme.breakpoints.down('lg')]: {
    left: 0,
    top: '-6%',
    img: {
      width: '100px',
      height: '100px',
    },
  },
}));

//Text
const TitleText = styled(H3)(({ theme }) => ({
  color: '#fff',
  fontSize: '28px',

  [theme.breakpoints.down('md')]: {
    fontSize: '22px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
  },
}));

const ButtonMore = styled(Button)(({ theme }) => ({
  borderRadius: '32px',
  padding: '5px 10px',
  whiteSpace: 'nowrap',
  backgroundColor: '#ffff',
  color: '#7AA244',

  [theme.breakpoints.down('sm')]: {
    borderRadius: '8px',
  },
}));
const BestSellerProduct: FC = () => {
  const { productsBest } = useSelector((state) => state.home);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const { push } = useRouter();

  return (
    <Stack
      gap={2}
      sx={(theme) => ({
        backgroundColor: 'rgba(165, 199, 120, 1)',
        padding: 2,
        borderRadius: '8px',
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
          paddingTop: 6,
        },
      })}>
      <WrapperImageBestSeller>
        <Image
          width={151}
          height={151}
          alt='complete'
          src='/assets/images/BEST_SELLER.png'
        />
      </WrapperImageBestSeller>
      <Stack gap={2}>
        <Stack direction={'row'} gap={2} justifyContent={'center'}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Start sx={{ mr: 1 }} />
            <TitleText>Sản phẩm bán chạy</TitleText>
          </Box>

          {!isMobile && (
            <ButtonMore
              color='primary'
              onClick={() => {
                push({
                  pathname: `/category`,
                  query: `products=best`,
                });
              }}
              sx={(theme) => ({
                position: 'absolute',
                top: '2%',
                right: '1%',
              })}>
              Xem Thêm
            </ButtonMore>
          )}
        </Stack>
        <Box>
          <Grid container spacing={1}>
            {productsBest?.slice(0, 4).map((item: Product) => (
              <Grid key={item.id} item xs={6} sm={3}>
                <ProductItem product={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
      {isMobile && (
        <ButtonMore
          color='primary'
          onClick={() => {
            push({
              pathname: `/category`,
              query: `products=best`,
            });
          }}>
          Xem Thêm
        </ButtonMore>
      )}
      <Card
        sx={{
          maxHeight: '470px',
          img: {
            objectFit: 'contain',
            width: '100%',
            height: '100%',
          },
        }}>
        <img src={'/assets/images/intro2.png'} alt='' />
      </Card>
    </Stack>
  );
};

export default BestSellerProduct;

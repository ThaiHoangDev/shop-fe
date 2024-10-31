import { FC } from 'react';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  CardMedia,
  Stack,
  Theme,
  styled,
  useMediaQuery,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import LazyImage from 'components/LazyImage';
import { H4 } from 'components/Typography';
import { CartItem, useAppContext } from 'contexts/AppContext';
import Product from 'models/Product.model';
import ShoppingBag from '../icons/ShoppingBag';
import NumberFormat from '@/components/number-format';

// custom styled components
const Card = styled(Box)(({ theme }) => ({
  borderRadius: '3px',
  transition: 'all 0.3s',
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey[100]}`,
  ':hover': {
    '& .product-actions': { right: 5 },
    '& img': { transform: 'scale(1.1)' },
    backgroundColor: '#E1ECD2',
  },
}));

const CardMediaStyled = styled(CardMedia)(({ theme }) => ({
  width: '100%',
  maxHeight: 300,
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  padding: '16px',
  '& img': { transition: '0.3s' },
  [theme.breakpoints.down('sm')]: {
    padding: '8px',
  },
}));

//Text
const ProductNameText = styled(Box)(({ theme }) => ({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  color: 'rgba(35, 44, 53, 1)',
  fontWeight: 700,
  height: '5.5ex',
  textAlign: 'left',
  [theme.breakpoints.down('sm')]: {
    WebkitLineClamp: 1,
    height: '3ex',
  },
}));

const PriceText = styled(H4)(({ theme }) => ({
  fontWeight: 700,
  padding: '4px 0',
  color: 'rgba(135, 180, 75, 1)',
  fontSize: '14px',
  span: {
    whiteSpace: 'nowrap',
  },
  [theme.breakpoints.down('sm')]: {},
}));

const QuantityText = styled(H4)(() => ({
  fontWeight: 600,
  padding: '0 4px',
  fontSize: '14px',
}));

//Button
const AddCartButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'rgba(135, 180, 75, 1)',
  borderRadius: '32px',
  height: '35px',
  width: '35px',
  [theme.breakpoints.down('lg')]: {
    width: '100%',
    borderRadius: '8px',
  },
}));

//Wrapper
const PriceAndButtonGroupWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 1,

  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
// ===========================================================
type ProductCardProps = {
  product: Product;
  width?: 200 | string;
  height?: 200 | string;
};
// ==============================================================

const ProductItem: FC<ProductCardProps> = ({ product, width, height }) => {
  const { id, has_variants, master, variants } = product;
  const { enqueueSnackbar } = useSnackbar();

  const { state, dispatch } = useAppContext();

  const downMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const { images = [] } = (has_variants ? variants[0] : master) || {};

  const cartItem: CartItem | undefined = state.cart.find(
    (item) => item.slug === product.slug
  );

  const cartExist = state.cart.find((item) => item.id === id);

  // handle add to cart
  const handleAddToCart = (product: Product) => {
    const payload = {
      id: id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imgUrl: images?.length
        ? images[0]?.small_url || images[0]?.product_url
        : '',
      qty: (cartItem?.qty || 0) + 1,
      variant_id: has_variants ? variants[0].id : master.id,
      variants: has_variants ? variants : [],
    };

    dispatch({ type: 'CHANGE_CART_AMOUNT', payload });
    enqueueSnackbar('Đã thêm vào giỏ hàng', { variant: 'success' });
  };

  const handleCartAmountChange = (amount: number) => () => {
    dispatch({
      type: 'CHANGE_CART_AMOUNT',
      payload: {
        price: product.price,
        qty: amount,
        name: product.name,
        imgUrl: images?.length
          ? images[0]?.small_url || images[0]?.product_url
          : '',
        id,
        slug: product.slug,
        variant_id: has_variants ? variants[0].id : master.id,
        variants: has_variants ? variants : [],
      },
    });
  };

  return (
    <Card height='100%' sx={{ borderRadius: '8px !important' }}>
      <CardMediaStyled>
        <Link
          href={{
            pathname: `/product/${product.slug}-${product.id}`,
            query: { id: product.id },
          }}>
          <LazyImage
            width={300}
            height={300}
            alt='category'
            className='product-img'
            src={
              images?.length ? images[0]?.small_url || images[0]?.large_url : ''
            }
            sx={{
              borderRadius: 1,
              height: height || '170px',
              width: width || '100%',
              ...(downMd && { height: 140 }),
            }}
          />
        </Link>
      </CardMediaStyled>

      <Box p={2} pt={0} textAlign='center'>
        <ProductNameText>{product.name}</ProductNameText>

        <PriceAndButtonGroupWrapper>
          <PriceText>
            <NumberFormat
              value={has_variants ? variants[0].price : product?.price}
            />
          </PriceText>

          {/* Button Group Action */}
          <Box
            sx={{
              width: {
                lg: 'fit-content',
                xs: '100%',
              },
            }}>
            {!cartExist?.qty ? (
              //Add to Cart
              <AddCartButton
                color='primary'
                variant='contained'
                onClick={() => handleAddToCart(product)}>
                <ShoppingBag
                  sx={{
                    fontSize: '20px',
                  }}
                />
              </AddCartButton>
            ) : (
              //Group Button
              <Stack
                direction={'row'}
                justifyContent={'space-around'}
                alignItems='center'>
                <Button
                  size='small'
                  sx={{ p: 0.5 }}
                  variant='outlined'
                  onClick={handleCartAmountChange(cartExist?.qty - 1)}>
                  <Remove fontSize='small' />
                </Button>
                <QuantityText>
                  {cartExist?.qty.toString().padStart(2, '0')}
                </QuantityText>

                <Button
                  size='small'
                  sx={{ p: 0.5 }}
                  variant='outlined'
                  onClick={handleCartAmountChange(cartExist?.qty + 1)}>
                  <Add fontSize='small' />
                </Button>
              </Stack>
            )}
          </Box>
        </PriceAndButtonGroupWrapper>
      </Box>
    </Card>
  );
};

export default ProductItem;

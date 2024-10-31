import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import { Add, Clear, Close, Remove } from '@mui/icons-material';
import LazyImage from 'components/LazyImage';
import { FlexBetween, FlexBox } from 'components/flex-box';
import { H5, Paragraph, Tiny } from 'components/Typography';
import CartBag from 'components/icons/CartBag';
import { CartItem, useAppContext } from 'contexts/AppContext';
import { currency } from 'lib';
import NumberFormat from '@/components/number-format';

// =========================================================
type MiniCartProps = { toggleSidenav: () => void };
// =========================================================

const MiniCart: FC<MiniCartProps> = ({ toggleSidenav }) => {
  const { push } = useRouter();
  const { palette } = useTheme();
  const { state, dispatch } = useAppContext();
  const cartList = state.cart;

  const handleCartAmountChange = (amount: number, product) => () => {
    dispatch({
      type: 'CHANGE_CART_AMOUNT',
      payload: { ...product, qty: amount },
    });
  };

  const getTotalPrice = () => {
    return cartList.reduce((accum, item) => accum + item.price * item.qty, 0);
  };

  const handleNavigate = (path: string) => () => {
    toggleSidenav();
    push(path);
  };

  return (
    <Box width={{ sm: '50vw', xs: '100vw' }}>
      <Box
        overflow='auto'
        height={`calc(100vh - ${
          !!cartList.length ? '80px - 3.25rem' : '0px'
        })`}>
        <FlexBetween mx={3} height={74}>
          <FlexBox gap={1} alignItems='center' color='secondary.main'>
            <CartBag color='inherit' />

            <Paragraph lineHeight={0} fontWeight={600}>
              {cartList.length} sản phẩm
            </Paragraph>
          </FlexBox>

          <IconButton onClick={toggleSidenav}>
            <Clear />
          </IconButton>
        </FlexBetween>

        <Divider />

        {cartList.length <= 0 && (
          <FlexBox
            alignItems='center'
            flexDirection='column'
            justifyContent='center'
            height='calc(100% - 74px)'>
            <Box maxWidth={100}>
              <LazyImage
                width={90}
                height={100}
                alt='banner'
                src='/assets/images/logos/shopping-bag.svg'
              />
            </Box>
            <Box
              component='p'
              mt={2}
              color='grey.600'
              textAlign='center'
              maxWidth='200px'>
              Chưa có sản phẩm nào trong giỏ hàng
            </Box>
          </FlexBox>
        )}

        {cartList.map((item: CartItem) => (
          <FlexBox
            py={2}
            px={2.5}
            key={item.id}
            alignItems='center'
            borderBottom={`1px solid ${palette.divider}`}>
            <FlexBox alignItems='center' flexDirection='column'>
              <Button
                variant='outlined'
                onClick={handleCartAmountChange(item.qty + 1, item)}
                sx={{ height: '32px', width: '32px', borderRadius: '6px' }}>
                <Add fontSize='small' />
              </Button>

              <Box fontWeight={600} fontSize='15px' my='3px'>
                {item.qty}
              </Box>

              <Button
                variant='outlined'
                disabled={item.qty === 1}
                onClick={handleCartAmountChange(item.qty - 1, item)}
                sx={{
                  height: '32px',
                  width: '32px',
                }}>
                <Remove fontSize='small' />
              </Button>
            </FlexBox>

            <Link href={`/product/${item.id}`}>
              <Avatar
                alt={item.name}
                src={item.imgUrl}
                sx={{ mx: 2, width: 76, height: 76 }}
              />
            </Link>

            <Box
              flex='1'
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
              <Link href={`/product/${item.slug}`}>
                <H5 ellipsis fontSize='14px' className='title'>
                  {item.name}
                </H5>
              </Link>

              <Tiny color='grey.600'>
                <NumberFormat value={item.price} /> x {item.qty}
              </Tiny>

              <Box
                fontWeight={600}
                fontSize='14px'
                color='primary.main'
                mt={0.5}>
                <NumberFormat value={item.qty * item.price} />
              </Box>
            </Box>

            <IconButton
              size='small'
              onClick={handleCartAmountChange(0, item)}
              sx={{ marginLeft: 2.5 }}>
              <Close fontSize='small' />
            </IconButton>
          </FlexBox>
        ))}
      </Box>

      {cartList.length > 0 && (
        <Box p={2.5}>
          <Button
            fullWidth
            color='primary'
            sx={{
              height: 40,
              borderRadius: {
                sm: '32px',
                xs: '8px',
              },
            }}
            onClick={handleNavigate('/cart')}>
            Xem giỏ hàng
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MiniCart;

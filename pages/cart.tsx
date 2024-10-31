import Link from 'next/link';
import { NextPage } from 'next';
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Theme,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
import SEO from 'components/SEO';
import { Span, H6 } from 'components/Typography';
import { FlexBetween } from 'components/flex-box';
import ProductCartItem, {
  DeleteIcon,
} from '@/components/product-cards/ProductCartItem';
import CheckoutNavLayout from 'components/layouts/CheckoutNavLayout';
import { CartItem, useAppContext } from 'contexts/AppContext';

import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import AddressFormDialog from '@/components/address-dialog/AddressForm';
import { useCallback, useEffect, useState } from 'react';
import * as Order from '../src/utils/__api__/orders';
import { dispatch, useSelector } from '@/store/store';
import { defaultInfoUser } from '@/store/slices/homeSlice';
import NumberFormat from '@/components/number-format';
import LoadingButton from '@mui/lab/LoadingButton';
import NonSSRComponent from '@/components/NonSSRComponent';
import { useSnackbar } from 'notistack';

const WrapBoxLoading = styled(Box)(() => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: 3,
  top: 0,
  left: 0,

  backgroundColor: '#747474',
  opacity: 0.8,
  pointerEvents: 'none',

  div: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%,-50%)`,
  },
  p: {
    color: '#E1ECD2',
    fontSize: '22px',
  },
}));

const WrapperCheckbox = styled(Checkbox)(({ theme }) => ({
  '.Mui-checked': {
    color: '#96BD62!important',
  },
  padding: 0,
  [theme.breakpoints.down('sm')]: {
    svg: {
      fontSize: '20px',
    },
  },
}));

const shipping_method_name = {
  fee_weight: 'Phí GHTK theo cân nặng thùng hàng',
  fee_company: 'Ship GHTK / GRAB / AHAMOVE',
};

const Cart: NextPage = () => {
  const { state } = useAppContext();
  const cartList: CartItem[] = state.cart;
  const { push } = useRouter();
  const { infoUser } = useSelector((state) => state.home);
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const [selectedProducts, setSelectedProducts] = useState(
    cartList.map((item) => item.id)
  );
  const [orderNumberCart, setOrderNumberCart] = useState<string>('');
  const [responseLockCart, setResponseLockCart] = useState<any>(null);
  const [responseComplete, setResponseComplete] = useState<any>(null);
  const [productListSelected, setProductListSelected] = useState<any>(null);

  const [valueInputPromotion, setValueInputPromotion] = useState('');
  const [openDialogAddress, setOpenDialogAddress] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const [isLoadingCartBox, setIsLoadingCartBox] = useState<boolean>(false);

  const handleProductToggle = (productId: any) => {
    const selectedIndex = selectedProducts.indexOf(productId);
    let newSelectedProducts = [];

    if (selectedIndex === -1) {
      newSelectedProducts = newSelectedProducts.concat(
        selectedProducts,
        productId
      );
    } else if (selectedIndex === 0) {
      newSelectedProducts = newSelectedProducts.concat(
        selectedProducts.slice(1)
      );
    } else if (selectedIndex === selectedProducts.length - 1) {
      newSelectedProducts = newSelectedProducts.concat(
        selectedProducts.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedProducts = newSelectedProducts.concat(
        selectedProducts.slice(0, selectedIndex),
        selectedProducts.slice(selectedIndex + 1)
      );
    }

    setSelectedProducts(newSelectedProducts);
  };

  const handSelectedAll = () => {
    if (selectedProducts.length <= 0) {
      const selectedPro = cartList.map((e) => e.id);
      setSelectedProducts(selectedPro);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleDeleteAll = () => {
    setSelectedProducts([]);
  };

  const getTotalPriceSelectedProducts = () =>
    cartList
      .filter(
        (accum, index) => selectedProducts.find((e) => e === accum.id) && accum
      )
      .reduce((accum, item) => accum + item.price * item.qty, 0);

  const getTotalPrice = () =>
    getTotalPriceSelectedProducts() + (!!infoUser ? +infoUser?.cost : 0);

  const getProductSelected = (tmpCartList, tmpProductSelectedList) =>
    tmpCartList.filter((item) => tmpProductSelectedList.includes(item.id));

  // APPLY PROMOTION
  const handleVoucher = useCallback(async () => {
    const productList = getProductSelected(cartList, selectedProducts);
    handleCompleteCart(true, responseLockCart, productList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueInputPromotion]);

  //GET NUMBER CART
  const handleGetOrderNumberCart = useCallback(async () => {
    const { order_number } = await Order.default.getOrderApi();
    const productList = getProductSelected(cartList, selectedProducts);

    setOrderNumberCart(order_number);
    setProductListSelected(productList);

    handleLockCart(productList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    infoUser?.addressResponse,
    productListSelected,
    cartList,
    selectedProducts,
  ]);

  //HANDLE LOCK CART ITEM
  const handleLockCart = useCallback(
    async (tmpProductSelectedList) => {
      if (!tmpProductSelectedList) return;
      const variantListToLock = tmpProductSelectedList.map((item) => ({
        variant_id: item.variant_id,
        quantity: item.qty,
      }));

      const lockPayload = {
        order: {
          order_number: orderNumberCart,
          variants: variantListToLock,
        },
      };
      const lockResponse = await Order.default.lockOrderApi(lockPayload);
      setResponseLockCart(lockResponse);

      handleCompleteCart(true, lockResponse, tmpProductSelectedList);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [infoUser?.addressResponse, orderNumberCart]
  );

  // HANDLE COMPLETE CART
  const handleCompleteCart = useCallback(
    async (isDraft = false, responseLock, productListSelected) => {
      if (!orderNumberCart) return;
      const body = {
        order: {
          cart_order_number: orderNumberCart,
          lock_order_number: responseLock?.order?.number,
          shipping_method_id:
            responseLock?.shipping_methods[0]?.shipping_method_id,
          payment_method_id: responseLock?.payment_methods[0].id,
          promotion_code: isDraft ? valueInputPromotion : '',
          note: '',
          draft: isDraft,
        },
      };
      await Order.default
        .completeOrderApi(body)
        .then((response) => {
          setResponseComplete(response);
          if (!isDraft) {
            dispatch(
              defaultInfoUser({
                ...infoUser,
                ...{ responseComplete: response },
                ...{ productSelected: productListSelected },
              })
            );
            window.localStorage.removeItem('cart_local');

            push('/checkout');
          }
        })
        .catch((err) =>
          enqueueSnackbar(
            `${err?.data?.errors?.errors ?? 'Áp dụng thất bại'}`,
            {
              variant: 'error',
            }
          )
        )
        .finally(() => setIsLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [infoUser, orderNumberCart, valueInputPromotion]
  );

  // REMOVE PROMOTION
  const handleRemovePromotion = useCallback(async () => {
    const body = {
      order: {
        lock_order_number: responseLockCart?.order?.number,
        promotion_code: valueInputPromotion,
      },
    };
    await Order.default
      .removePromotionApi(body)
      .then((response) => {
        setResponseComplete(response);
      })
      .catch((err) => console.log(err));
  }, [responseLockCart, valueInputPromotion]);

  //SUBMIT
  const submitOrder = async () => {
    if (!infoUser) return setOpenDialogAddress(true);
    setIsLoading(true);

    await handleCompleteCart(false, responseLockCart, productListSelected)
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  //update Lock Cart when action change
  useEffect(() => {
    if (!infoUser) return;
    setIsLoading(true);
    const productListSelected = getProductSelected(cartList, selectedProducts);
    setProductListSelected(productListSelected);
    handleLockCart(productListSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartList, selectedProducts, handleLockCart]);

  //update Lock Cart when typed address
  useEffect(() => {
    if (!infoUser?.addressResponse) return;

    handleGetOrderNumberCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoUser?.addressResponse]);

  return (
    <NonSSRComponent>
      <CheckoutNavLayout>
        <SEO title='Giỏ hàng' />

        <Box sx={{ position: 'relative' }}>
          {isLoading ? (
            <WrapBoxLoading>
              <Stack justifyContent={'center'} alignItems={'center'}>
                <CircularProgress />
                <Typography>Loading...</Typography>
              </Stack>
            </WrapBoxLoading>
          ) : null}

          <Container sx={{ pointerEvents: isLoading ? 'none' : 'all' }}>
            <Stack pt={2} pb={5}>
              <Box
                sx={{
                  fontSize: '24px',
                  fontWeight: 700,
                  marginBottom: '16px',
                }}>
                Giỏ hàng
              </Box>

              <Grid container spacing={3}>
                <Grid item md={8} xs={12}>
                  <Box
                    sx={{
                      position: 'relative',
                      pointerEvents: isLoading ? 'none' : 'all',
                    }}>
                    {/* Select all Box */}
                    <Card
                      sx={(theme) => ({
                        padding: {
                          sm: '24px 16px',
                          xs: '24px 8px',
                        },
                        p: {
                          whiteSpace: 'nowrap',
                          color: '#5E6B74',
                          fontSize: '16px',
                          [theme.breakpoints.down('sm')]: {
                            fontSize: '14px',
                          },
                        },
                      })}>
                      <Grid container>
                        <Grid item xs={12} sm={6} lg={6}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              height: '100%',
                            }}>
                            {selectedProducts.length > 0 &&
                            selectedProducts.length < cartList.length ? (
                              <WrapperCheckbox
                                indeterminate={true}
                                onClick={() => setSelectedProducts([])}
                                sx={(theme) => ({
                                  '.Mui-checked': {
                                    color: '#96BD62!important',
                                  },
                                  padding: 0,
                                  [theme.breakpoints.down('sm')]: {
                                    svg: {
                                      fontSize: '20px',
                                    },
                                  },
                                })}
                              />
                            ) : (
                              <WrapperCheckbox
                                onClick={() => handSelectedAll()}
                                checked={
                                  cartList.length > 0 &&
                                  cartList.length === selectedProducts.length
                                }
                              />
                            )}

                            <Typography>
                              Chọn tất cả ({selectedProducts.length} sản phẩm)
                            </Typography>
                          </Box>
                        </Grid>

                        {!isMobile && (
                          <Grid item sm={6} lg={6}>
                            <Grid container sx={{ height: '100%' }}>
                              <Grid
                                item
                                xs={3}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'end',
                                }}>
                                <Typography>Đơn giá</Typography>
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'end',
                                }}>
                                <Typography>Số lượng</Typography>
                              </Grid>
                              <Grid
                                item
                                xs={5}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Typography>Thành Tiền</Typography>
                              </Grid>
                            </Grid>

                            <IconButton size='small' onClick={handleDeleteAll}>
                              {/* <DeleteIcon /> */}
                            </IconButton>
                          </Grid>
                        )}
                      </Grid>
                    </Card>

                    {/* Cart List  */}
                    <Box
                      sx={{
                        marginTop: 2,
                      }}>
                      {isEmpty(cartList) && (
                        <Box
                          sx={{
                            textAlign: 'center',
                            background: '#fff',
                            padding: 2,
                          }}>
                          <Typography>
                            Giỏ hàng đang trống, hãy đến trang chủ để lựa chọn
                            các sản phẩm với giá cực hấp dẫn nhé
                          </Typography>
                          <Button
                            onClick={() => push('/')}
                            sx={{ color: '#87B44B' }}>
                            Đến trang chủ
                          </Button>
                        </Box>
                      )}
                      <Card
                        sx={{
                          padding: {
                            sm: '24px 16px',
                            xs: '24px 8px',
                          },
                        }}>
                        <Stack gap={2}>
                          {cartList.map((item, idx) => (
                            <Box key={item.id}>
                              <ProductCartItem
                                {...item}
                                variants={item?.variants}
                                onClick={handleProductToggle}
                                selectedProducts={selectedProducts}
                              />
                              {idx < cartList?.length - 1 && (
                                <Divider sx={{ my: 2 }} />
                              )}
                            </Box>
                          ))}
                        </Stack>
                      </Card>
                    </Box>
                  </Box>
                </Grid>

                {/* CHECKOUT FORM */}
                <Grid item md={4} xs={12}>
                  <Stack gap={2}>
                    {/* ADDRESS */}
                    <Card sx={{ padding: 3 }}>
                      <FlexBetween mb={2}>
                        <Typography
                          sx={{
                            color: '#232C35',
                            fontSize: '16px',
                            fontWeight: 400,
                          }}>
                          Giao tới
                        </Typography>

                        <Button
                          sx={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: '#6C903C',
                          }}
                          onClick={() => setOpenDialogAddress(true)}>
                          {!!infoUser ? 'Đổi địa chỉ' : 'Thêm địa chỉ'}
                        </Button>
                      </FlexBetween>
                      {infoUser?.addressResponse ? (
                        <Box>
                          <Box mb={1} sx={{ display: 'flex' }}>
                            <H6 fontSize={16} fontWeight={'700'}>
                              {infoUser?.addressResponse?.name} |{' '}
                              <Span>{infoUser?.addressResponse?.phone}</Span>
                            </H6>
                          </Box>

                          <Span>
                            {infoUser?.addressResponse?.display_address}
                          </Span>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: 'center', fontWeight: 600 }}>
                          Vui lòng thêm địa chỉ
                        </Box>
                      )}
                    </Card>

                    {/* PROMOTIONS */}
                    <Card
                      sx={{
                        padding: 3,
                        // backgroundColor: '#BFC3C7', opacity: 0.5
                      }}>
                      <FlexBetween mb={2} sx={{ gap: 2, alignItems: 'center' }}>
                        <Span color='#232C35'>Khuyến mãi</Span>

                        {responseComplete?.promotion ? (
                          <Button sx={{ color: '#6C903C', fontSize: 15 }}>
                            Đã áp dụng!
                          </Button>
                        ) : (
                          <Button
                            disabled={
                              !infoUser || selectedProducts.length === 0
                            }
                            variant='outlined'
                            sx={{
                              backgroundColor: '#F7D944',
                              borderColor: 'transparent',
                              borderRadius: '24px',
                              color: '#1A2129',
                              fontWeight: 500,
                              '&:disabled': {
                                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                              },
                            }}
                            onClick={handleVoucher}>
                            Áp dụng
                          </Button>
                        )}
                      </FlexBetween>
                      {
                        // discount > 0 && selectedProducts.length > 0

                        responseComplete?.promotion ? (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              height: 59,
                              border: '1px solid #E2E4E9',
                              borderRadius: '8px',
                            }}>
                            <Box
                              sx={{
                                backgroundColor: '#87B44B',
                                width: '35%',
                                display: 'flex',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px 0 0 8px',
                              }}>
                              <svg
                                width='27'
                                height='27'
                                viewBox='0 0 27 27'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path
                                  d='M23.0553 11.037V7.75922C23.0553 5.57404 21.9627 4.48145 19.7776 4.48145H6.66645C4.48126 4.48145 3.38867 5.57404 3.38867 7.75922V11.037C4.59052 11.037 5.57386 12.0203 5.57386 13.2222C5.57386 14.424 4.59052 15.4074 3.38867 15.4074V18.6851C3.38867 20.8703 4.48126 21.9629 6.66645 21.9629H19.7776C21.9627 21.9629 23.0553 20.8703 23.0553 18.6851V15.4074C21.8535 15.4074 20.8702 14.424 20.8702 13.2222C20.8702 12.0203 21.8535 11.037 23.0553 11.037ZM10.5015 9.39811H10.5124C11.1166 9.39811 11.605 9.88759 11.605 10.4907C11.605 11.0938 11.1166 11.5833 10.5124 11.5833C9.90929 11.5833 9.41434 11.0938 9.41434 10.4907C9.41434 9.88759 9.89835 9.39811 10.5015 9.39811ZM10.4905 16.7731C10.2807 16.7731 10.0709 16.6933 9.91142 16.5327C9.59129 16.2126 9.59129 15.6936 9.91142 15.3735L15.3744 9.91053C15.6945 9.5904 16.2135 9.5904 16.5337 9.91053C16.8538 10.2307 16.8538 10.7496 16.5337 11.0698L11.0707 16.5327C10.9101 16.6933 10.7003 16.7731 10.4905 16.7731ZM15.9754 17.0463C15.3722 17.0463 14.8773 16.5568 14.8773 15.9537C14.8773 15.3506 15.3613 14.8611 15.9644 14.8611H15.9754C16.5796 14.8611 17.068 15.3506 17.068 15.9537C17.068 16.5568 16.5785 17.0463 15.9754 17.0463Z'
                                  fill='white'
                                />
                              </svg>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                              }}>
                              <Typography
                                sx={{
                                  paddingLeft: 1,
                                  display: '-webkit-box',
                                  overflow: 'hidden',
                                  WebkitBoxOrient: 'vertical',
                                  WebkitLineClamp: 1,
                                }}>
                                {responseComplete.promotion?.value?.name}
                              </Typography>

                              <Button onClick={handleRemovePromotion}>
                                <svg
                                  width='24'
                                  height='25'
                                  viewBox='0 0 24 25'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'>
                                  <path
                                    d='M12 2.5C6.48 2.5 2 6.98 2 12.5C2 18.02 6.48 22.5 12 22.5C17.52 22.5 22 18.02 22 12.5C22 6.98 17.52 2.5 12 2.5ZM15.53 14.97C15.82 15.26 15.82 15.74 15.53 16.03C15.38 16.18 15.19 16.25 15 16.25C14.81 16.25 14.62 16.18 14.47 16.03L12 13.56L9.53 16.03C9.38 16.18 9.19 16.25 9 16.25C8.81 16.25 8.62 16.18 8.47 16.03C8.18 15.74 8.18 15.26 8.47 14.97L10.94 12.5L8.47 10.03C8.18 9.74003 8.18 9.25997 8.47 8.96997C8.76 8.67997 9.24 8.67997 9.53 8.96997L12 11.44L14.47 8.96997C14.76 8.67997 15.24 8.67997 15.53 8.96997C15.82 9.25997 15.82 9.74003 15.53 10.03L13.06 12.5L15.53 14.97Z'
                                    fill='#232C35'
                                  />
                                </svg>
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <TextField
                            disabled={
                              !infoUser || selectedProducts.length === 0
                            }
                            fullWidth
                            size='small'
                            label=''
                            variant='outlined'
                            placeholder='Nhập mã khuyến mãi'
                            sx={{ mb: 2 }}
                            value={valueInputPromotion}
                            onChange={(e) =>
                              setValueInputPromotion(e.target.value)
                            }
                          />
                        )
                      }
                    </Card>

                    {/* PRICE DETAIL */}
                    <Card sx={{ padding: 3 }}>
                      <Stack gap={1}>
                        <FlexBetween mb={2}>
                          <Span color='grey.600'>Tạm tính</Span>

                          <Span fontSize={16} fontWeight={400} lineHeight='1'>
                            {responseComplete ? (
                              <NumberFormat
                                value={responseComplete?.order?.item_total}
                              />
                            ) : (
                              <NumberFormat
                                value={getTotalPriceSelectedProducts()}
                              />
                            )}
                          </Span>
                        </FlexBetween>

                        <FlexBetween mb={2}>
                          <Span color='grey.600'>Giảm giá</Span>

                          <Span
                            fontSize={16}
                            fontWeight={400}
                            lineHeight='1'
                            color={'#4E97FD'}>
                            {responseComplete ? (
                              <NumberFormat
                                value={responseComplete?.order?.promo_total}
                              />
                            ) : (
                              <NumberFormat value={0} />
                            )}
                          </Span>
                        </FlexBetween>

                        <FlexBetween mb={2}>
                          <Span color='grey.600'>Phí vận chuyển</Span>

                          {responseLockCart?.shipping_methods[0]
                            ?.shipping_method_name ===
                            shipping_method_name.fee_company ||
                          responseLockCart?.shipping_methods[0]
                            ?.shipping_method_name ===
                            shipping_method_name.fee_weight ? (
                            <Span
                              fontSize={14}
                              fontWeight={400}
                              lineHeight='1'
                              textAlign={'end'}>
                              {
                                responseLockCart?.shipping_methods[0]
                                  ?.shipping_method_name
                              }
                            </Span>
                          ) : (
                            <Span fontSize={16} fontWeight={400} lineHeight='1'>
                              {responseComplete ? (
                                <NumberFormat
                                  value={
                                    responseComplete?.order?.shipment_total
                                  }
                                />
                              ) : (
                                <NumberFormat value={0} />
                              )}
                            </Span>
                          )}
                        </FlexBetween>

                        <FlexBetween mt={1} mb={2}>
                          <Box>
                            <Span color='grey.600'>Tổng tiền:</Span>
                          </Box>

                          <Stack alignItems={'end'} gap={0.5}>
                            <Span
                              fontSize={24}
                              fontWeight={700}
                              lineHeight='1'
                              color={'#6C903C'}>
                              {responseComplete ? (
                                <NumberFormat
                                  value={Number(responseComplete?.order?.total)}
                                />
                              ) : (
                                <NumberFormat value={getTotalPrice() || 0} />
                              )}
                            </Span>
                            <Typography
                              sx={{
                                fontSize: '12px',
                                color: '#5E6B74',
                              }}>
                              (Đã bao gồm VAT nếu có)
                            </Typography>
                          </Stack>
                        </FlexBetween>
                      </Stack>
                    </Card>

                    <LoadingButton
                      fullWidth
                      color='primary'
                      LinkComponent={Link}
                      loading={isLoading}
                      disabled={!selectedProducts.length}
                      onClick={submitOrder}
                      sx={{ borderRadius: { sm: '32px', xs: '8px' } }}>
                      Mua hàng ({selectedProducts.length})
                    </LoadingButton>
                  </Stack>
                </Grid>

                <AddressFormDialog
                  openDialog={openDialogAddress}
                  handleCloseDialog={() => setOpenDialogAddress(false)}
                />
              </Grid>
            </Stack>
          </Container>
        </Box>
      </CheckoutNavLayout>
    </NonSSRComponent>
  );
};

export default Cart;

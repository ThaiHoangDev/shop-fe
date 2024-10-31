import { FC, useEffect, useState } from 'react';
import { Add, Remove } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Grid, Stack } from '@mui/material';
import { H1, H2, H3, H5, H6 } from 'components/Typography';
import { useAppContext } from 'contexts/AppContext';
import { FlexBox } from '../../components/flex-box';
import Product from 'models/Product.model';
import { isEmpty } from 'lodash';
import NumberFormat from '@/components/number-format';
import Image from 'next/image';

// ================================================================
type ProductIntroProps = { product: Product };
// ================================================================

const ProductIntro: FC<ProductIntroProps> = ({ product }) => {
  const { id, name, slug, price, variants, has_variants, master } = product;

  const { state, dispatch } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantItem, setSelectedVariantItem] = useState(
    product?.variants[0]
  );

  const [selectVariants, setSelectVariants] = useState({
    option: 'option 1',
    type: has_variants ? variants[0]?.options_text : '',
    id: has_variants ? variants[0].id : master.id,
  });

  useEffect(() => {
    setSelectVariants({
      option: 'option 1',
      type: has_variants ? variants[0]?.options_text : '',
      id: has_variants ? variants[0].id : master.id,
    });
  }, [has_variants, master.id, variants]);

  // HANDLE CHAMGE TYPE AND OPTIONS
  // const handleChangeVariant = (variantName: string, value: string) => () => {
  //   setSelectVariants((state) => ({
  //     ...state,
  //     [variantName.toLowerCase()]: value,
  //   }));
  // };

  // CHECK PRODUCT EXIST OR NOT IN THE CART

  const cartItem = state.cart.find((item) => item.id === id);

  // const checkCart = () => {
  //   if (isEmpty(cartItem)) {
  //     return false;
  //   } else {
  //   }
  // };

  // HANDLE SELECT IMAGE
  const handleImageClick = (index: number) => setSelectedImage(index);

  // HANDLE CHANGE CART
  const handleCartAmountChange = (amount: number) => () => {
    dispatch({
      type: 'CHANGE_CART_AMOUNT',
      payload: {
        price: has_variants
          ? variants.find((e) => e.id === selectVariants.id)?.price
          : price,
        qty: amount,
        name: name,
        imgUrl: has_variants
          ? variants[0]?.images[0]?.small_url
          : master.images[0].small_url,
        id,
        slug,
        variant_id: selectVariants.id,
        variants: has_variants ? variants : [],
      },
    });
  };

  const handleTypeProduct = (e: any) => {
    setSelectedVariantItem(e);
    setSelectVariants({
      option: '',
      type: e.options_text,
      id: e.id,
    });
  };

  return (
    <Box width='100%'>
      <Grid container spacing={3} justifyContent='space-around'>
        <Grid item sm={6} xs={12} alignItems='center'>
          <Stack
            justifyContent='flex-start'
            gap={2}
            direction={{ xs: 'column-reverse', sm: 'row' }}>
            <Stack
              gap={1}
              direction={{ xs: 'row', sm: 'column' }}
              sx={(theme) => ({
                overflow: 'hidden',
                overflowY: 'scroll',
                maxHeight: { xs: '500px', md: 'auto' },
                [theme.breakpoints.down('md')]: {
                  overflowX: 'scroll',
                  overflowY: 'unset',
                },
              })}>
              {has_variants
                ? variants?.map((variant, idx) => {
                    return variant?.images?.map((img, indexImage) => {
                      return (
                        <Box
                          key={indexImage}
                          sx={{
                            width: { xs: 'auto', md: '100px' },
                            height: { xs: 'auto', md: '100px' },
                            maxHeight: { xs: '80px', sm: '100px' },
                            maxWidth: { xs: '80px', sm: '100px' },
                            cursor: 'pointer',
                            opacity: selectedImage === indexImage ? 1 : '0.2',
                          }}>
                          <Image
                            alt={name}
                            width={300}
                            height={300}
                            loading='eager'
                            src={img?.small_url}
                            style={{
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%',
                              borderRadius: '8px',
                            }}
                            onClick={() => {
                              handleImageClick(indexImage);
                              handleTypeProduct(variant);
                            }}
                          />
                        </Box>
                      );
                    });
                  })
                : master?.images.length > 0 &&
                  master?.images.map((url: any, ind: number) => (
                    <Box
                      key={ind}
                      onClick={() => handleImageClick(ind)}
                      sx={{
                        width: { xs: 'auto', md: '100px' },
                        height: { xs: 'auto', md: '100px' },
                        maxHeight: { xs: '80px', sm: '100px' },
                        maxWidth: { xs: '80px', sm: '100px' },
                        cursor: 'pointer',
                        mb: 2,
                        opacity: selectedImage === ind ? 1 : 0.6,
                        borderColor:
                          selectedImage === ind ? 'grey.400' : 'primary.main',
                      }}>
                      <Image
                        alt={name}
                        width={300}
                        height={300}
                        loading='eager'
                        src={url?.small_url}
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                          borderRadius: '8px',
                        }}
                      />
                    </Box>
                  ))}
            </Stack>
            <Box
              sx={{
                width: { md: 350, lg: 450 },
                height: { md: 350, lg: 450 },
              }}>
              <Image
                alt={name}
                width={300}
                height={300}
                loading='eager'
                src={
                  has_variants
                    ? selectedVariantItem?.images[selectedImage]?.large_url
                    : master?.images[selectedImage]?.large_url
                }
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  background: 'rgba(225, 236, 210, 1)',
                  borderRadius: '8px',
                }}
              />
            </Box>
          </Stack>
        </Grid>

        <Grid item sm={6} xs={12} alignItems='center'>
          <H1 mb={1} sx={{ fontSize: { xs: 24, md: 36 }, fontWeight: '700' }}>
            {name}
          </H1>
          <Box pt={1} mb={3}>
            <H2
              color='primary.main'
              mb={0.5}
              lineHeight='1'
              sx={{
                fontSize: { xs: 24, md: 36 },
                fontWeight: '700',
                color: '#6C903C',
              }}>
              <NumberFormat
                value={
                  has_variants
                    ? variants.find((e: any) => e.id == selectVariants?.id)
                        ?.price
                    : master?.price
                }
              />
            </H2>
          </Box>
          {has_variants && !isEmpty(variants) && (
            <Stack direction={'row'} alignItems={'center'} mb={2}>
              <H5>Chọn loại:</H5>
              <ButtonGroup sx={{ ml: 1 }}>
                {variants.map((e: any, ind: number) => (
                  <Button
                    key={ind}
                    onClick={() => {
                      handleTypeProduct(e);
                      handleImageClick(0);
                    }}
                    sx={{
                      borderRadius: '24px',
                      backgroundColor:
                        selectVariants.id === e.id ? '#FAE88F' : '#FDF6D5',
                    }}>
                    {e.options_text}
                  </Button>
                ))}
              </ButtonGroup>
            </Stack>
          )}

          {!cartItem?.qty ? (
            <Button
              color='primary'
              variant='contained'
              onClick={handleCartAmountChange(1)}
              sx={{
                mb: 4.5,
                px: '1.75rem',
                height: 40,
                borderRadius: '32px',
              }}>
              Thêm vào giỏ hàng
            </Button>
          ) : (
            <FlexBox alignItems='center' mb={4.5}>
              <Button
                size='small'
                sx={{ p: 1 }}
                variant='outlined'
                onClick={handleCartAmountChange(cartItem?.qty - 1)}>
                <Remove fontSize='small' />
              </Button>

              <H3 fontWeight='600' mx={2.5}>
                {cartItem?.qty.toString().padStart(2, '0')}
              </H3>

              <Button
                size='small'
                sx={{ p: 1 }}
                variant='outlined'
                onClick={handleCartAmountChange(cartItem?.qty + 1)}>
                <Add fontSize='small' />
              </Button>
            </FlexBox>
          )}

          <Box>
            <H5>Mô tả sản phẩm:</H5>
            <H6>
              {has_variants
                ? selectedVariantItem?.description ?? 'Chưa có mô tả'
                : master?.description ?? 'Chưa có mô tả'}
            </H6>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductIntro;

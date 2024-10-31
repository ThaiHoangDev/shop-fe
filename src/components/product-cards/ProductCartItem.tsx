import { FC, memo, useState } from 'react';
import Link from 'next/link';
import { Add, Remove } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Theme,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
import Image from 'components/BazaarImage';
import { Span } from 'components/Typography';
import { useAppContext } from 'contexts/AppContext';
import { SvgIcon, SvgIconProps } from '@mui/material';
import NumberFormat from '@/components/number-format';

// =========================================================
type ProductCartItemProps = {
  qty?: number;
  name?: string;
  slug?: string;
  price?: number;
  imgUrl?: string;
  id: string | number;
  onClick: (id: any) => void;
  selectedProducts?: any;
  variant_id: string | number;
  variants: any;
};
// =========================================================

const SelectStyled = styled(Select)(({ theme }) => ({
  borderRadius: '24px',
  height: 40,
  border: '0px',
  backgroundColor: '#EDF1F4',
  '.MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  [theme.breakpoints.down('sm')]: {},
}));

//Wrapper
const WrapperImage = styled(Image)(({ theme }) => ({
  width: '100px',
  height: '100px',
  minWidth: '100px',
  borderRadius: '8px',
  [theme.breakpoints.down('sm')]: {
    width: '70px',
    height: '70px',
    minWidth: '70px',
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

//Text
const ProductNameText = styled(Link)(({ theme }) => ({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  color: '#232C35',
  [theme.breakpoints.down('sm')]: {
    fontSize: 14,
  },
}));

export const DeleteIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M20.75 6C20.75 6.414 20.414 6.75 20 6.75H4C3.586 6.75 3.25 6.414 3.25 6C3.25 5.586 3.586 5.25 4 5.25H8.214C8.307 5.068 8.37899 4.862 8.45599 4.632L8.658 4.02499C8.862 3.41299 9.43499 3 10.081 3H13.919C14.565 3 15.138 3.41299 15.342 4.02499L15.544 4.632C15.621 4.862 15.693 5.068 15.786 5.25H20C20.414 5.25 20.75 5.586 20.75 6ZM18.56 7.75C18.733 7.75 18.871 7.89701 18.859 8.07001L18.19 18.2C18.08 19.78 17.25 21 15.19 21H8.81C6.75 21 5.92 19.78 5.81 18.2L5.141 8.07001C5.13 7.89701 5.267 7.75 5.44 7.75H18.56ZM10.75 11C10.75 10.59 10.41 10.25 10 10.25C9.59 10.25 9.25 10.59 9.25 11V16C9.25 16.41 9.59 16.75 10 16.75C10.41 16.75 10.75 16.41 10.75 16V11ZM14.75 11C14.75 10.59 14.41 10.25 14 10.25C13.59 10.25 13.25 10.59 13.25 11V16C13.25 16.41 13.59 16.75 14 16.75C14.41 16.75 14.75 16.41 14.75 16V11Z'
          fill='#232C35'
        />
      </svg>
    </SvgIcon>
  );
};

const ProductCartItem: FC<ProductCartItemProps> = ({
  id,
  name,
  qty,
  price,
  imgUrl,
  slug,
  onClick,
  selectedProducts,
  variant_id,
  variants,
  ...rest
}) => {
  const { dispatch } = useAppContext();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const [selectedVariant, setSelectedVariant] = useState({
    option:
      !!variants && variants.length > 0
        ? variants.find((e: any) => e.id === variant_id).option_values[0].name
        : '',
    type:
      !!variants && variants.length > 0
        ? variants.find((e: any) => e.id === variant_id).options_text
        : '',
    id: variant_id,
    variant_item:
      !!variants && variants.length > 0
        ? variants.find((e: any) => e.id === variant_id)
        : null,
  });

  // handle change cart
  const handleCartAmountChange = (amount: number) => () => {
    dispatch({
      type: 'CHANGE_CART_AMOUNT',
      payload: {
        id,
        name,
        price,
        imgUrl,
        qty: amount,
        slug,
        variant_id: selectedVariant.id,
        variants: variants,
      },
    });
  };

  const handleChangeVariant = (event: any) => {
    const idVariant = event.target.value;

    const payload = {
      id,
      variant_id: idVariant,
      variants: variants,
    };
    dispatch({
      type: 'CHANGE_VARIANT_CART',
      payload: payload,
    });
    // handleChangeOption(idVariant, id);
    setSelectedVariant({
      option: variants?.find((item) => item.id === idVariant).option_values[0]
        .name,
      type: variants?.find((item) => item.id === idVariant).options_text,
      id: idVariant,
      variant_item: variants?.find((item) => item.id === idVariant),
    });
  };

  return (
    <Grid container spacing={{ sm: 2, xs: 1 }}>
      <Grid item xs={4.5} sm={3} lg={3}>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          gap={{ sm: 2, xs: 0.5 }}>
          {/* CheckBox */}
          <WrapperCheckbox
            defaultChecked={selectedProducts.some((e: any) => e === id)}
            onChange={() => onClick(id)}
            checked={selectedProducts.some((e: any) => e === id)}
          />

          {/* Image */}
          <WrapperImage
            src={selectedVariant?.variant_item?.images[0]?.small_url}
            alt='product'
          />
        </Stack>
      </Grid>

      <Grid item xs={6.5} sm={7} lg={7}>
        <Grid
          container
          sx={{ height: '100%', width: '100%' }}
          spacing={{ sm: 0, xs: 1 }}>
          <Grid item xs={12} sm={6}>
            {/* Name */}
            <ProductNameText href={`/product/${slug}-${id}?id=${id}`}>
              {selectedVariant?.variant_item?.name}
            </ProductNameText>

            {/* Variant */}
            {variants?.length ? (
              <SelectStyled
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                label=''
                value={+selectedVariant.id}
                onChange={handleChangeVariant}>
                {variants.map((e: any, ind: number) => (
                  <MenuItem value={e.id} key={ind}>
                    {e?.options_text}
                  </MenuItem>
                ))}
              </SelectStyled>
            ) : (
              <Box />
            )}
          </Grid>

          {/* Single  Price */}
          <Grid item xs={12} sm={3}>
            <Stack height={'100%'} justifyContent={'center'}>
              <Typography
                sx={(theme) => ({
                  fontWeight: 700,
                  span: {
                    whiteSpace: 'nowrap',
                  },
                  [theme.breakpoints.down('sm')]: { fontSize: '14px' },
                })}>
                <NumberFormat value={selectedVariant?.variant_item?.price} />
              </Typography>
            </Stack>
          </Grid>

          {/*  Button Quantity*/}
          <Grid item xs={12} sm={3}>
            <Stack
              alignItems={'center'}
              direction={'row'}
              justifyContent={{ xs: 'start', sm: 'center' }}
              gap={0.5}
              height={'100%'}>
              <Button
                sx={{ p: '5px' }}
                variant='outlined'
                disabled={qty === 1}
                onClick={handleCartAmountChange(qty - 1)}>
                <Remove fontSize='small' />
              </Button>

              <Span mx={0.5} fontWeight={600} fontSize={14}>
                {qty}
              </Span>
              <Button
                sx={{ p: '5px' }}
                variant='outlined'
                onClick={handleCartAmountChange(qty + 1)}>
                <Add fontSize='small' />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={1} sm={2} lg={2}>
        <Stack
          direction={'row'}
          alignContent={'center'}
          justifyContent={'center'}
          height={'100%'}>
          {/* Final Price */}
          {!isMobile && (
            <Typography
              fontWeight={700}
              fontSize={'16px'}
              color={'#6C903C'}
              whiteSpace='nowrap'
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
              })}>
              <NumberFormat
                value={Number(selectedVariant?.variant_item?.price) * qty}
              />
            </Typography>
          )}
          {/* Delete Item */}
          <IconButton size='small' onClick={handleCartAmountChange(0)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default memo(ProductCartItem);

import { NextPage } from 'next';
import { Box, Button, Card, Divider, Stack, styled } from '@mui/material';
import SEO from 'components/SEO';
import CheckoutNavLayout from 'components/layouts/CheckoutNavLayout';
import { FlexBetween, FlexBox } from '@/components/flex-box';
import { H5, H6, Span } from '@/components/Typography';
import { useSelector } from '@/store/store';
import LazyImage from '@/components/LazyImage';
import { isEmpty } from 'lodash';
import NumberFormat from '@/components/number-format';
import { useRouter } from 'next/router';

const ButtonBackHome = styled(Button)(({ theme }) => ({
  padding: '5px 30px',
  whiteSpace: 'nowrap',

  width: 'fit-content',
  [theme.breakpoints.down('sm')]: {
    borderRadius: '8px',
  },
}));

const Checkout: NextPage = () => {
  const { infoUser } = useSelector((state) => state.home);
  const { push } = useRouter();

  return (
    <CheckoutNavLayout>
      <SEO title='Xác nhận đơn hàng' />
      {!isEmpty(infoUser) && (
        <Stack gap={2} py={5}>
          <Card sx={{ maxWidth: 500, margin: 'auto' }}>
            <FlexBetween sx={{ backgroundColor: '#F7D944', p: 2 }}>
              <H6>Cảm ơn bạn đã ủng hộ!</H6>
              <Span>
                Mã đơn hàng: {infoUser?.responseComplete?.order?.number}
              </Span>
            </FlexBetween>
            <Box sx={{ p: 2 }}>
              <Span>Giao đến</Span>
              <H6>
                {infoUser?.addressResponse?.name} |{' '}
                {infoUser?.addressResponse?.phone}
              </H6>
              <Span>{infoUser?.addressResponse?.display_address}</Span>
            </Box>
            <Box sx={{ p: 2 }}>
              {infoUser?.productSelected?.map((item: any) => (
                <Box key={item.id} sx={{ mb: 2 }}>
                  <FlexBetween>
                    <FlexBox sx={{ maxWidth: '60%', width: '60%' }}>
                      <LazyImage
                        width={140}
                        height={140}
                        src={item.imgUrl}
                        alt={''}
                        sx={{
                          minWidth: '100px',
                          width: '100px',
                          height: '100px',
                          borderRadius: 2,
                          mr: 2,
                        }}
                      />
                      <Box>
                        <H6>{item.name}</H6>
                        <Span>
                          {
                            item.variants.find(
                              (variantItem: any) =>
                                variantItem.id === item.variant_id
                            )?.options_text
                          }
                        </Span>
                      </Box>
                    </FlexBox>

                    <Span>{item.qty}x</Span>
                    <H5>
                      <NumberFormat value={item.price} />
                    </H5>
                  </FlexBetween>
                </Box>
              ))}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ padding: 2 }}>
              <FlexBetween mb={2}>
                <Span color='grey.600'>Tạm tính</Span>

                <Span fontSize={18} fontWeight={600} lineHeight='1'>
                  <NumberFormat
                    value={infoUser?.responseComplete?.order?.item_total || 0}
                  />
                </Span>
              </FlexBetween>

              <FlexBetween mb={2}>
                <Span color='grey.600'>Giảm giá:</Span>

                <Span
                  fontSize={18}
                  fontWeight={600}
                  lineHeight='1'
                  color={'#4E97FD'}>
                  <NumberFormat
                    value={infoUser?.responseComplete?.order?.promo_total || 0}
                  />
                </Span>
              </FlexBetween>

              <FlexBetween mb={2}>
                <Span color='grey.600'>Phí vận chuyển</Span>

                <Span fontSize={18} fontWeight={600} lineHeight='1'>
                  <NumberFormat
                    value={
                      infoUser?.responseComplete?.order?.shipment_total || 0
                    }
                  />
                </Span>
              </FlexBetween>

              <FlexBetween mb={2}>
                <Span color='grey.600'>Tổng tiền:</Span>

                <Span
                  fontSize={24}
                  fontWeight={700}
                  lineHeight='1'
                  color={'#6C903C'}>
                  <NumberFormat
                    value={infoUser?.responseComplete?.order?.total || 0}
                  />
                </Span>
              </FlexBetween>
              <H6 sx={{ textAlign: 'right' }}>(Đã bao gồm VAT nếu có)</H6>
            </Box>
          </Card>
          <Stack alignItems={'center'}>
            <ButtonBackHome
              fullWidth={false}
              onClick={() => push('/')}
              color='primary'>
              Về trang chủ
            </ButtonBackHome>
          </Stack>
        </Stack>
      )}
    </CheckoutNavLayout>
  );
};

export default Checkout;

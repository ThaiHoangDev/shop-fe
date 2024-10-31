import { FC } from 'react';
import Link from 'next/link';
import { Box, Container, Grid, Stack, Typography, styled } from '@mui/material';
import Image from 'components/BazaarImage';
import { Paragraph } from 'components/Typography';
import { useSelector } from '@/store/store';
import FanPageFacebook from '@/utils/FacebookFanpage';

// styled component
const StyledLink = styled(Link)(({ theme }) => ({
  display: 'block',
  borderRadius: 4,
  cursor: 'pointer',
  position: 'relative',
  color: theme.palette.grey[500],
  '&:hover': { color: theme.palette.grey[100] },
}));

const ParagraphStyled = styled(Paragraph)(({ theme }) => ({
  fontSize: 16,
  fontWeight: '400',
  mt: 2,
}));
const Footer1: FC = () => {
  const { logoAndBanner } = useSelector((state) => state.home);

  return (
    <Box component={'footer'} bgcolor='rgba(108, 144, 60, 1)'>
      <Container sx={{ color: 'white' }}>
        <Box py={{ md: 10, xs: 5 }}>
          <Grid container spacing={5}>
            <Grid item lg={4} md={4} sm={4} xs={12}>
              <Link href='/'>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Image height={48} src={logoAndBanner?.logo} alt='logo' />
                  <Typography
                    sx={{ fontWeight: '700', fontSize: 16, padding: 1 }}>
                    ChuChu Shop
                  </Typography>
                </Box>
              </Link>

              <ParagraphStyled>
                Hotline:
                <a href='tel:+84979741010'> 0974 74 10 10</a>
              </ParagraphStyled>
              <ParagraphStyled>
                <a
                  href='https://maps.app.goo.gl/LQArqKYppb2wdGfo6'
                  target='_blank'>
                  Địa chỉ: 54/19A Đồng Đen, phường 14, quận Tân Bình, TP. HCM
                </a>
              </ParagraphStyled>
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={12}>
              <Box
                fontSize='18px'
                fontWeight='600'
                mb={1.5}
                lineHeight='1'
                color='white'>
                Truy cập nhanh
              </Box>

              <div>
                {aboutLinks.map((item, ind) => (
                  <StyledLink
                    href='/'
                    key={ind}
                    sx={{ color: '#fff', fontWeight: '400', fontSize: 16 }}>
                    {item}
                  </StyledLink>
                ))}
              </div>
            </Grid>

            <Grid item lg={4} md={4} sm={4} xs={12}>
              <Stack justifyContent={'center'} gap={2}>
                <Typography fontSize='18px' fontWeight='600'>
                  Theo dõi trang Facebook của chúng tôi
                </Typography>
                <FanPageFacebook />

                <Box
                  sx={{
                    a: { fontSize: 16 },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                  <Link
                    href={'https://www.facebook.com/ShopChuChu'}
                    target='_blank'>
                    https://www.facebook.com/ShopChuChu
                  </Link>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

const aboutLinks = ['Sản phẩm bán chạy', 'Sản phẩm mới ra mắt', 'Giỏ hàng'];

export default Footer1;

import { FC } from 'react';
import { Box, Grid, Stack, Typography, styled } from '@mui/material';
import appIcons from 'components/icons';
import { H4 } from 'components/Typography';
import Service from 'models/Service.model';

//Wrapper
const ServiceItem = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: '8px',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'start',
  padding: '24px',
  gap: '8px',

  [theme.breakpoints.down('md')]: {
    padding: '16px',
    gap: '4px',
  },

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    padding: '8px',
  },
}));

//Text
const TitleText = styled(H4)(({ theme }) => ({
  lineHeight: '1.3',
  fontSize: 20,
  fontWeight: 700,
  textAlign: 'start',

  [theme.breakpoints.down('md')]: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 12,
    whiteSpace: 'nowrap',
  },
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  color: '#7D879C',
  fontSize: 14,
  whiteSpace: 'nowrap',

  [theme.breakpoints.down('md')]: {
    fontSize: 14,
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: 10,
    whiteSpace: 'normal',
    height: '4ex',
  },
}));

// ===========================================================
// ===========================================================

const ServicesCard: FC = () => {
  const serviceList: Service[] = [
    {
      icon: 'BoxSvg',
      title: 'Hàng hoá',
      description: 'Luôn luôn tươi ngon',
      id: '1',
    },
    {
      icon: 'Truck2',
      title: 'Giao hàng',
      description: 'Nhanh chóng, tiết kiệm',
      id: '2',
    },
    {
      icon: 'UserGroup',
      title: 'Tư vấn',
      description: 'Chu đáo, tận tâm',
      id: '3',
    },
    {
      icon: 'Burger',
      title: 'Thực phẩm',
      description: 'Vệ sinh, an toàn',
      id: '4',
    },
  ];
  return (
    <Box sx={{ padding: { sm: '30px 0 60px', xs: '0 0 30px 0' } }}>
      <Grid container spacing={{ sm: 2, xs: 1 }}>
        {serviceList.map((item) => {
          const Icon = appIcons[item.icon];

          return (
            <Grid key={item.id} item xs={6} md={3}>
              <ServiceItem>
                <Icon sx={{ fontSize: { md: 50, sm: 40, xs: 20 } }} />
                <Box>
                  <TitleText>{item.title}</TitleText>
                  <DescriptionText>{item.description}</DescriptionText>
                </Box>
              </ServiceItem>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ServicesCard;

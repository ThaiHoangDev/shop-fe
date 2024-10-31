import { FC } from 'react';
import { Box, styled } from '@mui/material';
import Carousel from 'components/carousel/Carousel';
import { MainCarouselItem } from 'models/Market-2.model';
import Image from 'next/image';

const WrapperImage = styled(Image)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  [theme.breakpoints.down('sm')]: {
    minHeight: '190px',
  },
}));
// ======================================================
type Props = { carouselData: MainCarouselItem[] };
// ======================================================

const PromotionBanner: FC<Props> = ({ carouselData }) => {
  return (
    <Box>
      <Carousel
        visibleSlides={1}
        totalSlides={carouselData.length}
        showArrow={true}
        infinite>
        {carouselData.map((item, index) => (
          <Box key={index}>
            <WrapperImage
              width={0}
              height={0}
              sizes='100vw'
              src={item.normal_size_url}
              alt='category'
            />
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default PromotionBanner;

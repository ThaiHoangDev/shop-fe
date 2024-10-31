import { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Theme,
  styled,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useSelector } from '@/store/store';
import useWindowSize from '@/hooks/useWindowSize';

import Fire from '@/components/icons/Fire';
import Carousel from '@/components/carousel/Carousel';
import { H3 } from 'components/Typography';

const ButtonMore = styled(Button)(({ theme }) => ({
  padding: '5px 10px',
  whiteSpace: 'nowrap',

  [theme.breakpoints.down('sm')]: {
    borderRadius: '8px',
  },
}));

// ===========================================================

const ItemCategoryWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&:hover': {
    cursor: 'pointer',
    div: {
      color: theme.palette.common.white,
      backgroundColor: '#87B44B',
    },
  },
}));

const ButtonAbsolute = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '65%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,50%)',

  backgroundColor: '#fff',
  borderRadius: '36px',
  textAlign: 'center',

  padding: '5px',

  [theme.breakpoints.down('md')]: {
    transform: 'translate(-50%,0)',
  },
}));
const NoteworthyCategory: FC = () => {
  const width = useWindowSize();
  const [visibleSlides, setVisibleSlides] = useState(2);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const { push } = useRouter();

  const { categoriesBest } = useSelector((state) => state.home);

  useEffect(() => {
    if (width < 426) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 1024) setVisibleSlides(3);
    else if (width < 1200) setVisibleSlides(3);
    else setVisibleSlides(3);
  }, [width]);

  return (
    <Stack gap={{ xs: 1, sm: 2 }}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Fire sx={{ mr: 1 }} />
          <H3>Danh mục đáng chú ý</H3>
        </Box>
        {!isMobile && (
          <ButtonMore color='primary' fullWidth={false} href={'/category/all'}>
            Tất cả danh mục
          </ButtonMore>
        )}
      </Stack>

      <Carousel
        visibleSlides={visibleSlides}
        totalSlides={categoriesBest.length}
        showArrow={true}
        infinite
        autoPlay>
        {categoriesBest.map((item, index) => (
          <ItemCategoryWrapper
            key={index}
            onClick={() =>
              push({
                pathname: `/category`,
                query: `taxon=${item.permalink.split('/').pop()}`,
              })
            }>
            <Image
              width={100}
              height={100}
              sizes='100vw'
              style={{ width: '100%', height: '200px', borderRadius: '8px' }}
              src={item?.icon_url || '/assets/images/intro.png'}
              alt='category'
            />
            <ButtonAbsolute>{item.name}</ButtonAbsolute>
          </ItemCategoryWrapper>
        ))}
      </Carousel>

      {isMobile && (
        <ButtonMore color='primary' href={'/category/all'}>
          Tất cả danh mục
        </ButtonMore>
      )}
    </Stack>
  );
};

export default NoteworthyCategory;

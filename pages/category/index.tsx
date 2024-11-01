import { FC, useEffect } from 'react';
import { Container } from '@mui/material';
import { isEmpty } from 'lodash';
import dynamic from 'next/dynamic';

import { dispatch, useSelector } from '@/store/store';
import { getCategories } from '@/store/slices/homeSlice';

import ShopLayout1 from 'components/layouts/ShopLayout1';
import PromotionBanner from '@/pages-sections/promotion-banner';

import { mockDataBanner } from '../shop-home';

const FilterPage = dynamic(
  () =>
    import('@/pages-sections/filter-page/filter-by-taxon').then(
      (mod) => mod.default
    ),
  {
    ssr: false,
  }
);

// ===============================================================

// ===============================================================

const Index: FC = () => {
  const { logoAndBanner, categories } = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  if (isEmpty(categories)) {
    return <></>;
  }

  return (
    <ShopLayout1>
      <PromotionBanner carouselData={logoAndBanner?.banner ?? mockDataBanner} />

      <Container sx={{ my: 4 }}>
        <FilterPage />
      </Container>
    </ShopLayout1>
  );
};

export default Index;

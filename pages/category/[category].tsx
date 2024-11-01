import { FC, useEffect } from 'react';

import { Container } from '@mui/material';
import ShopLayout1 from 'components/layouts/ShopLayout1';

import { dispatch, useSelector } from '@/store/store';
import { getCategories } from '@/store/slices/homeSlice';

import { mockDataBanner } from '../shop-home';
import { isEmpty } from 'lodash';
import PromotionBanner from '@/pages-sections/promotion-banner';
import FilterByTaxon from '@/pages-sections/filter-page/filter-by-taxon';

// ===============================================================

// ===============================================================

const ProductByCategory: FC = () => {
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
        <FilterByTaxon />
      </Container>
    </ShopLayout1>
  );
};

export default ProductByCategory;

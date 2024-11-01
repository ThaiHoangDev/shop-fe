import { Box, Container, Stack } from "@mui/material";
import SEO from "components/SEO";
import ShopLayout1 from "components/layouts/ShopLayout1";
import { MainCarouselItem } from "models/Market-2.model";
import { useEffect } from "react";
import { multiActionCreator } from "@/store/slices/homeSlice";
import { dispatch, useSelector } from "@/store/store";
import PromotionBanner from "@/pages-sections/promotion-banner";
import ServicesCard from "@/pages-sections/services-card";
import BestSellerProduct from "@/pages-sections/best-seller-product";
import NoteworthyCategory from "@/pages-sections/noteworthy-category";
import NewProductLaunched from "@/pages-sections/new-products";
import ProductAndCategory from "@/pages-sections/product-and-category";
import ButtonChatContact from "@/components/button-chat-contact";
import NonSSRWrapper from "@/components/NonSSRComponent";
import ShopLayout2 from "@/components/layouts/ShopLayout2";
import Section1 from "@/pages-sections/fashion-shop-1/Section1";
import Section2 from "@/pages-sections/fashion-shop-1/Section2";
import Section3 from "@/pages-sections/fashion-shop-1/Section3";
import Section4 from "@/pages-sections/fashion-shop-1/Section4";
import Section5 from "@/pages-sections/fashion-shop-1/Section5";
// import dynamic from 'next/dynamic';

// =======================================================
// =======================================================

export const mockDataBanner: MainCarouselItem[] = [
  {
    normal_size_url: "/assets/images/intro.png",
  },
];

const Market = () => {
  const {
    categories,
    logoAndBanner,
    flashDeals,
    newArrivals,
    dealOfTheWeekList,
    hotDealList,
  } = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(multiActionCreator());
  }, []);

  return (
    <ShopLayout2>
      <SEO title="Trang chủ" />

      <NonSSRWrapper>
        <Box sx={{ backgroundColor: "rgba(254, 252, 241, 1)" }}>
          {/* HERO SLIDER AND GRID */}
          {/* <PromotionBanner
            carouselData={logoAndBanner?.banners ?? mockDataBanner}
          /> */}

          <ButtonChatContact />

          <Container>
            <Stack gap={{ lg: 10, xs: 5 }} mt={2} pb={5}>
              {/* SERVICE CARDS */}
              {/* <ServicesCard /> */}

              {/* BEST SELLER */}
              {/* <BestSellerProduct /> */}

              {/* NOTEWORTHY CATEGORIES AND ANIMATED OFFER BANNER */}
              {/* <NoteworthyCategory /> */}

              {/* DEALS OF THE DAY AND OFFER BANNERS */}
              {/* <NewProductLaunched /> */}
              <Section1 />
              <Section2 flashDeals={flashDeals} />
              <Section3 newArrivals={newArrivals} />
              <Section4 dealOfTheWeek={dealOfTheWeekList} />
              <Section5 hotDealList={hotDealList} />

              {/* CATEGORY LIST SECTION */}
              {/* {categories?.length > 0 &&
                categories[0]?.categoryItem?.map((e, ind) => (
                  <Box key={ind}>
                    <ProductAndCategory category={e} />
                  </Box>
                ))} */}
            </Stack>
          </Container>
        </Box>
      </NonSSRWrapper>
    </ShopLayout2>
  );
};

export default Market;

import { FC, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Container, styled, Tab, Tabs } from "@mui/material";
import { H2, Span } from "components/Typography";
import ShopLayout1 from "components/layouts/ShopLayout1";
import ProductIntro from "pages-sections/product-details/ProductIntro";

import Product from "models/Product.model";
import api from "utils/__api__/products";
import { isEmpty } from "lodash";

// styled component
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  marginTop: 80,
  marginBottom: 24,
  borderBottom: `1px solid ${theme.palette.text.disabled}`,
  "& .inner-tab": {
    minHeight: 40,
    fontWeight: 600,
    textTransform: "capitalize",
  },
}));

// ===============================================================
type ProductDetailsProps = {
  product: Product;
  // relatedProducts: Product[];
  // frequentlyBought: Product[];
};
// ===============================================================

const ProductDetails: FC<ProductDetailsProps> = (props) => {
  // const { product } = props;

  const router = useRouter();
  const [product, setProduct] = useState<any>({});

  const getProduct = useCallback(async () => {
    try {
      const { query } = router;

      let slug = query?.slug;
      if (isEmpty(query)) {
        slug = window.location.pathname.split("/").pop();
      }
      const product = await api.getProduct(
        ((slug as string) || "").split("-").pop()
      );

      setProduct(product);
    } catch (error) {}
  }, [router]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  // Show a loading state when the fallback is rendered
  if (router.isFallback || isEmpty(product)) {
    return <Span>Loading...</Span>;
  }

  return (
    <ShopLayout1>
      <Container sx={{ my: 4 }}>
        {/* PRODUCT DETAILS INFO AREA */}
        <H2 sx={{ fontSize: 14, fontWeight: "700", py: 2 }}>
          {product && product?.classifications[0].taxon.pretty_name}
        </H2>
        {product ? <ProductIntro product={product} /> : <H2>Loading...</H2>}

        {/* PRODUCT DESCRIPTION AND REVIEW */}
        {/* <StyledTabs
          textColor="primary"
          value={selectedOption}
          indicatorColor="primary"
          onChange={handleOptionClick}
        >
          <Tab className="inner-tab" label="Description" />
          <Tab className="inner-tab" label="Review (3)" />
        </StyledTabs> */}

        {/* <Box mb={6}>
          {selectedOption === 0 && <ProductDescription />}
          {selectedOption === 1 && <ProductReview />}
        </Box> */}

        {/* {frequentlyBought && (
          <FrequentlyBought productsData={frequentlyBought} />
        )} */}

        {/* <AvailableShops /> */}

        {/* {relatedProducts && <RelatedProducts productsData={relatedProducts} />} */}
      </Container>
    </ShopLayout1>
  );
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths = [];

//   return {
//     paths: paths, //indicates that no page needs be created at build time
//     fallback: "blocking", //indicates the type of fallback
//   };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   // const relatedProducts = await getRelatedProducts();
//   // const frequentlyBought = await getFrequentlyBought();

//   const product = await api.getProduct(
//     ((params?.slug as string) || "").split("-").pop()
//   );

//   return { props: { product } };
// };

export default ProductDetails;

import { useEffect, useState, FC, useCallback } from "react";
import {
  Box,
  Button,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  Theme,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import useWindowSize from "hooks/useWindowSize";

import SideNavbar from "@/components/page-sidenav/SideNavbar";

import ProductItem from "@/components/product-cards/ProductItem";

import { useRouter } from "next/router";

import Donut from "@/components/icons/Donut";
import { getProductsByTaxonsApi } from "@/utils/__api__/products";
import { isEmpty } from "lodash";

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 600,
  [theme.breakpoints.down("sm")]: {
    fontSize: 18,
  },
}));

const ButtonMore = styled(Button)(({ theme }) => ({
  padding: "5px 10px",
  whiteSpace: "nowrap",

  marginTop: "16px",
  fontSize: 14,
  fontWeight: 600,
  [theme.breakpoints.down("sm")]: {
    fontSize: 14,
    borderRadius: "8px",
  },
}));
// ==========================================================
type Props = { category: any };
// ==========================================================

const ProductAndCategory: FC<Props> = ({ category }) => {
  const width = useWindowSize();
  const [_, setVisibleSlides] = useState(6);
  const { push, query } = useRouter();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const [page, setPage] = useState(1);

  const [productByCate, setProductByCate] = useState([]);
  const [currentCate, setCurrentCate] = useState(category.taxonomy_id);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const getProductByCate = useCallback(async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      let res = { products: [] };
      let params = [];

      if (currentCate === category.taxonomy_id) {
        category.taxons.map((e: any) => {
          params.push(`filter_by[taxon_ids][]=${e.id}`);
        });

        res = await getProductsByTaxonsApi(params.join("&"), 16, page);
      } else {
        res = await getProductsByTaxonsApi(
          [`filter_by[taxon_ids][]=${currentCate}`].join("&"),
          16,
          page
        );
      }
      const { products, ...rest } = res;
      setPagination({ ...rest });
      setProductByCate(res.products);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [category.taxonomy_id, category.taxons, currentCate, page]);

  const onChangePage = async (event: unknown, newPage: number) => {
    if (newPage <= pagination.pages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    if (width < 650) setVisibleSlides(2);
    else if (width < 800) setVisibleSlides(3);
    else if (width < 1024) setVisibleSlides(4);
    else setVisibleSlides(5);
  }, [width]);

  useEffect(() => {
    getProductByCate();
  }, [getProductByCate]);

  useEffect(() => {
    setCurrentCate(
      !isEmpty(query) && query?.category
        ? category.taxons?.find((e: any) => e.permalink === query?.category)?.id
        : category.taxonomy_id
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Donut sx={{ mr: 1 }} />
          <TitleText>{category?.name}</TitleText>
        </Box>
        {!isMobile && (
          <ButtonMore
            color="primary"
            disabled={productByCate.length >= pagination?.total_count}
            onClick={() => {
              push({
                pathname: `/category`,
                query: `category=${category.permalink.split("/").pop()}`,
              });
            }}
          >
            Xem thêm
          </ButtonMore>
        )}
      </Stack>

      <Grid container spacing={1}>
        <Grid item xs={12} md={2.5}>
          <Box className="sidenav">
            <SideNavbar
              currentCate={currentCate}
              categoryId={category.taxonomy_id}
              navList={category.taxons}
              handleSelect={(e) => {
                setCurrentCate(e?.id || category.id);
                setPage(1);
                push(`/?category=${e.href}`, undefined, { scroll: false });
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={9.5}>
          <Grid container spacing={1}>
            {isLoading ? (
              [...Array(16).keys()].map((item) => (
                <Grid key={item} item xs={6}>
                  <Skeleton
                    variant="rectangular"
                    height={100}
                    sx={{
                      borderRadius: 1,
                      flexShrink: 0,
                      background: (theme) => theme.palette.grey[200],
                    }}
                  />
                </Grid>
              ))
            ) : productByCate.length > 0 ? (
              productByCate.map((item) => (
                <Grid key={item.id} item xs={6} sm={3}>
                  <ProductItem product={item} />
                </Grid>
              ))
            ) : (
              <></>
            )}
          </Grid>

          {!isLoading && productByCate.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                width: "100%",
                height: "100%",
                fontSize: 24,
                fontWeight: "700",
              }}
            >
              Not Found!
            </Box>
          )}

          {pagination && pagination.pages > 1 && (
            <Stack alignItems={"center"} sx={{ marginTop: 2 }}>
              <Pagination
                count={pagination.pages}
                page={page}
                onChange={onChangePage}
              />
            </Stack>
          )}
        </Grid>
      </Grid>
      {isMobile && (
        <ButtonMore
          color="primary"
          fullWidth
          onClick={() => {
            push({
              pathname: `/category`,
              query: `category=${category.permalink.split("/").pop()}`,
            });
          }}
        >
          Xem thêm
        </ButtonMore>
      )}
    </>
  );
};

export default ProductAndCategory;

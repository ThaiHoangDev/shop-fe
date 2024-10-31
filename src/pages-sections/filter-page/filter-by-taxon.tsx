import { useEffect, useState, FC, useCallback, memo } from "react";
import {
  Box,
  Container,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import queryString from "query-string";
import { H3, Span } from "components/Typography";
import SideNavbar from "@/components/page-sidenav/SideNavbar";
import ProductItem from "@/components/product-cards/ProductItem";
import { useRouter } from "next/router";
import { useSelector } from "@/store/store";

import Donut from "@/components/icons/Donut";
import { getProductsByTaxonsApi } from "@/utils/__api__/products";
import { isEmpty } from "lodash";
import { Taxons } from "@/models/CategoryNavList.model";

const Per_page = 20;

const FilterByTaxons: FC = () => {
  const { query, replace } = useRouter();

  const { categories } = useSelector((state) => state.home);

  const [productByCate, setProductByCate] = useState([]);
  const [nav, setNav] = useState<Taxons[]>([]);
  const [listTaxons, setListTaxons] = useState([]);

  const [page, setPage] = useState(1);
  const [per_page, setRowsPerPage] = useState(Per_page);

  const [currentCate, setCurrentCate] = useState<any>();
  const [currentTabs, setCurrentTabs] = useState(
    query?.products === "new" ? 2 : 1
  );
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const [amount, setAmount] = useState({
    amount_gt: 0,
    amount_lt: 0,
  });

  const handleChangeTabs = useCallback(
    (newValue: any) => {
      setCurrentTabs(newValue);
      switch (newValue) {
        case 1:
          setListTaxons([...listTaxons, "filter_by[best_seller]=true"]);
          break;
        case 2:
          setListTaxons([
            ...listTaxons.filter((e) => e !== "filter_by[best_seller]=true"),
          ]);

          break;
        case 3:
          // console.log("777", productByCate);

          // let productsSortedDes = productByCate.sort(
          //   (a, b) => a.price - b.price
          // );
          // setProductByCate(productsSortedDes);
          setPage(1),
            setListTaxons([
              ...listTaxons.filter(
                (e) =>
                  e !== "sort_by[attribute]=prices&sort_by[direction]=desc" &&
                  e !== "filter_by[best_seller]=true"
              ),
              "sort_by[attribute]=prices&sort_by[direction]=asc",
            ]);
          break;
        case 4:
          // let productsSorted = productByCate.sort((a, b) => b.price - a.price);
          // setProductByCate(productsSorted);
          setPage(1),
            setListTaxons([
              ...listTaxons.filter(
                (e) =>
                  e !== "sort_by[attribute]=prices&sort_by[direction]=asc" &&
                  e !== "filter_by[best_seller]=true"
              ),
              "sort_by[attribute]=prices&sort_by[direction]=desc",
            ]);

          break;

        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productByCate]
  );

  const handleNavList = useCallback(() => {
    setNav(categories[0].categoryItem[0].taxons || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const getProductByCate = useCallback(async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      let res = { products: [] };
      const newParams = listTaxons;
      res = await getProductsByTaxonsApi(newParams.join("&"), Per_page, page);
      const { products, ...rest } = res;
      setPagination({ ...rest });
      if (currentTabs === 3) {
        let productsSortedDes = res.products.sort((a, b) => a.price - b.price);
        setProductByCate(productsSortedDes);
      } else if (currentTabs === 4) {
        let productsSorted = res.products.sort((a, b) => b.price - a.price);
        setProductByCate(productsSorted);
      } else setProductByCate(res.products);
    } catch (error) {
      console.log(error, "errr");
      setProductByCate([]);
      setPage(1);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listTaxons, page]);

  const onChangePage = async (event: unknown, newPage: number) => {
    if (newPage <= pagination.pages) {
      setPage(newPage);
    }
  };

  const onChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleListParams = useCallback(() => {
    if (categories.length > 0 && !!currentCate) {
      let params = [`filter_by[currency]=VND`];

      !!query.product &&
        params.push(
          // `q[name_cont]=${(query.product as string).split('-').join(' ')}` +
          `q[slug_cont]=${(query.product as string).split("-").join(" ")}`
        );

      // update taxon id
      if (categories[0].categoryItem[0].id === currentCate) {
        params.push(`filter_by[taxon_ids][]=${currentCate}`);
      } else {
        params.push(`filter_by[taxon_ids][]=${currentCate}`);
      }

      if (currentTabs === 1) {
        params.push("filter_by[best_seller]=true");
      }

      if (+amount.amount_gt > 0) {
        params.push(`filter_by[amount_gt]=${amount.amount_gt}`);
      }
      if (+amount.amount_lt > 0) {
        params.push(`filter_by[amount_lt]=${amount.amount_lt}`);
      }

      setListTaxons(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount.amount_gt, amount.amount_lt, currentCate, query.product]);

  useEffect(() => {
    handleListParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleListParams]);

  useEffect(() => {
    if (categories) {
      handleNavList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (categories && listTaxons.length > 0) {
      getProductByCate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProductByCate]);

  useEffect(() => {
    if (!isEmpty(query)) {
      setCurrentTabs(
        query?.products === "new"
          ? 2
          : query?.products === "best"
          ? 1
          : currentTabs
      );
    }
    setCurrentCate(
      !isEmpty(query) && query?.taxon
        ? categories[0]?.categoryItem[0]?.taxons.find(
            (e) => e.permalink.split("/").pop() === query?.taxon
          )?.id
        : categories[0].categoryItem[0].id
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  if (isEmpty(categories)) {
    return <Span>Loading...</Span>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Donut sx={{ mr: 1 }} />
        <H3 fontSize={20}>{"Tất cả sản phẩm"}</H3>
      </Box>

      <Grid container spacing={1}>
        <Grid item xs={12} md={2.5} sx={{ mt: 2 }}>
          <Box className="sidenav">
            <SideNavbar
              currentCate={currentCate}
              categoryId={categories[0].categoryItem[0].id}
              navList={nav}
              amount={amount}
              setAmount={(e) => {
                setAmount(e);
                setPage(1);
              }}
              handleSelect={(e) => {
                console.log(e, "mm");

                setCurrentCate(e?.id);
                setPage(1);

                const newQuery = {
                  ...query,
                  taxon: e.href.split("/").pop(),
                };

                replace(
                  {
                    pathname: `/category`,
                    ...(e.href !== "/" && {
                      query: queryString.stringify(newQuery),
                    }),
                  },
                  undefined,
                  {
                    scroll: false,
                  }
                );
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={9.5}>
          <TabFilter
            currentTabs={currentTabs}
            onChangeTabs={handleChangeTabs}
          />
          <br />
          <Grid container spacing={1}>
            {isLoading ? (
              [...Array(8).keys()].map((index) => (
                <Grid key={index} item xs={6} sm={3}>
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
              productByCate
                // .slice(page * Per_page, page * Per_page + Per_page)
                .map((e, index) => (
                  <Grid key={index} item xs={6} sm={3}>
                    <ProductItem product={e} key={e.id} />
                  </Grid>
                ))
            ) : (
              <></>
            )}
          </Grid>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
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
            <Box sx={{ flexGrow: 1 }} />

            {pagination && pagination.pages > 1 && (
              //   <TablePagination
              //     defaultValue={20}
              //     rowsPerPageOptions={[20]}
              //     component="div"
              //     count={panigation.total_count}
              //     rowsPerPage={Per_page}
              //     page={1}
              //     onPageChange={onChangePage}
              //     onRowsPerPageChange={onChangeRowsPerPage}
              //   />
              <Stack alignItems={"center"} sx={{ marginTop: 2 }}>
                <Pagination
                  count={pagination.pages}
                  page={page}
                  onChange={onChangePage}
                />
              </Stack>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(FilterByTaxons);

const TabList = [
  { name: "Bán chạy", id: 1 },
  { name: "Hàng mới", id: 2 },
  { name: "Giá Thấp Đến Cao", id: 3 },
  { name: "Giá Cao Đến Thấp", id: 4 },
];

const TabFilter = ({ currentTabs, onChangeTabs }: any) => {
  const handleChange = (e: any, newValue: any) => {
    onChangeTabs(newValue);
  };

  return (
    <Tabs
      value={currentTabs}
      onChange={handleChange}
      variant="scrollable"
      aria-label="basic tabs example"
      scrollButtons="auto"
      indicatorColor="primary"
      TabIndicatorProps={{
        style: { height: 2, backgroundColor: "#00AB55" },
      }}
    >
      {TabList.map((item, ind) => {
        return (
          <Tab
            value={item.id}
            label={item.name}
            key={ind}
            sx={{
              borderRadius: 2,
            }}
          />
        );
      })}
    </Tabs>
  );
};

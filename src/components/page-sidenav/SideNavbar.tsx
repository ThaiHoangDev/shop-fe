import { FC, memo, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Tab,
  Tabs,
  TextField,
  Theme,
  styled,
  useMediaQuery,
} from "@mui/material";

import Scrollbar from "components/Scrollbar";
import BazaarCard from "components/BazaarCard";
import { H3, H4, Span } from "components/Typography";

import { FlexBetween, FlexBox } from "components/flex-box";

import CategoryNavList, {
  CategoryItem,
  Taxons,
} from "models/CategoryNavList.model";
import { useRouter } from "next/router";

const NavbarRoot = styled(BazaarCard)<{
  isfixed: boolean;
  sidebarstyle: "style1" | "style2";
}>(({ isfixed, theme, sidebarstyle }) => ({
  height: "100%",
  boxShadow: "none",
  borderRadius: "8px",
  position: "relative",
  backgroundColor: "rgba(252, 243, 199, 1)",
  paddingTop: "8px",
  paddingBottom: "8px",
  overflow: isfixed ? "auto" : "unset",

  "& .linkList": { transition: "all 0.2s", padding: "8px 20px" },
  ...(sidebarstyle === "style2" && {
    height: "auto",
    paddingBottom: 10,
    backgroundColor: theme.palette.primary[50],
  }),
  [theme.breakpoints.down("md")]: {
    display: "flex",
  },
}));

const TabItem = styled(Tab)(({ theme }) => ({
  borderRadius: 2,
  transition: "ease-in .1s",
  ":hover": {
    transition: "ease-in .1s",
    backgroundColor: "rgba(248, 224, 105, 1)",
  },
  [theme.breakpoints.down("md")]: {},
}));
// ==================================================================
type SideNavbarProps = {
  currentCate?: string;
  categoryId?: string;
  isFixed?: boolean;
  navList: CategoryItem[] | CategoryNavList[] | Taxons[];
  lineStyle?: "dash" | "solid";
  sidebarHeight?: string | number;
  sidebarStyle?: "style1" | "style2";
  handleSelect?: (e: any) => void;
  amount?: {
    amount_gt: number;
    amount_lt: number;
  };
  setAmount?: (e: any) => void;
};
// ==================================================================

const SideNavbar: FC<SideNavbarProps> = (props) => {
  const {
    categoryId,
    isFixed,
    navList,

    sidebarStyle,
    sidebarHeight,
    currentCate,
    handleSelect = () => {},
    amount,
    setAmount,
  } = props;

  const { query, pathname } = useRouter();

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  if (isMobile) {
    return (
      <Tabs
        onChange={() => {}}
        variant="scrollable"
        aria-label="basic tabs example"
        scrollButtons="auto"
      >
        <TabItem
          value={"0"}
          label={"Tất cả"}
          onClick={() => {
            handleSelect({
              id: categoryId,
              href: "/",
            });
          }}
          sx={{
            backgroundColor:
              categoryId === currentCate
                ? "rgba(248, 224, 105, 1)"
                : "transparent",
          }}
        />
        {navList.map((item: any, ind: number) => {
          return (
            <TabItem
              value={item.name}
              label={item.name}
              key={ind}
              onClick={() => {
                handleSelect({
                  id: item.id,
                  href: item.permalink,
                });
              }}
              sx={{
                background:
                  query.category === item.permalink
                    ? "rgba(248, 224, 105, 1)"
                    : "transparent",
                backgroundColor:
                  currentCate === item.id
                    ? "rgba(248, 224, 105, 1)"
                    : "transparent",
              }}
            />
          );
        })}
      </Tabs>
    );
  }

  return (
    <Scrollbar autoHide={false} sx={{ maxHeight: sidebarHeight }}>
      <NavbarRoot isfixed={isFixed} sidebarstyle={sidebarStyle}>
        <Box
          onClick={() => {
            handleSelect({
              id: categoryId,
              href: "/",
            });
          }}
          sx={{
            marginX: 1,
            marginTop: 1,
            color: "grey.700",
            cursor: "pointer",
            backgroundColor:
              categoryId === currentCate
                ? "rgba(248, 224, 105, 1)"
                : "transparent",
            ":hover": {
              backgroundColor: "rgba(248, 224, 105, 1)",
            },
            borderRadius: 1,
          }}
        >
          <FlexBox gap={1.5} className="linkList" py={0.75}>
            <Span sx={{ fontSize: 16, fontWeight: "400" }}>Tất cả</Span>
          </FlexBox>
        </Box>
        {navList.map((item: any, ind: any) => {
          return (
            <Box
              key={ind}
              sx={{
                paddingX: 1,
                mt: 1,
              }}
            >
              <Box
                onClick={() => {
                  handleSelect({
                    id: item.id,
                    href: item?.permalink,
                  });
                }}
                sx={{
                  color: "grey.700",
                  cursor: "pointer",
                  backgroundColor:
                    currentCate === item.id
                      ? "rgba(248, 224, 105, 1)"
                      : "transparent",
                  transition: "ease-in .1s",
                  ":hover": {
                    transition: "ease-in .1s",
                    backgroundColor: "rgba(248, 224, 105, 1)",
                  },
                  borderRadius: 1,
                }}
              >
                <FlexBox gap={1.5} className="linkList" py={0.75}>
                  <Span
                    sx={{
                      fontSize: 16,
                      fontWeight: "400",
                      minWidth: "fit-content",
                    }}
                  >
                    {item.name}
                  </Span>
                </FlexBox>
              </Box>
            </Box>
          );
        })}

        {pathname.includes("category") && (
          <FilterComp amount={amount} setAmount={setAmount} />
        )}
      </NavbarRoot>
    </Scrollbar>
  );
};

SideNavbar.defaultProps = {
  lineStyle: "solid",
  sidebarHeight: "auto",
  sidebarStyle: "style1",
};

export default SideNavbar;

const COUNT = [
  { label: "Dưới 50.000", value: "0 - 50000", id: 1 },
  { label: "50.000 - 150.000", value: "50.000 - 150.000", id: 2 },
  { label: "151.000 - 450.000", value: "151.000 - 450.000", id: 3 },
  { label: "Trên 450.000", value: "450.000 - 0", id: 4 },
];

const FilterComp = ({ amount, setAmount }) => {
  const [state, setState] = useState({
    gilad: false,
    jason: false,
  });

  const [price, setPrice] = useState({
    price_gt: amount?.amount_gt || 0,
    price_lt: amount?.amount_lt || 0,
    id: null,
  });

  const handleChange = (newState: any) => () => {
    setState({
      ...state,
      ...newState,
    });
  };

  const handleSubmitPrice = () => {
    setAmount({
      amount_gt: price.price_gt,
      amount_lt: price.price_lt,
    });
  };

  const handlePrice = (e: any) => (id: any) => {
    setAmount({
      amount_gt: e.split("-")[0].split(".").join("").trim(),
      amount_lt: e.split("-")[1].split(".").join("").trim(),
    });
    setPrice({ price_gt: 0, price_lt: 0, id: id });
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* <H3 sx={{ fontSize: 18, fontWeight: "700" }}>Ưu đãi</H3>
      <FlexBetween>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.gilad}
              onChange={handleChange({ gilad: !state.gilad })}
              name="Sản phẩm bán chạy"
            />
          }
          label="Sản phẩm bán chạy"
        />
        <Box
          sx={{ backgroundColor: "#E84522", borderRadius: "24px", paddingX: 2 }}
        >
          <Span color={"#fff"} fontSize={12} fontWeight={"400"}>
            Hot
          </Span>
        </Box>
      </FlexBetween>
      <FlexBetween>
        <FormControlLabel
          control={
            <>
              <Checkbox
                checked={state.jason}
                onChange={handleChange({ jason: !state.jason })}
                name="Giảm sốc"
              />
            </>
          }
          label="Giảm sốc"
        />
        <Box
          sx={{ backgroundColor: "#14B339", borderRadius: "24px", paddingX: 2 }}
        >
          <Span color={"#fff"} fontSize={12} fontWeight={"400"}>
            Sale off
          </Span>
        </Box>
      </FlexBetween> */}

      <H3 sx={{ fontSize: 18, fontWeight: "700" }}>Giá</H3>
      <ButtonGroup sx={{ flexDirection: "column" }}>
        {COUNT.map((e) => (
          <Button
            key={e.label}
            onClick={() => handlePrice(e.value)(e.id)}
            sx={{
              backgroundColor: "#FBEB9D",
              borderRadius: "24px !important",
              borderColor: "transparent",
              mt: 1,
              opacity: e.id === price.id ? 1 : 0.6,
            }}
          >
            {e.label}
          </Button>
        ))}
      </ButtonGroup>
      <Box sx={{ my: 1 }}>
        <H4>Chọn khoảng giá</H4>
        <FlexBetween sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            value={price.price_gt}
            onChange={(e) => setPrice({ ...price, price_gt: e.target.value })}
            onBlur={handleSubmitPrice}
          />{" "}
          -{" "}
          <TextField
            variant="outlined"
            value={price.price_lt}
            onChange={(e) => setPrice({ ...price, price_lt: e.target.value })}
            onBlur={handleSubmitPrice}
          />
        </FlexBetween>
      </Box>
    </Box>
  );
};

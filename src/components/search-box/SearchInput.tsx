import Link from "next/link";
import {
  ChangeEvent,
  FC,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import queryString from "query-string";
import { Box, MenuItem, TextField } from "@mui/material";
import { SearchOutlinedIcon, SearchResultCard } from "./styled";
import api from "utils/__api__/products";
import { debounce } from "lodash";
import { useRouter } from "next/router";

const SearchInput: FC = () => {
  const parentRef = useRef();
  const { push, query } = useRouter();
  const [_, startTransition] = useTransition();
  const [resultList, setResultList] = useState<any>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!!query.product) {
      setValue((query?.product as string).trim().split("-").join(" ") || "");
    }
  }, [query.product]);

  const getProducts = async (searchText: string) => {
    const data = await api.searchProducts(searchText);
    setResultList(data?.variants);
  };

  const handleSearch = (e: string) => {
    startTransition(() => {
      const value = e;

      if (!value) setResultList([]);
      else getProducts(value);
    });
  };

  const handleDocumentClick = () => setResultList([]);

  const handleSearchDebounce = debounce(handleSearch, 1000);

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", null);
  }, []);

  const handleKeyUp = (event: any) => {
    if (event.key === "Enter") {
      let newParams: any = {
        ...query,
        ...(!!event.target?.value && {
          product: event.target?.value.split(" ").join("-"),
        }),
      };
      !!query?.taxon && delete newParams.taxon;
      !event.target?.value && delete newParams.product;
      const queryS = queryString.stringify(newParams);
      push({ pathname: "/category", query: queryS });
      setResultList([]);
    }
  };

  const handleChangeText = (e: any) => {
    console.log(e.target.value);
    const value = e.target.value;
    setValue(value);
    handleSearchDebounce(value);
  };

  return (
    <Box
      position="relative"
      flex="1 1 0"
      maxWidth="670px"
      mx="auto"
      {...{ ref: parentRef }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Nhập từ khoá sản phẩm "
        onChange={handleChangeText}
        type="text"
        onKeyUp={handleKeyUp}
        value={value}
        InputProps={{
          sx: {
            background: "#fff",
            height: 42,
            paddingRight: 0,
            borderRadius: 300,
            color: "grey.700",
            overflow: "hidden",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
          },
          endAdornment: <SearchOutlinedIcon fontSize="medium" />,
        }}
      />

      {resultList.length > 0 && (
        <SearchResultCard elevation={2} sx={{ overflow: "scroll" }}>
          {resultList.map((item: any) => (
            <Link
              href={{
                pathname: `/product/${item.slug}-${item.product_id}`,
                query: `id=${item.product_id}`,
              }}
              key={item}
            >
              <MenuItem key={item}>{item.name}</MenuItem>
            </Link>
          ))}
        </SearchResultCard>
      )}
    </Box>
  );
};

export default SearchInput;

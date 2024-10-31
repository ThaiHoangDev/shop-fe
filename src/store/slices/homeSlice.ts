import { createSlice } from '@reduxjs/toolkit';
// import omit from 'lodash/omit';
// utils
// import axios from '../../utils/axios';
import {
  getAllCategoryApi,
  getProductsApi,
  getProductsBestSellerApi,
  getProductsByTaxonsApi,
  getTaxonsBestAPi,
} from '../../../src/utils/__api__/products';
import  fashionShopService  from '../../../src/utils/__api__/fashion-shop';
// @types

//
import { AppDispatch, dispatch } from '../store';
import Product from '@/models/Product.model';
import Category from '@/models/Category.model';
import CategoryNavList from '@/models/CategoryNavList.model';
import { getLogoAndBannerApi } from '@/utils/__api__/dashboard';

type HomeState = {
  isLoading: boolean;
  error: string | null;
  products: Product[];
  product: Product | null;
  categories: CategoryNavList[];
  panigation: any;
  productsBest: any;
  categoriesBest: any;
  infoUser: any;
  logoAndBanner: any;
  addressInfo: any;
};

// ----------------------------------------------------------------------

const initialState: HomeState = {
  isLoading: false,
  error: null,
  products: [],
  product: {} as Product,
  categories: [],
  panigation: null,
  productsBest: [],
  categoriesBest: [],
  infoUser: null,
  logoAndBanner: null,
  addressInfo: null,
};

const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload.products;
      state.panigation = action.payload.panigation;
    },
    getProductDetailSuccess(state, action) {},

    getLogoAndBannerSuccess(state, action) {
      state.isLoading = false;
      state.logoAndBanner = action.payload;
    },

    getAllcategorySuccess(state, action) {
      state.isLoading = false;
      state.categories = action.payload;
    },
    getProductsBestSuccess(state, action) {
      state.isLoading = false;
      state.productsBest = action.payload;
    },
    getCategoryBestSuccess(state, action) {
      state.isLoading = false;
      state.categoriesBest = action.payload;
    },
    updateInfoUserSuccess(state, action) {
      state.infoUser = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

export const { actions } = slice;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function getLogoAndBanner() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const res = await getLogoAndBannerApi();
      dispatch(slice.actions.getLogoAndBannerSuccess({ ...res }));
      return res;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProducts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const res = await getProductsApi();
      const { products, ...rest } = res;
      dispatch(
        slice.actions.getProductsSuccess({
          products: products,
          panigation: { ...rest },
        })
      );
      return res;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getCategories() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const { taxonomies } = await getAllCategoryApi();
      const formatData = taxonomies.reduce(
        (arr: any, obj: any) => [
          ...arr,
          {
            root: { id: taxonomies.id, name: taxonomies.name },
            category: obj.root,
            categoryItem: obj.root.taxons,
          },
        ],
        []
      );
      dispatch(slice.actions.getAllcategorySuccess(formatData));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getProduct(userId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.getProductDetailSuccess([]));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getProductsBest() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const res = await getProductsBestSellerApi();

      dispatch(slice.actions.getProductsBestSuccess(res.products));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getFlashDeals() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const res = await fashionShopService.getFlashDealsApi();

      dispatch(slice.actions.getProductsBestSuccess(res));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getProductsByTaxons(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const res = await getProductsByTaxonsApi(id, 8);
      // dispatch(slice.actions.getProductsBestSuccess(res.products));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getCategoriesBestSell() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const res = await getTaxonsBestAPi();
      dispatch(
        slice.actions.getCategoryBestSuccess(
          res.taxons.filter((item) => item.id !== 55)
        )
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function defaultInfoUser(infoUser: any) {
  return async () => {
    try {
      dispatch(slice.actions.updateInfoUserSuccess(infoUser));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export const multiActionCreator = () => {
  return async (dispatch: AppDispatch) => {
    const actionPromises = [
      dispatch(getFlashDeals()),
      dispatch(getProducts()),
      dispatch(getCategories()),
      dispatch(getProductsBest()),
      dispatch(getCategoriesBestSell()),
    ];

    return (
      Promise.all(actionPromises)
        // .then((results) => {
        //   // Xử lý kết quả hoặc trả về một kết quả tổng hợp
        //   console.log(results);
        // })
        .catch((error) => {
          // Xử lý lỗi (nếu có)
          console.error(error);
        })
    );
  };
};

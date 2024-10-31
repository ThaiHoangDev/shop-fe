import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react';

// =================================================================================
type InitialState = { cart: CartItem[] };

export type CartItem = {
  qty?: number;
  name?: string;
  slug?: string;
  price?: number;
  imgUrl?: string;
  id: string | number;
  variant_id: string | number;
  variants: any;
};

type CartActionType = { type: 'CHANGE_CART_AMOUNT'; payload: CartItem };
type CartChangeVariantType = {
  type: 'CHANGE_VARIANT_CART';
  payload: CartItem;
};

type ActionType = CartActionType | CartChangeVariantType;

// =================================================================================

const INITIAL_CART = [];

const INITIAL_STATE = {
  cart:
    typeof window !== 'undefined' && window.localStorage.getItem('cart_local')
      ? (JSON.parse(window.localStorage.getItem('cart_local')).cart as any)
      : INITIAL_CART,
};

interface ContextProps {
  state: InitialState;
  dispatch: (args: ActionType) => void;
}

const AppContext = createContext<ContextProps>({
  state: INITIAL_STATE,
  dispatch: () => {},
});

const reducer = (state: InitialState, action: ActionType) => {
  switch (action.type) {
    case 'CHANGE_VARIANT_CART':
      let product = action.payload;
      let myCartList = state.cart;

      let indexCart = myCartList?.findIndex((item) => item?.id === product.id);
      myCartList[indexCart].variant_id = product.variant_id;

      return { ...state, cart: [...myCartList] };

    case 'CHANGE_CART_AMOUNT':
      let cartList = state.cart;
      let cartItem = action.payload;
      let exist = cartList.find((item) => item.id === cartItem.id);

      if (cartItem.qty < 1) {
        const filteredCart = cartList.filter((item) => item.id !== cartItem.id);
        typeof window !== 'undefined' &&
          window.localStorage.setItem(
            'cart_local',
            JSON.stringify({ cart: filteredCart })
          );
        return { ...state, cart: filteredCart };
      }

      // IF PRODUCT ALREADY EXITS IN CART
      if (exist) {
        const newCart = cartList.map((item) =>
          item.id === cartItem.id ? { ...item, qty: cartItem.qty } : item
        );
        typeof window !== 'undefined' &&
          window.localStorage.setItem(
            'cart_local',
            JSON.stringify({ cart: newCart })
          );
        return { ...state, cart: newCart };
      }

      typeof window !== 'undefined' &&
        window.localStorage.setItem(
          'cart_local',
          JSON.stringify({ cart: [...cartList, cartItem] })
        );

      return { ...state, cart: [...cartList, cartItem] };

    default: {
      return state;
    }
  }
};

// =======================================================
type AppProviderProps = { children: ReactNode };
// =======================================================

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => useContext<ContextProps>(AppContext);

export default AppContext;

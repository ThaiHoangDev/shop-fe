import { FC, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Grid } from '@mui/material';
import Stepper from 'components/Stepper';
import ShopLayout1 from './ShopLayout1';

/**
 *  Used:
 *  1. cart page
 *  2. checkout page
 *  3. payment page
 */

// ======================================================
type CheckoutNavLayoutProps = { children: ReactNode };
// ======================================================

const CheckoutNavLayout: FC<CheckoutNavLayoutProps> = ({ children }) => {
  const [selectedStep, setSelectedStep] = useState(0);

  const router = useRouter();
  const { pathname } = router;

  const handleStepChange = (step: number) => {
    switch (step) {
      case 0:
        router.push('/cart');
        break;
      case 1:
        router.push('/checkout');
        break;
      case 2:
        router.push('/payment');
        break;
      case 3:
        router.push('/orders');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (pathname) {
      case '/cart':
        setSelectedStep(1);
        break;
      case '/checkout':
        setSelectedStep(2);
        break;
      case '/payment':
        setSelectedStep(3);
        break;
      default:
        break;
    }
  }, [pathname]);

  return <ShopLayout1>{children}</ShopLayout1>;
};

const stepperList = [
  { title: 'Cart', disabled: false },
  { title: 'Details', disabled: false },
  { title: 'Payment', disabled: false },
  { title: 'Review', disabled: true },
];

export default CheckoutNavLayout;

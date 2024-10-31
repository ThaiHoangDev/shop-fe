import Link from 'next/link';
import { FC, Fragment, ReactElement, useEffect, useState } from 'react';
import { Badge, Box, Button, Dialog, Drawer, styled } from '@mui/material';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Clear } from '@mui/icons-material';
import clsx from 'clsx';
import Icon from 'components/icons';
import { layoutConstant } from 'utils/constants';
import { useAppContext } from 'contexts/AppContext';
import Image from 'components/BazaarImage';
import MiniCart from 'components/MiniCart';
// import Category from "components/icons/Category";
import MobileMenu from 'components/navbar/MobileMenu';
import { FlexBetween, FlexBox } from 'components/flex-box';
// import CategoryMenu from "components/categories/CategoryMenu";
import { dispatch, useSelector } from '@/store/store';
import { getLogoAndBanner } from '@/store/slices/homeSlice';
import ShoppingBag from '../icons/ShoppingBag';

// styled component
export const HeaderWrapper = styled(Box)(({ theme }) => ({
  zIndex: 3,
  position: 'relative',
  height: layoutConstant.headerHeight,
  transition: 'height 250ms ease-in-out',
  background: 'rgba(225, 236, 210, 1)',
  [theme.breakpoints.down('sm')]: {
    height: layoutConstant.mobileHeaderHeight,
  },
}));

const StyledContainer = styled(Container)({
  gap: 2,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

// ==============================================================
type HeaderProps = {
  isFixed?: boolean;
  className?: string;
  searchInput: ReactElement;
};
// ==============================================================

const Header: FC<HeaderProps> = ({ isFixed, className, searchInput }) => {
  const theme = useTheme();
  const { state } = useAppContext();
  const { logoAndBanner } = useSelector((state) => state.home);

  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const downMd = useMediaQuery(theme.breakpoints.down(1150));

  const toggleSideNav = () => setSideNavOpen(!sideNavOpen);
  const toggleSearchBar = () => setSearchBarOpen(!searchBarOpen);

  useEffect(() => {
    dispatch(getLogoAndBanner());
  }, []);
  // LOGIN AND MINICART DRAWER
  const DIALOG_DRAWER = (
    <Fragment>
      <Drawer
        open={sideNavOpen}
        anchor='right'
        onClose={toggleSideNav}
        sx={{ zIndex: 9999 }}>
        <MiniCart toggleSidenav={toggleSideNav} />
      </Drawer>
    </Fragment>
  );

  // FOR SMALLER DEVICE
  if (downMd) {
    const ICON_STYLE = { color: 'grey.600', fontSize: 20 };

    return (
      <HeaderWrapper className={clsx(className)}>
        <StyledContainer>
          <FlexBetween width='100%'>
            {/* LEFT CONTENT - NAVIGATION ICON BUTTON */}
            <Box flex={1}>
              <MobileMenu />
            </Box>

            {/* MIDDLE CONTENT - LOGO */}
            <Link href='/'>
              <Image height={44} src={logoAndBanner?.logo} alt='logo' />
            </Link>

            {/* RIGHT CONTENT - LOGIN, CART, SEARCH BUTTON */}
            <FlexBox justifyContent='end' flex={1}>
              <Box component={IconButton} onClick={toggleSearchBar}>
                <Icon.Search sx={ICON_STYLE} />
              </Box>

              {/* <Box component={IconButton} onClick={toggleDialog}>
                <Icon.User sx={ICON_STYLE} />
              </Box> */}

              <Box component={IconButton} onClick={toggleSideNav}>
                <Badge badgeContent={state.cart.length} color='primary'>
                  <Icon.CartBag sx={ICON_STYLE} />
                </Badge>
              </Box>
            </FlexBox>
          </FlexBetween>

          {/* SEARCH FORM DRAWER */}
          <Drawer
            open={searchBarOpen}
            anchor='top'
            onClose={toggleSearchBar}
            sx={{ zIndex: 9999 }}>
            <Box sx={{ width: 'auto', padding: 2, height: '100vh' }}>
              <FlexBox mb={1} justifyContent={'end'}>
                <IconButton onClick={toggleSearchBar}>
                  <Clear />
                </IconButton>
              </FlexBox>

              {/* CATEGORY BASED SEARCH FORM */}
              {searchInput}
            </Box>
          </Drawer>

          {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
          {DIALOG_DRAWER}
        </StyledContainer>
      </HeaderWrapper>
    );
  }

  return (
    <HeaderWrapper className={clsx(className)}>
      <StyledContainer>
        {/* LEFT CONTENT - LOGO AND CATEGORY */}
        <FlexBox mr={2} minWidth='170px' alignItems='center'>
          <Link href='/'>
            <Image height={44} src={logoAndBanner?.logo} alt='logo' />
          </Link>

          {/* SHOW DROP DOWN CATEGORY BUTTON WHEN HEADER FIXED */}
          {/* {isFixed && (
            <CategoryMenu>
              <FlexBox color="grey.600" alignItems="center" ml={2}>
                <Button color="inherit">
                  <Category fontSize="small" color="inherit" />
                  <KeyboardArrowDown fontSize="small" color="inherit" />
                </Button>
              </FlexBox>
            </CategoryMenu>
          )} */}
        </FlexBox>

        {/* SEARCH FORM */}
        <FlexBox justifyContent='center' flex='1 1 0'>
          {searchInput}
        </FlexBox>

        {/* LOGIN AND CART BUTTON */}
        <FlexBox gap={1.5} alignItems='center'>
          {/* <Box
            component={IconButton}
            p={1.25}
            bgcolor="grey.200"
            onClick={toggleDialog}
          >
            <PersonOutline />
          </Box> */}

          <Badge
            badgeContent={state.cart.length}
            color='primary'
            sx={{
              '& .MuiBadge-badge': {
                color: 'black',
                backgroundColor: 'white',
              },
            }}>
            <Button
              color='primary'
              component={IconButton}
              onClick={toggleSideNav}>
              <ShoppingBag />
            </Button>
          </Badge>
        </FlexBox>

        {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
        {DIALOG_DRAWER}
      </StyledContainer>
    </HeaderWrapper>
  );
};

export default Header;

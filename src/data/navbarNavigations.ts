// MAIN NAVIGATION DATA
const navbarNavigations = [
  {
    title: 'Trang chủ',
    megaMenu: false,
    megaMenuWithSub: false,
    url: '/',
  },

  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: 'Tất cả sản phẩm',
    url: '/category',
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: 'Mới ra mắt',
    url: '/category/all/?products=new',
  },

  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: 'Bán chạy',
    url: '/category/all?products=best',
  },

  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: 'Giỏ hàng',
    url: '/cart',
  },
];

export default navbarNavigations;

import { NextPage } from 'next';
import Box from '@mui/material/Box';

import dynamic from 'next/dynamic';

const MarketDynamic = dynamic(
  () => import('./chu-chu-shop').then((mod) => mod.default),
  {
    ssr: false,
  }
);

const IndexPage: NextPage = () => {
  return (
    <Box id='top' overflow='hidden' bgcolor='background.paper'>
      <MarketDynamic />
    </Box>
  );
};

export default IndexPage;

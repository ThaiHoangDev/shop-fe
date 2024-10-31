import { Theme, useMediaQuery } from '@mui/material';
import Script from 'next/script';
import { FC } from 'react';

const FanPageFacebook: FC<any> = () => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  return (
    <div>
      <div
        className='fb-page'
        data-href='https://www.facebook.com/ShopChuChu'
        data-tabs='timeline'
        data-width={isMobile ? '280' : '350'}
        data-height='130'
        data-small-header='false'
        data-adapt-container-width='true'
        data-hide-cover='false'
        data-show-facepile='true'>
        <blockquote
          cite='https://www.facebook.com/ShopChuChu'
          className='fb-xfbml-parse-ignore'>
          <a href='https://www.facebook.com/ShopChuChu'>Chuchu Shop</a>
        </blockquote>
      </div>

      <Script
        async
        defer
        strategy='lazyOnload'
        src='https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v18.0&appId=2002564683114281'
        crossOrigin='anonymous'
        nonce='sqxZ9oQP'
      />
    </div>
  );
};

export default FanPageFacebook;

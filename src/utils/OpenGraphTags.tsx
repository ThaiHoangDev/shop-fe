import React from 'react';

const OpenGraphTags: React.FC = () => {
  return (
    <React.Fragment>
      <meta
        property='og:title'
        content={'ChuChu Shop - 54/19A Đồng Đen - Hotline: 0974 74 10 10'}
      />
      <meta property='og:image' content='/assets/meta-image.jpg' />
      <meta property='og:image:width' content={'1200'} />
      <meta property='og:image:height' content={'630'} />
    </React.Fragment>
  );
};

export default OpenGraphTags;

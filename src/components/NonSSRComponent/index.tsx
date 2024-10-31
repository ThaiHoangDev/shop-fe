import dynamic from 'next/dynamic';
import React from 'react';
import LoadingScreen from '../LoadingScreen';

const NonSSRWrapper = (props) => (
  <React.Fragment>{props.children}</React.Fragment>
);

export default dynamic(() => Promise.resolve(NonSSRWrapper), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

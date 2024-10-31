import Script from 'next/script';
import { useEffect } from 'react';
const FacebookMessenger = () => {
  useEffect(() => {
    var chatbox = document.getElementById('fb-customer-chat');
    chatbox.setAttribute('page_id', '639329122765756');
    chatbox.setAttribute('attribution', 'biz_inbox');

    /// <reference types="facebook-js-sdk" />
    window.fbAsyncInit = function () {
      FB.init({
        xfbml: true,
        version: 'v18.0',
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  return (
    <>
      <div id='fb-root' />
      <div id='fb-customer-chat' className='fb-customerchat' />

      <Script
        async
        defer
        strategy='lazyOnload'
        src='https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js'
        crossOrigin='anonymous'
      />
    </>
  );
};

export default FacebookMessenger;

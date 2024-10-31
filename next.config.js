// const { i18n } = require("./next-i18next.config");

module.exports = {
  // i18n,
  devIndicators: {},
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
    currency: "VND",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  env: {
    HOST_API_KEY: process.env.HOST_API_KEY,
    FACEBOOK_CUSTOMER_SDK: process.env.FACEBOOK_CUSTOMER_SDK,
    FACEBOOK_PAGE_ID: process.env.FACEBOOK_PAGE_ID,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  },
};

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

// module.exports = withBundleAnalyzer({
//   i18n,
//   devIndicators: {},
//   publicRuntimeConfig: {
//     // Available on both server and client
//     theme: "DEFAULT",
//     currency: "USD",
//   },
// });

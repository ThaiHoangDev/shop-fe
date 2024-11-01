import { NextPage } from "next";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import SEO from "components/SEO";
import BazaarImage from "components/BazaarImage";
import { FlexBox, FlexRowCenter } from "components/flex-box";

const Error404: NextPage = () => {
  const router = useRouter();
  const handleGoBack = () => router.back();
  const handleGoHome = () => router.push("/");

  return (
    <FlexRowCenter px={2} minHeight="100vh" flexDirection="column">
      <SEO title="Không tìm thấy trang" />
      <BazaarImage
        src="/assets/images/illustrations/404.svg"
        sx={{ display: "block", maxWidth: 320, width: "100%", mb: 3 }}
      />

      <FlexBox flexWrap="wrap">
        <Button
          variant="outlined"
          color="primary"
          sx={{ m: 1 }}
          onClick={handleGoBack}
        >
          Quay lại
        </Button>

        <Button
          variant="contained"
          onClick={handleGoHome}
          color="primary"
          sx={{ m: 1 }}
        >
          Trở về trang chủ
        </Button>
      </FlexBox>
    </FlexRowCenter>
  );
};

export default Error404;

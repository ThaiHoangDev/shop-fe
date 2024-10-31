import { FC } from 'react';
import Head from 'next/head';

// ====================================================================
type SEOProps = {
  title: string;
  sitename?: string;
  description?: string;
};
// ====================================================================

const SEO: FC<SEOProps> = ({ title, description }) => {
  return (
    <Head>
      {title ? <title>{`${title} | ChuChu Shop`}</title> : null}

      {description ? <meta name='description' content={description} /> : null}
    </Head>
  );
};

export default SEO;

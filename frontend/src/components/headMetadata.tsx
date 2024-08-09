import Head from "next/head";
import { useRouter } from "next/router";

type HeadMetaDataProps = {
  pageTitle?: string;
};

const HeadMetaData = ({ pageTitle }: HeadMetaDataProps) => {
  const router = useRouter();
  const title = pageTitle ? `${pageTitle}` : "PNL.GREEN";
  const ogUrl = router.pathname ? `${router.pathname}` : "";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="pnl.green" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/PNL.GREEN.svg" />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content="pnl.green" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/PNL.GREEN.svg" />
      </Head>
    </>
  );
};

export default HeadMetaData;

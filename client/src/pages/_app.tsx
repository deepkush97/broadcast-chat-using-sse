import "../styles/global.css";
import Head from "next/head";

const Application = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>SSE Client</title>{" "}
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_PREFIX}/favicon.ico`}
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default Application;

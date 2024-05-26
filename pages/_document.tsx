import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Nameless Coin - First Dynamic Coin on Sui"
        />
        <meta name="keywords" content="Sui, Nameless Coin, Dynamic Coin" />
        <meta name="author" content="Nameless Team" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta
          property="og:title"
          content="Nameless Coin - First Dynamic Coin on Sui"
        />
        <meta
          property="og:description"
          content="Nameless Coin - First Dynamic Coin on Sui"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://namelesscoin.wtf" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

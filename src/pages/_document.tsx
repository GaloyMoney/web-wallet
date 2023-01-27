import { Html, Head, Main, NextScript } from "next/document"
import Script from "next/script"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/images/favicon-150x150.png" sizes="32x32" />
        <link rel="icon" href="/images/favicon-300x300.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/images/favicon-300x300.png" />
        <Script src="/vendor/gt.js" strategy="beforeInteractive" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

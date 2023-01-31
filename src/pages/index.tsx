import Head from "next/head"

import dynamic from "next/dynamic"
import { publicConfig } from "@/store"
const App = dynamic(() => import("@/components/index"), {
  ssr: false,
})

export default function Root() {
  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Galoy Web Wallet</title>
      </Head>
      <App />
    </>
  )
}

export async function getServerSideProps() {
  return { props: { publicConfig } }
}

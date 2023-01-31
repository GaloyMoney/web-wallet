import { TextDecoder, TextEncoder } from "util"

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

if (typeof window !== "undefined") {
  Object.defineProperty(window, "__NEXT_DATA__", {
    value: {
      props: { pageProps: {} },
    },
  })
}

import { trace } from "@opentelemetry/api"
import { ZoneContextManager } from "@opentelemetry/context-zone"
import { registerInstrumentations } from "@opentelemetry/instrumentation"
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions"
import { Resource } from "@opentelemetry/resources"
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web"
import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base"

const provider = new WebTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "galoy-web-wallet-profile",
  }),
})
const exporter = new OTLPTraceExporter({
  url: "https://api.honeycomb.io:443/v1/traces",
  headers: {
    "Content-Type": "application/json",
    "x-honeycomb-team": "CLov9kTZIbWamzaucsjvgC",
  },
  concurrencyLimit: 10,
})

provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()))
provider.addSpanProcessor(new BatchSpanProcessor(exporter))

trace.setGlobalTracerProvider(provider)
const name = "galoy-web-wallet"
const version = "0.1.0"
export const tracer = trace.getTracer(name, version)

const fetchInstrumentation = new FetchInstrumentation()
fetchInstrumentation.setTracerProvider(provider)

provider.register({
  contextManager: new ZoneContextManager(),
})

registerInstrumentations({
  instrumentations: [fetchInstrumentation],
})

export type TraceProviderProps = {
  children?: React.ReactNode
}

export default function TraceProvider({ children }: TraceProviderProps) {
  return <>{children}</>
}

import { trace } from "@opentelemetry/api"
import { ZoneContextManager } from "@opentelemetry/context-zone"
import { registerInstrumentations } from "@opentelemetry/instrumentation"
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch"
import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/tracing"
import { WebTracerProvider } from "@opentelemetry/web"

const provider = new WebTracerProvider({})

provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()))

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

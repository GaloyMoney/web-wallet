import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base"
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin"
import { Resource } from "@opentelemetry/resources"
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions"
import { W3CTraceContextPropagator } from "@opentelemetry/core"
import { propagation } from "@opentelemetry/api"
import { registerInstrumentations } from "@opentelemetry/instrumentation"
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch"
propagation.setGlobalPropagator(new W3CTraceContextPropagator())
const jaegerExporter = new ZipkinExporter({
  url: "localhost:6832",
})
registerInstrumentations({
  instrumentations: [new FetchInstrumentation()],
})
const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "galoy-dev-webwallet-browser",
  }),
})
provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter))
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
provider.register()

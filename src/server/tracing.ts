import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { Resource } from "@opentelemetry/resources"
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions"
import { propagation } from "@opentelemetry/api"
import { W3CTraceContextPropagator } from "@opentelemetry/core"
import { registerInstrumentations } from "@opentelemetry/instrumentation"
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http"
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"

propagation.setGlobalPropagator(new W3CTraceContextPropagator())

const otlpExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318",
})

const provider = new NodeTracerProvider({
  resource: Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]:
        process.env.TRACING_SERVICE_NAME || "galoy-dev",
    }),
  ),
})
provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter))
provider.register()

registerInstrumentations({
  instrumentations: [new HttpInstrumentation()],
})

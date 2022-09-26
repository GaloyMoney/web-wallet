import { trace, context, Span } from "@opentelemetry/api"

export const reportSpan = (span: Span) => {
  console.log("report span:", span)

  fetch("./send-trace", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(span),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error)
    })
}

export const withTracing = async (name: string, parentSpan: Span, cb?: () => void) => {
  const tracer = trace.getTracer("galoy-web-wallet")
  let span = trace.getSpan(context.active())

  if (parentSpan) {
    const ctx = trace.setSpan(context.active(), parentSpan)
    span = tracer.startSpan(name, undefined, ctx)
  } else {
    span = tracer.startSpan(name)
  }

  if (cb) {
    await cb()
  }

  span.end()

  reportSpan(span)
}

export const getTracer = () => {
  return trace.getTracer("galoy-web-wallet")
}

import { context, SpanKind, SpanStatusCode, trace } from "@opentelemetry/api"
import { SemanticAttributes } from "@opentelemetry/semantic-conventions"

type Attr = {
  key: string
  value: string
}

type TracingFields = {
  spanName: string
  attachSpan?: boolean
  fnName?: string
  attr?: Attr
  fn?: () => void
  fnArgs?: string[] | number[]
  exception?: string
}

export const recordTrace = async ({
  spanName,
  attachSpan,
  attr,
  fnName,
  fn,
  fnArgs,
  exception,
}: TracingFields) => {
  const functionName = fnName || fn?.name || "unknown"
  const tracer = trace.getTracer("galoy-web-wallet")
  const ctx = context.active()
  const currentSpan = trace.getSpan(ctx)

  tracer.startActiveSpan(spanName, { kind: SpanKind.CLIENT }, async (rootSpan) => {
    if (attachSpan && currentSpan) {
      // eslint-disable-next-line no-param-reassign
      rootSpan = currentSpan
    }
    rootSpan.setAttribute("pageUrlwindow", window.location.href)
    if (attr) {
      rootSpan.setAttribute(attr.key, attr.value)
    }
    try {
      if (fn) {
        rootSpan.setAttribute(SemanticAttributes.CODE_FUNCTION, functionName)
        if (fnArgs) {
          rootSpan.setAttribute("fn.arguments", fnArgs)
        }
        const resp = await Promise.resolve(fn())
        if ((resp as unknown) instanceof Error) {
          rootSpan.recordException(resp as unknown as Error)
          rootSpan.setStatus({
            code: SpanStatusCode.ERROR,
          })
        }
        rootSpan.setStatus({
          code: SpanStatusCode.OK,
        })
      }
      if (exception) {
        rootSpan.setStatus({
          code: SpanStatusCode.ERROR,
          message: exception,
        })
      }
    } catch (err) {
      rootSpan.recordException(err)
      rootSpan.setStatus({
        code: SpanStatusCode.ERROR,
        message: err.message,
      })
    }
    rootSpan.end()
  })
}

export const getTracer = () => {
  return trace.getTracer("galoy-web-wallet")
}

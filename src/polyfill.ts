/**
 * Polyfills functionalities missing from some web browsers.
 */
export function polyfill() {
  // AbortController.timeout
  if (!AbortSignal.timeout) {
    AbortSignal.timeout = (timeout: number) => {
      const controller = new AbortController()
      setTimeout(() => controller.abort(new DOMException('TimeoutError')), timeout)

      return controller.signal
    }
  }
}
/**
 * Polyfills functionalities missing from some web browsers.
 */
export function polyfill(): void {
  // Adds AbortController.timeout when it does not exist
  if (AbortSignal.timeout == null) {
    AbortSignal.timeout = (timeout: number): AbortSignal => {
      const controller = new AbortController()
      setTimeout(() => controller.abort(new DOMException('TimeoutError')), timeout)

      return controller.signal
    }
  }
}
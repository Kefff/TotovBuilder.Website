import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const applicationInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_APPLICATION_INSIGHTS_CONNECTION_STRING,
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
    enableUnhandledPromiseRejectionTracking: true
  }
})

// Adding a telemetry analyzer to ignore ResizeObserver exceptions
applicationInsights.addTelemetryInitializer((envelope) => {
  if (envelope.baseType === 'ExceptionData') {
    const exception = envelope.baseData?.exceptions[0]

    if (exception != null
      && exception.message != null
      && (exception.message as string).includes('ResizeObserver')) {
      return false
    }
  }

  return true
})

export function useApplicationInsights(): void {
  if (import.meta.env.VITE_APPLICATION_INSIGHTS_CONNECTION_STRING != null
    && import.meta.env.VITE_APPLICATION_INSIGHTS_CONNECTION_STRING != '') {
    applicationInsights.loadAppInsights()
  }
}

export default applicationInsights
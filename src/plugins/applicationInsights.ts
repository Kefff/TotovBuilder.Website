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
  const baseData = envelope.data?.baseData as Record<string, unknown>

  if (baseData?.exceptions != null) {
    const hasIgnoredException = ((baseData.exceptions as Record<string, unknown>[]).some(e => (e.message as string)?.includes('ResizeObserver')))

    return !hasIgnoredException
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
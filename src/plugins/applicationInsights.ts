import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const applicationInsights = new ApplicationInsights({
  config: {
    instrumentationKey: import.meta.env.VITE_APPLICATION_INSIGHTS_INSTRUMENTATION_KEY,
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
    enableUnhandledPromiseRejectionTracking: true
  }
})

export function useApplicationInsights(): void {
  applicationInsights.loadAppInsights()
}

export default applicationInsights
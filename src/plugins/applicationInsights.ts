import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const applicationInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_APPLICATION_INSIGHTS_CONNECTION_STRING,
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
    enableUnhandledPromiseRejectionTracking: true
  }
})

export function useApplicationInsights(): void {
  if (import.meta.env.VITE_APPLICATION_INSIGHTS_CONNECTION_STRING != null
    && import.meta.env.VITE_APPLICATION_INSIGHTS_CONNECTION_STRING != '') {
    applicationInsights.loadAppInsights()
  }
}

export default applicationInsights
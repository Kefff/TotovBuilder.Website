import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const applicationInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_APPLICATION_INSIGHTS_CONNECTION_STRING,
    enableAutoRouteTracking: false,
    enableCorsCorrelation: true,
    enableUnhandledPromiseRejectionTracking: true
  }
})

export function useApplicationInsights(): void {
  applicationInsights.loadAppInsights()
}

export default applicationInsights
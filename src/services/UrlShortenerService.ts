import { FetchService } from './FetchService'
import Services from './repository/Services'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'

/**
 * Represents a service for shortening URLs.
 */
export class UrlShortenerService {
  /**
   * Shortens a URL.
   * @param url - URL to shorten.
   */
  public async shortenAsync(url: string): Promise<string> {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    const fetchService = Services.get(FetchService)

    const data = new URLSearchParams()
    data.append('url', url)

    const response = await fetchService.fetchWithRetryAsync({
      body: data,
      endpoint: websiteConfigurationService.configuration.endpointUrlShortener,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      }
    })

    return (response as Record<string, string>)?.short_url
  }
}
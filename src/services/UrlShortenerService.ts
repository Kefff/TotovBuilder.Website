import { FetchService } from './FetchService'
import { LogService } from './LogService'
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
  public async shortenAsync(url: string): Promise<string | undefined> {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    const fetchService = Services.get(FetchService)

    const data = new URLSearchParams()
    data.append('url', url)

    const response = await fetchService.fetchAsync({
      body: data,
      endpoint: websiteConfigurationService.configuration.endpointUrlShortener,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      method: 'POST'
    })

    const shortenedUrl = (response as Record<string, string>)?.short_url

    if (shortenedUrl == null) {
      Services.get(LogService).logError('message.urlShorteningError', { url })

      return url
    }

    return shortenedUrl
  }
}
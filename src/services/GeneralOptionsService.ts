import applicationInsights from '../plugins/applicationInsights'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import Services from './repository/Services'

/**
 * Represents a service for managing general options.
 */
export class GeneralOptionsService {
  /**
   * Gets the allow cookies indicator.
   * @returns true if no cookie
   */
  public getAllowCookiesIndicator(): boolean {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    const storedValue = localStorage.getItem(websiteConfigurationService.configuration.allowCookiesStorageKey) ?? 'true'
    const allowCookies = JSON.parse(storedValue)

    return allowCookies
  }

  /**
   Sets the allow cookies indicator and deletes Application Insights cookies when disabling cookies.
 */
  public setAllowCookiesIndicator(allowCookies: boolean): void {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    localStorage.setItem(websiteConfigurationService.configuration.allowCookiesStorageKey, allowCookies.toString())

    if (!allowCookies) {
      applicationInsights.getCookieMgr().del('ai_session')
      applicationInsights.getCookieMgr().del('ai_user')
    }

    applicationInsights.getCookieMgr().setEnabled(allowCookies)
  }
}
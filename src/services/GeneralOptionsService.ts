import applicationInsights from '../plugins/applicationInsights'
import vueI18n from '../plugins/vueI18n'
import { NotificationService, NotificationType } from './NotificationService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import Services from './repository/Services'

/**
 * Represents a service for managing general options.
 */
export class GeneralOptionsService {
  /**
   * Indicates whether the allow cookies notifications has been displayed.
   */
  private hasDisplayedAllowCookiesNotification = false

  /**
   * Gets the allow cookies indicator.
   * @returns true if no cookie
   */
  public getAllowCookiesIndicator(): boolean {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    let allowCookies = true
    const storedValue = localStorage.getItem(websiteConfigurationService.configuration.allowCookiesStorageKey)

    if (storedValue != null) {
      allowCookies = JSON.parse(storedValue)
      this.setCookieUsage(allowCookies)
    } else if (!this.hasDisplayedAllowCookiesNotification) {
      // Displaying a notification asking whether the user allows to use cookies
      this.hasDisplayedAllowCookiesNotification = true

      Services.get(NotificationService).notify(
        NotificationType.information,
        vueI18n.t('message.cookiesExplanation'),
        0,
        [
          {
            action: () => /* c8 ignore next */ this.setAllowCookiesIndicator(true),
            caption: vueI18n.t('caption.allowCookies'),
            icon: undefined,
            name: 'allow',
            type: NotificationType.success
          },
          {
            action: () => /* c8 ignore next */ this.setAllowCookiesIndicator(false),
            caption: vueI18n.t('caption.rejectCookies'),
            icon: undefined,
            name: 'deny',
            type: NotificationType.error
          }
        ])
    }

    return allowCookies
  }

  /**
   Sets the allow cookies indicator and deletes Application Insights cookies when disabling cookies.
 */
  public setAllowCookiesIndicator(allowCookies: boolean): void {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    localStorage.setItem(websiteConfigurationService.configuration.allowCookiesStorageKey, allowCookies.toString())
    this.setCookieUsage(allowCookies)
  }

  /**
   * Sets cookie usage.
   */
  private setCookieUsage(allowCookies: boolean) {
    if (!allowCookies) {
      applicationInsights.getCookieMgr().del('ai_session')
      applicationInsights.getCookieMgr().del('ai_user')
    }

    applicationInsights.getCookieMgr().setEnabled(allowCookies)
  }
}
import applicationInsights from '../plugins/applicationInsights'
import i18n from '../plugins/vueI18n'
import { SeverityLevel } from '@microsoft/applicationinsights-web'

/**
 * Represents a service responsible for logging messages.
 */
export class LogService {
  /**
   * Logs an error message.
   * @param messageOrKey - Message or message key.
   * @param parameters - Parameters used to fill the message.
   * @param plural - Quantity used to determine the plurialized version of the message to use.
   */
  public logError(messageOrKey: string, parameters?: Record<string, unknown>, plural?: number): void {
    const message = this.getMessage(messageOrKey, parameters, plural)
    const errorMessage = i18n.t('message.errorLog', { message })

    console.error(message)
    applicationInsights.trackTrace({
      message: errorMessage,
      severityLevel: SeverityLevel.Error
    })
  }

  /**
   * Logs an exception message. When not in debug mode, the message is replaced by a generic error message.
   * @param messageOrKey - Message or message key.
   * @param parameters - Parameters used to fill the message.
   * @param plural - Quantity used to determine the plurialized version of the message to use.
   */
  public logException(messageOrKey: string, parameters?: Record<string, unknown>, plural?: number): void {
    const message = this.getMessage(messageOrKey, parameters, plural)
    const displayedMessage = import.meta.env.VITE_DEBUG === 'true'
      ? i18n.t('message.errorLog', { message })
      : this.getMessage('message.internalErrorLog')

    console.error(displayedMessage)
    applicationInsights.trackException({
      exception: new Error(message),
      severityLevel: SeverityLevel.Error
    })
  }

  /**
   * Logs an information message.
   * @param messageOrKey - Message or message key.
   * @param parameters - Parameters used to fill the message.
   * @param plural - Quantity used to determine the plurialized version of the message to use.
   */
  public logInformation(messageOrKey: string, parameters?: Record<string, unknown>, plural?: number): void {
    const message = this.getMessage(messageOrKey, parameters, plural)

    console.log(message)
    applicationInsights.trackTrace({
      message,
      severityLevel: SeverityLevel.Information
    })
  }

  /**
   * Logs an warning message.
   * @param messageOrKey - Message or message key.
   * @param parameters - Parameters used to fill the message.
   * @param plural - Quantity used to determine the plurialized version of the message to use.
   */
  public logWarning(messageOrKey: string, parameters?: Record<string, unknown>, plural?: number): void {
    const message = this.getMessage(messageOrKey, parameters, plural)
    const warningMessage = i18n.t('message.warningLog', { message })

    console.warn(warningMessage)
    applicationInsights.trackTrace({
      message,
      severityLevel: SeverityLevel.Warning
    })
  }

  /**
   * Gets a message to log.
   * @param messageOrKey - Message or message key.
   * @param parameters - Parameters to interpolate in the message.
   * @param plural - Quantity used to determine the plurialized version of the message to use.
   * @returns Message.
   */
  private getMessage(messageOrKey: string, parameters?: Record<string, unknown>, plural?: number): string {
    const message = i18n.t(messageOrKey, parameters ?? {}, plural ?? 1)

    return message
  }
}
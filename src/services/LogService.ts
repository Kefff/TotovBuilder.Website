import i18n from '../plugins/vueI18n'

/**
 * Represents a service responsible for logging messages.
 */
export class LogService {
  /**
   * Logs an error message. When not in debug mode, the message is replaced by a generic error message.
   * @param key - Message key.
   * @param parameters - Parameters used to fill the message.
   * @param plural - Quantity used to determine the plurialized version of the message to use.
   */
  public logError(key: string, parameters?: Record<string, unknown>, plural?: number): void {
    let message
    const debug = import.meta.env.VITE_DEBUG === 'true'

    if (debug) {
      message = this.getMessage(key, parameters, plural)
    } else {
      message = this.getMessage('message.internalErrorLog')
    }

    const errorMessage = i18n.t('message.errorLog', { message })
    console.error(errorMessage)
  }

  /**
   * Logs an information message.
   * @param key - Message key.
   * @param parameters - Parameters used to fill the message.
   * @param plural - Quantity used to determine the plurialized version of the message to use.
   */
  public logWarning(key: string, parameters?: Record<string, unknown>, plural?: number): void {
    const message = this.getMessage(key, parameters, plural)
    const warningMessage = i18n.t('message.warningLog', { message })
    console.warn(warningMessage)
  }

  /**
   * Gets a message to log.
   * @param key - Message key.
   * @param parameters - Parameters to interpolate in the message.
   * @param plural - Quantity used to determine the plurialized version of the message to use.
   * @returns Message.
   */
  private getMessage(key: string, parameters?: Record<string, unknown>, plural?: number): string {
    const message = i18n.t(key, parameters ?? {}, plural ?? 1)

    return message
  }
}
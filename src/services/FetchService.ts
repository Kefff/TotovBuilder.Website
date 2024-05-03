import { IRequestParameter } from '../models/utils/IRequestParameter'
import vueI18n from '../plugins/vueI18n'
import { LogService } from './LogService'
import Services from './repository/Services'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'

/**
 * Represents a service responsible for sending requests for fetching data.
 */
export class FetchService {
  /**
   * Sends a GET request.
   * @param endpoint - Endpoint to call.
   * @param parameters - Parameters to pass in the endpoint address.
   * @returns Response data.
   */
  public async get<TResult>(endpoint: string, ...parameters: IRequestParameter[]): Promise<TResult | undefined> {
    const maxTries = Services.get(WebsiteConfigurationService).configuration.fetchMaxTries
    let tries = 0
    let lastResult: TResult | undefined

    do {
      lastResult = await this.executeGet<TResult>(endpoint, parameters)

      if (lastResult != null) {
        break
      }

      await this.waitBeforeRetry()
      tries++
    } while (tries < maxTries)

    if (lastResult == null) {
      Services.get(LogService).logError(vueI18n.t('message.fetchMaxTriesError', { endpoint, maxTries }))
    }

    return lastResult
  }

  /**
   * Executes a GET request.
   * @param endpoint - Endpoint to call.
   * @param parameters - Parameters to pass in the endpoint address.
   * @returns Response data.
   */
  private async executeGet<TResult>(endpoint: string, parameters: IRequestParameter[]): Promise<TResult | undefined> {
    const logService = Services.get(LogService)

    endpoint += this.getParametersString(parameters)
    const fetchTimeout = Services.get(WebsiteConfigurationService).configuration.fetchTimeout * 1000 // In milliseconds

    const result: TResult | undefined = await fetch(endpoint, { method: 'GET', signal: AbortSignal.timeout(fetchTimeout) })
      .then(async (response) => {
        if (response.ok) {
          const responseData = await response.text()
          const parsedData = JSON.parse(responseData) as TResult

          return parsedData
        } else {
          const errorRespondeData = await response.text()

          /* c8 ignore start */ // For some reason, jest-fetch-mock cannot mock an error response with an empty body. The response has a 200 status even if we force it to 500 when configuring the mock.
          if (this.isEmptyResponseData(errorRespondeData)) {
            logService.logError(vueI18n.t('message.fetchError', { endpoint, errorMessage: vueI18n.t('message.emptyFetchResponse') }))

            return undefined
          }
          /* c8 ignore stop */

          const result = JSON.parse(errorRespondeData) as Record<string, unknown>
          const errorMessage = result['error'] as string

          logService.logException(vueI18n.t('message.fetchError', { endpoint, errorMessage }))

          return undefined
        }
      })
      .catch((error: Error) => {
        logService.logException(vueI18n.t('message.fetchError', { endpoint, errorMessage: error.message }))

        return undefined
      })

    return result
  }

  /**
   * Gets a parameters string from a list of parameters.
   * @param parameters - Parameters.
   * @returns Parameters string.
   */
  private getParametersString(parameters: IRequestParameter[]): string {
    let parametersString = ''

    for (const parameter of parameters) {
      parametersString += `?${parameter.name}=${parameter.value}`
    }

    return parametersString
  }

  /**
   * Indicates whether a response data is considered empty.
   * @param responseData - Response data.
   * @returns true when the response data is considered empty; otherwise false.
   */
  private isEmptyResponseData(responseData: string) {
    return responseData.length === 0 || responseData === '""' || responseData === '{}' || responseData === '[]'
  }

  /**
   * Waits the configured time before retrying to fetch.
   */
  private waitBeforeRetry(): Promise<void> {
    const waitTime = Services.get(WebsiteConfigurationService).configuration.fetchWaitTimeBetweenRetries

    return new Promise(resolve => setTimeout(resolve, waitTime * 1000)) // In milliseconds
  }
}

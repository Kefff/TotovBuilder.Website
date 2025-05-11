import { IFetchOptions } from '../models/utils/IFetchOptions'
import vueI18n from '../plugins/vueI18n'
import { LogService } from './LogService'
import Services from './repository/Services'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'

/**
 * Represents a service responsible for sending requests for fetching data.
 */
export class FetchService {
  /**
   * Sends a request.
   * @param endpoint - Endpoint to call.
   * @param method - HTTP method.
   * @param parameters - Parameters to pass in the endpoint address.
   * @param headers - Headers.
   * @returns Response data.
   */
  public async fetchAsync<TResult>(options: IFetchOptions)
    : Promise<TResult | undefined> {
    const result = await this.executeAsync<TResult>(options)

    return result
  }

  /**
   * Sends a request.
   * If the request fails, retries until a response is gotten or the maximum number of tries is reached.
   * @param endpoint - Endpoint to call.
   * @param method - HTTP method.
   * @param parameters - Parameters to pass in the endpoint address.
   * @param headers - Headers.
   * @returns Response data.
   */
  public async fetchWithRetryAsync<TResult>(options: IFetchOptions)
    : Promise<TResult | undefined> {
    const maxTries = Services.get(WebsiteConfigurationService).configuration.fetchMaxTries
    let tries = 0
    let lastResult: TResult | undefined

    do {
      lastResult = await this.executeAsync<TResult>(options)

      if (lastResult != null) {
        break
      }

      await this.waitBeforeRetry()
      tries++
    } while (tries < maxTries)

    if (lastResult == null) {
      Services.get(LogService).logException('message.fetchMaxTriesError', { endpoint: options.endpoint, maxTries })
    }

    return lastResult
  }

  /**
   * Executes a GET request.
   * @param endpoint - Endpoint to call.
   * @param parameters - Parameters to pass in the endpoint address.
   * @returns Response data.
   */
  private async executeAsync<TResult>(options: IFetchOptions): Promise<TResult | undefined> {
    const logService = Services.get(LogService)

    options.endpoint += this.getParametersString(options.parameters ?? {})
    const fetchTimeout = Services.get(WebsiteConfigurationService).configuration.fetchTimeout * 1000 // In milliseconds

    const result: TResult | undefined = await fetch(
      options.endpoint,
      {
        body: options.body,
        headers: options.headers,
        method: options.method ?? 'GET',
        signal: AbortSignal.timeout(fetchTimeout)
      })
      .then(async (response) => {
        if (response.ok) {
          const responseData = await response.text()
          const parsedData = JSON.parse(responseData) as TResult

          return parsedData
        } else {
          const errorRespondeData = await response.text()

          /* c8 ignore start */ // For some reason, jest-fetch-mock cannot mock an error response with an empty body. The response has a 200 status even if we force it to 500 when configuring the mock.
          if (this.isEmptyResponseData(errorRespondeData)) {
            logService.logError('message.fetchError', { endpoint: options.endpoint, errorMessage: vueI18n.t('message.emptyFetchResponse') })

            return undefined
          }
          /* c8 ignore stop */

          const result = JSON.parse(errorRespondeData) as Record<string, unknown>
          const errorMessage = result['error'] as string

          logService.logError('message.fetchError', { endpoint: options.endpoint, errorMessage })

          return undefined
        }
      })
      .catch((error: Error) => {
        logService.logError('message.fetchError', { endpoint: options.endpoint, errorMessage: error.message })

        return undefined
      })

    return result
  }

  /**
   * Gets a parameters string from a list of parameters.
   * @param parameters - Parameters.
   * @returns Parameters string.
   */
  private getParametersString(parameters: Record<string, string>): string {
    let parametersString = ''

    for (const key in parameters) {
      parametersString += `?${key}=${parameters[key]}`
    }

    return parametersString
  }

  /**
   * Indicates whether a response data is considered empty.
   * @param responseData - Response data.
   * @returns `true` when the response data is considered empty; otherwise `false`.
   */
  private isEmptyResponseData(responseData: string): boolean {
    const result = responseData.length === 0 || responseData === '""' || responseData === '{}' || responseData === '[]'

    return result
  }

  /**
   * Waits the configured time before retrying to fetch.
   */
  private waitBeforeRetry(): Promise<void> {
    const waitTime = Services.get(WebsiteConfigurationService).configuration.fetchWaitTimeBetweenRetries

    return new Promise(resolve => setTimeout(resolve, waitTime * 1000)) // In milliseconds
  }
}

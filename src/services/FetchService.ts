import { IRequestParameter } from '../models/utils/IRequestParameter'
import vueI18n from '../plugins/vueI18n'
import Result, { FailureType } from '../utils/Result'
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
  public async get<TResult>(endpoint: string, ...parameters: IRequestParameter[]): Promise<Result<TResult>> {
    const maxTries = Services.get(WebsiteConfigurationService).configuration.fetchMaxTries
    let tries = 0
    let lastResult: Result<TResult>

    do {
      lastResult = await this.executeGet<TResult>(endpoint, parameters)

      if (lastResult.success) {
        break
      }

      await this.waitBeforeRetry()
      tries++
    } while (tries < maxTries)

    if (!lastResult.success) {
      return Result.fail(FailureType.exception, 'FetchService.get()', vueI18n.t('message.fetchMaxTriesError', { endpoint, maxTries }))
    }

    return lastResult
  }

  /**
   * Executes a GET request.
   * @param endpoint - Endpoint to call.
   * @param parameters - Parameters to pass in the endpoint address.
   * @returns Response data.
   */
  private async executeGet<TResult>(endpoint: string, parameters: IRequestParameter[]): Promise<Result<TResult>> {
    endpoint += this.getParametersString(parameters)

    const fetchTimeout = Services.get(WebsiteConfigurationService).configuration.fetchTimeout * 1000 // In milliseconds
    const controller = new AbortController()
    setTimeout(() => controller.abort(), fetchTimeout)

    const result = await fetch(endpoint, { method: 'GET', signal: controller.signal })
      .then(async (response) => {
        if (response.ok) {
          const responseData = await response.text()

          /* c8 ignore start */
          if (this.isEmptyResponseData(responseData)) {
            // Sometimes Azures responds an empty response with a 0 status code when the instance is shutting down when the request happens.
            // It's unclear whether this response is seen a OK on client-side, so in case where a GET gets an empty response
            // we consider it to be an error
            return Result.fail<TResult>(FailureType.error, 'FetchService.get()', vueI18n.t('message.fetchError', { endpoint, errorMessage: vueI18n.t('message.emptyFetchResponse') }))
          }
          /* c8 ignore stop */

          const result = JSON.parse(responseData) as TResult

          return Result.ok(result)
        } else {
          const responseData = await response.text()

          /* c8 ignore start */
          if (this.isEmptyResponseData(responseData)) {
            // For some reason, jest-fetch-mock cannot mock an error response with an empty body. The response has a 200 status even if we force it to 500 when configuring the mock.
            return Result.fail<TResult>(FailureType.error, 'FetchService.get()', vueI18n.t('message.fetchError', { endpoint, errorMessage: vueI18n.t('message.emptyFetchResponse') }))
          }
          /* c8 ignore stop */

          const result = JSON.parse(responseData) as Record<string, unknown>
          const errorMessage = result['error'] as string

          return Result.fail<TResult>(FailureType.error, 'FetchService.get()', vueI18n.t('message.fetchError', { endpoint, errorMessage }))
        }
      })
      .catch((error: Error) => Result.fail<TResult>(FailureType.error, 'FetchService.get()', vueI18n.t('message.fetchError', { endpoint, errorMessage: error.message })))

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

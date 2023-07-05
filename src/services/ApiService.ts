import { IApiMethodParameter } from '../models/utils/IApiMethodParameter'
import i18n from '../plugins/vueI18n'
import Result, { FailureType } from '../utils/Result'
import Configuration from '../../test-data/configuration.json'
import Services from './repository/Services'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'

/**
 * Represents a service responsible for sending requests to an API and getting responses.
 */
export class ApiService {
  /**
   * Sends a get request on an API method.
   * @param method - API method to be called.
   * @param parameters - Parameters to pass to the API method.
   * @returns Response data in JSON format.
   */
  public async get<TResult>(method: string, ...parameters: IApiMethodParameter[]): Promise<Result<TResult>> {
    const maxTries = Services.get(WebsiteConfigurationService).configuration.fetchMaxTries
    let tries = 1
    let lastResult: Result<TResult> = Result.fail(FailureType.hidden)

    while (tries <= maxTries) {
      lastResult = await this.executeGet<TResult>(method, parameters)

      if (lastResult.success) {
        break
      }

      await this.waitBeforeRetry()
      tries++
    }

    return lastResult
  }

  private async executeGet<TResult>(method: string, parameters: IApiMethodParameter[]): Promise<Result<TResult>> {
    const parametersString = this.getParametersString(parameters)
    const url = Configuration.VITE_API_URL as string + method + parametersString

    const fetchTimeout = Services.get(WebsiteConfigurationService).configuration.fetchTimeout * 1000 // In milliseconds
    const controller = new AbortController()
    setTimeout(() => controller.abort(), fetchTimeout)

    const result = await fetch(url, { method: 'GET', signal: controller.signal })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.text()

          if (data.length === 0) {
            return Result.ok(data as unknown as TResult)
          }

          const result = JSON.parse(data) as TResult

          return Result.ok(result)
        } else {
          const data = await response.text()

          /* istanbul ignore if */
          if (data.length === 0) {
            // For some reason, jest-fetch-mock cannot mock an error response with an empty body. The response has a 200 status even if we force it to 500 when configuring the mock.
            return Result.fail<TResult>(FailureType.error, 'ApiItemFetcher.get()', i18n.t('message.apiError', { api: method, apiErrorMessage: i18n.t('message.emptyApiResponse') }))
          }

          const result = JSON.parse(data) as Record<string, unknown>
          const apiErrorMessage = result['error'] as string

          return Result.fail<TResult>(FailureType.error, 'ApiItemFetcher.get()', i18n.t('message.apiError', { api: method, apiErrorMessage }))
        }
      })
      .catch((error: Error) => Result.fail<TResult>(FailureType.error, 'ApiItemFetcher.get()', i18n.t('message.apiError', { api: method, apiErrorMessage: error.message })))

    return result
  }

  /**
   * Gets a parameters string from a list of parameters.
   * @param parameters - Parameters.
   * @returns Paremeters string .
   */
  private getParametersString(parameters: IApiMethodParameter[]): string {
    let parametersString = ''

    for (const parameter of parameters) {
      parametersString += `?${parameter.name}=${parameter.value}`
    }

    return parametersString
  }

  /**
   * Waits the configured time before retrying to fetch.
   */
  private waitBeforeRetry(): Promise<void> {
    const waitTime = Services.get(WebsiteConfigurationService).configuration.fetchWaitTimeBetweenRetries

    return new Promise(resolve => setTimeout(resolve, waitTime * 1000)) // In milliseconds
  }
}

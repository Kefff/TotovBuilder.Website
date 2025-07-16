import { URLSearchParams } from 'url'

/**
 * Provides the functionalities of options for fetching.
 */
export interface IFetchOptions {
  /**
   * Body.
   */
  body?: FormData | URLSearchParams

  /**
   * Endpoint to request.
   */
  endpoint: string,

  /**
   * Request headers.
   */
  headers?: Record<string, string>,

  /**
   * HTTP method.
   * 'GET' by default.
   */
  method?: 'GET' | 'POST',

  /**
   * URL parameters.
   */
  parameters?: Record<string, string>,
}
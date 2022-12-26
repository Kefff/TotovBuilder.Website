import i18n from '../plugins/vueI18n'
import { LogService } from '../services/LogService'
import Services from '../services/repository/Services'
import Configuration from '../../test-data/configuration.json'

/**
 * Represents the result of an operation.
 */
export default class Result<T = void> {
  /**
   * Informations about the context in which the failure occurred.
   */
  public failureContext = ''

  /**
   * Failure message.
   */
  public failureMessage = ''

  /**
   * Indicates wheter the operation was successful or not.
   */
  public success: boolean;

  /**
   * Value returned by the successful operation.
   */
  public get value(): T {
    if (!this.success) {
      throw i18n.t('message.resultCannotReadValueError')
    }

    if (this._value == null) {
      throw i18n.t('message.resultUndefinedValue')
    }

    return this._value as T
  }
  private _value?: T

  /**
   * Initializes a new instance of the Result class.
   * @param success - Indicates wheter the operation was successful or not.
   */
  private constructor(success: boolean) {
    this.success = success
  }

  /**
   * Create a failure result.
   * @param type - Failure type determining how the failure is logged.
   * @param context - Informations about the context in which the failure occurred.
   * @param message - Failure message.
   * @returns Failure result.
   */
  public static fail<T = void>(type: FailureType = FailureType.hidden, context?: string, message?: string): Result<T> {
    const result = new Result<T>(false)
    result.failureContext = context ?? ''
    result.failureMessage = message ?? ''
    result.logFailure(type)

    return result
  }

  /**
   * Creates a failure result from another result.
   * @param originalResult - Original result.
   * @returns Failure result.
   */
  public static failFrom<T = void>(originalResult: Result<unknown>): Result<T> {
    const result = new Result<T>(false)
    result.failureContext = originalResult.failureContext
    result.failureMessage = originalResult.failureMessage

    return result
  }

  /**
   * Create a successful result.
   * @returns Successful result.
   */
  public static ok<T = void>(value?: T): Result<T> {
    const result = new Result<T>(true)
    result._value = value

    return result
  }

  /**
   * Logs a failure.
   * @param type - Failure type determining how the failure is logged.
   * @param context - Failure context.
   * @param message - Failure message.
   */
  private logFailure(type: FailureType) {
    const service = Services.get(LogService)

    switch (type) {
      case FailureType.error: {
        if (Configuration.VITE_DEBUG === 'true') {
          service.logError('message.failureDebug', { message: this.failureMessage, context: this.failureContext })
        } else {
          service.logError(this.failureMessage)
        }

        break
      }
      case FailureType.warning: {
        if (Configuration.VITE_DEBUG === 'true') {
          service.logWarning('message.failureDebug', { message: this.failureMessage, context: this.failureContext })
        } else {
          service.logWarning(this.failureMessage)
        }

        break
      }
    }
  }
}

/**
 * Failure types.
 */
export enum FailureType {
  /**
   * Failure will be logged as an error.
   */
  error,

  /**
   * Failure will not be logged.
   * Usually used when a failure is normal and expected.
   */
  hidden,

  /**
   * Failure will be logged as a warning.
   */
  warning
}
import vueI18n from '../plugins/vueI18n'

/**
 * Represents the result of an operation.
 */
export default class Result<T = void> {
  /**
   * Failure message.
   */
  public failureMessage = ''

  /**
   * Indicates wheter the operation was successful or not.
   */
  public success: boolean

  /**
   * Value returned by the successful operation.
   */
  public get value(): T {
    if (!this.success) {
      throw vueI18n.t('message.resultCannotReadValueError')
    }

    if (this._value == null) {
      throw vueI18n.t('message.resultUndefinedValue')
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
   * @param message - Failure message.
   * @returns Failure result.
   */
  public static fail<T = void>(message: string): Result<T> {
    const result = new Result<T>(false)
    result.failureMessage = message

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
}
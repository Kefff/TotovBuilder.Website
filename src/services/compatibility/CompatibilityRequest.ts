import Result from '../../utils/Result'
import { CompatibilityRequestType } from './CompatibilityRequestType'

/**
 * Represents a compatibility request.
 */
export class CompatibilityRequest {
  private _result: Promise<Result>

  /**
   * Initializes a new instance of the CompatibilityRequest class.
   * @param requestType - Request type.
   * @param itemId - ID of the item for which the compatibilkity must be checked.
   * @param modSlotPath - When checking the compatibility of a modn, "path" to the mod slot the mod is being added in. Used to ignore conflicts with the mod being replaced in this slot.
   */
  constructor(public requestType: CompatibilityRequestType, public itemId: string, public modSlotPath?: string) {
    this._result = new Promise((resolve) => this.setResult = async (value: Promise<Result>) => resolve(await value))
  }

  /**
   * Promise resolved when the request is processed.
   */
  public get result(): Promise<Result> {
    return this._result
  }

  /**
   * Set the result of the compatibility check.
   */
  public setResult!: (value: Promise<Result>) => void
}
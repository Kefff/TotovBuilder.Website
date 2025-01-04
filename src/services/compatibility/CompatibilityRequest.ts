import { CompatibilityRequestType } from './CompatibilityRequestType'

/**
 * Represents a compatibility request.
 */
export class CompatibilityRequest {
  private _result: Promise<boolean>

  /**
   * Initializes a new instance of the CompatibilityRequest class.
   * @param requestType - Request type.
   * @param path - When checking the compatibility of a mod, path to the mod slot the mod is being added in. Used to ignore conflicts with the mod being replaced in this slot.
   */
  public constructor(public requestType: CompatibilityRequestType, public itemId: string, public path: string) {
    this._result = new Promise(resolve => this.setResult = async (value: Promise<boolean>): Promise<void> => resolve(await value))
  }

  /**
   * Promise resolved when the request is processed.
   */
  public get result(): Promise<boolean> {
    return this._result
  }

  /**
   * Set the result of the compatibility check.
   */
  public setResult!: (value: Promise<boolean>) => void
}
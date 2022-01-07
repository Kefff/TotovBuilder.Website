import { TinyEmitter } from 'tiny-emitter'
import Result from '../../utils/Result'
import { CompatibilityRequest } from './CompatibilityRequest'
import { CompatibilityRequestType } from './CompatibilityRequestType'

/**
 * Represents a service for checking the compatibility of a item being added in a build.
 * Used to accept or reject item changes when we cannot directly filter that list of available items
 * (when selecting a mod that might be incompatible with another mod on a weapon for example).
 */
export class CompatibilityService {
  /**
   * Event emitter used to signal compatibility check requests.
   */
  public emitter = new TinyEmitter()

  /**
   * Checks an item compatibility.
   * @param requestType - Request type.
   * @param itemId - ID of the item for which the compatibility must be checked.
   * @param path - When checking the compatibility of a mod, path to the mod slot the mod is being added in. Used to ignore conflicts with the mod being replaced in this slot.
   * @returns Result indicating whether the item can be added to the build or not.
   */
  public checkCompatibility(compatibilityRequestType: CompatibilityRequestType, itemId: string, path: string): Promise<Result> {
    const request = new CompatibilityRequest(compatibilityRequestType, itemId, path)
    this.emitter.emit(compatibilityRequestType, request)

    return request.result
  }
}
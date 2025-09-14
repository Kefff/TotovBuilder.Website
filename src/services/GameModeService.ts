import { TinyEmitter } from 'tiny-emitter'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'

/**
 * Represents a service for managing language changes.
 */
export default class GameModeService {
  /**
   * Name of the event fired when the game mode has changed.
   */
  public static gameModeChangedEvent = 'gameModeChanged'

  /**
   * Event emitter used to indicate that the items language has changed.
   */
  public emitter = new TinyEmitter()

  /**
   * Items language.
   */
  private _gameMode: string | undefined | null

  /**
   * Gets the game mode stored for the user or the default game mode.
   * @returns Stored or default game mode.
   */
  public getGameMode(): string {
    if (this._gameMode == null) {
      this._gameMode = localStorage.getItem(Services.get(WebsiteConfigurationService).configuration.gameModeStorageKey)
    }

    if (this._gameMode == null) {
      this._gameMode = Services.get(WebsiteConfigurationService).configuration.gameModes[0]
    }

    return this._gameMode
  }

  /**
   * Sets the game mode, stores it in the local storage, invalidates prices cache and emits an event indicating the gale mode has changed.
   * @param gameMode - Game mode.
   * @param emitEvent - Indicates whether the event that indicates the items language has changed must be emitted.
   */
  public setGameMode(gameMode: string, emitEvent: boolean = true): void {
    if (gameMode === this._gameMode) {
      return
    }

    this._gameMode = gameMode
    localStorage.setItem(Services.get(WebsiteConfigurationService).configuration.gameModeStorageKey, gameMode)
    Services.get(ItemService).invalidatedPricesCache()

    if (emitEvent) {
      this.emitter.emit(GameModeService.gameModeChangedEvent)
    }
  }
}
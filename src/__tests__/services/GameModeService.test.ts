import { describe, expect, it } from 'vitest'
import GameModeService from '../../services/GameModeService'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('GameModeService', () => {
  describe('getGameMode', () => {
    it('should get the stored game mode', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      localStorage.setItem(websiteConfigurationService.configuration.gameModeStorageKey, 'pve')

      const service = new GameModeService()

      // Act
      const gameMode = service.getGameMode()

      // Assert
      expect(gameMode).toBe('pve')
    })

    it('should get the default game mode when no game mode is stored', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const service = new GameModeService()

      // Act
      const language = service.getGameMode()

      // Assert
      expect(language).toBe('pvp')
    })
  })

  describe('setGameMode', () => {
    it('should change the game mode, store it, invalidate prices cache and emit an event', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)

      let emitted = false

      const service = new GameModeService()
      service.emitter.on(GameModeService.gameModeChangedEvent, () => emitted = true)

      // Act
      service.setGameMode('pve')

      // Assert
      const gameMode = service.getGameMode()
      const storedGameMode = localStorage.getItem(websiteConfigurationService.configuration.gameModeStorageKey)

      expect(gameMode).toBe('pve')
      expect(storedGameMode).toBe('pve')
      expect(emitted).toBe(true)
    })
  })
})
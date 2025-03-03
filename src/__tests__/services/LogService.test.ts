import { anything, spy, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import vueI18n from '../../plugins/vueI18n'
import { LogService } from '../../services/LogService'

describe('getMessage', () => {
  it('should get a message', () => {
    // Arrange
    const loggerService = new LogService()
    const key = 'test.logger1'
    let log: string | undefined
    const expected = vueI18n.t('message.warningLog', { message: vueI18n.t(key) })

    const consoleSpy = spy(console)
    when(consoleSpy.warn(anything())).thenCall((args) => log = args as string)

    // Act
    loggerService.logWarning(key)

    // Assert
    expect(log).toBe(expected)
  })

  it('should get a message with parameters', () => {
    // Arrange
    const loggerService = new LogService()
    const key = 'test.logger2'
    const parameters = { article: 'an', messageType: 'error' }
    const expected = vueI18n.t('message.warningLog', { message: vueI18n.t(key, parameters) })
    let log: string | undefined


    const consoleSpy = spy(console)
    when(consoleSpy.warn(anything())).thenCall((args) => log = args as string)

    // Act
    loggerService.logWarning(key, parameters)

    // Assert
    expect(log).toBe(expected)
  })

  it('should log a message with plural', () => {
    // Arrange
    const loggerService = new LogService()
    const key = 'test.logger3'
    const plural = 2
    const expected = vueI18n.t('message.warningLog', { message: vueI18n.t(key, plural) })
    let log: string | undefined

    const consoleSpy = spy(console)
    when(consoleSpy.warn(anything())).thenCall((args) => log = args as string)

    // Act
    loggerService.logWarning(key, undefined, plural)

    // Assert
    expect(log).toBe(expected)
  })
})

describe('logError', () => {
  it('should log an error message', () => {
    // Arrange
    const loggerService = new LogService()
    const key = 'test.logger1'
    const expected = vueI18n.t(key)
    let log: string | undefined

    const consoleSpy = spy(console)
    when(consoleSpy.error(anything())).thenCall((args) => log = args as string)

    // Act
    loggerService.logError(key)

    // Assert
    expect(log).toBe(expected)
    verify(consoleSpy.error(anything())).once()
  })
})

describe('logException', () => {
  it('should log an exception message', () => {
    // Arrange
    const loggerService = new LogService()
    const key = 'test.logger1'
    const expected = vueI18n.t(key)
    let log: string | undefined

    const consoleSpy = spy(console)
    when(consoleSpy.error(anything())).thenCall((args) => log = args as string)

    // Act
    loggerService.logException(key)

    // Assert
    expect(log).toBe(expected)
    verify(consoleSpy.error(anything())).once()
  })
})

describe('logInformation', () => {
  it('should log an information message', () => {
    // Arrange
    const loggerService = new LogService()
    const key = 'test.logger1'
    const expected = vueI18n.t(key)
    let log: string | undefined

    const consoleSpy = spy(console)
    when(consoleSpy.log(anything())).thenCall((args) => log = args as string)

    // Act
    loggerService.logInformation(key)

    // Assert
    expect(log).toBe(expected)
    verify(consoleSpy.log(anything())).once()
  })
})

describe('logWarning', () => {
  it('should log a warning message', () => {
    // Arrange
    const loggerService = new LogService()
    const key = 'test.logger1'
    const expected = vueI18n.t('message.warningLog', { message: vueI18n.t(key) })
    let log: string | undefined

    const consoleSpy = spy(console)
    when(consoleSpy.warn(anything())).thenCall((args) => log = args as string)

    // Act
    loggerService.logWarning(key)

    // Assert
    expect(log).toBe(expected)
    verify(consoleSpy.warn(anything())).once()
  })
})
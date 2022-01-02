import { LogService } from '../../services/LogService'
import i18n from '../../plugins/vueI18n'
import Configuration from '../../../test-data/configuration.json'
import { anything, spy, when } from 'ts-mockito'

describe('getMessage()', () => {
  it('should get a message', () => {
    // Arrange
    const loggerService = new LogService()
    const key = 'test.logger1'
    let log: string | undefined = undefined
    const expected = i18n.t('message.warningLog', { message: i18n.t(key) })

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
    const expected = i18n.t('message.warningLog', { message: i18n.t(key, parameters) })
    let log: string | undefined = undefined


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
    const expected = i18n.t('message.warningLog', { message: i18n.t(key, plural) })
    let log: string | undefined = undefined

    const consoleSpy = spy(console)
    when(consoleSpy.warn(anything())).thenCall((args) => log = args as string)

    // Act
    loggerService.logWarning(key, undefined, plural)

    // Assert
    expect(log).toBe(expected)
  })
})

describe('logError()', () => {
  it.each([
    [true, 'Error : This is a message.'],
    [false, 'Error : An internal error occured.']
  ])('should log an error messages when in debug mode, otherwise a generic error message', (debug: boolean, expected: string) => {
    // Arrange
    const loggerService = new LogService()
    Configuration.VITE_DEBUG = debug.toString().toLocaleLowerCase()
    const key = 'test.logger1'
    let log: string | undefined = undefined

    const consoleSpy = spy(console)
    when(consoleSpy.error(anything())).thenCall((args) => log = args as string)

    // Act
    loggerService.logError(key)

    // Assert
    expect(log).toBe(expected)
  })
})

describe('logWarning()', () => {
  it('should log an warning message', () => {
    // Arrange
    const loggerService = new LogService()
    const key = 'test.logger1'
    const expected = i18n.t('message.warningLog', { message: i18n.t(key) })
    let log: string | undefined = undefined

    const consoleSpy = spy(console)
    when(consoleSpy.warn(anything())).thenCall((args) => log = args as string)

    // Act
    loggerService.logWarning(key)

    // Assert
    expect(log).toBe(expected)
  })
})
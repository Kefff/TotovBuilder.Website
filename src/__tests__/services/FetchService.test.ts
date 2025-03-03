import { anything, instance, mock, verify } from 'ts-mockito'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'
import { FetchService } from '../../services/FetchService'
import { LogService } from '../../services/LogService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Services from '../../services/repository/Services'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

const fetchMock = createFetchMock(vi)

afterAll(() => {
  fetchMock.disableMocks()
})

beforeAll(() => {
  fetchMock.enableMocks()
})

beforeEach(() => {
  fetchMock.resetMocks()
})

describe('getAsync', () => {
  it('should send a request and get a response', async () => {
    // Arrange
    const response = `[
  {
    "ic": "https://assets.tarkov.dev/590c392f86f77444754deb29-icon.webp",
    "i": "590c392f86f77444754deb29",
    "im": "https://assets.tarkov.dev/590c392f86f77444754deb29-image.webp",
    "m": "https://tarkov.dev/item/ssd-drive",
    "n": "SSD drive",
    "s": "SSD",
    "w": 0.04,
    "wi": "https://escapefromtarkov.fandom.com/wiki/SSD_drive"
  },
  {
    "e": -1,
    "mo": [
      {
        "i": [
          "5addba3e5acfc4001669f0ab",
          "5aafa49ae5b5b00015042a58"
        ],
        "n": "mod_sight_front"
      }
    ],
    "r": -0.06,
    "c": "rangedWeaponMod",
    "ic": "https://assets.tarkov.dev/5addbbb25acfc40015621bd9-icon.webp",
    "i": "5addbbb25acfc40015621bd9",
    "im": "https://assets.tarkov.dev/5addbbb25acfc40015621bd9-image.webp",
    "m": "https://tarkov.dev/item/m14-yankee-hill-phantom-762x51-flash-hider",
    "n": "M14 Yankee Hill Phantom 7.62x51 flash hider",
    "s": "Phantom",
    "w": 0.07,
    "wi": "https://escapefromtarkov.fandom.com/wiki/M14_Yankee_Hill_Phantom_7.62x51_flash_hider"
  }
]`
    const endpoint = 'data/prices.ts'
    useWebsiteConfigurationServiceMock()
    fetchMock.mockOnceIf(endpoint, response, { status: 200 })

    // Act
    const result = await new FetchService().getAsync(endpoint)

    // Assert
    expect(fetchMock.mock.calls.length).toBe(1)
    expect(result).toStrictEqual([
      {
        ic: 'https://assets.tarkov.dev/590c392f86f77444754deb29-icon.webp',
        i: '590c392f86f77444754deb29',
        im: 'https://assets.tarkov.dev/590c392f86f77444754deb29-image.webp',
        m: 'https://tarkov.dev/item/ssd-drive',
        n: 'SSD drive',
        s: 'SSD',
        w: 0.04,
        wi: 'https://escapefromtarkov.fandom.com/wiki/SSD_drive'
      },
      {
        e: -1,
        mo: [
          {
            'i': [
              '5addba3e5acfc4001669f0ab',
              '5aafa49ae5b5b00015042a58'
            ],
            'n': 'mod_sight_front'
          }
        ],
        r: -0.06,
        c: 'rangedWeaponMod',
        ic: 'https://assets.tarkov.dev/5addbbb25acfc40015621bd9-icon.webp',
        i: '5addbbb25acfc40015621bd9',
        im: 'https://assets.tarkov.dev/5addbbb25acfc40015621bd9-image.webp',
        m: 'https://tarkov.dev/item/m14-yankee-hill-phantom-762x51-flash-hider',
        n: 'M14 Yankee Hill Phantom 7.62x51 flash hider',
        s: 'Phantom',
        w: 0.07,
        wi: 'https://escapefromtarkov.fandom.com/wiki/M14_Yankee_Hill_Phantom_7.62x51_flash_hider'
      }
    ])
  })

  it('should send a request with parameters and get a response', async () => {
    // Arrange
    const response = `[
  {
    "ic": "https://assets.tarkov.dev/590c392f86f77444754deb29-icon.webp",
    "i": "590c392f86f77444754deb29",
    "im": "https://assets.tarkov.dev/590c392f86f77444754deb29-image.webp",
    "m": "https://tarkov.dev/item/ssd-drive",
    "n": "SSD drive",
    "s": "SSD",
    "w": 0.04,
    "wi": "https://escapefromtarkov.fandom.com/wiki/SSD_drive"
  }
]`
    useWebsiteConfigurationServiceMock()
    fetchMock.mockOnceIf('localhost:3000/method?id=590c392f86f77444754deb29', response, { status: 200 })

    // Act
    const result = await new FetchService().getAsync('localhost:3000/method', { name: 'id', value: '590c392f86f77444754deb29' })

    // Assert
    expect(fetchMock.mock.calls.length).toBe(1)
    expect(result).toStrictEqual([
      {
        ic: 'https://assets.tarkov.dev/590c392f86f77444754deb29-icon.webp',
        i: '590c392f86f77444754deb29',
        im: 'https://assets.tarkov.dev/590c392f86f77444754deb29-image.webp',
        m: 'https://tarkov.dev/item/ssd-drive',
        n: 'SSD drive',
        s: 'SSD',
        w: 0.04,
        wi: 'https://escapefromtarkov.fandom.com/wiki/SSD_drive'
      }
    ])
  })

  it('should resend a request until it receives a success response', async () => {
    // Arrange
    const errorResponse = `{
  "error": "Access denied"
}`
    const successResponse = `{
  "success": "Access granted"
}`
    useWebsiteConfigurationServiceMock()

    fetchMock
      .mockResponse(errorResponse, { status: 401 })
      .mockResponse(successResponse, { status: 200 })

    // Act
    const result = await new FetchService().getAsync('item', { name: 'uid', value: 'f0fa8457-6638-4ad2-b7e8-4708033d8f39' })

    // Assert
    expect(result).toStrictEqual({ success: 'Access granted' })
  })

  it('should return undefined data when the response is empty', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    websiteConfigurationService.configuration.fetchMaxTries = 1

    const endpoint = 'data/prices.ts'
    fetchMock.mockOnceIf('localhost:3000/' + endpoint, '', { status: 200 })

    // Act
    const result = await new FetchService().getAsync(endpoint)

    // Assert
    expect(fetchMock.mock.calls.length).toBe(1)
    expect(result).toBeUndefined()
    verify(logServiceMock.logError('message.fetchError', anything())).once()
    verify(logServiceMock.logException('message.fetchMaxTriesError', anything())).once()
  })

  it('should return undefined if a success response is not received until the maximum number of tries is reached', async () => {
    // Arrange
    const response = `{
  "error": "Access denied"
}`

    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    websiteConfigurationService.configuration.fetchTimeout = 0.1
    websiteConfigurationService.configuration.fetchMaxTries = 2
    websiteConfigurationService.configuration.fetchWaitTimeBetweenRetries = 0.1

    fetchMock.doMock(response, { status: 401 })

    // Act
    const result = await new FetchService().getAsync('item', { name: 'uid', value: 'f0fa8457-6638-4ad2-b7e8-4708033d8f39' })

    // Assert
    expect(result).toBeUndefined()
    verify(logServiceMock.logError('message.fetchError', anything())).times(websiteConfigurationService.configuration.fetchMaxTries)
    verify(logServiceMock.logException('message.fetchMaxTriesError', anything())).once()
  })

  it('should return undefined if it times out', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    websiteConfigurationService.configuration.fetchTimeout = 0.5
    websiteConfigurationService.configuration.fetchMaxTries = 1

    fetchMock.doMock(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))

      return ''
    })

    const service = new FetchService()

    // Act
    const result = await service.getAsync('item', { name: 'uid', value: 'f0fa8457-6638-4ad2-b7e8-4708033d8f39' })

    // Assert
    expect(result).toBeUndefined()
    verify(logServiceMock.logError('message.fetchError', anything())).times(websiteConfigurationService.configuration.fetchMaxTries)
    verify(logServiceMock.logException('message.fetchMaxTriesError', anything())).once()
  })
})

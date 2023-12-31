import { FetchService } from '../../services/FetchService'
import createFetchMock from 'vitest-fetch-mock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

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

describe('get()', () => {
  it('should send a request and get a response', async () => {
    // Arrange
    const response = `[
  {
    "id": "590c621186f774138d11ea29",
    "name": "Secure Flash drive",
    "shortName": "Flash drive",
    "iconLink": "https://assets.tarkov-tools.com/590c621186f774138d11ea29-icon.jpg",
    "wikiLink": "https://escapefromtarkov.fandom.com/wiki/Secure_Flash_drive",
    "imageLink": "https://assets.tarkov-tools.com/590c621186f774138d11ea29-image.jpg",
    "link": "https://tarkov-tools.com/item/secure-flash-drive",
    "buyFor": [
      {
        "source": "flea-market",
        "price": 58486,
        "currency": "RUB",
        "requirements": [{ "type": "playerLevel", "value": 20 }]
      }
    ]
  },
  {
    "id": "590c392f86f77444754deb29",
    "name": "SSD drive",
    "shortName": "SSD",
    "iconLink": "https://assets.tarkov-tools.com/590c392f86f77444754deb29-icon.jpg",
    "wikiLink": "https://escapefromtarkov.fandom.com/wiki/SSD_drive",
    "imageLink": "https://assets.tarkov-tools.com/590c392f86f77444754deb29-image.jpg",
    "link": "https://tarkov-tools.com/item/ssd-drive",
    "buyFor": [
      {
        "source": "flea-market",
        "price": 60373,
        "currency": "RUB",
        "requirements": [{ "type": "playerLevel", "value": 20 }]
      }
    ]
  }
]`
    const endpoint = 'data/prices.ts'
    useWebsiteConfigurationServiceMock()
    fetchMock.mockOnceIf(endpoint, response, { status: 200 })

    // Act
    const result = await new FetchService().get(endpoint)

    // Assert
    expect(fetchMock.mock.calls.length).toBe(1)
    expect(result.success).toBe(true)
    expect(result.value).toStrictEqual([
      {
        'id': '590c621186f774138d11ea29',
        'name': 'Secure Flash drive',
        'shortName': 'Flash drive',
        'iconLink': 'https://assets.tarkov-tools.com/590c621186f774138d11ea29-icon.jpg',
        'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/Secure_Flash_drive',
        'imageLink': 'https://assets.tarkov-tools.com/590c621186f774138d11ea29-image.jpg',
        'link': 'https://tarkov-tools.com/item/secure-flash-drive',
        'buyFor': [
          {
            'source': 'flea-market',
            'price': 58486,
            'currency': 'RUB',
            'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
          }
        ]
      },
      {
        'id': '590c392f86f77444754deb29',
        'name': 'SSD drive',
        'shortName': 'SSD',
        'iconLink': 'https://assets.tarkov-tools.com/590c392f86f77444754deb29-icon.jpg',
        'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/SSD_drive',
        'imageLink': 'https://assets.tarkov-tools.com/590c392f86f77444754deb29-image.jpg',
        'link': 'https://tarkov-tools.com/item/ssd-drive',
        'buyFor': [
          {
            'source': 'flea-market',
            'price': 60373,
            'currency': 'RUB',
            'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
          }
        ]
      }
    ])
  })

  it('should send a request with parameters and get a response', async () => {
    // Arrange
    const response = `[
  {
    "id": "57dc2fa62459775949412633",
    "name": "AKS-74U 5.45x39 assault rifle",
    "shortName": "AKS-74U",
    "iconLink": "https://assets.tarkov-tools.com/57dc2fa62459775949412633-icon.jpg",
    "wikiLink": "https://escapefromtarkov.fandom.com/wiki/AKS-74U_5.45x39_assault_rifle",
    "imageLink": "https://assets.tarkov-tools.com/57dc2fa62459775949412633-image.jpg",
    "link": "https://tarkov-tools.com/item/aks-74u-545x39-assault-rifle",
    "buyFor": [
      {
        "source": "prapor",
        "price": 28823,
        "currency": "RUB",
        "requirements": [
          { "type": "loyaltyLevel", "value": 1 },
          { "type": "questCompleted", "value": 1 }
        ]
      },
      {
        "source": "flea-market",
        "price": 22761,
        "currency": "RUB",
        "requirements": [{ "type": "playerLevel", "value": 20 }]
      }
    ]
  }
]`
    useWebsiteConfigurationServiceMock()
    fetchMock.mockOnceIf('localhost:3000/method?id=57dc2fa62459775949412633', response, { status: 200 })

    // Act
    const result = await new FetchService().get('localhost:3000/method', { name: 'id', value: '57dc2fa62459775949412633' })

    // Assert
    expect(fetchMock.mock.calls.length).toBe(1)
    expect(result.success).toBe(true)
    expect(result.value).toStrictEqual([
      {
        'id': '57dc2fa62459775949412633',
        'name': 'AKS-74U 5.45x39 assault rifle',
        'shortName': 'AKS-74U',
        'iconLink': 'https://assets.tarkov-tools.com/57dc2fa62459775949412633-icon.jpg',
        'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/AKS-74U_5.45x39_assault_rifle',
        'imageLink': 'https://assets.tarkov-tools.com/57dc2fa62459775949412633-image.jpg',
        'link': 'https://tarkov-tools.com/item/aks-74u-545x39-assault-rifle',
        'buyFor': [
          {
            'source': 'prapor',
            'price': 28823,
            'currency': 'RUB',
            'requirements': [
              { 'type': 'loyaltyLevel', 'value': 1 },
              { 'type': 'questCompleted', 'value': 1 }
            ]
          },
          {
            'source': 'flea-market',
            'price': 22761,
            'currency': 'RUB',
            'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
          }
        ]
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
    const result = await new FetchService().get('item', { name: 'uid', value: 'f0fa8457-6638-4ad2-b7e8-4708033d8f39' })

    // Assert
    expect(result.success).toBe(true)
    expect(result.value).toStrictEqual({ success: 'Access granted' })
  })

  it('should return empty data when the response is empty', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    websiteConfigurationService.configuration.fetchMaxTries = 1

    const endpoint = 'data/prices.ts'
    fetchMock.mockOnceIf('localhost:3000/' + endpoint, '', { status: 200 })

    // Act
    const result = await new FetchService().get(endpoint)

    // Assert
    expect(fetchMock.mock.calls.length).toBe(1)
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe('Failed to successfully request endpoint "data/prices.ts" after 1 tries.')
  })

  it('should fail if a success response is not received until the maximum number of tries is reached', async () => {
    // Arrange
    const response = `{
  "error": "Access denied"
}`
    useWebsiteConfigurationServiceMock()

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    websiteConfigurationService.configuration.fetchTimeout = 0.1
    websiteConfigurationService.configuration.fetchMaxTries = 2
    websiteConfigurationService.configuration.fetchWaitTimeBetweenRetries = 0.1

    fetchMock.doMock(response, { status: 401 })

    // Act
    const result = await new FetchService().get('item', { name: 'uid', value: 'f0fa8457-6638-4ad2-b7e8-4708033d8f39' })

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe('Failed to successfully request endpoint "item" after 2 tries.')
  })

  it('should fail if it times out', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    websiteConfigurationService.configuration.fetchTimeout = 0.5
    websiteConfigurationService.configuration.fetchMaxTries = 1

    fetchMock.doMock(async () => {
      return new Promise(resolve => setTimeout(resolve, 1000)).then(() => '')
    })

    const service = new FetchService()

    // Act
    const result = await service.get('item', { name: 'uid', value: 'f0fa8457-6638-4ad2-b7e8-4708033d8f39' })

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe('Failed to successfully request endpoint "item" after 1 tries.')
  })
})

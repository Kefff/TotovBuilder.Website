import { ApiService } from '../../services/ApiService'
import fetchMock from 'jest-fetch-mock'
import Configuration from '../../../test-data/configuration.json'

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
        "source": "fleaMarket",
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
        "source": "fleaMarket",
        "price": 60373,
        "currency": "RUB",
        "requirements": [{ "type": "playerLevel", "value": 20 }]
      }
    ]
  }
]`
    fetchMock.mockOnceIf(Configuration.VITE_API_URL as string + Configuration.VITE_MARKET_DATA_API as string, response, { status: 200 })

    // Act
    const result = await new ApiService().get(Configuration.VITE_MARKET_DATA_API as string)

    // Assert
    expect(fetchMock.mock.calls.length).toEqual(1)
    expect(result.success).toBe(true)
    expect(result.value).toEqual([
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
            'source': 'fleaMarket',
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
            'source': 'fleaMarket',
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
        "source": "fleaMarket",
        "price": 22761,
        "currency": "RUB",
        "requirements": [{ "type": "playerLevel", "value": 20 }]
      }
    ]
  }
]`
    fetchMock.mockOnceIf(Configuration.VITE_API_URL as string + 'item?id=57dc2fa62459775949412633', response, { status: 200 })

    // Act
    const result = await new ApiService().get('item', { name: 'id', value: '57dc2fa62459775949412633' })

    // Assert
    expect(fetchMock.mock.calls.length).toEqual(1)
    expect(result.success).toBe(true)
    expect(result.value).toEqual([
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
            'source': 'fleaMarket',
            'price': 22761,
            'currency': 'RUB',
            'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
          }
        ]
      }
    ])
  })

  it('should fail if a an error reponse is received', async () => {
    // Arrange
    const response = `{
  "error": "Access denied"
}`
    fetchMock.mockOnce(response, { status: 401 })

    // Act
    const result = await new ApiService().get('item', { name: 'uid', value: 'f0fa8457-6638-4ad2-b7e8-4708033d8f39' })

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe(`Error while requesting the API.
Response : "Access denied".`)
  })

  it('should fail if it times out', async () => {
    // Arrange
    Configuration.VITE_FETCH_TIMEOUT = '0.01'
    fetchMock.mockOnce(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))

      return ''
    })

    // Act
    const resultPromise = new ApiService().get('item', { name: 'uid', value: 'f0fa8457-6638-4ad2-b7e8-4708033d8f39' })
    const result = await resultPromise

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe(`Error while requesting the API.
Response : "The operation was aborted. ".`)

    // Clean
    Configuration.VITE_FETCH_TIMEOUT = '10'
  })
})
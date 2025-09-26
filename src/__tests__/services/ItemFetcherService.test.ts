import { anything, instance, mock, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IFetchOptions } from '../../models/utils/IFetchOptions'
import { FetchService } from '../../services/FetchService'
import { ItemFetcherService } from '../../services/ItemFetcherService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { LogService } from '../../services/LogService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'
import { ItemMocks, water } from '../__data__/itemMocks'
import { PresetMocks } from '../__data__/presetMocks'
import { iskraPrices, PriceMocks } from '../__data__/priceMocks'
import ReducedItemMocks from '../__data__/reduced-items.json'
import ReducedPresetMocks from '../__data__/reduced-presets.json'
import ReducedPriceMocks from '../__data__/reduced-prices.json'
import WebsiteConfigurationMock from '../__data__/websiteConfigurationMock'
import { useFetchServiceMock } from '../__mocks__/FetchServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('fetchItemsAsync', () => {
  it('should fetch all items', async () => {
    // Arrange
    useFetchServiceMock(ReducedItemMocks)
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemPropertiesService)
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const items = await fetcher.fetchItemsAsync('en')

    // Assert
    expect(items).not.toBeUndefined()
    expect(items!.length).toBe(4204)

    for (const itemMock of ItemMocks) {
      const fetchedItem = items!.find(i => i.id === itemMock.id)
      expect(fetchedItem).toStrictEqual(itemMock)
    }
  })

  it.each([
    ['en'],
    ['fr']
  ])('should fetch items in a specific language', async (language: string) => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.fetchWithRetryAsync(anything()))
      .thenCall((o: IFetchOptions) => {
        if (o.endpoint === `/${WebsiteConfigurationMock.endpointItems.replace('{0}', 'en')}`) {
          return [
            {
              'ic': 'https://assets.tarkov.dev/5448fee04bdc2dbc018b4567-icon.webp',
              'i': '5448fee04bdc2dbc018b4567',
              'im': 'https://assets.tarkov.dev/5448fee04bdc2dbc018b4567-image.webp',
              'm': 'https://tarkov.dev/item/bottle-of-water-06l',
              'n': 'Bottle of water (0.6L)',
              's': 'Water',
              'w': 0.65,
              'wi': 'https://escapefromtarkov.fandom.com/wiki/Bottle_of_water_(0.6L)'
            }
          ]
        } else if (o.endpoint === `/${WebsiteConfigurationMock.endpointItems.replace('{0}', 'fr')}`) {
          return [
            {
              'ic': 'https://assets.tarkov.dev/5448fee04bdc2dbc018b4567-icon.webp',
              'i': '5448fee04bdc2dbc018b4567',
              'im': 'https://assets.tarkov.dev/5448fee04bdc2dbc018b4567-image.webp',
              'm': 'https://tarkov.dev/item/bottle-of-water-06l',
              'n': 'Bouteille d\'eau (0.6L)',
              's': 'Eau',
              'w': 0.65,
              'wi': 'https://escapefromtarkov.fandom.com/wiki/Bottle_of_water_(0.6L)'
            }
          ]
        }
      })

    Services.configure(FetchService, undefined, instance(fetchServiceMock))
    Services.configure(ItemPropertiesService)
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const items = await fetcher.fetchItemsAsync(language)

    // Assert
    if (language === 'en') {
      expect(items).toStrictEqual([
        water
      ])
    } else {
      expect(items).toStrictEqual([
        {
          ...water,
          name: 'Bouteille d\'eau (0.6L)',
          shortName: 'Eau'
        }
      ])
    }
  })

  it('should return undefined and log exception when items are not found', async () => {
    // Arrange
    useFetchServiceMock([])
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const fetcher = new ItemFetcherService()

    // Act
    const items = await fetcher.fetchItemsAsync('en')

    // Assert
    expect(items).toBeUndefined()
    verify(logServiceMock.logException('message.itemsNotFetched')).once()
  })

  it('should return undefined and log exception when an error occurs requesting items', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.fetchWithRetryAsync({ endpoint: '/' + WebsiteConfigurationMock.endpointItems.replace('{0}', 'en') })).thenResolve(undefined)
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const fetcher = new ItemFetcherService()

    // Act
    const items = await fetcher.fetchItemsAsync('en')

    // Assert
    expect(items).toBeUndefined()
    verify(logServiceMock.logException('message.itemsNotFetched')).once()
  })
})

describe('fetchPricesAsync', () => {
  it('should fetch all prices', async () => {
    // Arrange
    useFetchServiceMock(ReducedPriceMocks)
    useWebsiteConfigurationServiceMock()
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const prices = await fetcher.fetchPricesAsync('pvp', 'en')

    // Assert
    expect(prices).not.toBeUndefined()
    expect(prices!.length).toBe(5197)

    for (const priceMock of PriceMocks) {
      const fetchedPrice = prices!.find(p =>
        p.itemId === priceMock.itemId
        && p.merchant === priceMock.merchant
        && p.merchantLevel === priceMock.merchantLevel
        && p.currencyName === priceMock.currencyName
        && p.barterItems.map(bi => bi.itemId).join(',') === priceMock.barterItems.map(bi => bi.itemId).join(',')) // Needed because some items have multiple barters for the same merchant

      expect(fetchedPrice).toStrictEqual(priceMock)
    }
  })

  it.each([
    ['pvp', 'en'],
    ['pvp', 'fr'],
    ['pve', 'en'],
    ['pve', 'fr']
  ])('should fetch prices for a specific game mode in a specific language', async (gameMode: string, language: string) => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.fetchWithRetryAsync(anything()))
      .thenCall((o: IFetchOptions) => {
        if (o.endpoint === `/${WebsiteConfigurationMock.endpointPrices.replace('{0}', 'pvp').replace('{1}', 'en')}`) {
          return [
            {
              'i': '590c5d4b86f774784e1b9c45',
              'm': 'jaeger',
              'ml': 2,
              'q': {
                'i': '5d25b6be86f77444001e1b89',
                'n': 'The Survivalist Path - Thrifty',
                'w': 'https://escapefromtarkov.fandom.com/wiki/The_Survivalist_Path_-_Thrifty'
              },
              'v': 24392,
              'vm': 24392
            }
          ]
        } else if (o.endpoint === `/${WebsiteConfigurationMock.endpointPrices.replace('{0}', 'pvp').replace('{1}', 'fr')}`) {
          return [
            {
              'i': '590c5d4b86f774784e1b9c45',
              'm': 'jaeger',
              'ml': 2,
              'q': {
                'i': '5d25b6be86f77444001e1b89',
                'n': 'Le Chemin du Survivaliste - Econome',
                'w': 'https://escapefromtarkov.fandom.com/wiki/The_Survivalist_Path_-_Thrifty'
              },
              'v': 24392,
              'vm': 24392
            }
          ]
        } else if (o.endpoint === `/${WebsiteConfigurationMock.endpointPrices.replace('{0}', 'pve').replace('{1}', 'en')}`) {
          return [
            {
              'i': '590c5d4b86f774784e1b9c45',
              'm': 'jaeger',
              'ml': 2,
              'q': {
                'i': '5d25b6be86f77444001e1b89',
                'n': 'The Survivalist Path - Thrifty',
                'w': 'https://escapefromtarkov.fandom.com/wiki/The_Survivalist_Path_-_Thrifty'
              },
              'v': 20000,
              'vm': 20000
            }
          ]
        } else if (o.endpoint === `/${WebsiteConfigurationMock.endpointPrices.replace('{0}', 'pve').replace('{1}', 'fr')}`) {
          return [
            {
              'i': '590c5d4b86f774784e1b9c45',
              'm': 'jaeger',
              'ml': 2,
              'q': {
                'i': '5d25b6be86f77444001e1b89',
                'n': 'Le Chemin du Survivaliste - Econome',
                'w': 'https://escapefromtarkov.fandom.com/wiki/The_Survivalist_Path_-_Thrifty'
              },
              'v': 20000,
              'vm': 20000
            }
          ]
        }
      })

    Services.configure(FetchService, undefined, instance(fetchServiceMock))
    Services.configure(ItemPropertiesService)
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const prices = await fetcher.fetchPricesAsync(gameMode, language)

    // Assert
    if (gameMode === 'pvp' && language === 'en') {
      expect(prices).toStrictEqual([
        iskraPrices[0]
      ])
    } else if (gameMode === 'pvp' && language === 'fr') {
      expect(prices).toStrictEqual([
        {
          ...iskraPrices[0],
          quest: {
            ...iskraPrices[0].quest,
            name: 'Le Chemin du Survivaliste - Econome'
          }
        }
      ])
    } else if (gameMode === 'pve' && language === 'en') {
      expect(prices).toStrictEqual([
        {
          ...iskraPrices[0],
          value: 20000,
          valueInMainCurrency: 20000
        }
      ])
    } else {
      expect(prices).toStrictEqual([
        {
          ...iskraPrices[0],
          quest: {
            ...iskraPrices[0].quest,
            name: 'Le Chemin du Survivaliste - Econome'
          },
          value: 20000,
          valueInMainCurrency: 20000
        }
      ])
    }
  })

  it('should return undefined and log exception when prices are not found', async () => {
    // Arrange
    useFetchServiceMock([])
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const fetcher = new ItemFetcherService()

    // Act
    const prices = await fetcher.fetchPricesAsync('pvp', 'en')

    // Assert
    expect(prices).toBeUndefined()
    verify(logServiceMock.logException('message.pricesNotFetched')).once()
  })

  it('should return undefined and log exception when an error occurs requesting prices', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.fetchWithRetryAsync({ endpoint: '/' + WebsiteConfigurationMock.endpointPrices.replace('{0}', 'pvp').replace('{1}', 'en') })).thenResolve(undefined)
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const fetcher = new ItemFetcherService()

    // Act
    const prices = await fetcher.fetchPricesAsync('pvp', 'en')

    // Assert
    expect(prices).toBeUndefined()
    verify(logServiceMock.logException('message.pricesNotFetched')).once()
  })
})

describe('fetchPresetsAsync', () => {
  it('should fetch all presets', async () => {
    // Arrange
    useFetchServiceMock(ReducedPresetMocks)
    useWebsiteConfigurationServiceMock()
    Services.configure(ReductionService)

    const fetcher = new ItemFetcherService()

    // Act
    const presets = await fetcher.fetchPresetsAsync()

    // Assert
    expect(presets).not.toBeUndefined()
    expect(presets!.length).toBe(381)

    for (const presetMock of PresetMocks) {
      const fetchedItem = presets!.find(i => i.itemId === presetMock.itemId)
      expect(fetchedItem).toStrictEqual(presetMock)
    }
  })

  it('should return undefined and log exception when presets are not found', async () => {
    // Arrange
    useFetchServiceMock([])
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const fetcher = new ItemFetcherService()

    // Act
    const presets = await fetcher.fetchPresetsAsync()

    // Assert
    expect(presets).toBeUndefined()
    verify(logServiceMock.logException('message.presetsNotFetched')).once()
  })

  it('should return undefined and log exception when an error occurs requesting presets', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.fetchWithRetryAsync({ endpoint: '/' + WebsiteConfigurationMock.endpointPresets })).thenResolve(undefined)
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const fetcher = new ItemFetcherService()

    // Act
    const presets = await fetcher.fetchPresetsAsync()

    // Assert
    expect(presets).toBeUndefined()
    verify(logServiceMock.logException('message.presetsNotFetched')).once()
  })
})
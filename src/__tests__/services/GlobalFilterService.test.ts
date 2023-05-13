import { IItem } from '../../models/item/IItem'
import { IMerchantFilter } from '../../models/utils/IMerchantFilter'
import { IPrice } from '../../models/item/IPrice'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import WebsiteConfigurationMock from '../../../test-data/website-configuration.json'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { IItemExclusionFilter } from '../../models/utils/IItemExclusionFilter'
import Services from '../../services/repository/Services'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { IModdable } from '../../models/item/IModdable'
import { IGlobalFilter } from '../../models/utils/IGlobalFilter'

const itemExclusionFilters = [
  {
    enabled: true,
    exclude: (item: IItem) => {
      return item.prices.length === 0
    },
    name: GlobalFilterService.excludeItemsWithoutMerchantFilterName
  },
  {
    enabled: true,
    exclude: (item: IItem) => {
      const canBeModded = Services.get(ItemPropertiesService).canBeModded(item)
      const hasBaseItemId = (item as IModdable).baseItemId == null
      const hasDefaultPresetId = (item as IModdable).defaultPresetId != null

      return canBeModded && hasBaseItemId && hasDefaultPresetId
    },
    name: GlobalFilterService.excludePresetBaseItemsFilterName
  }
] as IItemExclusionFilter[]

const merchantFilters = [
  {
    'enabled': true,
    'merchantLevel': 0,
    'merchant': 'flea-market'
  },
  {
    'enabled': false,
    'merchantLevel': 4,
    'merchant': 'jaeger'
  },
  {
    'enabled': true,
    'merchantLevel': 4,
    'merchant': 'mechanic'
  },
  {
    'enabled': true,
    'merchantLevel': 4,
    'merchant': 'peacekeeper'
  },
  {
    'enabled': true,
    'merchantLevel': 4,
    'merchant': 'prapor'
  },
  {
    'enabled': true,
    'merchantLevel': 4,
    'merchant': 'ragman'
  },
  {
    'enabled': true,
    'merchantLevel': 4,
    'merchant': 'skier'
  },
  {
    'enabled': true,
    'merchantLevel': 4,
    'merchant': 'therapist'
  }
] as IMerchantFilter[]

beforeEach(() => {
  localStorage.setItem(WebsiteConfigurationMock.globalFilterStorageKey, JSON.stringify({
    itemExclusionFilters,
    merchantFilters
  } as IGlobalFilter))
})

afterEach(() => {
  localStorage.clear()
})

describe('get()', () => {
  it('should get the merchant filters', () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new GlobalFilterService()

    // Act
    const filters = service.get()

    // Assert
    expect(filters).toStrictEqual(filters)
  })

  it('should get the default merchant filters when merchant filters are not saved', () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new GlobalFilterService()

    // Act
    localStorage.clear()
    const filters = service.get()

    // Assert
    expect(filters).toStrictEqual(filters)
  })
})

describe('getMatchingPrices()', () => {
  it.each([
    [
      [
        {
          currencyName: '',
          merchant: 'flea-market',
          merchantLevel: 0,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        {
          currencyName: '',
          merchant: 'prapor',
          merchantLevel: 4,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        }
      ] as IPrice[],
      [
        {
          currencyName: '',
          merchant: 'flea-market',
          merchantLevel: 0,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        {
          currencyName: '',
          merchant: 'prapor',
          merchantLevel: 4,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        }
      ] as IPrice[]
    ],
    [
      [
        {
          currencyName: '',
          merchant: 'prapor',
          merchantLevel: 4,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        {
          currencyName: '',
          merchant: 'therapist',
          merchantLevel: 4,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        }
      ] as IPrice[],
      [
        {
          currencyName: '',
          merchant: 'prapor',
          merchantLevel: 4,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        }
      ] as IPrice[]
    ]
  ])('should indicate that an item has matching prices', async (prices: IPrice[], expected: IPrice[]) => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new GlobalFilterService()
    service.setMerchantFilters([
      {
        enabled: true,
        merchant: 'flea-market',
        merchantLevel: 0
      },
      {
        enabled: true,
        merchant: 'prapor',
        merchantLevel: 4
      },
      {
        enabled: true,
        merchant: 'therapist',
        merchantLevel: 3
      },
      {
        enabled: false,
        merchant: 'mechanic',
        merchantLevel: 2
      }
    ])
    const item: IItem = {
      categoryId: '',
      conflictingItemIds: [],
      iconLink: '',
      id: '',
      imageLink: '',
      marketLink: '',
      maxStackableAmount: 1,
      name: '',
      prices,
      shortName: '',
      weight: 0,
      wikiLink: ''
    }

    // Act
    const result = service.getMatchingPrices(item)

    // Assert
    expect(result).toStrictEqual(expected)
  })
})

describe('getMerchantLevels()', () => {
  it('should get the levels of a merchant', () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new GlobalFilterService()

    // Act
    const levels1 = service.getMerchantLevels('flea-market')
    const levels2 = service.getMerchantLevels('prapor')
    const levels3 = service.getMerchantLevels('invalid')

    // Assert
    expect(levels1).toStrictEqual([0])
    expect(levels2).toStrictEqual([1, 2, 3, 4])
    expect(levels3).toStrictEqual([])
  })
})

describe('hasLevels()', () => {
  it('should indicates whether a merchant has multiple levels or not', () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new GlobalFilterService()

    // Act
    const hasLevels1 = service.hasLevels('flea-market')
    const hasLevels2 = service.hasLevels('prapor')
    const hasLevels3 = service.hasLevels('invalid')

    // Assert
    expect(hasLevels1).toStrictEqual(false)
    expect(hasLevels2).toStrictEqual(true)
    expect(hasLevels3).toStrictEqual(false)
  })
})

describe('isMatchingFilter()', () => {
  it.each([
    [
      [
        {
          currencyName: '',
          merchant: 'flea-market',
          merchantLevel: 0,
          value: 0,
          valueInMainCurrency: 0
        }
      ] as IPrice[],
      false,
      true
    ],
    [
      [
        {
          currencyName: '',
          merchant: 'prapor',
          merchantLevel: 4,
          value: 0,
          valueInMainCurrency: 0
        }
      ] as IPrice[],
      false,
      true
    ],
    [
      [
        {
          currencyName: '',
          merchant: 'therapist',
          merchantLevel: 4,
          value: 0,
          valueInMainCurrency: 0
        }
      ] as IPrice[],
      false,
      false
    ],
    [
      [
        {
          currencyName: '',
          merchant: 'mechanic',
          merchantLevel: 1,
          value: 0,
          valueInMainCurrency: 0
        },
        {
          currencyName: '',
          merchant: 'flea-market',
          merchantLevel: 0,
          value: 0,
          valueInMainCurrency: 0
        }
      ] as IPrice[],
      false,
      true
    ],
    [
      [
        {
          currencyName: '',
          merchant: 'mechanic',
          merchantLevel: 1,
          value: 0,
          valueInMainCurrency: 0
        },
        {
          currencyName: '',
          merchant: 'therapist',
          merchantLevel: 4,
          value: 0,
          valueInMainCurrency: 0
        }
      ] as IPrice[],
      false,
      false
    ],
    [
      [] as IPrice[],
      true,
      true
    ],
    [
      [] as IPrice[],
      false,
      false
    ]
  ])('should indicate whether an item matches the item filter and has prices matching the merchant filters', async (prices: IPrice[], includeItemsWithoutMerchant: boolean, expected: boolean) => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemPropertiesService)

    const service = new GlobalFilterService()
    service.setMerchantFilters([
      {
        enabled: true,
        merchant: 'flea-market',
        merchantLevel: 0
      },
      {
        enabled: true,
        merchant: 'prapor',
        merchantLevel: 4
      },
      {
        enabled: true,
        merchant: 'therapist',
        merchantLevel: 3
      },
      {
        enabled: false,
        merchant: 'mechanic',
        merchantLevel: 2
      }
    ])
    const item: IItem = {
      categoryId: '',
      conflictingItemIds: [],
      iconLink: '',
      id: '',
      imageLink: '',
      marketLink: '',
      maxStackableAmount: 1,
      name: '',
      prices,
      shortName: '',
      weight: 0,
      wikiLink: ''
    }

    // Act
    const result = service.isMatchingFilter(item, includeItemsWithoutMerchant)

    // Assert
    expect(result).toBe(expected)
  })
})

describe('setMerchantFilters()', () => {
  it('should save the merchant filters and save them', () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new GlobalFilterService()
    merchantFilters[0].enabled = false
    merchantFilters[2].merchantLevel = 1

    // Act
    service.setMerchantFilters(merchantFilters)
    const readenFilters = service.get()

    // Assert
    expect(localStorage.setItem).toHaveBeenCalled()
    expect(readenFilters.merchantFilters).toStrictEqual([
      {
        'enabled': false,
        'merchant': 'flea-market',
        'merchantLevel': 0
      },
      {
        'enabled': false,
        'merchant': 'jaeger',
        'merchantLevel': 4
      },
      {
        'enabled': true,
        'merchant': 'mechanic',
        'merchantLevel': 1
      },
      {
        'enabled': true,
        'merchant': 'peacekeeper',
        'merchantLevel': 4
      },
      {
        'enabled': true,
        'merchant': 'prapor',
        'merchantLevel': 4
      },
      {
        'enabled': true,
        'merchant': 'ragman',
        'merchantLevel': 4
      },
      {
        'enabled': true,
        'merchant': 'skier',
        'merchantLevel': 4
      },
      {
        'enabled': true,
        'merchant': 'therapist',
        'merchantLevel': 4
      }
    ])
  })
})
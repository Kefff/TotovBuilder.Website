import { beforeEach, describe, expect, it } from 'vitest'
import { IItem, ItemCategoryId } from '../../models/item/IItem'
import { IPrice } from '../../models/item/IPrice'
import { IGlobalFilter } from '../../models/utils/IGlobalFilter'
import { IItemExclusionFilter } from '../../models/utils/IItemExclusionFilter'
import { IMerchantFilter } from '../../models/utils/IMerchantFilter'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import { ammo545bp, berkut, rpk16 } from '../__data__/itemMocks'
import WebsiteConfigurationMock from '../__data__/websiteConfigurationMock'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

const itemExclusionFilters = [
  {
    enabled: true,
    name: GlobalFilterService.excludeItemsWithoutMerchantFilterName
  },
  {
    enabled: true,
    name: GlobalFilterService.excludePresetBaseItemsFilterName
  }
] as IItemExclusionFilter[]

const initialMerchantFilters = [
  {
    'enabled': true,
    'merchantLevel': 0,
    'merchant': 'flea-market'
  },
  {
    'enabled': false,
    'merchantLevel': 3,
    'merchant': 'jaeger'
  },
  {
    'enabled': true,
    'merchantLevel': 3,
    'merchant': 'mechanic'
  },
  {
    'enabled': true,
    'merchantLevel': 3,
    'merchant': 'peacekeeper'
  },
  {
    'enabled': true,
    'merchantLevel': 3,
    'merchant': 'prapor'
  },
  {
    'enabled': true,
    'merchantLevel': 3,
    'merchant': 'ragman'
  },
  {
    'enabled': true,
    'merchantLevel': 3,
    'merchant': 'ref'
  },
  {
    'enabled': true,
    'merchantLevel': 3,
    'merchant': 'skier'
  },
  {
    'enabled': true,
    'merchantLevel': 3,
    'merchant': 'therapist'
  }
] as IMerchantFilter[]

beforeEach(() => {
  localStorage.setItem(
    WebsiteConfigurationMock.globalFilterStorageKey,
    JSON.stringify({
      itemExclusionFilters,
      merchantFilters: initialMerchantFilters
    } as IGlobalFilter))
})

describe('get()', () => {
  it('should get the merchant filters', () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new GlobalFilterService()

    // Act
    const globalFilter = service.get()

    // Assert
    expect(globalFilter).toStrictEqual({
      itemExclusionFilters: [
        {
          enabled: true,
          name: 'itemsWithoutMerchant'
        },
        {
          enabled: true,
          name: 'presetBaseItems'
        }
      ],
      merchantFilters: [
        {
          enabled: true,
          merchant: 'flea-market',
          merchantLevel: 0
        },
        {
          enabled: false,
          merchant: 'jaeger',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'mechanic',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'peacekeeper',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'prapor',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'ragman',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'ref',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'skier',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'therapist',
          merchantLevel: 3
        }
      ]
    } as IGlobalFilter)
  })

  it('should get the default merchant filters when merchant filters are not saved', () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    localStorage.clear()
    const service = new GlobalFilterService()

    // Act
    const globalFilter = service.get()

    // Assert
    expect(globalFilter).toStrictEqual({
      itemExclusionFilters: [
        {
          enabled: true,
          name: 'itemsWithoutMerchant'
        },
        {
          enabled: true,
          name: 'presetBaseItems'
        }
      ],
      merchantFilters: [
        {
          enabled: true,
          merchant: 'flea-market',
          merchantLevel: 0
        },
        {
          enabled: true,
          merchant: 'jaeger',
          merchantLevel: 4
        },
        {
          enabled: true,
          merchant: 'mechanic',
          merchantLevel: 4
        },
        {
          enabled: true,
          merchant: 'peacekeeper',
          merchantLevel: 4
        },
        {
          enabled: true,
          merchant: 'prapor',
          merchantLevel: 4
        },
        {
          enabled: true,
          merchant: 'ragman',
          merchantLevel: 4
        },
        {
          enabled: true,
          merchant: 'ref',
          merchantLevel: 4
        },
        {
          enabled: true,
          merchant: 'skier',
          merchantLevel: 4
        },
        {
          enabled: true,
          merchant: 'therapist',
          merchantLevel: 4
        }
      ]
    } as IGlobalFilter)
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
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        {
          currencyName: '',
          merchant: 'prapor',
          merchantLevel: 4,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        }
      ] as IPrice[],
      [
        {
          currencyName: '',
          merchant: 'flea-market',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        {
          currencyName: '',
          merchant: 'prapor',
          merchantLevel: 4,
          quest: undefined,
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
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        {
          currencyName: '',
          merchant: 'therapist',
          merchantLevel: 4,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        }
      ] as IPrice[],
      [
        {
          currencyName: '',
          merchant: 'prapor',
          merchantLevel: 4,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        }
      ] as IPrice[]
    ]
  ])('should indicate that an item has matching prices', (prices: IPrice[], expected: IPrice[]) => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new GlobalFilterService()

    service.saveMerchantFilters([
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
      categoryId: ItemCategoryId.other,
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
      false
    ],
    [
      [] as IPrice[],
      false
    ]
  ])('should indicate whether an item matches the item filter and has prices matching the merchant filters', (prices: IPrice[], expected: boolean) => {
    // Arrange
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemPropertiesService)

    const service = new GlobalFilterService()

    service.saveMerchantFilters([
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
      categoryId: ItemCategoryId.other,
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
    const result = service.isMatchingFilter(item)

    // Assert
    expect(result).toBe(expected)
  })

  it.each([
    [berkut.id, false, true],
    [ammo545bp.id, true, true],
    [ammo545bp.id, false, false],
    [rpk16.id, false, false]
  ])('should indicate that items included in the item exclusion filters do not match the filter', async (itemId: string, includeItemsWithoutMerchant: boolean, expected: boolean) => {
    // Arrange
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemPropertiesService)

    const service = new GlobalFilterService()

    const globalFilter = service.get()
    const excludeItemsWithoutMerchantFilter = globalFilter.itemExclusionFilters.find(i => i.name === GlobalFilterService.excludeItemsWithoutMerchantFilterName)

    if (excludeItemsWithoutMerchantFilter != null) {
      excludeItemsWithoutMerchantFilter.enabled = !includeItemsWithoutMerchant
    }

    service.save(globalFilter)

    const item = await Services.get(ItemService).getItemAsync(itemId)

    // Act
    const result = service.isMatchingFilter(item)

    // Assert
    expect(result).toBe(expected)
  })
})

describe('save', () => {
  it('should save the global filter', () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new GlobalFilterService()

    const globalFilter = service.get()

    const presetBaseItemsExclusionFilter = globalFilter.itemExclusionFilters[1]

    if (presetBaseItemsExclusionFilter != null) {
      presetBaseItemsExclusionFilter.enabled = false
    }

    const fleaMarket = globalFilter.merchantFilters.find(mf => mf.merchant === 'flea-market')

    if (fleaMarket != null) {
      fleaMarket.enabled = false
    }

    const prapor = globalFilter.merchantFilters.find(mf => mf.merchant === 'prapor')

    if (prapor != null) {
      prapor.merchantLevel = 1
    }

    // Act
    service.save(globalFilter)
    const updatedGlobalFilter = service.get()

    // Assert
    expect(localStorage.setItem).toHaveBeenCalled()
    expect(updatedGlobalFilter).toStrictEqual({
      itemExclusionFilters: [
        {
          enabled: true,
          name: 'itemsWithoutMerchant'
        },
        {
          enabled: false,
          name: 'presetBaseItems'
        }
      ],
      merchantFilters: [
        {
          enabled: false,
          merchant: 'flea-market',
          merchantLevel: 0
        },
        {
          enabled: false,
          merchant: 'jaeger',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'mechanic',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'peacekeeper',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'prapor',
          merchantLevel: 1
        },
        {
          enabled: true,
          merchant: 'ragman',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'ref',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'skier',
          merchantLevel: 3
        },
        {
          enabled: true,
          merchant: 'therapist',
          merchantLevel: 3
        }
      ]
    } as IGlobalFilter)
  })
})

describe('saveItemExclusionFilters', () => {
  it('should save the items exclusion filter', () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new GlobalFilterService()

    const globalFilter = service.get()

    const presetBaseItemsExclusionFilter = globalFilter.itemExclusionFilters.find(ief => ief.name === GlobalFilterService.excludePresetBaseItemsFilterName)

    if (presetBaseItemsExclusionFilter != null) {
      presetBaseItemsExclusionFilter.enabled = false
    }

    // Act
    service.saveItemExclusionFilters(globalFilter.itemExclusionFilters)
    const updatedGlobalFilter = service.get()

    // Assert
    expect(localStorage.setItem).toHaveBeenCalled()
    expect(updatedGlobalFilter.itemExclusionFilters).toStrictEqual([
      {
        enabled: true,
        name: 'itemsWithoutMerchant'
      },
      {
        enabled: false,
        name: 'presetBaseItems'
      }
    ] as IItemExclusionFilter[])
  })
})


describe('saveMerchantFilters()', () => {
  it('should save the merchant filters', () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new GlobalFilterService()

    const globalFilter = service.get()

    const fleaMarket = globalFilter.merchantFilters.find(mf => mf.merchant === 'flea-market')

    if (fleaMarket != null) {
      fleaMarket.enabled = false
    }

    const prapor = globalFilter.merchantFilters.find(mf => mf.merchant === 'prapor')

    if (prapor != null) {
      prapor.merchantLevel = 1
    }

    // Act
    service.saveMerchantFilters(globalFilter.merchantFilters)
    const updatedGlobalFilter = service.get()

    // Assert
    expect(localStorage.setItem).toHaveBeenCalled()
    expect(updatedGlobalFilter.merchantFilters).toStrictEqual([
      {
        enabled: false,
        merchant: 'flea-market',
        merchantLevel: 0
      },
      {
        enabled: false,
        merchant: 'jaeger',
        merchantLevel: 3
      },
      {
        enabled: true,
        merchant: 'mechanic',
        merchantLevel: 3
      },
      {
        enabled: true,
        merchant: 'peacekeeper',
        merchantLevel: 3
      },
      {
        enabled: true,
        merchant: 'prapor',
        merchantLevel: 1
      },
      {
        enabled: true,
        merchant: 'ragman',
        merchantLevel: 3
      },
      {
        enabled: true,
        merchant: 'ref',
        merchantLevel: 3
      },
      {
        enabled: true,
        merchant: 'skier',
        merchantLevel: 3
      },
      {
        enabled: true,
        merchant: 'therapist',
        merchantLevel: 3
      }
    ] as IMerchantFilter[])
  })
})
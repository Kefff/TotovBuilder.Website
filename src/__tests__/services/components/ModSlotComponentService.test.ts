import { anything, instance, mock, when } from 'ts-mockito'
import { IItem } from '../../../models/item/IItem'
import { ModSlotComponentService } from '../../../services/components/ModSlotComponentService'
import { ItemService } from '../../../services/ItemService'
import { NotificationService } from '../../../services/NotificationService'
import Services from '../../../services/repository/Services'
import Result, { FailureType } from '../../../utils/Result'
import { GlobalFilterService } from '../../../services/GlobalFilterService'
import { useWebsiteConfigurationServiceMock } from '../../../__mocks__/WebsiteConfigurationServiceMock'
import { useTarkovValuesServiceMock } from '../../../__mocks__/TarkovValuesServiceMock'
import { useItemFetcherServiceMock } from '../../../__mocks__/ItemFetcherServiceMock'
import { usePresetServiceMock } from '../../../__mocks__/PresetPropertiesServiceMock'
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'
import { describe, expect, it } from 'vitest'

describe('getAcceptedItems()', () => {
  it('should get the acceptem items', async () => {
    // Arrange
    useItemFetcherServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemService)
    Services.configure(ItemPropertiesService)
    Services.configure(GlobalFilterService)
    Services.configure(NotificationService)

    const modSlotService = new ModSlotComponentService()

    const globalFitlerService = Services.get(GlobalFilterService)
    globalFitlerService.saveMerchantFilters([
      {
        enabled: true,
        merchant: 'prapor',
        merchantLevel: 1
      }
    ])

    // Act
    const items = await modSlotService.getAcceptedItems([
      '5f6341043ada5942720e2dc5',
      '6087e663132d4d12c81fd96b',
      '5beec8ea0db834001a6f9dbf',
      '5649ad3f4bdc2df8348b4585',
      '5649ade84bdc2d1b2b8b4587',
      '59e62cc886f77440d40b52a1',
      '5a0071d486f77404e23a12b2',
      '57e3dba62459770f0c32322b',
      '5cf54404d7f00c108840b2ef',
      '5e2192a498a36665e8337386',
      '5b30ac585acfc433000eb79c',
      '59e6318286f77444dd62c4cc',
      '5cf50850d7f00c056e24104c',
      '5cf508bfd7f00c056e24104e',
      '5947f92f86f77427344a76b1',
      '5947fa2486f77425b47c1a9b',
      '5c6bf4aa2e2216001219b0ae',
      '5649ae4a4bdc2d1b2b8b4588',
      '5998517986f7746017232f7e'
    ])

    // Assert
    expect(items.length).toBe(3)
  })

  it('should ignore accepted items that are not found', async () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)

    const modSlotService = new ModSlotComponentService()
    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, notificationServiceMock)

    const itemServiceMock = mock<ItemService>()
    when(itemServiceMock.getItems(anything(), true)).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
    Services.configure(ItemService, undefined, instance(itemServiceMock))

    // Act
    const items = await modSlotService.getAcceptedItems(['5ca20d5986f774331e7c9602'])

    // Assert
    expect(items.length).toBe(0)
  })
})

describe('getAcceptedItemsCategoryId()', () => {
  it.each([
    [
      [
        {
          categoryId: 'rangedWeaponMod',
          conflictingItemIds: [],
          iconLink: '',
          id: '5f6341043ada5942720e2dc5', // AK Aeroknox Scorpius pistol grip
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          name: '',
          prices: [],
          shortName: '',
          weight: 0,
          wikiLink: ''
        },
        {
          categoryId: 'headphones',
          conflictingItemIds: [],
          iconLink: '',
          id: '5f60cd6cf2bcbb675b00dac6', // Walker's XCEL 500BT Digital headset
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          name: '',
          prices: [],
          shortName: '',
          weight: 0,
          wikiLink: ''
        }
      ],
      undefined
    ],
    [
      [
        {
          categoryId: 'headphones',
          conflictingItemIds: [],
          iconLink: '',
          id: '5f60cd6cf2bcbb675b00dac6', // Walker's XCEL 500BT Digital headset
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          name: '',
          prices: [],
          shortName: '',
          weight: 0,
          wikiLink: ''
        }
      ],
      'headphones'
    ]
  ])('should get the accepted items category ID', (items: IItem[], expected: string | undefined) => {
    // Arrange
    const modSlotService = new ModSlotComponentService()

    // Act
    const categoryIds = modSlotService.getAcceptedItemsCategoryId(items)

    // Assert
    expect(categoryIds).toBe(expected)
  })
})
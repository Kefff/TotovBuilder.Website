import { anyString, anything, instance, mock, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IInventoryModSlot } from '../../models/build/IInventoryModSlot'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem } from '../../models/item/IItem'
import { IMod } from '../../models/item/IMod'
import { IPrice } from '../../models/item/IPrice'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import { IErgonomics } from '../../models/utils/IErgonomics'
import { IRecoil } from '../../models/utils/IRecoil'
import { IRecoilPercentageModifier } from '../../models/utils/IRecoilPercentageModifier'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import { InventoryItemService } from '../../services/InventoryItemService'
import { ItemFetcherService } from '../../services/ItemFetcherService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ItemService } from '../../services/ItemService'
import { LogService } from '../../services/LogService'
import { PresetService } from '../../services/PresetService'
import Services from '../../services/repository/Services'
import Result, { FailureType } from '../../utils/Result'
import ItemCategoriesMock from '../__data__/item-categories.json'
import ItemsMock from '../__data__/items'
import PresetsMock from '../__data__/presets'
import PricesMock from '../__data__/prices'
import { useGlobalFilterServiceMock } from '../__mocks__/GlobalFilterServiceMock'
import { useItemFetcherServiceMock } from '../__mocks__/ItemFetcherServiceMock'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('fetchPresets()', () => {
  it('should fetch presets', async () => {
    // Arrange
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.ok(PresetsMock))
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    const presetService = new PresetService()

    // Act
    await presetService.fetchPresets()
    const preset = presetService.getPreset('584147732459775a2b6d9f12')

    // Assert
    expect(preset).toStrictEqual({
      content: [],
      ignorePrice: false,
      itemId: '584147732459775a2b6d9f12',
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '57e3dba62459770f0c32322b',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_pistol_grip'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '57dc347d245977596754e7a1',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_stock'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '564ca99c4bdc2d16268b4589',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_magazine'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '57dc324a24597759501edc20',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_muzzle'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '57dc334d245977597164366f',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_reciever'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '59d36a0086f7747e673f3946',
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '57dc32dc245977596d4ef3d3',
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_handguard'
              }
            ],
            quantity: 1
          },
          modSlotName: 'mod_gas_block'
        }
      ],
      quantity: 1
    })
  })

  it('should fail when fetching fails', async () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.fail(FailureType.error, undefined, 'Fetch error'))
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))


    // Act
    const presetService = new PresetService()
    const result = await presetService.fetchPresets()

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe('Fetch error')
  })
})

describe('getPreset()', () => {
  it.each([
    [
      '584147732459775a2b6d9f12', // Kalashnikov AKS-74U 5.45x39 assault rifle Default
      {
        content: [],
        ignorePrice: false,
        itemId: '584147732459775a2b6d9f12', // AKS-74U 5.45x39 assault rifle Default
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '57e3dba62459770f0c32322b', // AK-74 textolite pistol grip (6P4 Sb.9)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_pistol_grip'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '57dc347d245977596754e7a1', // AKS-74U metal skeleton stock (6P26 Sb.5)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_stock'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '564ca99c4bdc2d16268b4589', // AK-74 5.45x39 6L20 30-round magazine
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_magazine'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '57dc324a24597759501edc20', // AKS-74U 5.45x39 muzzle brake (6P26 0-20)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_muzzle'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '57dc334d245977597164366f', // AKS-74U dust cover (6P26 Sb.7)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_reciever'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '59d36a0086f7747e673f3946', // AKS-74U gas tube"
              modSlots: [
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: '57dc32dc245977596d4ef3d3', // AKS-74U wooden handguard (6P26 Sb.6)
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_handguard'
                }
              ],
              quantity: 1
            },
            modSlotName: 'mod_gas_block'
          }
        ],
        quantity: 1
      } as IInventoryItem
    ],
    [
      '590c678286f77426c9660122', // IFAK individual first aid kit
      undefined
    ]
  ])('should get a preset', async (id: string, expected: IInventoryItem | undefined) => {
    // Arrange
    useItemFetcherServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new PresetService()
    await service.fetchPresets()

    // Act
    const preset = service.getPreset(id)

    // Assert
    if (expected == null) {
      expect(preset).toBeUndefined()
    } else {
      expect(preset).toStrictEqual(expected)
    }
  })
})

describe('getPresetModSlotContainingItem', () => {
  it.each([
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5a6f5d528dc32e00094b97d9', // Glock rear sight
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      'build:1234-4568-9011/slot:holster_0/item:5b439b1f86f7744fd8059cbe/mod:mod_reciever/item:5b1faa0f5acfc40dc528aeb5/mod:mod_sight_rear/item:5a6f5d528dc32e00094b97d9',
      {
        item: {
          content: [],
          ignorePrice: false,
          itemId: '5a6f5d528dc32e00094b97d9',
          modSlots: [],
          quantity: 1
        },
        modSlotName: 'mod_sight_rear'
      } as IInventoryModSlot
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5d6e6891a4b9361bd473feea', // 12/70 \"Poleva-3\" slug
        modSlots: [],
        quantity: 20
      },
      'build:0754d5a9-f29d-d68e-ed23-81a61a2b7af1/slot:onSling_0/item:5ddbbeac582ed30a6134e577/mod:mod_magazine/item:5cf8f3b0d7f00c00217872ef/content:0_1/item:5d6e6891a4b9361bd473feea',
      {
        item: {
          content: [
            {
              content: [],
              ignorePrice: false,
              itemId: '5d6e6891a4b9361bd473feea', // 12/70 \"Poleva-3\" slug
              modSlots: [],
              quantity: 20
            }
          ],
          ignorePrice: false,
          itemId: '5cf8f3b0d7f00c00217872ef',
          modSlots: [],
          quantity: 1
        },
        modSlotName: 'mod_magazine'
      } as IInventoryModSlot
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '',
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      'build:1234-4568-9011/slot:holster_0/item:5b439b1f86f7744fd8059cbe/mod:invalid/item:5b1faa0f5acfc40dc528aeb5/mod:mod_sight_rear/item:',
      undefined
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5a6f5d528dc32e00094b97d9',
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      'build:1234-4568-9011/slot:holster/item:invalid/mod:mod_sight_rear/item:5b1faa0f5acfc40dc528aeb5/mod:mod_sight_rear/item:5a6f5d528dc32e00094b97d9',
      undefined
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5a6f5d528dc32e00094b97d9',
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      'build:1234-4568-9011/slot:holster_0/item:5b439b1f86f7744fd8059cbe',
      undefined
    ]
  ])('should get the preset mod slot that contains an item', async (item: IInventoryItem, path: string, expected: IInventoryModSlot | undefined) => {
    // Arrange
    useItemServiceMock()
    useItemFetcherServiceMock()

    const service = new PresetService()
    await service.fetchPresets()

    // Act
    const result = await service.getPresetModSlotContainingItem(item.itemId, path)

    // Assert
    expect(result).toStrictEqual(expected)
  })

  it('should return undefined when the item is different from the preset modslot item', async () => {
    // Arrange
    useItemServiceMock()
    useItemFetcherServiceMock()

    const service = new PresetService()
    await service.fetchPresets()

    const item = {
      content: [],
      ignorePrice: false,
      itemId: '5a7d9122159bd4001438dbf4', // Glock Dead Ringer Snake Eye rear sight
      modSlots: [],
      quantity: 1
    } as IInventoryItem
    const path = 'build:1234-4568-9011/slot:holster_0/item:5b439b1f86f7744fd8059cbe/mod:mod_reciever/item:5b1faa0f5acfc40dc528aeb5/mod:mod_sight_rear/item:5a7d9122159bd4001438dbf4'

    // Act
    const result = await service.getPresetModSlotContainingItem(item.itemId, path)

    // Assert
    expect(result).toBeUndefined()
  })

  it('should return undefined when the preset does not contain the mod slot containing the item', async () => {
    // Arrange
    useItemServiceMock()
    useItemFetcherServiceMock()

    const service = new PresetService()
    await service.fetchPresets()

    const item = {
      content: [],
      ignorePrice: false,
      itemId: '5a6f5d528dc32e00094b97d9', // Glock rear sight
      modSlots: [],
      quantity: 1
    } as IInventoryItem
    const path = 'build:1234-4568-9011/slot:holster_0/item:5b439b1f86f7744fd8059cbe/mod:mod_reciever/item:5b1faa0f5acfc40dc528aeb5/mod:mod_pistol_grip'

    // Act
    const result = await service.getPresetModSlotContainingItem(item.itemId, path)

    // Assert
    expect(result).toBeUndefined()
  })

  it.each([
    ['build:0754d5a9-f29d-d68e-ed23-81a61a2b7af1/slot:onSling_0/item:5ddbbeac582ed30a6134e577/mod:mod_magazine/item:5cf8f3b0d7f00c00217872ef'],
    ['build:0754d5a9-f29d-d68e-ed23-81a61a2b7af1/slot:onSling_0/item:5ddbbeac582ed30a6134e577/mod:mod_magazine/item:5cf8f3b0d7f00c00217872ef/content:0_1/item:5d6e67fba4b9361bc73bc779']
  ])('should return undefined when the preset mod slot does not contain any item', async (path: string) => {
    // Arrange
    useItemServiceMock()

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchItemCategories()).thenResolve(Result.ok(ItemCategoriesMock))
    when(itemFetcherServiceMock.fetchItems()).thenResolve(Result.ok(ItemsMock as IItem[]))
    when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.ok([
      {
        content: [],
        ignorePrice: false,
        itemId: '5ddbbeac582ed30a6134e577', // Saiga-12ga v.10 NERFGUN
        modSlots: [
          {
            item: undefined,
            modSlotName: 'mod_magazine'
          }
        ],
        quantity: 1
      }
    ]))
    when(itemFetcherServiceMock.fetchPrices()).thenResolve(Result.ok(PricesMock as IPrice[]))

    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    const service = new PresetService()
    await service.fetchPresets()

    const item = {
      content: [],
      ignorePrice: false,
      itemId: '5d6e6891a4b9361bd473feea', // 12/70 \"Poleva-3\" slug
      modSlots: [],
      quantity: 20
    } as IInventoryItem
    //const path = 'build:0754d5a9-f29d-d68e-ed23-81a61a2b7af1/slot:onSling_0/item:5ddbbeac582ed30a6134e577/mod:mod_magazine/item:5cf8f3b0d7f00c00217872ef/content:0_1/item:5d6e67fba4b9361bc73bc779'

    // Act
    const result = await service.getPresetModSlotContainingItem(item.itemId, path)

    // Assert
    expect(result).toBeUndefined()
  })

  it('should return undefined when the item is different from the content of the item in the preset modslot', async () => {
    // Arrange
    useItemServiceMock()
    useItemFetcherServiceMock()

    const service = new PresetService()
    await service.fetchPresets()

    const item = {
      content: [],
      ignorePrice: false,
      itemId: '5d6e67fba4b9361bc73bc779', // 12/70 6.5mm Express buckshot
      modSlots: [],
      quantity: 20
    } as IInventoryItem
    const path = 'build:0754d5a9-f29d-d68e-ed23-81a61a2b7af1/slot:onSling_0/item:5ddbbeac582ed30a6134e577/mod:mod_magazine/item:5cf8f3b0d7f00c00217872ef/content:0_1/item:5d6e67fba4b9361bc73bc779'

    // Act
    const result = await service.getPresetModSlotContainingItem(item.itemId, path)

    // Assert
    expect(result).toBeUndefined()
  })
})

describe('isPreset()', () => {
  it.each([
    ['584147732459775a2b6d9f12', true],
    ['5648ac824bdc2ded0b8b457d', false],
    ['5c1d0c5f86f7744bb2683cf0', false]
  ])(
    'should determine if an item is a preset',
    async (itemId: string, expected: boolean) => {
      // Arrange
      useGlobalFilterServiceMock()
      useItemFetcherServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(ItemService)
      Services.configure(ItemPropertiesService)
      Services.configure(InventoryItemService)

      const presetService = new PresetService()
      Services.configure(PresetService, undefined, presetService)

      const itemResult = await Services.get(ItemService).getItem(itemId)

      // Act
      const result = presetService.isPreset(itemResult.value)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('updatePresetProperties', () => {
  it('should update the properties of an armor mod', async () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    useItemServiceMock(
      true,
      [
        {
          armorClass: 1,
          armoredAreas: ['TopOfTheHead'],
          baseItemId: undefined,
          blindnessProtectionPercentage: 0,
          categoryId: 'armorMod',
          conflictingItemIds: [],
          defaultPresetId: 'presetArmorMod',
          durability: 10,
          ergonomicsPercentageModifier: 0.05,
          iconLink: '',
          id: 'baseArmorMod',
          imageLink: '',
          marketLink: '',
          material: 'Aluminum',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          movementSpeedPercentageModifier: 0.04,
          name: 'Base armor mod',
          presetWearableModifiers: undefined,
          prices: [],
          ricochetChance: 'low',
          shortName: 'bam',
          turningSpeedPercentageModifier: 0.03,
          weight: 1,
          wikiLink: ''
        } as IArmorMod,
        {
          armorClass: 1,
          armoredAreas: ['TopOfTheHead'],
          baseItemId: 'baseArmorMod',
          blindnessProtectionPercentage: 0,
          categoryId: 'armorMod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          durability: 10,
          ergonomicsPercentageModifier: 0.05,
          iconLink: '',
          id: 'presetArmorMod',
          imageLink: '',
          marketLink: '',
          material: 'Aluminum',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          movementSpeedPercentageModifier: 0.04,
          name: 'Preset armor mod',
          presetWearableModifiers: undefined,
          prices: [],
          ricochetChance: 'low',
          shortName: 'pam',
          turningSpeedPercentageModifier: 0.03,
          weight: 1,
          wikiLink: ''
        } as IArmorMod,
        {
          armorClass: 1,
          armoredAreas: ['Eyes'],
          baseItemId: undefined,
          blindnessProtectionPercentage: 0,
          categoryId: 'armorMod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          durability: 20,
          ergonomicsPercentageModifier: 0.10,
          iconLink: '',
          id: 'childMod',
          imageLink: '',
          marketLink: '',
          material: 'Glass',
          maxStackableAmount: 1,
          modSlots: [],
          movementSpeedPercentageModifier: 0.20,
          name: 'Child armor mod',
          presetWearableModifiers: undefined,
          prices: [],
          ricochetChance: 'low',
          shortName: 'cam',
          turningSpeedPercentageModifier: 0.30,
          weight: 1,
          wikiLink: ''
        } as IArmorMod
      ],
      undefined)

    const itemFetcherServiceMock = mock<ItemFetcherService>()
    when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.ok(
      [
        {
          content: [],
          ignorePrice: false,
          itemId: 'presetArmorMod',
          modSlots: [
            {
              modSlotName: '',
              item: {
                content: [],
                ignorePrice: false,
                itemId: 'childMod',
                modSlots: [],
                quantity: 1
              }
            }
          ],
          quantity: 1
        }
      ] as IInventoryItem[])))
  Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

  Services.configure(InventoryItemService)
  Services.configure(ItemPropertiesService)

  const presetService = new PresetService()
  await presetService.fetchPresets()

  const itemResult = await Services.get(ItemService).getItem('presetArmorMod')
  const armorMod = itemResult.value as IArmorMod

  // Act
  await presetService.updatePresetProperties([armorMod])

  // Assert
  expect(armorMod.ergonomicsPercentageModifier).toBe(0.05)
  expect(armorMod.presetWearableModifiers).toStrictEqual({
    ergonomicsPercentageModifier: 0.05,
    ergonomicsPercentageModifierWithMods: 0.15,
    movementSpeedPercentageModifier: 0.04,
    movementSpeedPercentageModifierWithMods: 0.24,
    turningSpeedPercentageModifier: 0.03,
    turningSpeedPercentageModifierWithMods: 0.33
  } as IWearableModifiers)
})

it('should update the properties of a headwear', async () => {
  // Arrange
  useTarkovValuesServiceMock()
  useWebsiteConfigurationServiceMock()
  useItemServiceMock(
    true,
    [
      {
        armorClass: 1,
        armoredAreas: ['TopOfTheHead'],
        baseItemId: undefined,
        blocksHeadphones: false,
        categoryId: 'headwear',
        conflictingItemIds: [],
        deafening: 'None',
        defaultPresetId: 'presetHeadwear',
        durability: 10,
        ergonomicsPercentageModifier: 0.05,
        iconLink: '',
        id: 'baseArmorMod',
        imageLink: '',
        marketLink: '',
        material: 'Aluminum',
        maxStackableAmount: 1,
        modSlots: [{
          compatibleItemIds: ['childMod'],
          maxStackableAmount: 1,
          name: 'slot1',
          required: false
        }],
        movementSpeedPercentageModifier: 0.04,
        name: 'Base headwear',
        presetWearableModifiers: undefined,
        prices: [],
        ricochetChance: 'low',
        shortName: 'bh',
        turningSpeedPercentageModifier: 0.03,
        weight: 1,
        wikiLink: ''
      } as IHeadwear,
      {
        armorClass: 1,
        armoredAreas: ['TopOfTheHead'],
        baseItemId: 'baseHeadwear',
        blocksHeadphones: false,
        categoryId: 'armorMod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        deafening: 'None',
        durability: 10,
        ergonomicsPercentageModifier: 0.05,
        iconLink: '',
        id: 'presetHeadwear',
        imageLink: '',
        marketLink: '',
        material: 'Aluminum',
        maxStackableAmount: 1,
        modSlots: [{
          compatibleItemIds: ['childMod'],
          maxStackableAmount: 1,
          name: 'slot1',
          required: false
        }],
        movementSpeedPercentageModifier: 0.04,
        name: 'Preset headwear',
        presetWearableModifiers: undefined,
        prices: [],
        ricochetChance: 'low',
        shortName: 'ph',
        turningSpeedPercentageModifier: 0.03,
        weight: 1,
        wikiLink: ''
      } as IHeadwear,
      {
        armorClass: 1,
        armoredAreas: ['Eyes'],
        baseItemId: undefined,
        blindnessProtectionPercentage: 0,
        categoryId: 'armorMod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        durability: 20,
        ergonomicsPercentageModifier: 0.10,
        iconLink: '',
        id: 'childMod',
        imageLink: '',
        marketLink: '',
        material: 'Glass',
        maxStackableAmount: 1,
        modSlots: [],
        movementSpeedPercentageModifier: 0.20,
        name: 'Child armor mod',
        presetWearableModifiers: undefined,
        prices: [],
        ricochetChance: 'low',
        shortName: 'cam',
        turningSpeedPercentageModifier: 0.30,
        weight: 1,
        wikiLink: ''
      } as IArmorMod
    ],
    undefined)

  const itemFetcherServiceMock = mock<ItemFetcherService>()
  when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.ok(
    [
      {
        content: [],
        ignorePrice: false,
        itemId: 'presetHeadwear',
        modSlots: [
          {
            modSlotName: '',
            item: {
              content: [],
              ignorePrice: false,
              itemId: 'childMod',
              modSlots: [],
              quantity: 1
            }
          }
        ],
        quantity: 1
      }
    ] as IInventoryItem[]))
  Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

  Services.configure(InventoryItemService)
  Services.configure(ItemPropertiesService)

  const presetService = new PresetService()
  await presetService.fetchPresets()

  const itemResult = await Services.get(ItemService).getItem('presetHeadwear')
  const headwear = itemResult.value as IHeadwear

  // Act
  await presetService.updatePresetProperties([headwear])

  // Assert
  expect(headwear.ergonomicsPercentageModifier).toBe(0.05)
  expect(headwear.presetWearableModifiers).toStrictEqual({
    ergonomicsPercentageModifier: 0.05,
    ergonomicsPercentageModifierWithMods: 0.15,
    movementSpeedPercentageModifier: 0.04,
    movementSpeedPercentageModifierWithMods: 0.24,
    turningSpeedPercentageModifier: 0.03,
    turningSpeedPercentageModifierWithMods: 0.33
  } as IWearableModifiers)
})

it('should update the properties of a mod', async () => {
  // Arrange
  useTarkovValuesServiceMock()
  useWebsiteConfigurationServiceMock()
  useItemServiceMock(
    true,
    [
      {
        baseItemId: undefined,
        categoryId: 'mod',
        conflictingItemIds: [],
        defaultPresetId: 'presetMod',
        ergonomicsModifier: 5,
        iconLink: '',
        id: 'baseMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [{
          compatibleItemIds: ['childMod'],
          maxStackableAmount: 1,
          name: 'slot1',
          required: false
        }],
        name: 'Base mod',
        presetErgonomicsModifier: undefined,
        prices: [],
        shortName: 'bm',
        weight: 1,
        wikiLink: ''
      } as IMod,
      {
        baseItemId: 'baseMod',
        categoryId: 'mod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 5,
        iconLink: '',
        id: 'presetMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [{
          compatibleItemIds: ['childMod'],
          maxStackableAmount: 1,
          name: 'slot1',
          required: false
        }],
        name: 'Preset mod',
        presetErgonomicsModifier: undefined,
        prices: [],
        shortName: 'pm',
        weight: 1,
        wikiLink: ''
      } as IMod,
      {
        baseItemId: undefined,
        categoryId: 'mod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 10,
        iconLink: '',
        id: 'childMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [],
        name: 'Child mod',
        presetErgonomicsModifier: undefined,
        prices: [],
        shortName: 'cm',
        weight: 1,
        wikiLink: ''
      } as IMod
    ],
    undefined)

  const itemFetcherServiceMock = mock<ItemFetcherService>()
  when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.ok(
    [
      {
        content: [],
        ignorePrice: false,
        itemId: 'presetMod',
        modSlots: [
          {
            modSlotName: '',
            item: {
              content: [],
              ignorePrice: false,
              itemId: 'childMod',
              modSlots: [],
              quantity: 1
            }
          }
        ],
        quantity: 1
      }
    ] as IInventoryItem[]))
  Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

  Services.configure(InventoryItemService)
  Services.configure(ItemPropertiesService)

  const presetService = new PresetService()
  await presetService.fetchPresets()

  const itemResult = await Services.get(ItemService).getItem('presetMod')
  const mod = itemResult.value as IMod

  // Act
  await presetService.updatePresetProperties([mod])

  // Assert
  expect(mod.ergonomicsModifier).toBe(5)
  expect(mod.presetErgonomicsModifier).toBe(15)
})

it('should update the properties of a ranged weapon', async () => {
  // Arrange
  useItemFetcherServiceMock()
  useItemServiceMock()
  useTarkovValuesServiceMock()
  useWebsiteConfigurationServiceMock()
  Services.configure(InventoryItemService)
  Services.configure(ItemPropertiesService)

  const presetService = new PresetService()
  await presetService.fetchPresets()

  const itemResult = await Services.get(ItemService).getItem('584147732459775a2b6d9f12') // Kalashnikov AKS-74U 5.45x39 assault rifle Default
  const rangedWeapon = itemResult.value as IRangedWeapon

  // Act
  await presetService.updatePresetProperties([rangedWeapon])

  // Assert
  expect(rangedWeapon.ergonomics).toBe(44)
  expect(rangedWeapon.horizontalRecoil).toBe(415)
  expect(rangedWeapon.verticalRecoil).toBe(121)
  expect(rangedWeapon.presetErgonomics).toBe(64)
  expect(rangedWeapon.presetHorizontalRecoil).toBe(257)
  expect(rangedWeapon.presetVerticalRecoil).toBe(75)
})

it('should update the properties of a ranged weapond mod', async () => {
  // Arrange
  useTarkovValuesServiceMock()
  useWebsiteConfigurationServiceMock()
  useItemServiceMock(
    true,
    [
      {
        accuracyPercentageModifier: 0.04,
        baseItemId: undefined,
        categoryId: 'rangedWeaponMod',
        conflictingItemIds: [],
        defaultPresetId: 'presetRangedWeaponMod',
        ergonomicsModifier: 5,
        iconLink: '',
        id: 'baseRangedWeaponMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [{
          compatibleItemIds: ['childMod'],
          maxStackableAmount: 1,
          name: 'slot1',
          required: false
        }],
        name: 'Base ranged weapon mod',
        presetErgonomicsModifier: undefined,
        presetRecoilPercentageModifier: undefined,
        prices: [],
        recoilPercentageModifier: 0.06,
        shortName: 'brwm',
        weight: 1,
        wikiLink: ''
      } as IRangedWeaponMod,
      {
        accuracyPercentageModifier: 0.04,
        baseItemId: 'baseRangedWeaponMod',
        categoryId: 'rangedWeaponMod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 5,
        iconLink: '',
        id: 'presetRangedWeaponMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [{
          compatibleItemIds: ['childMod'],
          maxStackableAmount: 1,
          name: 'slot1',
          required: false
        }],
        name: 'Preset ranged weapon mod',
        presetErgonomicsModifier: undefined,
        presetRecoilPercentageModifier: undefined,
        prices: [],
        recoilPercentageModifier: 0.06,
        shortName: 'prwm',
        weight: 1,
        wikiLink: ''
      } as IRangedWeaponMod,
      {
        accuracyPercentageModifier: 0.03,
        baseItemId: undefined,
        categoryId: 'rangedWeaponMod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 10,
        iconLink: '',
        id: 'childMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [],
        name: 'Child ranged weapon mod',
        presetErgonomicsModifier: undefined,
        presetRecoilPercentageModifier: undefined,
        prices: [],
        recoilPercentageModifier: 0.2,
        shortName: 'crwm',
        weight: 1,
        wikiLink: ''
      } as IRangedWeaponMod
    ],
    undefined)

  const itemFetcherServiceMock = mock<ItemFetcherService>()
  when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.ok(
    [
      {
        content: [],
        ignorePrice: false,
        itemId: 'presetRangedWeaponMod',
        modSlots: [
          {
            modSlotName: '',
            item: {
              content: [],
              ignorePrice: false,
              itemId: 'childMod',
              modSlots: [],
              quantity: 1
            }
          }
        ],
        quantity: 1
      }
    ] as IInventoryItem[]))
  Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

  Services.configure(InventoryItemService)
  Services.configure(ItemPropertiesService)

  const presetService = new PresetService()
  await presetService.fetchPresets()

  const itemResult = await Services.get(ItemService).getItem('presetRangedWeaponMod')
  const rangedWeaponMod = itemResult.value as IRangedWeaponMod

  // Act
  await presetService.updatePresetProperties([rangedWeaponMod])

  // Assert
  expect(rangedWeaponMod.accuracyPercentageModifier).toBe(0.04)
  expect(rangedWeaponMod.ergonomicsModifier).toBe(5)
  expect(rangedWeaponMod.recoilPercentageModifier).toBe(0.06)
  expect(rangedWeaponMod.presetErgonomicsModifier).toBe(15)
  expect(rangedWeaponMod.presetRecoilPercentageModifier).toBe(0.26)
})

it('should should do nothing to an item that is not a preset', async () => {
  // Arrange
  useTarkovValuesServiceMock()
  useWebsiteConfigurationServiceMock()
  useItemServiceMock(
    true,
    [
      {
        baseItemId: undefined,
        categoryId: 'mod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 5,
        iconLink: '',
        id: 'nonPresetMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [{
          compatibleItemIds: ['childMod'],
          maxStackableAmount: 1,
          name: 'slot1',
          required: false
        }],
        name: 'Non preset mod',
        presetErgonomicsModifier: undefined,
        prices: [],
        shortName: 'pm',
        weight: 1,
        wikiLink: ''
      } as IMod,
      {
        baseItemId: undefined,
        categoryId: 'mod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 10,
        iconLink: '',
        id: 'childMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [],
        name: 'Child mod',
        presetErgonomicsModifier: undefined,
        prices: [],
        shortName: 'cm',
        weight: 1,
        wikiLink: ''
      } as IMod
    ],
    undefined)

  const itemFetcherServiceMock = mock<ItemFetcherService>()
  when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.ok([] as IInventoryItem[]))
  Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

  Services.configure(InventoryItemService)
  Services.configure(ItemPropertiesService)

  const presetService = new PresetService()
  const itemResult = await Services.get(ItemService).getItem('nonPresetMod')
  const mod = itemResult.value as IMod

  // Act
  await presetService.updatePresetProperties([mod])

  // Assert
  expect(mod.ergonomicsModifier).toBe(5)
  expect(mod.presetErgonomicsModifier).toBe(undefined)
})

it('should log presets it did not find', async () => {
  // Arrange
  useTarkovValuesServiceMock()
  useWebsiteConfigurationServiceMock()
  useItemServiceMock(
    true,
    [
      {
        baseItemId: undefined,
        categoryId: 'mod',
        conflictingItemIds: [],
        defaultPresetId: 'presetMod',
        ergonomicsModifier: 5,
        iconLink: '',
        id: 'baseMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [{
          compatibleItemIds: ['childMod'],
          maxStackableAmount: 1,
          name: 'slot1',
          required: false
        }],
        name: 'Base mod',
        presetErgonomicsModifier: undefined,
        prices: [],
        shortName: 'bm',
        weight: 1,
        wikiLink: ''
      } as IMod,
      {
        baseItemId: 'baseMod',
        categoryId: 'mod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 5,
        iconLink: '',
        id: 'presetMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [{
          compatibleItemIds: ['childMod'],
          maxStackableAmount: 1,
          name: 'slot1',
          required: false
        }],
        name: 'Preset mod',
        presetErgonomicsModifier: undefined,
        prices: [],
        shortName: 'pm',
        weight: 1,
        wikiLink: ''
      } as IMod,
      {
        baseItemId: undefined,
        categoryId: 'mod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 10,
        iconLink: '',
        id: 'childMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [],
        name: 'Child mod',
        presetErgonomicsModifier: undefined,
        prices: [],
        shortName: 'cm',
        weight: 1,
        wikiLink: ''
      } as IMod
    ],
    undefined)

  const itemFetcherServiceMock = mock<ItemFetcherService>()
  when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.ok([] as IInventoryItem[]))
  Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

  Services.configure(InventoryItemService)
  Services.configure(ItemPropertiesService)

  const logServiceMock = mock<LogService>()
  Services.configure(LogService, undefined, instance(logServiceMock))

  const presetService = new PresetService()
  const itemResult = await Services.get(ItemService).getItem('presetMod')
  const mod = itemResult.value as IMod

  // Act
  await presetService.updatePresetProperties([mod])

  // Assert
  verify(logServiceMock.logError(anyString())).once()
  expect(mod.ergonomicsModifier).toBe(5)
  expect(mod.presetErgonomicsModifier).toBe(undefined)
})

it.each([
  ['presetArmorMod', true, true, true, true],
  ['presetMod', true, true, true, true],
  ['presetRangedWeaponMod', true, true, true, true],
  ['presetRangedWeaponMod', false, true, true, true],
  ['584147732459775a2b6d9f12', true, true, true, true],
  ['584147732459775a2b6d9f12', false, true, true, true]
])('should log presets it cannot update', async (
  presetId: string,
  ergonomicsFailure: boolean,
  wearableModifiersFailure: boolean,
  recoilFailure: boolean,
  recoilPercentageModifierFailure: boolean) => {
  // Arrange
  useTarkovValuesServiceMock()
  useWebsiteConfigurationServiceMock()
  useItemServiceMock(
    true,
    [
      {
        armorClass: 1,
        armoredAreas: ['TopOfTheHead'],
        baseItemId: 'baseArmorMod',
        blindnessProtectionPercentage: 0,
        categoryId: 'armorMod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        durability: 10,
        ergonomicsPercentageModifier: 0.05,
        iconLink: '',
        id: 'presetArmorMod',
        imageLink: '',
        marketLink: '',
        material: 'Aluminum',
        maxStackableAmount: 1,
        modSlots: [],
        movementSpeedPercentageModifier: 0.04,
        name: 'Preset armor mod',
        presetWearableModifiers: undefined,
        prices: [],
        ricochetChance: 'low',
        shortName: 'pam',
        turningSpeedPercentageModifier: 0.03,
        weight: 1,
        wikiLink: ''
      } as IArmorMod,
      {
        baseItemId: 'baseMod',
        categoryId: 'mod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 5,
        iconLink: '',
        id: 'presetMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [],
        name: 'Preset mod',
        presetErgonomicsModifier: undefined,
        prices: [],
        shortName: 'pm',
        weight: 1,
        wikiLink: ''
      } as IMod,
      {
        accuracyPercentageModifier: 0.04,
        baseItemId: 'baseRangedWeaponMod',
        categoryId: 'rangedWeaponMod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 5,
        iconLink: '',
        id: 'presetRangedWeaponMod',
        imageLink: '',
        marketLink: '',
        maxStackableAmount: 1,
        modSlots: [],
        name: 'Preset ranged weapon mod',
        presetErgonomicsModifier: undefined,
        presetRecoilPercentageModifier: undefined,
        prices: [],
        recoilPercentageModifier: 0.06,
        shortName: 'prwm',
        weight: 1,
        wikiLink: ''
      } as IRangedWeaponMod,
      {
        baseItemId: '57dc2fa62459775949412633',
        caliber: 'Caliber545x39',
        defaultPresetId: undefined,
        ergonomics: 44,
        fireModes: ['SingleFire', 'FullAuto'],
        fireRate: 650,
        horizontalRecoil: 415,
        minuteOfAngle: 3.44,
        modSlots: [],
        verticalRecoil: 121,
        categoryId: 'mainWeapon',
        conflictingItemIds: [],
        iconLink: 'https://assets.tarkov.dev/584147732459775a2b6d9f12-icon.webp',
        id: '584147732459775a2b6d9f12',
        imageLink: 'https://assets.tarkov.dev/584147732459775a2b6d9f12-image.webp',
        maxStackableAmount: 1,
        marketLink: 'https://tarkov.dev/item/kalashnikov-aks-74u-545x39-assault-rifle-default',
        name: 'Kalashnikov AKS-74U 5.45x39 assault rifle Default',
        presetErgonomics: undefined,
        presetHorizontalRecoil: undefined,
        presetVerticalRecoil: undefined,
        prices: [],
        shortName: 'AKS-74U Default',
        weight: 1.809,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kalashnikov_AKS-74U_5.45x39_assault_rifle'
      } as IRangedWeapon
    ],
    undefined)

  const inventoryItemServiceMock = mock<InventoryItemService>()
  when(inventoryItemServiceMock.getErgonomics(anything()))
    .thenResolve(
      ergonomicsFailure
        ? Result.fail(FailureType.error)
        : Result.ok({
          ergonomics: 0,
          ergonomicsWithMods: 0
        } as IErgonomics))
  when(inventoryItemServiceMock.getWearableModifiers(anything()))
    .thenResolve(
      wearableModifiersFailure
        ? Result.fail(FailureType.error)
        : Result.ok({
          ergonomicsPercentageModifier: 0,
          ergonomicsPercentageModifierWithMods: 0,
          movementSpeedPercentageModifier: 0,
          movementSpeedPercentageModifierWithMods: 0,
          turningSpeedPercentageModifier: 0,
          turningSpeedPercentageModifierWithMods: 0
        } as IWearableModifiers))
  when(inventoryItemServiceMock.getRecoil(anything()))
    .thenResolve(
      recoilFailure
        ? Result.fail(FailureType.error)
        : Result.ok({
          horizontalRecoil: 0,
          horizontalRecoilWithMods: 0,
          verticalRecoil: 0,
          verticalRecoilWithMods: 0
        } as IRecoil))
  when(inventoryItemServiceMock.getRecoilPercentageModifier(anything()))
    .thenResolve(
      recoilPercentageModifierFailure
        ? Result.fail(FailureType.error)
        : Result.ok({
          recoilPercentageModifier: 0,
          recoilPercentageModifierWithMods: 0
        } as IRecoilPercentageModifier))
  Services.configure(InventoryItemService, undefined, instance(inventoryItemServiceMock))

  const itemFetcherServiceMock = mock<ItemFetcherService>()
  when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.ok([
    {
      content: [],
      ignorePrice: false,
      itemId: 'presetArmorMod',
      modSlots: [
        {
          modSlotName: '',
          item: {
            content: [],
            ignorePrice: false,
            itemId: 'childMod',
            modSlots: [],
            quantity: 1
          }
        }
      ],
      quantity: 1
    },
    {
      content: [],
      ignorePrice: false,
      itemId: 'presetMod',
      modSlots: [
        {
          modSlotName: '',
          item: {
            content: [],
            ignorePrice: false,
            itemId: 'childMod',
            modSlots: [],
            quantity: 1
          }
        }
      ],
      quantity: 1
    },
    {
      content: [],
      ignorePrice: false,
      itemId: 'presetRangedWeaponMod',
      modSlots: [
        {
          modSlotName: '',
          item: {
            content: [],
            ignorePrice: false,
            itemId: 'childMod',
            modSlots: [],
            quantity: 1
          }
        }
      ],
      quantity: 1
    },
    {
      content: [],
      ignorePrice: false,
      itemId: '584147732459775a2b6d9f12',
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '57e3dba62459770f0c32322b',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_pistol_grip'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '57dc347d245977596754e7a1',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_stock'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '564ca99c4bdc2d16268b4589',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_magazine'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '57dc324a24597759501edc20',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_muzzle'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '57dc334d245977597164366f',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_reciever'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '59d36a0086f7747e673f3946',
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '57dc32dc245977596d4ef3d3',
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_handguard'
              }
            ],
            quantity: 1
          },
          modSlotName: 'mod_gas_block'
        }
      ],
      quantity: 1
    }
  ] as IInventoryItem[]))
  Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

  Services.configure(ItemPropertiesService)

  const logServiceMock = mock<LogService>()
  Services.configure(LogService, undefined, instance(logServiceMock))

  const presetService = new PresetService()
  await presetService.fetchPresets()

  const itemResult = await Services.get(ItemService).getItem(presetId)
  const originalItem = { ...itemResult.value }

  // Act
  await presetService.updatePresetProperties([itemResult.value])

  // Assert
  verify(logServiceMock.logError(anyString())).once()
  expect(itemResult.value).toStrictEqual(originalItem)
})
})
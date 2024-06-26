import { anyString, anything, instance, mock, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IInventoryModSlot } from '../../models/build/IInventoryModSlot'
import { IArmor } from '../../models/item/IArmor'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IMod } from '../../models/item/IMod'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import { IErgonomics } from '../../models/utils/IErgonomics'
import { IInventoryItemRecoil } from '../../models/utils/IInventoryItemRecoil'
import { IInventoryItemWearableModifiers } from '../../models/utils/IInventoryItemWearableModifiers'
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
import { ak12bt, ammo545bp, ammo545us, ammo9mmGT, armor6b13FlDefault, bansheeDefault, iskra, m9a3Cap, m9a3Default, m9a3Magazine, m9a3Rs, m9a3Slide, m9a3Thr, rpk16Default, rpk16Drum, srd9 } from '../__data__/itemMocks'
import { PresetMocks, rpk16DefaultPreset } from '../__data__/presetMocks'
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
    when(itemFetcherServiceMock.fetchPresets()).thenResolve(Result.ok(PresetMocks))
    Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

    const presetService = new PresetService()

    // Act
    await presetService.fetchPresets()
    const preset = presetService.getPreset(rpk16Default.id)

    // Assert
    expect(preset).toStrictEqual(rpk16DefaultPreset)
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
      rpk16Default.id,
      rpk16DefaultPreset
    ],
    [
      iskra.id, // IFAK individual first aid kit
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
        itemId: m9a3Rs.id,
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      `build:1234-4568-9011/slot:holster_0/item:${m9a3Default.id}/mod:mod_reciever/item:${m9a3Slide.id}/mod:mod_sight_rear/item:${m9a3Rs.id}`,
      {
        item: {
          content: [],
          ignorePrice: false,
          itemId: m9a3Rs.id,
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
        itemId: '',
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      `build:1234-4568-9011/slot:holster_0/item:${m9a3Default.id}/mod:invalid/item:${m9a3Slide.id}/mod:mod_sight_rear/item:`,
      undefined
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: m9a3Rs.id,
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      `build:1234-4568-9011/slot:holster/item:invalid/mod:mod_sight_rear/item:${m9a3Slide.id}/mod:mod_sight_rear/item:${m9a3Rs.id}`,
      undefined
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: m9a3Rs.id,
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      `build:1234-4568-9011/slot:holster_0/item:${m9a3Default.id}`,
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

  it('should get the preset mod slot that contains an item in its content', async () => {
    // Arrange
    useItemServiceMock()
    useItemFetcherServiceMock(
      undefined,
      [
        {
          content: [],
          itemId: m9a3Default.id,
          ignorePrice: false,
          modSlots: [
            {
              item: {
                content: [
                  {
                    content: [],
                    ignorePrice: false,
                    itemId: ammo9mmGT.id,
                    modSlots: [],
                    quantity: 17
                  }
                ],
                itemId: m9a3Magazine.id,
                ignorePrice: false,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_magazine'
            }
          ],
          quantity: 1
        }
      ])

    const service = new PresetService()
    await service.fetchPresets()

    // Act
    const result = await service.getPresetModSlotContainingItem(
      ammo9mmGT.id,
      `build:0754d5a9-f29d-d68e-ed23-81a61a2b7af1/slot:holster/item:${m9a3Default.id}/mod:mod_magazine/item:${m9a3Magazine.id}/content:0_1/item:${ammo9mmGT.id}`)

    // Assert
    expect(result).toStrictEqual({
      item: {
        content: [
          {
            content: [],
            ignorePrice: false,
            itemId: ammo9mmGT.id,
            modSlots: [],
            quantity: 17
          }
        ],
        ignorePrice: false,
        itemId: m9a3Magazine.id,
        modSlots: [],
        quantity: 1
      },
      modSlotName: 'mod_magazine'
    } as IInventoryModSlot)
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
      itemId: srd9.id,
      modSlots: [],
      quantity: 1
    } as IInventoryItem
    const path = `build:1234-4568-9011/slot:holster_0/item:${m9a3Default.id}/mod:mod_barrel/item:${m9a3Thr.id}/mod:mod_muzzle/item:${m9a3Cap.id}`

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
      itemId: m9a3Rs.id,
      modSlots: [],
      quantity: 1
    } as IInventoryItem
    const path = `build:1234-4568-9011/slot:holster_0/item:${m9a3Default.id}/mod:mod_reciever/item:${m9a3Slide.id}/mod:mod_pistol_grip`

    // Act
    const result = await service.getPresetModSlotContainingItem(item.itemId, path)

    // Assert
    expect(result).toBeUndefined()
  })

  it.each([
    [`build:0754d5a9-f29d-d68e-ed23-81a61a2b7af1/slot:onSling_0/item:${m9a3Default.id}/mod:mod_magazine/item:${m9a3Magazine.id}`],
    [`build:0754d5a9-f29d-d68e-ed23-81a61a2b7af1/slot:onSling_0/item:${m9a3Default.id}/mod:mod_magazine/item:${m9a3Magazine.id}/content:0_1/item:${ammo9mmGT.id}`]
  ])('should return undefined when the preset mod slot does not contain any item', async (path: string) => {
    // Arrange
    useItemServiceMock()
    useItemFetcherServiceMock(
      undefined,
      [
        {
          content: [],
          itemId: m9a3Default.id,
          ignorePrice: false,
          modSlots: [
            {
              item: undefined,
              modSlotName: 'mod_reciever'
            }
          ],
          quantity: 1
        }
      ]
    )

    const service = new PresetService()
    await service.fetchPresets()

    const item = {
      content: [],
      ignorePrice: false,
      itemId: ammo9mmGT.id,
      modSlots: [],
      quantity: 20
    } as IInventoryItem

    // Act
    const result = await service.getPresetModSlotContainingItem(item.itemId, path)

    // Assert
    expect(result).toBeUndefined()
  })

  it('should return undefined when the item is different from the content of the item in the preset modslot', async () => {
    // Arrange
    useItemServiceMock()
    useItemFetcherServiceMock(
      undefined,
      [
        {
          content: [],
          itemId: rpk16Default.id,
          ignorePrice: false,
          modSlots: [
            {
              item: {
                content: [
                  {
                    content: [],
                    ignorePrice: false,
                    itemId: ammo545us.id,
                    modSlots: [],
                    quantity: 95
                  }
                ],
                itemId: rpk16Drum.id,
                ignorePrice: false,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_magazine'
            }
          ],
          quantity: 1
        }
      ])

    const service = new PresetService()
    await service.fetchPresets()

    const item: IInventoryItem = {
      content: [],
      ignorePrice: false,
      itemId: ammo545bp.id,
      modSlots: [],
      quantity: 95
    }
    const path = `build:0754d5a9-f29d-d68e-ed23-81a61a2b7af1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_magazine/item:${rpk16Drum.id}/content:0_1/item:${ammo545us.id}`

    // Act
    const result = await service.getPresetModSlotContainingItem(item.itemId, path)

    // Assert
    expect(result).toBeUndefined()
  })
})

describe('isPreset()', () => {
  it.each([
    [rpk16Default.id, true],
    [ak12bt.id, false],
    [iskra.id, false]
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
  it('should update the properties of an armor', async () => {
    // Arrange
    useItemFetcherServiceMock()
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)

    const presetService = new PresetService()
    await presetService.fetchPresets()

    const itemResult = await Services.get(ItemService).getItem(armor6b13FlDefault.id)
    const armor = itemResult.value as IArmor

    // Act
    await presetService.updatePresetProperties([armor])

    // Assert
    expect(armor.presetWearableModifiers).toStrictEqual({
      ergonomicsPercentageModifier: -0.01,
      ergonomicsPercentageModifierWithMods: -0.025,
      movementSpeedPercentageModifier: -0.01,
      movementSpeedPercentageModifierWithMods: -0.060000000000000005,
      turningSpeedPercentageModifier: 0,
      turningSpeedPercentageModifierWithMods: -0.01
    } as IWearableModifiers)
  })

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
          modSlots: [
            {
              compatibleItemIds: ['childMod'],
              maxStackableAmount: 1,
              name: 'slot1',
              required: false
            }
          ],
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
          modSlots: [
            {
              compatibleItemIds: ['childMod'],
              maxStackableAmount: 1,
              name: 'slot1',
              required: false
            }
          ],
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
      ] as IInventoryItem[]))
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
      ergonomicsPercentageModifierWithMods: 0.15000000000000002,
      movementSpeedPercentageModifier: 0.04,
      movementSpeedPercentageModifierWithMods: 0.24000000000000002,
      turningSpeedPercentageModifier: 0.03,
      turningSpeedPercentageModifierWithMods: 0.32999999999999996
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
          modSlots: [
            {
              compatibleItemIds: ['childMod'],
              maxStackableAmount: 1,
              name: 'slot1',
              required: false
            }
          ],
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
          modSlots: [
            {
              compatibleItemIds: ['childMod'],
              maxStackableAmount: 1,
              name: 'slot1',
              required: false
            }
          ],
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
      ergonomicsPercentageModifierWithMods: 0.15000000000000002,
      movementSpeedPercentageModifier: 0.04,
      movementSpeedPercentageModifierWithMods: 0.24000000000000002,
      turningSpeedPercentageModifier: 0.03,
      turningSpeedPercentageModifierWithMods: 0.32999999999999996
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
          modSlots: [
            {
              compatibleItemIds: ['childMod'],
              maxStackableAmount: 1,
              name: 'slot1',
              required: false
            }
          ],
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
          modSlots: [
            {
              compatibleItemIds: ['childMod'],
              maxStackableAmount: 1,
              name: 'slot1',
              required: false
            }
          ],
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

    const itemResult = await Services.get(ItemService).getItem(rpk16Default.id)
    const rangedWeapon = itemResult.value as IRangedWeapon

    // Act
    await presetService.updatePresetProperties([rangedWeapon])

    // Assert
    expect(rangedWeapon.ergonomics).toBe(45)
    expect(rangedWeapon.horizontalRecoil).toBe(333)
    expect(rangedWeapon.verticalRecoil).toBe(112)
    expect(rangedWeapon.presetErgonomics).toBe(62)
    expect(rangedWeapon.presetHorizontalRecoil).toBe(226.44)
    expect(rangedWeapon.presetVerticalRecoil).toBe(76.16)
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
          modSlots: [
            {
              compatibleItemIds: ['childMod'],
              maxStackableAmount: 1,
              name: 'slot1',
              required: false
            }
          ],
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
          modSlots: [
            {
              compatibleItemIds: ['childMod'],
              maxStackableAmount: 1,
              name: 'slot1',
              required: false
            }
          ],
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

  it('should update the properties of a vest', async () => {
    // Arrange
    useItemFetcherServiceMock()
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)

    const presetService = new PresetService()
    await presetService.fetchPresets()

    const itemResult = await Services.get(ItemService).getItem(bansheeDefault.id)
    const armor = itemResult.value as IArmor

    // Act
    await presetService.updatePresetProperties([armor])

    // Assert
    expect(armor.presetWearableModifiers).toStrictEqual({
      ergonomicsPercentageModifier: -0.01,
      ergonomicsPercentageModifierWithMods: -0.03,
      movementSpeedPercentageModifier: -0.01,
      movementSpeedPercentageModifierWithMods: -0.03,
      turningSpeedPercentageModifier: -0.01,
      turningSpeedPercentageModifierWithMods: -0.01
    } as IWearableModifiers)
  })

  it('should do nothing to an item that is not a preset', async () => {
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
          modSlots: [
            {
              compatibleItemIds: ['childMod'],
              maxStackableAmount: 1,
              name: 'slot1',
              required: false
            }
          ],
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
          modSlots: [
            {
              compatibleItemIds: ['childMod'],
              maxStackableAmount: 1,
              name: 'slot1',
              required: false
            }
          ],
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
          modSlots: [
            {
              compatibleItemIds: ['childMod'],
              maxStackableAmount: 1,
              name: 'slot1',
              required: false
            }
          ],
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
          } as IInventoryItemWearableModifiers))
    when(inventoryItemServiceMock.getRecoil(anything()))
      .thenResolve(
        recoilFailure
          ? Result.fail(FailureType.error)
          : Result.ok({
            horizontalRecoil: 0,
            horizontalRecoilWithMods: 0,
            verticalRecoil: 0,
            verticalRecoilWithMods: 0
          } as IInventoryItemRecoil))
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
import { anything, instance, mock, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IInventoryModSlot } from '../../models/build/IInventoryModSlot'
import { IArmor } from '../../models/item/IArmor'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IHeadwear } from '../../models/item/IHeadwear'
import { ItemCategoryId } from '../../models/item/IItem'
import { IMod } from '../../models/item/IMod'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import { IVest } from '../../models/item/IVest'
import { InventoryItemService } from '../../services/InventoryItemService'
import { ItemFetcherService } from '../../services/ItemFetcherService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ItemService } from '../../services/ItemService'
import { LogService } from '../../services/LogService'
import { PresetService } from '../../services/PresetService'
import Services from '../../services/repository/Services'
import { ak12bt, ammo545bp, ammo545us, ammo9mmGT, armor6b13FlDefault, bansheeDefault, iskra, m9a3Default, m9a3Magazine, m9a3Prot, m9a3Rs, m9a3Slide, m9a3Thr, rpk16Default, rpk16Drum, srd9 } from '../__data__/itemMocks'
import { PresetMocks, rpk16DefaultPreset } from '../__data__/presetMocks'
import { useGlobalFilterServiceMock } from '../__mocks__/GlobalFilterServiceMock'
import { useItemFetcherServiceMock } from '../__mocks__/ItemFetcherServiceMock'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('PresetService', () => {
  describe('fetchPresetsAsync', () => {
    it('should fetch presets', async () => {
      // Arrange
      useItemServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()

      const itemFetcherServiceMock = mock<ItemFetcherService>()
      when(itemFetcherServiceMock.fetchPresetsAsync()).thenResolve(PresetMocks)
      Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

      const presetService = new PresetService()

      // Act
      const result = await presetService.fetchPresetsAsync()
      const preset = presetService.getPreset(rpk16Default.id)

      // Assert
      expect(result).toBe(true)
      expect(preset).toStrictEqual(rpk16DefaultPreset)
    })

    it('should return false when fetching fails', async () => {
      // Arrange
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()

      const itemFetcherServiceMock = mock<ItemFetcherService>()
      when(itemFetcherServiceMock.fetchPresetsAsync()).thenResolve(undefined)
      Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))


      // Act
      const presetService = new PresetService()
      const result = await presetService.fetchPresetsAsync()

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('getPreset', () => {
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
      await service.fetchPresetsAsync()

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
      await service.fetchPresetsAsync()

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
      await service.fetchPresetsAsync()

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
      await service.fetchPresetsAsync()

      const item = {
        content: [],
        ignorePrice: false,
        itemId: srd9.id,
        modSlots: [],
        quantity: 1
      } as IInventoryItem
      const path = `build:1234-4568-9011/slot:holster_0/item:${m9a3Default.id}/mod:mod_barrel/item:${m9a3Thr.id}/mod:mod_muzzle/item:${m9a3Prot.id}`

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
      await service.fetchPresetsAsync()

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
      await service.fetchPresetsAsync()

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
      await service.fetchPresetsAsync()

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

  describe('isPreset', () => {
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

        const item = await Services.get(ItemService).getItemAsync(itemId)

        // Act
        const result = presetService.isPreset(item)

        // Assert
        expect(result).toBe(expected)
      }
    )
  })

  describe('updatePresetPropertiesAsync', () => {
    it('should update the properties of an armor', async () => {
      // Arrange
      useItemFetcherServiceMock()
      useItemServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(InventoryItemService)
      Services.configure(ItemPropertiesService)

      const presetService = new PresetService()
      await presetService.fetchPresetsAsync()

      const item = await Services.get(ItemService).getItemAsync(armor6b13FlDefault.id)
      const armor = item as IArmor

      // Act
      await presetService.updatePresetPropertiesAsync([armor])

      // Assert
      expect(armor.weight).toBe(2.8)
      expect(armor.presetWeight).toBe(10.6)

      expect(armor.ergonomicsModifierPercentage).toBe(-0.01)
      expect(armor.presetWearableModifiers?.ergonomicsModifierPercentage).toBe(-0.025)

      expect(armor.movementSpeedModifierPercentage).toBe(-0.01)
      expect(armor.presetWearableModifiers?.movementSpeedModifierPercentage).toBe(-0.060000000000000005)

      expect(armor.turningSpeedModifierPercentage).toBe(0)
      expect(armor.presetWearableModifiers?.turningSpeedModifierPercentage).toBe(-0.01)
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
            categoryId: ItemCategoryId.armorMod,
            conflictingItemIds: [],
            defaultPresetId: 'presetArmorMod',
            durability: 10,
            ergonomicsModifierPercentage: 0.05,
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
            movementSpeedModifierPercentage: 0.04,
            name: 'Base armor mod',
            presetArmorModifiers: undefined,
            presetWeight: undefined,
            presetWearableModifiers: undefined,
            prices: [],
            ricochetChance: 'low',
            shortName: 'bam',
            turningSpeedModifierPercentage: 0.03,
            weight: 1,
            wikiLink: ''
          } as IArmorMod,
          {
            armorClass: 1,
            armoredAreas: ['TopOfTheHead'],
            baseItemId: 'baseArmorMod',
            blindnessProtectionPercentage: 0,
            categoryId: ItemCategoryId.armorMod,
            conflictingItemIds: [],
            defaultPresetId: undefined,
            durability: 10,
            ergonomicsModifierPercentage: 0.05,
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
            movementSpeedModifierPercentage: 0.04,
            name: 'Preset armor mod',
            presetArmorModifiers: undefined,
            presetWeight: undefined,
            presetWearableModifiers: undefined,
            prices: [],
            ricochetChance: 'low',
            shortName: 'pam',
            turningSpeedModifierPercentage: 0.03,
            weight: 1,
            wikiLink: ''
          } as IArmorMod,
          {
            armorClass: 1,
            armoredAreas: ['Eyes'],
            baseItemId: undefined,
            blindnessProtectionPercentage: 0,
            categoryId: ItemCategoryId.armorMod,
            conflictingItemIds: [],
            defaultPresetId: undefined,
            durability: 20,
            ergonomicsModifierPercentage: 0.10,
            iconLink: '',
            id: 'childMod',
            imageLink: '',
            marketLink: '',
            material: 'Glass',
            maxStackableAmount: 1,
            modSlots: [],
            movementSpeedModifierPercentage: 0.20,
            name: 'Child armor mod',
            presetArmorModifiers: undefined,
            presetWeight: undefined,
            presetWearableModifiers: undefined,
            prices: [],
            ricochetChance: 'low',
            shortName: 'cam',
            turningSpeedModifierPercentage: 0.30,
            weight: 1,
            wikiLink: ''
          } as IArmorMod
        ],
        undefined)

      const itemFetcherServiceMock = mock<ItemFetcherService>()
      when(itemFetcherServiceMock.fetchPresetsAsync()).thenResolve(
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
        ] as IInventoryItem[])
      Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

      Services.configure(InventoryItemService)
      Services.configure(ItemPropertiesService)

      const presetService = new PresetService()
      await presetService.fetchPresetsAsync()

      const item = await Services.get(ItemService).getItemAsync('presetArmorMod')
      const armorMod = item as IArmorMod

      // Act
      await presetService.updatePresetPropertiesAsync([armorMod])

      // Assert
      expect(armorMod.weight).toBe(1)
      expect(armorMod.presetWeight).toBe(2)

      expect(armorMod.ergonomicsModifierPercentage).toBe(0.05)
      expect(armorMod.presetWearableModifiers?.ergonomicsModifierPercentage).toBe(0.15000000000000002)

      expect(armorMod.movementSpeedModifierPercentage).toBe(0.04)
      expect(armorMod.presetWearableModifiers?.movementSpeedModifierPercentage).toBe(0.24000000000000002)

      expect(armorMod.turningSpeedModifierPercentage).toBe(0.03)
      expect(armorMod.presetWearableModifiers?.turningSpeedModifierPercentage).toBe(0.32999999999999996)
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
            blindnessProtectionPercentage: 0,
            blocksHeadphones: false,
            categoryId: ItemCategoryId.headwear,
            conflictingItemIds: [],
            defaultPresetId: 'presetHeadwear',
            durability: 10,
            ergonomicsModifierPercentage: 0.05,
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
            movementSpeedModifierPercentage: 0.04,
            name: 'Base headwear',
            presetArmorModifiers: undefined,
            presetWeight: undefined,
            presetWearableModifiers: undefined,
            prices: [],
            ricochetChance: 'Low',
            shortName: 'bh',
            turningSpeedModifierPercentage: 0.03,
            weight: 1,
            wikiLink: ''
          } as IHeadwear,
          {
            armorClass: 1,
            armoredAreas: ['TopOfTheHead'],
            baseItemId: 'baseHeadwear',
            blindnessProtectionPercentage: 0,
            blocksHeadphones: false,
            categoryId: ItemCategoryId.armorMod,
            conflictingItemIds: [],
            defaultPresetId: undefined,
            durability: 10,
            ergonomicsModifierPercentage: 0.05,
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
            movementSpeedModifierPercentage: 0.04,
            name: 'Preset headwear',
            presetArmorModifiers: undefined,
            presetWeight: undefined,
            presetWearableModifiers: undefined,
            prices: [],
            ricochetChance: 'Low',
            shortName: 'ph',
            turningSpeedModifierPercentage: 0.03,
            weight: 1,
            wikiLink: ''
          } as IHeadwear,
          {
            armorClass: 1,
            armoredAreas: ['Eyes'],
            baseItemId: undefined,
            blindnessProtectionPercentage: 0,
            categoryId: ItemCategoryId.armorMod,
            conflictingItemIds: [],
            defaultPresetId: undefined,
            durability: 20,
            ergonomicsModifierPercentage: 0.10,
            iconLink: '',
            id: 'childMod',
            imageLink: '',
            marketLink: '',
            material: 'Glass',
            maxStackableAmount: 1,
            modSlots: [],
            movementSpeedModifierPercentage: 0.20,
            name: 'Child armor mod',
            presetArmorModifiers: undefined,
            presetWeight: undefined,
            presetWearableModifiers: undefined,
            prices: [],
            ricochetChance: 'low',
            shortName: 'cam',
            turningSpeedModifierPercentage: 0.30,
            weight: 1,
            wikiLink: ''
          } as IArmorMod
        ],
        undefined)

      const itemFetcherServiceMock = mock<ItemFetcherService>()
      when(itemFetcherServiceMock.fetchPresetsAsync()).thenResolve(
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
        ] as IInventoryItem[])
      Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

      Services.configure(InventoryItemService)
      Services.configure(ItemPropertiesService)

      const presetService = new PresetService()
      await presetService.fetchPresetsAsync()

      const item = await Services.get(ItemService).getItemAsync('presetHeadwear')
      const headwear = item as IHeadwear

      // Act
      await presetService.updatePresetPropertiesAsync([headwear])

      // Assert
      expect(headwear.weight).toBe(1)
      expect(headwear.presetWeight).toBe(2)

      expect(headwear.ergonomicsModifierPercentage).toBe(0.05)
      expect(headwear.presetWearableModifiers?.ergonomicsModifierPercentage).toBe(0.15000000000000002)

      expect(headwear.movementSpeedModifierPercentage).toBe(0.04)
      expect(headwear.presetWearableModifiers?.movementSpeedModifierPercentage).toBe(0.24000000000000002)

      expect(headwear.turningSpeedModifierPercentage).toBe(0.03)
      expect(headwear.presetWearableModifiers?.turningSpeedModifierPercentage).toBe(0.32999999999999996)
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
            categoryId: ItemCategoryId.mod,
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
            presetWeight: undefined,
            prices: [],
            shortName: 'bm',
            weight: 1,
            wikiLink: ''
          } as IMod,
          {
            baseItemId: 'baseMod',
            categoryId: ItemCategoryId.mod,
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
            presetWeight: undefined,
            prices: [],
            shortName: 'pm',
            weight: 1,
            wikiLink: ''
          } as IMod,
          {
            baseItemId: undefined,
            categoryId: ItemCategoryId.mod,
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
            presetWeight: undefined,
            prices: [],
            shortName: 'cm',
            weight: 1,
            wikiLink: ''
          } as IMod
        ],
        undefined)

      const itemFetcherServiceMock = mock<ItemFetcherService>()
      when(itemFetcherServiceMock.fetchPresetsAsync()).thenResolve(
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
        ] as IInventoryItem[])
      Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

      Services.configure(InventoryItemService)
      Services.configure(ItemPropertiesService)

      const presetService = new PresetService()
      await presetService.fetchPresetsAsync()

      const item = await Services.get(ItemService).getItemAsync('presetMod')
      const mod = item as IMod

      // Act
      await presetService.updatePresetPropertiesAsync([mod])

      // Assert
      expect(mod.weight).toBe(1)
      expect(mod.presetWeight).toBe(2)

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
      await presetService.fetchPresetsAsync()

      const item = await Services.get(ItemService).getItemAsync(rpk16Default.id)
      const rangedWeapon = item as IRangedWeapon

      // Act
      await presetService.updatePresetPropertiesAsync([rangedWeapon])

      // Assert
      expect(rangedWeapon.weight).toBe(1.5)
      expect(rangedWeapon.presetWeight).toBe(3.017)

      expect(rangedWeapon.ergonomics).toBe(45)
      expect(rangedWeapon.presetRangedWeaponModifiers?.ergonomics).toBe(62)

      expect(rangedWeapon.horizontalRecoil).toBe(333)
      expect(rangedWeapon.presetRangedWeaponModifiers?.horizontalRecoil).toBe(226.44)

      expect(rangedWeapon.verticalRecoil).toBe(112)
      expect(rangedWeapon.presetRangedWeaponModifiers?.verticalRecoil).toBe(76.16)
    })

    it('should update the properties of a ranged weapond mod', async () => {
      // Arrange
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      useItemServiceMock(
        true,
        [
          {
            accuracyModifierPercentage: 0.04,
            baseItemId: undefined,
            categoryId: ItemCategoryId.rangedWeaponMod,
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
            presetWeight: undefined,
            presetRecoilModifierPercentage: undefined,
            prices: [],
            recoilModifierPercentage: 0.06,
            shortName: 'brwm',
            weight: 1,
            wikiLink: ''
          } as IRangedWeaponMod,
          {
            accuracyModifierPercentage: 0.04,
            baseItemId: 'baseRangedWeaponMod',
            categoryId: ItemCategoryId.rangedWeaponMod,
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
            presetWeight: undefined,
            presetRecoilModifierPercentage: undefined,
            prices: [],
            recoilModifierPercentage: 0.06,
            shortName: 'prwm',
            weight: 1,
            wikiLink: ''
          } as IRangedWeaponMod,
          {
            accuracyModifierPercentage: 0.03,
            baseItemId: undefined,
            categoryId: ItemCategoryId.rangedWeaponMod,
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
            presetWeight: undefined,
            presetRecoilModifierPercentage: undefined,
            prices: [],
            recoilModifierPercentage: 0.2,
            shortName: 'crwm',
            weight: 1,
            wikiLink: ''
          } as IRangedWeaponMod
        ],
        undefined)

      const itemFetcherServiceMock = mock<ItemFetcherService>()
      when(itemFetcherServiceMock.fetchPresetsAsync()).thenResolve(
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
        ] as IInventoryItem[])
      Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

      Services.configure(InventoryItemService)
      Services.configure(ItemPropertiesService)

      const presetService = new PresetService()
      await presetService.fetchPresetsAsync()

      const item = await Services.get(ItemService).getItemAsync('presetRangedWeaponMod')
      const rangedWeaponMod = item as IRangedWeaponMod

      // Act
      await presetService.updatePresetPropertiesAsync([rangedWeaponMod])

      // Assert
      expect(rangedWeaponMod.weight).toBe(1)
      expect(rangedWeaponMod.presetWeight).toBe(2)

      expect(rangedWeaponMod.accuracyModifierPercentage).toBe(0.04)

      expect(rangedWeaponMod.ergonomicsModifier).toBe(5)
      expect(rangedWeaponMod.presetErgonomicsModifier).toBe(15)

      expect(rangedWeaponMod.recoilModifierPercentage).toBe(0.06)
      expect(rangedWeaponMod.presetRecoilModifierPercentage).toBe(0.26)
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
      await presetService.fetchPresetsAsync()

      const item = await Services.get(ItemService).getItemAsync(bansheeDefault.id)
      const vest = item as IVest

      // Act
      await presetService.updatePresetPropertiesAsync([vest])

      // Assert
      expect(vest.weight).toBe(3.08)
      expect(vest.presetWeight).toBe(5.779999999999999)

      expect(vest.ergonomicsModifierPercentage).toBe(-0.01)
      expect(vest.presetWearableModifiers?.ergonomicsModifierPercentage).toBe(-0.03)

      expect(vest.ergonomicsModifierPercentage).toBe(-0.01)
      expect(vest.presetWearableModifiers?.ergonomicsModifierPercentage).toBe(-0.03)

      expect(vest.turningSpeedModifierPercentage).toBe(-0.01)
      expect(vest.presetWearableModifiers?.turningSpeedModifierPercentage).toBe(-0.01)
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
            categoryId: ItemCategoryId.mod,
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
            presetWeight: undefined,
            prices: [],
            shortName: 'pm',
            weight: 1,
            wikiLink: ''
          } as IMod,
          {
            baseItemId: undefined,
            categoryId: ItemCategoryId.mod,
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
            presetWeight: undefined,
            prices: [],
            shortName: 'cm',
            weight: 1,
            wikiLink: ''
          } as IMod
        ],
        undefined)

      const itemFetcherServiceMock = mock<ItemFetcherService>()
      when(itemFetcherServiceMock.fetchPresetsAsync()).thenResolve([] as IInventoryItem[])
      Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

      Services.configure(InventoryItemService)
      Services.configure(ItemPropertiesService)

      const presetService = new PresetService()
      const item = await Services.get(ItemService).getItemAsync('nonPresetMod')
      const mod = item as IMod

      // Act
      await presetService.updatePresetPropertiesAsync([mod])

      // Assert
      expect(mod.weight).toBe(1)
      expect(mod.presetWeight).toBeUndefined()

      expect(mod.ergonomicsModifier).toBe(5)
      expect(mod.presetErgonomicsModifier).toBeUndefined()
    })

    it('should log an error with the presets it did not find', async () => {
      // Arrange
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      useItemServiceMock(
        true,
        [
          {
            baseItemId: undefined,
            categoryId: ItemCategoryId.mod,
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
            presetWeight: undefined,
            prices: [],
            shortName: 'bm',
            weight: 1,
            wikiLink: ''
          } as IMod,
          {
            baseItemId: 'baseMod',
            categoryId: ItemCategoryId.mod,
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
            presetWeight: undefined,
            prices: [],
            shortName: 'pm',
            weight: 1,
            wikiLink: ''
          } as IMod,
          {
            baseItemId: undefined,
            categoryId: ItemCategoryId.mod,
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
            presetWeight: undefined,
            prices: [],
            shortName: 'cm',
            weight: 1,
            wikiLink: ''
          } as IMod
        ],
        undefined)

      const itemFetcherServiceMock = mock<ItemFetcherService>()
      when(itemFetcherServiceMock.fetchPresetsAsync()).thenResolve([])
      Services.configure(ItemFetcherService, undefined, instance(itemFetcherServiceMock))

      Services.configure(InventoryItemService)
      Services.configure(ItemPropertiesService)

      const logServiceMock = mock<LogService>()
      Services.configure(LogService, undefined, instance(logServiceMock))

      const presetService = new PresetService()
      const item = await Services.get(ItemService).getItemAsync('presetMod')
      const mod = item as IMod

      // Act
      await presetService.updatePresetPropertiesAsync([mod])

      // Assert
      expect(mod.weight).toBe(1)
      expect(mod.presetWeight).toBeUndefined()

      expect(mod.ergonomicsModifier).toBe(5)
      expect(mod.presetErgonomicsModifier).toBeUndefined()

      verify(logServiceMock.logError('message.presetsNotFound', anything())).once()
    })
  })
})
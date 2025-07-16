import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../../models/build/IInventoryItem'
import { IInventoryModSlot } from '../../../models/build/IInventoryModSlot'
import { ItemCategoryId } from '../../../models/item/IItem'
import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'
import { ItemComponentService } from '../../../services/ItemComponentService'
import { ak12bt, ak12Stock, alkali, alpha, ammo545bp, m9a3Magazine, magazine6l20, rpk16, rpk16Default, rpk16Drum, rpk16Tube, scavVest } from '../../__data__/itemMocks'
import { rpk16DefaultPreset } from '../../__data__/presetMocks'
import { usePresetServiceMock } from '../../__mocks__/PresetServiceMock'

describe('ItemComponentService', () => {
  describe('getReplacingItemContent', () => {
    it('should keep content when the replacing item is a container', () => {
      // Arrange
      const oldItem: IInventoryItem = {
        content: [
          {
            content: [],
            ignorePrice: false,
            itemId: alkali.id,
            modSlots: [],
            quantity: 1
          }
        ],
        ignorePrice: false,
        itemId: scavVest.id,
        modSlots: [],
        quantity: 1
      }
      const newItem = alpha
      const expectedContent: IInventoryItem[] = [
        {
          content: [],
          ignorePrice: false,
          itemId: alkali.id,
          modSlots: [],
          quantity: 1
        }
      ]

      const service = new ItemComponentService()

      // Act
      const newContent = service.getReplacingItemContent(oldItem, newItem)

      // Assert
      expect(newContent).toStrictEqual(expectedContent)
    })

    it('should keep the content and adjust the quantity to match the capacity when the replacing item is a magazine with compatible accepted items', () => {
      // Arrange
      const oldItem: IInventoryItem = {
        content: [
          {
            content: [],
            ignorePrice: false,
            itemId: ammo545bp.id,
            modSlots: [],
            quantity: 95
          }
        ],
        ignorePrice: false,
        itemId: rpk16Drum.id,
        modSlots: [],
        quantity: 1
      }
      const newItem = magazine6l20
      const expectedContent: IInventoryItem[] = [
        {
          content: [],
          ignorePrice: false,
          itemId: ammo545bp.id,
          modSlots: [],
          quantity: 30
        }
      ]

      const service = new ItemComponentService()

      // Act
      const newContent = service.getReplacingItemContent(oldItem, newItem)

      // Assert
      expect(newContent).toStrictEqual(expectedContent)
    })

    it('should not keep the content when the replacing item is a magazine with incompatible accepted items', () => {
      // Arrange
      const oldItem: IInventoryItem = {
        content: [
          {
            content: [],
            ignorePrice: false,
            itemId: ammo545bp.id,
            modSlots: [],
            quantity: 95
          }
        ],
        ignorePrice: false,
        itemId: rpk16Drum.id,
        modSlots: [],
        quantity: 1
      }
      const newItem = m9a3Magazine
      const expectedContent: IInventoryItem[] = []

      const service = new ItemComponentService()

      // Act
      const newContent = service.getReplacingItemContent(oldItem, newItem)

      // Assert
      expect(newContent).toStrictEqual(expectedContent)
    })

    it('should return an empty content when the old item has no content', () => {
      // Arrange
      const oldItem: IInventoryItem = {
        content: [],
        ignorePrice: false,
        itemId: scavVest.id,
        modSlots: [],
        quantity: 1
      }
      const newItem = alpha
      const expectedContent: IInventoryItem[] = []

      const service = new ItemComponentService()

      // Act
      const newContent = service.getReplacingItemContent(oldItem, newItem)

      // Assert
      expect(newContent).toStrictEqual(expectedContent)
    })
  })

  describe('getReplacingModSlots', () => {
    it('should replace mod slots with the new item mod slots when it is a preset', () => {
      // Arrange
      usePresetServiceMock()

      const oldItem: IInventoryItem = {
        content: [],
        ignorePrice: false,
        itemId: rpk16.id,
        modSlots: [
          {
            modSlotName: 'mod_magazine',
            item: {
              content: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: ammo545bp.id,
                  modSlots: [],
                  quantity: 95
                }
              ],
              ignorePrice: false,
              itemId: rpk16Drum.id,
              modSlots: [],
              quantity: 1
            }
          }
        ],
        quantity: 1
      }
      const newItem = rpk16Default
      const expectedModSlots: IInventoryModSlot[] = rpk16DefaultPreset.modSlots

      const service = new ItemComponentService()

      // Act
      const newModSlots = service.getReplacingModSlots(oldItem, newItem)

      // Assert
      expect(newModSlots).toStrictEqual(expectedModSlots)
    })

    it('should keep the mods in a mod slot with the same name if the mod is compatible', () => {
      usePresetServiceMock()

      const oldItem: IInventoryItem = {
        content: [],
        ignorePrice: false,
        itemId: '5c9a25172e2216000f20314e', // AR-15 Daniel Defense RIS II 12.25 handguard (Coyote Brown)
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '5649a2464bdc2d91118b45a8', // NcSTAR MPR45 Backup mount
              modSlots: [
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: '57ae0171245977343c27bfcf', // BelOMO PK-06 reflex sight
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_scope'
                }
              ],
              quantity: 1
            },
            modSlotName: 'mod_scope'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '544909bb4bdc2d6f028b4577', // L3Harris AN/PEQ-15 tactical device
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_tactical_000'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '5d10b49bd7ad1a1a560708b0', // Insight AN/PEQ-2 tactical device
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_tactical_001'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '55d4af3a4bdc2d972f8b456f', // AR-15 Leapers UTG Low Profile A2 front sight
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_sight_front'
          }
        ],
        quantity: 1
      }
      const newItem: IRangedWeaponMod = {
        accuracyModifierPercentage: 0,
        baseItemId: undefined,
        categoryId: ItemCategoryId.rangedWeaponMod,
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 7,
        iconLink: 'https://assets.tarkov.dev/5c9a26332e2216001219ea70-icon.webp',
        id: '5c9a26332e2216001219ea70',
        imageLink: 'https://assets.tarkov.dev/5c9a26332e2216001219ea70-image.webp',
        marketLink: 'https://tarkov.dev/item/ar-15-daniel-defense-ris-ii-fsp-95-handguard-coyote-brown',
        maxStackableAmount: 0,
        modSlots: [
          {
            compatibleItemIds: [
              '5c7fc87d2e221644f31c0298' // BCM GUNFIGHTER MOD 3 vertical foregrip
            ],
            maxStackableAmount: 1,
            name: 'mod_foregrip',
            required: false
          },
          {
            compatibleItemIds: [
              '5649a2464bdc2d91118b45a8' // NcSTAR MPR45 Backup mount
            ],
            maxStackableAmount: 1,
            name: 'mod_scope',
            required: false
          },
          {
            compatibleItemIds: [
              '55d4af3a4bdc2d972f8b456f' // AR-15 Leapers UTG Low Profile A2 front sight
            ],
            maxStackableAmount: 1,
            name: 'mod_sight_front',
            required: false
          },
          {
            compatibleItemIds: [
              '5d10b49bd7ad1a1a560708b0' // Insight AN/PEQ-2 tactical device
            ],
            maxStackableAmount: 1,
            name: 'mod_tactical_000',
            required: false
          }
        ],
        name: 'AR-15 Daniel Defense RIS II FSP 9.5 handguard (Coyote Brown)',
        presetErgonomicsModifier: undefined,
        presetRecoilModifierPercentage: undefined,
        presetWeight: undefined,
        prices: [],
        recoilModifierPercentage: -0.01,
        shortName: 'RIS II FSP 9.5 CB',
        weight: 0.3,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/AR-15_Daniel_Defense_RIS_II_FSP_9.5_handguard_(Coyote_Brown)'
      }
      const expectedModSlots: IInventoryModSlot[] = [
        {
          item: undefined,
          modSlotName: 'mod_foregrip'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '5649a2464bdc2d91118b45a8', // NcSTAR MPR45 Backup mount
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '57ae0171245977343c27bfcf', // BelOMO PK-06 reflex sight
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_scope'
              }
            ],
            quantity: 1
          },
          modSlotName: 'mod_scope'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '55d4af3a4bdc2d972f8b456f', // AR-15 Leapers UTG Low Profile A2 front sight
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_sight_front'
        },
        {
          item: undefined,
          modSlotName: 'mod_tactical_000'
        }
      ]

      const service = new ItemComponentService()

      // Act
      const newModSlots = service.getReplacingModSlots(oldItem, newItem)

      // Assert
      expect(newModSlots).toStrictEqual(expectedModSlots)
    })

    it('should return an empty mod slot list when the new item is no moddable', () => {
      // Arrange
      usePresetServiceMock()

      const oldItem: IInventoryItem = {
        content: [],
        ignorePrice: false,
        itemId: rpk16Tube.id,
        modSlots: [
          {
            modSlotName: 'mod_stock',
            item: {
              content: [],
              ignorePrice: false,
              itemId: ak12Stock.id,
              modSlots: [],
              quantity: 1
            }
          }
        ],
        quantity: 1
      }
      const newItem = alkali
      const expectedModSlots: IInventoryModSlot[] = []

      const service = new ItemComponentService()

      // Act
      const newModSlots = service.getReplacingModSlots(oldItem, newItem)

      // Assert
      expect(newModSlots).toStrictEqual(expectedModSlots)
    })

    it('should return the new item mod slots when there is no old item', () => {
      // Arrange
      usePresetServiceMock()

      const oldItem = undefined
      const newItem = ak12bt
      const expectedModSlots: IInventoryModSlot[] = [
        {
          item: undefined,
          modSlotName: 'mod_stock'
        }
      ]

      const service = new ItemComponentService()

      // Act
      const newModSlots = service.getReplacingModSlots(oldItem, newItem)

      // Assert
      expect(newModSlots).toStrictEqual(expectedModSlots)
    })
  })
})
/* eslint-disable no-irregular-whitespace */
import { describe, expect, it } from 'vitest'
import { IInventorySlot } from '../../models/build/IInventorySlot'
import { IInventorySlotType } from '../../models/build/IInventorySlotType'
import { InventorySlotTypeId } from '../../models/build/InventorySlotTypes'
import { ItemCategoryId } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { BuildsToTextType } from '../../models/utils/IBuildsToTextOptions'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { IRecoil } from '../../models/utils/IRecoil'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { PresetService } from '../../services/PresetService'
import Services from '../../services/repository/Services'
import { ak12PistolGrip, ak12Stock, ammo545bp, ammo545us, armbandBlue, armor6b13FlDefault, bansheeDefault, cultLocust, lshZ2dtm, lshZ2dtmFs, monocletePe, ms2000, paca, plate6b33Back, rpk1615inch, rpk16Default, rpk16Drum, rpk16DustCover, rpk16Handguard, rpk16MuzzleBreak, rpk16Rail, rpk16Rs, rpk16RsBase, rpk16Tube, scavVest, specterDr, srd9, vaseline } from '../__data__/itemMocks'
import { useGlobalFilterServiceMock } from '../__mocks__/GlobalFilterServiceMock'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('InventorySlotPropertiesService', () => {
  describe('getSummaryAsync', () => {
    describe('Armor modifiers', () => {
      it.each([
        [
          inventorySlot1,
          {
            armorClass: lshZ2dtm.armorClass,
            durability: lshZ2dtm.durability
          } as IArmorModifiers
        ],
        [
          {
            items: [
              {
                content: [],
                itemId: armor6b13FlDefault.id,
                ignorePrice: false,
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: cultLocust.id,
                      ignorePrice: false,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'front_plate'
                  },
                  {
                    item: {
                      content: [],
                      itemId: plate6b33Back.id,
                      ignorePrice: false,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'back_plate'
                  }
                ],
                quantity: 1
              }
            ],
            typeId: InventorySlotTypeId.bodyArmor
          } as IInventorySlot,
          {
            armorClass: cultLocust.armorClass,
            durability: armor6b13FlDefault.durability + cultLocust.durability + plate6b33Back.durability
          } as IArmorModifiers
        ],
        [
          {
            items: [
              {
                content: [],
                itemId: paca.id,
                ignorePrice: false,
                modSlots: [],
                quantity: 1
              }
            ],
            typeId: InventorySlotTypeId.bodyArmor
          } as IInventorySlot,
          {
            armorClass: paca.armorClass,
            durability: paca.durability
          } as IArmorModifiers
        ],
        [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: bansheeDefault.id,
                modSlots: [
                  {
                    item: {
                      content: [],
                      ignorePrice: false,
                      itemId: cultLocust.id,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'front_plate'
                  },
                  {
                    item: {
                      content: [],
                      ignorePrice: false,
                      itemId: monocletePe.id,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'back_plate'
                  }
                ],
                quantity: 1
              }
            ],
            typeId: InventorySlotTypeId.tacticalRig
          } as IInventorySlot,
          {
            armorClass: cultLocust.armorClass,
            durability: bansheeDefault.durability + cultLocust.durability + monocletePe.durability
          } as IArmorModifiers
        ],
        [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: scavVest.id,
                modSlots: [],
                quantity: 1
              }
            ],
            typeId: InventorySlotTypeId.tacticalRig
          } as IInventorySlot,
          {
            armorClass: 0,
            durability: 0
          } as IArmorModifiers
        ],
        [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: armbandBlue.id,
                modSlots: [],
                quantity: 1
              }
            ],
            typeId: InventorySlotTypeId.armband
          } as IInventorySlot,
          {
            armorClass: 0,
            durability: 0
          }
        ],
        [
          {
            items: [
              undefined
            ],
            typeId: InventorySlotTypeId.bodyArmor
          } as IInventorySlot,
          {
            armorClass: 0,
            durability: 0
          }
        ]
      ])('should get the armor modifiers of an armor or vest inventory slot', async (inventorySlot: IInventorySlot, expected: IArmorModifiers) => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)

        const service = new InventorySlotPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(inventorySlot)

        // Assert
        expect(summary.armorModifiers).toStrictEqual(expected)
      })

      it('should not get armor modifiers if an item cannot be found', async () => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)

        const service = new InventorySlotPropertiesService()

        // Act
        const summary = await service.getSummaryAsync({
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: InventorySlotTypeId.bodyArmor
        })

        // Assert
        expect(summary.wearableModifiers).toStrictEqual({
          ergonomicsModifierPercentage: 0,
          movementSpeedModifierPercentage: 0,
          turningSpeedModifierPercentage: 0
        })
      })
    })

    describe('Ergonomics', () => {
      it.each([
        [inventorySlot2, 38],
        [inventorySlot1, 0],
        [
          {
            typeId: InventorySlotTypeId.onSling,
            items: []
          } as IInventorySlot,
          0
        ]
      ])('should get the ergonomics of a ranged weapon inventory slot', async (inventorySlot: IInventorySlot, expected: number) => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)

        const service = new InventorySlotPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(inventorySlot)

        // Assert
        expect(summary.ergonomics).toBe(expected)
      })

      it('should not get ergonomics if an item cannot be found', async () => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)

        const service = new InventorySlotPropertiesService()

        // Act
        const summary = await service.getSummaryAsync({
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: InventorySlotTypeId.onSling
        })

        // Assert
        expect(summary.ergonomics).toBe(0)
      })
    })

    describe('Price', () => {
      it.each([
        [
          inventorySlot1,
          {
            missingPrice: false,
            priceInMainCurrency: 93298,
            priceByCurrency: [
              {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '',
                merchant: '',
                merchantLevel: 0,
                quest: undefined,
                value: 93298,
                valueInMainCurrency: 93298
              }
            ]
          } as IInventoryPrice
        ],
        [
          inventorySlot2,
          {
            missingPrice: false,
            priceInMainCurrency: 76779,
            priceByCurrency: [
              {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '',
                merchant: '',
                merchantLevel: 0,
                quest: undefined,
                value: 76779,
                valueInMainCurrency: 76779
              }
            ]
          } as IInventoryPrice
        ],
        [
          inventorySlot3,
          {
            missingPrice: false,
            priceInMainCurrency: 89597,
            priceByCurrency: [
              {
                barterItems: [],
                currencyName: 'EUR',
                itemId: '',
                merchant: '',
                merchantLevel: 0,
                quest: undefined,
                value: 95,
                valueInMainCurrency: 15105
              },
              {
                barterItems: [],
                currencyName: 'USD',
                itemId: '',
                merchant: '',
                merchantLevel: 0,
                quest: undefined,
                value: 521,
                valueInMainCurrency: 74492
              }
            ]
          } as IInventoryPrice
        ],
        [
          {
            items: [undefined],
            typeId: InventorySlotTypeId.pockets
          },
          {
            missingPrice: false,
            priceInMainCurrency: 0,
            priceByCurrency: []
          } as IInventoryPrice
        ]
      ])('should get the price of an inventory slot', async (inventorySlot: IInventorySlot, expected: IInventoryPrice) => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)

        const service = new InventorySlotPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(inventorySlot)

        // Assert
        expect(summary.price).toStrictEqual(expected)
      })

      it('should have a missing price when no merchants sell the item', async () => {
        // Arrange
        useGlobalFilterServiceMock()
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(InventoryItemService)
        Services.configure(GlobalFilterService)

        const service = new InventorySlotPropertiesService()

        const inventorySlot: IInventorySlot = {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: ammo545bp.id,
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: InventorySlotTypeId.pockets
        }

        // Act
        const summary = await service.getSummaryAsync(inventorySlot)

        // Assert
        expect(summary.price).toStrictEqual({
          missingPrice: true,
          priceInMainCurrency: 0,
          priceByCurrency: []
        } as IInventoryPrice)
      })

      it('should ignore the price of items that cannot be found', async () => {
        // Arrange
        useItemServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)
        Services.configure(PresetService)
        const service = new InventorySlotPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: 'invalid',
                modSlots: [],
                quantity: 1
              }
            ],
            typeId: InventorySlotTypeId.bodyArmor
          })

        // Assert
        expect(summary.price).toStrictEqual({
          missingPrice: true,
          priceInMainCurrency: 0,
          priceByCurrency: []
        } as IInventoryPrice)
      })
    })

    describe('Recoil', () => {
      it.each([
        [
          inventorySlot2,
          {
            horizontalRecoil: 216.24,
            verticalRecoil: 65.96000000000001
          } as IRecoil
        ],
        [
          inventorySlot1,
          {
            horizontalRecoil: 0,
            verticalRecoil: 0
          } as IRecoil
        ],
        [
          {
            typeId: InventorySlotTypeId.onSling,
            items: []
          } as IInventorySlot,
          {
            horizontalRecoil: 0,
            verticalRecoil: 0
          } as IRecoil
        ]
      ])('should get the recoil of a ranged weapon inventory slot', async (inventorySlot: IInventorySlot, expected: IRecoil) => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)

        const service = new InventorySlotPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(inventorySlot)

        // Assert
        expect(summary.recoil).toStrictEqual(expected)
      })

      it('should not get the recoil if an item cannot be found', async () => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)

        const service = new InventorySlotPropertiesService()

        // Act
        const summary = await service.getSummaryAsync({
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: InventorySlotTypeId.onSling
        })

        // Assert
        expect(summary.recoil).toStrictEqual({
          horizontalRecoil: 0,
          verticalRecoil: 0
        } as IRecoil)
      })
    })

    describe('Wrearable modifiers', () => {
      it.each([
        [
          inventorySlot1,
          {
            ergonomicsModifierPercentage: -0.05,
            movementSpeedModifierPercentage: 0,
            turningSpeedModifierPercentage: -0.08
          } as IWearableModifiers
        ],
        [
          inventorySlot4,
          {
            ergonomicsModifierPercentage: -0.03,
            movementSpeedModifierPercentage: -0.03,
            turningSpeedModifierPercentage: -0.01
          }
        ],
        [
          inventorySlot2,
          {
            ergonomicsModifierPercentage: 0,
            movementSpeedModifierPercentage: 0,
            turningSpeedModifierPercentage: 0
          } as IWearableModifiers
        ],
        [
          {
            items: [undefined],
            typeId: InventorySlotTypeId.headwear
          },
          {
            ergonomicsModifierPercentage: 0,
            movementSpeedModifierPercentage: 0,
            turningSpeedModifierPercentage: 0
          } as IWearableModifiers
        ]
      ])('should get the wearable modifiers of an inventory slot', async (inventorySlot: IInventorySlot, expected: IWearableModifiers) => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)

        const service = new InventorySlotPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(inventorySlot)

        // Assert
        expect(summary.wearableModifiers).toStrictEqual(expected)
      })

      it('should not get wearable modifiers if an item cannot be found', async () => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)

        const service = new InventorySlotPropertiesService()

        // Act
        const summary = await service.getSummaryAsync({
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: InventorySlotTypeId.bodyArmor
        })

        // Assert
        expect(summary.wearableModifiers).toStrictEqual({
          ergonomicsModifierPercentage: 0,
          movementSpeedModifierPercentage: 0,
          turningSpeedModifierPercentage: 0
        })
      })
    })

    describe('Weight', () => {
      it.each([
        [
          inventorySlot1,
          4.4
        ],
        [
          inventorySlot4,
          5.93
        ],
        [
          {
            items: [undefined],
            typeId: InventorySlotTypeId.pockets
          },
          0
        ]
      ])('should get the weight of an inventory slot', async (inventorySlot: IInventorySlot, expected: number) => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)

        const service = new InventorySlotPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(inventorySlot)

        // Assert
        expect(summary.weight).toBe(expected)
      })

      it('should ignore the weight of items that cannot be found', async () => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)

        const service = new InventorySlotPropertiesService()

        // Act
        const summary = await service.getSummaryAsync({
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: InventorySlotTypeId.bodyArmor
        })

        // Assert
        expect(summary.weight).toBe(0)
      })
    })
  })

  describe('getType', () => {
    it('should get an inventory slot type', () => {
      // Arrange
      useItemServiceMock()
      const service = new InventorySlotPropertiesService()

      // Act
      const slotTypeResult = service.getType(InventorySlotTypeId.pockets)

      // Assert
      expect(slotTypeResult).toStrictEqual({
        acceptedItemCategories: [
          ItemCategoryId.ammunition,
          ItemCategoryId.armband,
          ItemCategoryId.armor,
          ItemCategoryId.armorMod,
          ItemCategoryId.backpack,
          ItemCategoryId.container,
          ItemCategoryId.currency,
          ItemCategoryId.eyewear,
          ItemCategoryId.faceCover,
          ItemCategoryId.grenade,
          ItemCategoryId.headphones,
          ItemCategoryId.headwear,
          ItemCategoryId.magazine,
          ItemCategoryId.mainWeapon,
          ItemCategoryId.meleeWeapon,
          ItemCategoryId.mod,
          ItemCategoryId.other,
          ItemCategoryId.rangedWeaponMod,
          ItemCategoryId.secondaryWeapon,
          ItemCategoryId.securedContainer,
          ItemCategoryId.special,
          ItemCategoryId.vest
        ],
        canBeLooted: true,
        displayOrder: 9,
        icon: 'th-large',
        id: 'pockets',
        itemSlotsAmount: 4
      })
    })

    it('should throw if an inventory slot type is not found', () => {
      // Arrange
      const service = new InventorySlotPropertiesService()

      // Act
      const act = (): IInventorySlotType => service.getType('invalid' as InventorySlotTypeId)

      // Assert
      expect(act).toThrowError('Inventory slot type "invalid" not found.')
    })
  })

  describe('toTextAsync() (markdown)', () => {
    it.each([
      [
        inventorySlot1,
        `[*Couvre-chef*] **BNTI LShZ-2DTM helmet (Black)**   💵 Marché **63 493₽**  
 [*Équipement*] **LShZ-2DTM face shield**   💵 Ragman 3 (*échange*) **29 805₽**  `
      ],
      [
        inventorySlot2,
        `[*En bandouillère*] **RPK-16 5.45x39 light machine gun Default**   💵 Marché **43 345₽**  
 [*Chargeur*] **RPK-16 5.45x39 95-round drum magazine**   💵 Prapor 3 (*échange*) **24 218₽**  
  95 x **5.45x39mm US gs**   💵 Prapor 1 **9 120₽**  
 **5.45x39mm US gs**   💵 Prapor 1 **96₽**  `
      ],
      [
        {
          typeId: InventorySlotTypeId.pockets,
          items: [
            ...inventorySlot3.items,
            {
              content: [],
              ignorePrice: false,
              itemId: ammo545bp.id,
              modSlots: [],
              quantity: 60
            },
            {
              content: [],
              ignorePrice: true,
              itemId: vaseline.id,
              modSlots: [],
              quantity: 1
            }
          ]
        },
        `[*Poches*] **MS2000 Marker**   💵 Ragman 1 **95€** (= **15 105₽**)  
[*Poches*] **ELCAN SpecterDR 1x/4x scope**   💵 Peacekeeper 3 **279$** (= **39 886₽**)  
[*Poches*] **SIG Sauer SRD9 9x19 sound suppressor**   💵 Peacekeeper 2 **242$** (= **34 606₽**)  
[*Poches*] 60 x **5.45x39mm BP gs**   💵 Pas de marchand  
[*Poches*] **Vaseline balm**  `
      ],
      [
        {
          typeId: InventorySlotTypeId.tacticalRig,
          items: [
            {
              content: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: ms2000.id,
                  modSlots: [],
                  quantity: 1
                }
              ],
              ignorePrice: false,
              itemId: bansheeDefault.id,
              modSlots: [
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: monocletePe.id,
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'front_plate'
                },
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: plate6b33Back.id,
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'back_plate'
                }
              ],
              quantity: 1
            }
          ]
        } as IInventorySlot,
        `[*Gilet tactique*] **Shellback Tactical Banshee plate carrier (A-TACS AU) Default**   💵 Ragman 3 (*échange*) **59 790₽**  
 [*Plaque dorsale*] **6B13 custom ballistic plates (Back)**   💵 Marché **43 868₽**  
 **MS2000 Marker**   💵 Ragman 1 **95€** (= **15 105₽**)  `
      ],
      [
        {
          items: [undefined, undefined, undefined, undefined],
          typeId: InventorySlotTypeId.pockets
        } as IInventorySlot,
        ''
      ]
    ])('should convert an inventory slot to a markdown text', async (inventorySlot: IInventorySlot, expected: string) => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)

      const service = new InventorySlotPropertiesService()

      // Act
      const result = await service.toTextAsync(
        inventorySlot,
        {
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(expected)
    })

    it('should not include emojis', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)

      const service = new InventorySlotPropertiesService()

      // Act
      const result = await service.toTextAsync(
        inventorySlot1,
        {
          includeEmojis: false,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(`[*Couvre-chef*] **BNTI LShZ-2DTM helmet (Black)**   Marché **63 493₽**  
 [*Équipement*] **LShZ-2DTM face shield**   Ragman 3 (*échange*) **29 805₽**  `)
    })

    it('should ignore undefined items in an inventory slot', async () => {
      // Arrange
      Services.configure(InventoryItemService)

      const service = new InventorySlotPropertiesService()

      // Act
      const result = await service.toTextAsync(
        {
          items: [undefined, undefined, undefined, undefined],
          typeId: InventorySlotTypeId.pockets
        },
        {
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe('')
    })
  })

  describe('toTextAsync() (simple text)', () => {
    it.each([
      [
        inventorySlot1,
        `[Couvre-chef] BNTI LShZ-2DTM helmet (Black)   💵 Marché 63 493₽
 [Équipement] LShZ-2DTM face shield   💵 Ragman 3 (échange) 29 805₽`
      ],
      [
        inventorySlot2,
        `[En bandouillère] RPK-16 5.45x39 light machine gun Default   💵 Marché 43 345₽
 [Chargeur] RPK-16 5.45x39 95-round drum magazine   💵 Prapor 3 (échange) 24 218₽
  95 x 5.45x39mm US gs   💵 Prapor 1 9 120₽
 5.45x39mm US gs   💵 Prapor 1 96₽`
      ],
      [
        {
          typeId: InventorySlotTypeId.pockets,
          items: [
            ...inventorySlot3.items,
            {
              content: [],
              ignorePrice: false,
              itemId: ammo545bp.id,
              modSlots: [],
              quantity: 60
            },
            {
              content: [],
              ignorePrice: true,
              itemId: vaseline.id,
              modSlots: [],
              quantity: 1
            }
          ]
        },
        `[Poches] MS2000 Marker   💵 Ragman 1 95€ (= 15 105₽)
[Poches] ELCAN SpecterDR 1x/4x scope   💵 Peacekeeper 3 279$ (= 39 886₽)
[Poches] SIG Sauer SRD9 9x19 sound suppressor   💵 Peacekeeper 2 242$ (= 34 606₽)
[Poches] 60 x 5.45x39mm BP gs   💵 Pas de marchand
[Poches] Vaseline balm`
      ],
      [
        {
          typeId: InventorySlotTypeId.tacticalRig,
          items: [
            {
              content: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: ms2000.id,
                  modSlots: [],
                  quantity: 1
                }
              ],
              ignorePrice: false,
              itemId: bansheeDefault.id,
              modSlots: [
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: monocletePe.id,
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'front_plate'
                },
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: plate6b33Back.id,
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'back_plate'
                }
              ],
              quantity: 1
            }
          ]
        } as IInventorySlot,
        `[Gilet tactique] Shellback Tactical Banshee plate carrier (A-TACS AU) Default   💵 Ragman 3 (échange) 59 790₽
 [Plaque dorsale] 6B13 custom ballistic plates (Back)   💵 Marché 43 868₽
 MS2000 Marker   💵 Ragman 1 95€ (= 15 105₽)`
      ],
      [
        {
          items: [undefined, undefined, undefined, undefined],
          typeId: InventorySlotTypeId.pockets
        } as IInventorySlot,
        ''
      ]
    ])('should convert an inventory slot to a text', async (inventorySlot: IInventorySlot, expected: string) => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)

      const service = new InventorySlotPropertiesService()

      // Act
      const result = await service.toTextAsync(
        inventorySlot,
        {
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(expected)
    })

    it('should not include emojis', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)

      const service = new InventorySlotPropertiesService()

      // Act
      const result = await service.toTextAsync(
        inventorySlot1,
        {
          includeEmojis: false,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(`[Couvre-chef] BNTI LShZ-2DTM helmet (Black)   Marché 63 493₽
 [Équipement] LShZ-2DTM face shield   Ragman 3 (échange) 29 805₽`)
    })

    it('should ignore undefined items in an inventory slot', async () => {
      // Arrange
      Services.configure(InventoryItemService)

      const service = new InventorySlotPropertiesService()

      // Act
      const result = await service.toTextAsync(
        {
          items: [undefined, undefined, undefined, undefined],
          typeId: InventorySlotTypeId.pockets
        },
        {
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe('')
    })
  })
})



const inventorySlot1: IInventorySlot = {
  items: [
    {
      content: [],
      ignorePrice: false,
      itemId: lshZ2dtm.id,
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: lshZ2dtmFs.id,
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_equipment'
        }
      ],
      quantity: 1
    }
  ],
  typeId: InventorySlotTypeId.headwear
}

const inventorySlot2: IInventorySlot = {
  items: [
    {
      content: [
        {
          content: [],
          ignorePrice: false,
          itemId: ammo545us.id,
          modSlots: [],
          quantity: 1
        }
      ],
      ignorePrice: false,
      itemId: rpk16Default.id,
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: ak12PistolGrip.id,
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_pistol_grip'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: rpk16DustCover.id,
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16RsBase.id,
                  modSlots: [
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: rpk16Rs.id,
                        modSlots: [],
                        quantity: 1
                      },
                      modSlotName: 'mod_sight_rear'
                    }
                  ],
                  quantity: 1
                },
                modSlotName: 'mod_sight_rear'
              }
            ],
            quantity: 1
          },
          modSlotName: 'mod_reciever'
        },
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
            ignorePrice: false,
            itemId: rpk16Drum.id,
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_magazine'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: rpk16Tube.id,
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: ak12Stock.id,
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_stock'
              }
            ],
            quantity: 1
          },
          modSlotName: 'mod_stock_001'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: rpk16Handguard.id,
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Rail.id,
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_mount_000'
              },
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Rail.id,
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_mount_001'
              }
            ],
            quantity: 1
          },
          modSlotName: 'mod_handguard'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: rpk1615inch.id,
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16MuzzleBreak.id,
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_muzzle'
              }
            ],
            quantity: 1
          },
          modSlotName: 'mod_barrel'
        }
      ],
      quantity: 1
    }
  ],
  typeId: InventorySlotTypeId.onSling
}

const inventorySlot3: IInventorySlot = {
  typeId: InventorySlotTypeId.pockets,
  items: [
    {
      content: [],
      ignorePrice: false,
      itemId: ms2000.id,
      modSlots: [],
      quantity: 1
    },
    {
      content: [],
      ignorePrice: false,
      itemId: specterDr.id,
      modSlots: [],
      quantity: 1
    },
    {
      content: [],
      ignorePrice: false,
      itemId: srd9.id,
      modSlots: [],
      quantity: 1
    }
  ]
}

const inventorySlot4: IInventorySlot = {
  typeId: InventorySlotTypeId.tacticalRig,
  items: [
    {
      content: [
        {
          content: [],
          ignorePrice: false,
          itemId: ms2000.id,
          modSlots: [],
          quantity: 1
        }
      ],
      ignorePrice: false,
      itemId: bansheeDefault.id,
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: monocletePe.id,
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'front_plate'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: monocletePe.id,
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'back_plate'
        }
      ],
      quantity: 1
    }
  ]
}
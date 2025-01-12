/* eslint-disable no-irregular-whitespace */
import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { BuildsToTextType } from '../../models/utils/IBuildsToTextOptions'
import { IErgonomics } from '../../models/utils/IErgonomics'
import { IInventoryItemPrice } from '../../models/utils/IInventoryItemPrice'
import { IInventoryItemRecoil } from '../../models/utils/IInventoryItemRecoil'
import { IRecoilModifierPercentage } from '../../models/utils/IRecoilModifierPercentage'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import { IWeight } from '../../models/utils/IWeight'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { PresetService } from '../../services/PresetService'
import Services from '../../services/repository/Services'
import { ak12PistolGrip, ak12Stock, ak12bt, alpha, ammo1270Magnum, ammo545bp, ammo545us, ammo9mmGT, armor6b13Fl, armor6b13FlDefault, bansheeDefault, berkut, cultLocust, esLamp, ewr, iskra, lshZ2dtm, lshZ2dtmFs, m9a3, m9a3Default, m9a3Fs, m9a3Magazine, m9a3Rs, m9a3SideGrip, m9a3Slide, m9a3Thr, monocletePe, ms2000, mts25512Default, mts25512cyl, paca, plate6b33Back, plate6b33Front, precision, rgd5, rpk16, rpk1615inch, rpk16Default, rpk16Drum, rpk16DustCover, rpk16Handguard, rpk16MuzzleBreak, rpk16Rail, rpk16Rs, rpk16RsBase, rpk16Tube, salewa, scavVest, specterDr, srd9, syringe, vaseline, vhs, x400 } from '../__data__/itemMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('InventoryItemService', () => {
  describe('getArmorModifiersAsync()', () => {
    it.each([
      [
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
        } as IInventoryItem,
        {
          armorClass: cultLocust.armorClass,
          durability: armor6b13FlDefault.durability + cultLocust.durability + plate6b33Back.durability
        } as IArmorModifiers
      ],
      [
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
        } as IInventoryItem,
        {
          armorClass: cultLocust.armorClass,
          durability: bansheeDefault.durability + cultLocust.durability + monocletePe.durability
        } as IArmorModifiers
      ],
      [
        {
          content: [],
          itemId: armor6b13FlDefault.id,
          ignorePrice: false,
          modSlots: [
            {
              item: undefined,
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
        } as IInventoryItem,
        {
          armorClass: armor6b13FlDefault.armorClass,
          durability: armor6b13FlDefault.durability + plate6b33Back.durability
        } as IArmorModifiers
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: paca.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          armorClass: paca.armorClass,
          durability: paca.durability
        } as IArmorModifiers
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: scavVest.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          armorClass: scavVest.armorClass,
          durability: scavVest.durability
        } as IArmorModifiers
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: iskra.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          armorClass: 0,
          durability: 0
        } as IArmorModifiers
      ]
    ])('should get the armor class of the front armor plate (when present) and the sum of armor and plates durability of the inventory item', async (inventoryItem: IInventoryItem, expected: IArmorModifiers) => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)

      const service = new InventoryItemService()

      // Act
      const armorModifiers = await service.getArmorModifiersAsync(inventoryItem)

      // Assert
      expect(armorModifiers).toStrictEqual(expected)
    })

    it('should ignore the armor modifiers of armor plates that cannot be found', async () => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)

      const service = new InventoryItemService()

      // Act
      const armorClassResult = await service.getArmorModifiersAsync({
        content: [],
        ignorePrice: false,
        itemId: bansheeDefault.id,
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'front_plate'
          }
        ],
        quantity: 1
      })

      // Assert
      expect(armorClassResult).toStrictEqual({
        armorClass: 0,
        durability: 72
      })
    })

    it('should ignore the armor modifiers of items that cannot be found', async () => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)

      const service = new InventoryItemService()

      // Act
      const armorClassResult = await service.getArmorModifiersAsync({
        content: [],
        ignorePrice: false,
        itemId: 'invalid',
        modSlots: [],
        quantity: 1
      })

      // Assert
      expect(armorClassResult).toStrictEqual({
        armorClass: 0,
        durability: 0
      })
    })
  })

  describe('toTextAsync() (markdown)', () => {
    it.each([
      [
        {
          content: [],
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
        },
        `**RPK-16 5.45x39 light machine gun Default**   💵 Marché **43 345₽**  
 [*Chargeur*] **RPK-16 5.45x39 95-round drum magazine**   💵 Prapor 3 (*échange*) **24 218₽**  
  95 x **5.45x39mm US gs**   💵 Prapor 1 **9 120₽**  `
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: m9a3Default.id,
          modSlots: [
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: m9a3Thr.id,
                modSlots: [
                  {
                    item: {
                      content: [],
                      ignorePrice: false,
                      itemId: srd9.id,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_muzzle'
                  }
                ],
                quantity: 1
              },
              modSlotName: 'mod_barrel'
            },
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: m9a3SideGrip.id,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_pistol_grip'
            },
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: m9a3Slide.id,
                modSlots: [
                  {
                    item: {
                      content: [],
                      ignorePrice: false,
                      itemId: m9a3Rs.id,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_sight_rear'
                  },
                  {
                    item: {
                      content: [],
                      ignorePrice: false,
                      itemId: m9a3Fs.id,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_sight_front'
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
            },
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: x400.id,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_tactical'
            }
          ],
          quantity: 1
        },
        `**Beretta M9A3 9x19 pistol Default**   💵 Peacekeeper 1 **107$** (= **15 337₽**)  
 [*Canon*]  
  [*Bouche*] **SIG Sauer SRD9 9x19 sound suppressor**   💵 Peacekeeper 2 **242$** (= **34 606₽**)  
 [*Chargeur*]  
  17 x **9x19mm Green Tracer**   💵 Le Mécano 1 **1 241₽**  
 [*Dispositif tactique*] **SureFire X400 Ultra tactical flashlight with laser**   💵 Peacekeeper 2 **95$** (= **13 552₽**)  `
      ],
      [
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
            },
            {
              item: undefined,
              modSlotName: 'modSlot_left_side_plate'
            },
            {
              item: undefined,
              modSlotName: 'modSlot_right_side_plate'
            }
          ],
          quantity: 1
        },
        `**Shellback Tactical Banshee plate carrier (A-TACS AU) Default**   💵 Ragman 3 (*échange*) **59 790₽**  
 [*Plaque dorsale*] **6B13 custom ballistic plates (Back)**   💵 Marché **43 868₽**  
 **MS2000 Marker**   💵 Ragman 1 **95€** (= **15 105₽**)  `
      ],
      [
        {
          content: [],
          itemId: ammo545bp.id,
          ignorePrice: false,
          modSlots: [],
          quantity: 60
        },
        '60 x **5.45x39mm BP gs**   💵 Pas de marchand  '
      ],
      [
        {
          content: [],
          itemId: vaseline.id,
          ignorePrice: true,
          modSlots: [],
          quantity: 1
        },
        '**Vaseline balm**  '
      ]
    ])('should convert an inventory item to a markdown text', async (inventoryItem: IInventoryItem, expected: string) => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const service = new InventoryItemService()

      // Act
      const result = await service.toTextAsync(
        inventoryItem,
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

    it('should ignore prices', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const service = new InventoryItemService()

      // Act
      const result = await service.toTextAsync(
        inventoryItem,
        {
          includeEmojis: true,
          includeLink: true,
          includePrices: false,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(`**WARTECH Berkut BB-102 backpack (A-TACS FG)**  
 **RPK-16 5.45x39 light machine gun Default**  
  [*Chargeur*] **RPK-16 5.45x39 95-round drum magazine**  
 50 x **9x19mm Green Tracer**  `)
    })

    it.each([
      ['en', '**Video cassette with the Cyborg Killer movie**   💵 Flea market **37,867₽**  '],
      ['fr', '**Video cassette with the Cyborg Killer movie**   💵 Marché **37 867₽**  ']
    ])('should format prices according to the language', async (language: string, expected: string) => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const service = new InventoryItemService()

      // Act
      const result = await service.toTextAsync(
        {
          content: [],
          ignorePrice: false,
          itemId: vhs.id,
          modSlots: [],
          quantity: 1
        },
        {
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language,
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(expected)
    })

    it('should use the not found item when an item cannot be found', async () => {
      // Arrange
      useItemServiceMock(true, [])
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)
      Services.configure(PresetService)

      const service = new InventoryItemService()

      // Act
      const result = await service.toTextAsync(
        inventoryItem,
        {
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(`**Unknown item "5ca20d5986f774331e7c9602"**   💵 Pas de marchand  
 **Unknown item "5c0d1ec986f77439512a1a72"**   💵 Pas de marchand  
  [*Poignée-pistolet*] **Unknown item "5beec8ea0db834001a6f9dbf"**   💵 Pas de marchand  
  [*Chargeur*] **Unknown item "5bed625c0db834001c062946"**   💵 Pas de marchand  
 50 x **Unknown item "5c3df7d588a4501f290594e5"**   💵 Pas de marchand  `)
    })

    it('should ignore emojis', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const service = new InventoryItemService()

      // Act
      const result = await service.toTextAsync(
        inventoryItem,
        {
          includeEmojis: false,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(`**WARTECH Berkut BB-102 backpack (A-TACS FG)**   Ragman 2 **24 509₽**  
 **RPK-16 5.45x39 light machine gun Default**   Marché **43 345₽**  
  [*Chargeur*] **RPK-16 5.45x39 95-round drum magazine**   Prapor 3 (*échange*) **24 218₽**  
 50 x **9x19mm Green Tracer**   Le Mécano 1 **3 650₽**  `)
    })
  })

  describe('toTextAsync() (simple text)', () => {
    it.each([
      [
        {
          content: [],
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
        },
        `RPK-16 5.45x39 light machine gun Default   💵 Marché 43 345₽
 [Chargeur] RPK-16 5.45x39 95-round drum magazine   💵 Prapor 3 (échange) 24 218₽
  95 x 5.45x39mm US gs   💵 Prapor 1 9 120₽`
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: m9a3Default.id,
          modSlots: [
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: m9a3Thr.id,
                modSlots: [
                  {
                    item: {
                      content: [],
                      ignorePrice: false,
                      itemId: srd9.id,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_muzzle'
                  }
                ],
                quantity: 1
              },
              modSlotName: 'mod_barrel'
            },
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: m9a3SideGrip.id,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_pistol_grip'
            },
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: m9a3Slide.id,
                modSlots: [
                  {
                    item: {
                      content: [],
                      ignorePrice: false,
                      itemId: m9a3Rs.id,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_sight_rear'
                  },
                  {
                    item: {
                      content: [],
                      ignorePrice: false,
                      itemId: m9a3Fs.id,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_sight_front'
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
            },
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: x400.id,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_tactical'
            }
          ],
          quantity: 1
        },
        `Beretta M9A3 9x19 pistol Default   💵 Peacekeeper 1 107$ (= 15 337₽)
 [Canon]
  [Bouche] SIG Sauer SRD9 9x19 sound suppressor   💵 Peacekeeper 2 242$ (= 34 606₽)
 [Chargeur]
  17 x 9x19mm Green Tracer   💵 Le Mécano 1 1 241₽
 [Dispositif tactique] SureFire X400 Ultra tactical flashlight with laser   💵 Peacekeeper 2 95$ (= 13 552₽)`
      ],
      [
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
            },
            {
              item: undefined,
              modSlotName: 'modSlot_left_side_plate'
            },
            {
              item: undefined,
              modSlotName: 'modSlot_right_side_plate'
            }
          ],
          quantity: 1
        },
        `Shellback Tactical Banshee plate carrier (A-TACS AU) Default   💵 Ragman 3 (échange) 59 790₽
 [Plaque dorsale] 6B13 custom ballistic plates (Back)   💵 Marché 43 868₽
 MS2000 Marker   💵 Ragman 1 95€ (= 15 105₽)`
      ],
      [
        {
          content: [],
          itemId: ammo545bp.id,
          ignorePrice: false,
          modSlots: [],
          quantity: 60
        },
        '60 x 5.45x39mm BP gs   💵 Pas de marchand'
      ],
      [
        {
          content: [],
          itemId: vaseline.id,
          ignorePrice: true,
          modSlots: [],
          quantity: 1
        },
        'Vaseline balm'
      ]
    ])('should convert an inventory item to a text', async (inventoryItem: IInventoryItem, expected: string) => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const service = new InventoryItemService()

      // Act
      const result = await service.toTextAsync(
        inventoryItem,
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

    it('should ignore prices', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const service = new InventoryItemService()

      // Act
      const result = await service.toTextAsync(
        inventoryItem,
        {
          includeEmojis: true,
          includeLink: true,
          includePrices: false,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(`WARTECH Berkut BB-102 backpack (A-TACS FG)
 RPK-16 5.45x39 light machine gun Default
  [Chargeur] RPK-16 5.45x39 95-round drum magazine
 50 x 9x19mm Green Tracer`)
    })

    it.each([
      ['en', 'Video cassette with the Cyborg Killer movie   💵 Flea market 37,867₽'],
      ['fr', 'Video cassette with the Cyborg Killer movie   💵 Marché 37 867₽']
    ])('should format prices according to the language', async (language: string, expected: string) => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const service = new InventoryItemService()

      // Act
      const result = await service.toTextAsync(
        {
          content: [],
          ignorePrice: false,
          itemId: vhs.id,
          modSlots: [],
          quantity: 1
        },
        {
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language,
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(expected)
    })

    it('should use the not found item when an item cannot be found', async () => {
      // Arrange
      useItemServiceMock(true, [])
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)
      Services.configure(PresetService)

      const service = new InventoryItemService()

      // Act
      const result = await service.toTextAsync(
        inventoryItem,
        {
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(`Unknown item "5ca20d5986f774331e7c9602"   💵 Pas de marchand
 Unknown item "5c0d1ec986f77439512a1a72"   💵 Pas de marchand
  [Poignée-pistolet] Unknown item "5beec8ea0db834001a6f9dbf"   💵 Pas de marchand
  [Chargeur] Unknown item "5bed625c0db834001c062946"   💵 Pas de marchand
 50 x Unknown item "5c3df7d588a4501f290594e5"   💵 Pas de marchand`)
    })

    it('should ignore emojis', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const service = new InventoryItemService()

      // Act
      const result = await service.toTextAsync(
        inventoryItem,
        {
          includeEmojis: false,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(`WARTECH Berkut BB-102 backpack (A-TACS FG)   Ragman 2 24 509₽
 RPK-16 5.45x39 light machine gun Default   Marché 43 345₽
  [Chargeur] RPK-16 5.45x39 95-round drum magazine   Prapor 3 (échange) 24 218₽
 50 x 9x19mm Green Tracer   Le Mécano 1 3 650₽`)
    })
  })

  describe('getErgonomicsAsync()', () => {
    it.each([
      [
        {
          content: [],
          ignorePrice: false,
          itemId: rpk16Default.id,
          modSlots: [
            {
              item: {
                content: [],
                itemId: ak12PistolGrip.id,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_pistol_grip'
            },
            {
              item: undefined,
              modSlotName: 'mod_stock'
            },
            {
              item: {
                content: [],
                itemId: rpk16Drum.id,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_magazine'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          ergonomics: 45,
          ergonomicsWithMods: 28
        } as IErgonomics
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: iskra.id,
          modSlots: [],
          quantity: 50
        } as IInventoryItem,
        {
          ergonomics: 0,
          ergonomicsWithMods: 0
        } as IErgonomics
      ],
      [
        invalidInventoryItem3,
        {
          ergonomics: 0,
          ergonomicsWithMods: 0
        } as IErgonomics
      ]
    ])(
      'should get the ergonomics of an inventory item',
      async (inventoryItem: IInventoryItem, expected: IErgonomics) => {
        // Arrange
        useItemServiceMock()
        Services.configure(ItemPropertiesService)
        const service = new InventoryItemService()

        // Act
        const ergonomics = await service.getErgonomicsAsync(inventoryItem)

        // Assert
        expect(ergonomics).toStrictEqual(expected)
      }
    )

    it.each([
      [
        invalidInventoryItem1,
        {
          ergonomics: 0,
          ergonomicsWithMods: 0
        } as IErgonomics
      ],
      [
        invalidInventoryItem2,
        {
          ergonomics: rpk16Default.ergonomics,
          ergonomicsWithMods: rpk16Default.ergonomics
        } as IErgonomics
      ]
    ])(
      'should ignore the ergonomics of items that cannot be found',
      async (inventoryItem: IInventoryItem, expected: IErgonomics) => {
        // Arrange
        useItemServiceMock()
        Services.configure(ItemPropertiesService)
        const service = new InventoryItemService()

        // Act
        const ergonomics = await service.getErgonomicsAsync(inventoryItem)

        // Assert
        expect(ergonomics).toStrictEqual(expected)
      }
    )
  })

  describe('getPriceAsync()', () => {
    it.each([
      [
        inventoryItem,
        true,
        {
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: berkut.id,
            merchant: 'ragman',
            merchantLevel: 2,
            quest: undefined,
            value: 24509,
            valueInMainCurrency: 24509
          },
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 95722,
              valueInMainCurrency: 95722
            }
          ],
          priceWithContentInMainCurrency: 95722,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: berkut.id,
            merchant: 'ragman',
            merchantLevel: 2,
            quest: undefined,
            value: 24509,
            valueInMainCurrency: 24509
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        } as IInventoryItemPrice
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: ammo545us.id,
          modSlots: [],
          quantity: 60
        } as IInventoryItem,
        true,
        {
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: ammo545us.id,
            merchant: 'prapor',
            merchantLevel: 1,
            quest: undefined,
            value: 5760,
            valueInMainCurrency: 5760
          },
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 5760,
              valueInMainCurrency: 5760
            }
          ],
          priceWithContentInMainCurrency: 5760,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: ammo545us.id,
            merchant: 'prapor',
            merchantLevel: 1,
            quest: undefined,
            value: 96,
            valueInMainCurrency: 96
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        } as IInventoryItemPrice
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: rpk16.id,
          modSlots: [
            {
              item: {
                content: [],
                itemId: rpk16DustCover.id,
                ignorePrice: false,
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: specterDr.id,
                      ignorePrice: false,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_scope'
                  }
                ],
                quantity: 1
              },
              modSlotName: 'mod_reciever'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        true,
        {
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 43345,
            valueInMainCurrency: 43345
          },
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 51193,
              valueInMainCurrency: 51193
            },
            {
              barterItems: [],
              currencyName: 'USD',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 279,
              valueInMainCurrency: 39886
            }
          ],
          priceWithContentInMainCurrency: 91079,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 43345,
            valueInMainCurrency: 43345
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        } as IInventoryItemPrice
      ]
    ])(
      'should get the price of an inventory item',
      async (inventoryItem: IInventoryItem, canBeLooted: boolean, expected: IInventoryItemPrice) => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)

        const service = new InventoryItemService()

        // Act
        const price = await service.getPriceAsync(inventoryItem, undefined, canBeLooted)

        // Assert
        expect(price).toStrictEqual(expected)
      })

    it('should ignore the price of items in the content of a preset item', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock([
        {
          content: [],
          ignorePrice: false,
          itemId: m9a3Default.id,
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
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)
      const service = new InventoryItemService()

      const inventoryItem: IInventoryItem = {
        content: [],
        ignorePrice: false,
        itemId: m9a3Default.id,
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

      const expected: IInventoryItemPrice = {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: m9a3Default.id,
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        pricesWithContent: [],
        priceWithContentInMainCurrency: 0,
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: m9a3Default.id,
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notLootable
      }

      // Act
      const price = await service.getPriceAsync(inventoryItem, undefined, false)

      // Assert
      expect(price).toStrictEqual(expected)
    })

    it('should ignore the price of non lootable items', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)
      const service = new InventoryItemService()

      const inventoryItem: IInventoryItem = {
        content: [
          {
            content: [],
            ignorePrice: false,
            itemId: rpk16Default.id,
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
                  ignorePrice: false,
                  itemId: rpk16Drum.id,
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_magazine'
              }
            ],
            quantity: 1
          }
        ],
        ignorePrice: false,
        itemId: alpha.id,
        modSlots: [],
        quantity: 1
      }

      const expected: IInventoryItemPrice = {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: alpha.id,
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 76683,
            valueInMainCurrency: 76683
          }
        ],
        priceWithContentInMainCurrency: 76683,
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: alpha.id,
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notLootable
      }

      // Act
      const price = await service.getPriceAsync(inventoryItem, undefined, false)

      // Assert
      expect(price).toStrictEqual(expected)
    })

    it('should ignore the price of manually ignored items', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)
      const service = new InventoryItemService()

      const inventoryItem: IInventoryItem = {
        content: [
          {
            content: [
              {
                content: [],
                ignorePrice: true,
                itemId: iskra.id,
                modSlots: [],
                quantity: 1
              }
            ],
            ignorePrice: false,
            itemId: scavVest.id,
            modSlots: [],
            quantity: 1
          }
        ],
        ignorePrice: true,
        itemId: berkut.id,
        modSlots: [],
        quantity: 1
      }

      const expected: IInventoryItemPrice = {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: berkut.id,
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: 16321,
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 16321,
            valueInMainCurrency: 16321
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: berkut.id,
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.manuallyIgnored
      }

      // Act
      const price = await service.getPriceAsync(inventoryItem, undefined, true)

      // Assert
      expect(price).toStrictEqual(expected)
    })

    it.each([
      [
        {
          content: [],
          ignorePrice: false,
          itemId: rpk16Default.id,
          modSlots: [
            {
              item: {
                content: [],
                itemId: rpk16Tube.id,
                ignorePrice: false,
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: ak12Stock.id,
                      ignorePrice: false,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_stock'
                  }
                ],
                quantity: 1
              },
              modSlotName: 'mod_stock_001'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16Default.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 43345,
            valueInMainCurrency: 43345
          },
          priceWithContentInMainCurrency: 43345,
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 43345,
              valueInMainCurrency: 43345
            }
          ],
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16Default.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 43345,
            valueInMainCurrency: 43345
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        } as IInventoryItemPrice
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: rpk16Default.id,
          modSlots: [
            {
              item: {
                content: [],
                itemId: rpk16Tube.id,
                ignorePrice: false,
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: precision.id,
                      ignorePrice: false,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_stock'
                  }
                ],
                quantity: 1
              },
              modSlotName: 'mod_stock_001'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16Default.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 43345,
            valueInMainCurrency: 43345
          },
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 43345,
              valueInMainCurrency: 43345
            },
            {
              barterItems: [],
              currencyName: 'USD',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 157,
              valueInMainCurrency: 22385
            }
          ],
          priceWithContentInMainCurrency: 65730,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16Default.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 43345,
            valueInMainCurrency: 43345
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        } as IInventoryItemPrice
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: rpk16Default.id,
          modSlots: [
            {
              item: {
                content: [],
                itemId: ak12bt.id,
                ignorePrice: false,
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: ak12Stock.id,
                      ignorePrice: false,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_stock'
                  }
                ],
                quantity: 1
              },
              modSlotName: 'mod_stock_001'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16Default.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 43345,
            valueInMainCurrency: 43345
          },
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 46981,
              valueInMainCurrency: 46981
            }
          ],
          priceWithContentInMainCurrency: 46981,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16Default.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 43345,
            valueInMainCurrency: 43345
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        } as IInventoryItemPrice
      ],
      [
        {
          content: [
            {
              content: [],
              ignorePrice: false,
              itemId: rpk16Default.id,
              modSlots: [
                {
                  item: {
                    content: [],
                    itemId: rpk16Tube.id,
                    ignorePrice: false,
                    modSlots: [
                      {
                        item: {
                          content: [],
                          itemId: precision.id,
                          ignorePrice: false,
                          modSlots: [],
                          quantity: 1
                        },
                        modSlotName: 'mod_stock'
                      }
                    ],
                    quantity: 1
                  },
                  modSlotName: 'mod_stock_001'
                }
              ],
              quantity: 1
            }
          ],
          ignorePrice: false,
          itemId: berkut.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: berkut.id,
            merchant: 'ragman',
            merchantLevel: 2,
            quest: undefined,
            value: 24509,
            valueInMainCurrency: 24509
          },
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 67854,
              valueInMainCurrency: 67854
            },
            {
              barterItems: [],
              currencyName: 'USD',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 157,
              valueInMainCurrency: 22385
            }
          ],
          priceWithContentInMainCurrency: 90239,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: berkut.id,
            merchant: 'ragman',
            merchantLevel: 2,
            quest: undefined,
            value: 24509,
            valueInMainCurrency: 24509
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        } as IInventoryItemPrice
      ],
      [
        {
          content: [],
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
        } as IInventoryItem,
        {
          missingPrice: false,
          price: {
            barterItems: [
              {
                itemId: ewr.id,
                quantity: 1
              },
              {
                itemId: vhs.id,
                quantity: 1
              }
            ],
            currencyName: 'barter',
            itemId: bansheeDefault.id,
            merchant: 'ragman',
            merchantLevel: 3,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 59790
          },
          priceWithContentInMainCurrency: 103658,
          pricesWithContent: [
            {
              barterItems: [
              ],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 103658,
              valueInMainCurrency: 103658
            }
          ],
          unitPrice: {
            barterItems: [
              {
                itemId: ewr.id,
                quantity: 1
              },
              {
                itemId: vhs.id,
                quantity: 1
              }
            ],
            currencyName: 'barter',
            itemId: bansheeDefault.id,
            merchant: 'ragman',
            merchantLevel: 3,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 59790
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        } as IInventoryItemPrice
      ]
    ])('should get the price of an inventory item and ignore items present in the item preset',
      async (inventoryItem: IInventoryItem, expected: IInventoryItemPrice) => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)

        const service = new InventoryItemService()

        // Act
        const price = await service.getPriceAsync(inventoryItem, undefined, true)

        // Assert
        expect(price).toStrictEqual(expected)
      })

    it('should get the price of an inventory item ignoring the prices of deactivated merchants', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const inventoryItemService = new InventoryItemService()

      const globalFilterService = Services.get(GlobalFilterService)
      globalFilterService.save({
        excludeItemsWithoutMatchingPrice: true,
        excludePresetBaseItems: true,
        merchantFilters: [
          {
            enabled: false,
            merchant: 'jaeger',
            merchantLevel: 1
          },
          {
            enabled: true,
            merchant: 'therapist',
            merchantLevel: 1
          },
          {
            enabled: true,
            merchant: 'flea-market',
            merchantLevel: 0
          }
        ]
      })

      // Act
      const priceResult = await inventoryItemService.getPriceAsync({
        content: [],
        ignorePrice: false,
        itemId: iskra.id,
        modSlots: [],
        quantity: 1
      })

      // Assert
      const expected: IInventoryItemPrice = {
        missingPrice: false,
        price: {
          barterItems: [
            {
              itemId: syringe.id,
              quantity: 1
            }
          ],
          currencyName: 'barter',
          itemId: iskra.id,
          merchant: 'therapist',
          merchantLevel: 1,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 25320
        },
        priceWithContentInMainCurrency: 25320,
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 25320,
            valueInMainCurrency: 25320
          }
        ],
        unitPrice: {
          barterItems: [
            {
              itemId: syringe.id,
              quantity: 1
            }
          ],
          currencyName: 'barter',
          itemId: iskra.id,
          merchant: 'therapist',
          merchantLevel: 1,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 25320
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      }

      expect(priceResult).toStrictEqual(expected)
    })

    it.each([
      [
        {
          content: [],
          ignorePrice: false,
          itemId: ammo545bp.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          missingPrice: true,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: ammo545bp.id,
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          priceWithContentInMainCurrency: 0,
          pricesWithContent: [],
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: ammo545bp.id,
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        } as IInventoryItemPrice
      ],
      [
        {
          content: [
            {
              content: [],
              ignorePrice: false,
              itemId: ammo545bp.id,
              modSlots: [],
              quantity: 1
            }
          ],
          ignorePrice: false,
          itemId: berkut.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          missingPrice: true,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: berkut.id,
            merchant: 'ragman',
            merchantLevel: 2,
            quest: undefined,
            value: 24509,
            valueInMainCurrency: 24509
          },
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 24509,
              valueInMainCurrency: 24509
            }
          ],
          priceWithContentInMainCurrency: 24509,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: berkut.id,
            merchant: 'ragman',
            merchantLevel: 2,
            quest: undefined,
            value: 24509,
            valueInMainCurrency: 24509
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        } as IInventoryItemPrice
      ],
      [
        {
          content: [],
          itemId: m9a3.id,
          ignorePrice: false,
          modSlots: [
            {
              item: {
                content: [],
                itemId: m9a3SideGrip.id,
                ignorePrice: false,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_pistol_grip'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          missingPrice: true,
          price: {
            barterItems: [],
            currencyName: 'USD',
            itemId: m9a3.id,
            merchant: 'peacekeeper',
            merchantLevel: 1,
            quest: undefined,
            value: 75,
            valueInMainCurrency: 8025
          },
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'USD',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 75,
              valueInMainCurrency: 8025
            }
          ],
          priceWithContentInMainCurrency: 8025,
          unitPrice: {
            barterItems: [],
            currencyName: 'USD',
            itemId: m9a3.id,
            merchant: 'peacekeeper',
            merchantLevel: 1,
            quest: undefined,
            value: 75,
            valueInMainCurrency: 8025
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        } as IInventoryItemPrice
      ]
    ])('should have a missing price when no merchant sells the item', async (inventoryItem: IInventoryItem, expected: IInventoryItemPrice) => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const service = new InventoryItemService()

      // Act
      const price = await service.getPriceAsync(inventoryItem, undefined, true)

      // Assert
      expect(price).toStrictEqual(expected)
    })

    it('should get the price of an item that has barters', async () => {
      // Arrange
      useItemServiceMock(
        true,
        undefined,
        [
          {
            barterItems: [
              {
                itemId: ammo9mmGT.id,
                quantity: 5000.0
              }
            ],
            currencyName: 'barter',
            itemId: m9a3SideGrip.id,
            merchant: 'peacekeeper',
            merchantLevel: 3.0,
            quest: undefined,
            value: 0.0,
            valueInMainCurrency: 0.0
          },
          {
            barterItems: [
              {
                itemId: ammo9mmGT.id,
                quantity: 2.0
              },
              {
                itemId: vhs.id,
                quantity: 1.0
              },
              {
                itemId: rgd5.id,
                quantity: 3.0
              }
            ],
            currencyName: 'barter',
            itemId: m9a3SideGrip.id,
            merchant: 'peacekeeper',
            merchantLevel: 3.0,
            quest: undefined,
            value: 0.0,
            valueInMainCurrency: 0.0
          },
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: ammo9mmGT.id,
            merchant: 'flea-market',
            merchantLevel: 0.0,
            quest: undefined,
            value: 15000.0,
            valueInMainCurrency: 15000.0
          },
          {
            barterItems: [],
            currencyName: 'USD',
            itemId: vhs.id,
            merchant: 'flea-market',
            merchantLevel: 0.0,
            quest: undefined,
            value: 250.0,
            valueInMainCurrency: 25000.0
          },
          {
            barterItems: [
              {
                itemId: esLamp.id,
                quantity: 1
              }
            ],
            currencyName: 'barter',
            itemId: rgd5.id,
            merchant: 'prapor',
            merchantLevel: 0.0,
            quest: undefined,
            value: 0.0,
            valueInMainCurrency: 0.0
          },
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: esLamp.id,
            merchant: 'mechanic',
            merchantLevel: 1.0,
            quest: undefined,
            value: 200.0,
            valueInMainCurrency: 200.0
          }
        ])
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const service = new InventoryItemService()
      Services.get(GlobalFilterService)

      const inventoryItem: IInventoryItem = {
        content: [],
        ignorePrice: false,
        itemId: m9a3SideGrip.id,
        modSlots: [],
        quantity: 2
      }

      // Act
      const price = await service.getPriceAsync(inventoryItem)

      // Assert
      const expected: IInventoryItemPrice = {
        missingPrice: false,
        price: {
          barterItems: [
            {
              itemId: ammo9mmGT.id,
              quantity: 4.0
            },
            {
              itemId: vhs.id,
              quantity: 2.0
            },
            {
              itemId: rgd5.id,
              quantity: 6.0
            }
          ],
          currencyName: 'barter',
          itemId: m9a3SideGrip.id,
          merchant: 'peacekeeper',
          merchantLevel: 3,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 111200
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 61200,
            valueInMainCurrency: 61200
          },
          {
            barterItems: [],
            currencyName: 'USD',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 500,
            valueInMainCurrency: 50000
          }
        ],
        priceWithContentInMainCurrency: 111200,
        unitPrice: {
          barterItems: [
            {
              itemId: ammo9mmGT.id,
              quantity: 2.0
            },
            {
              itemId: vhs.id,
              quantity: 1.0
            },
            {
              itemId: rgd5.id,
              quantity: 3.0
            }
          ],
          currencyName: 'barter',
          itemId: m9a3SideGrip.id,
          merchant: 'peacekeeper',
          merchantLevel: 3,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 55600
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      }

      expect(price).toStrictEqual(expected)
    })

    it('should ignore barters with missing barter item price', async () => {
      // Arrange
      useItemServiceMock(
        true,
        undefined,
        [
          {
            barterItems: [
              {
                itemId: rgd5.id,
                quantity: 1.0
              }
            ],
            currencyName: 'barter',
            itemId: m9a3SideGrip.id,
            merchant: 'peacekeeper',
            merchantLevel: 3.0,
            quest: undefined,
            value: 0.0,
            valueInMainCurrency: 0.0
          },
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: m9a3SideGrip.id,
            merchant: 'prapor',
            merchantLevel: 3.0,
            quest: undefined,
            value: 25000000.0,
            valueInMainCurrency: 25000000.0
          }
        ])
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const service = new InventoryItemService()
      Services.get(GlobalFilterService)

      const inventoryItem: IInventoryItem = {
        content: [],
        ignorePrice: false,
        itemId: m9a3SideGrip.id,
        modSlots: [],
        quantity: 2
      }

      // Act
      const price = await service.getPriceAsync(inventoryItem)

      // Assert
      const expected: IInventoryItemPrice = {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: m9a3SideGrip.id,
          merchant: 'prapor',
          merchantLevel: 3,
          quest: undefined,
          value: 50000000,
          valueInMainCurrency: 50000000
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 50000000,
            valueInMainCurrency: 50000000
          }
        ],
        priceWithContentInMainCurrency: 50000000,
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: m9a3SideGrip.id,
          merchant: 'prapor',
          merchantLevel: 3,
          quest: undefined,
          value: 25000000,
          valueInMainCurrency: 25000000
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      }

      expect(price).toStrictEqual(expected)
    })

    it('should arbitrarily select the first barter as the unit price when no the item has no prices available but has barter with missing barter item prices', async () => {
      // Arrange
      useItemServiceMock(
        true,
        undefined,
        [
          {
            barterItems: [
              {
                itemId: rgd5.id,
                quantity: 1.0
              }
            ],
            currencyName: 'barter',
            itemId: m9a3SideGrip.id,
            merchant: 'peacekeeper',
            merchantLevel: 3.0,
            quest: undefined,
            value: 0.0,
            valueInMainCurrency: 0.0
          },
          {
            barterItems: [
              {
                itemId: vhs.id,
                quantity: 1.0
              }
            ],
            currencyName: 'barter',
            itemId: m9a3SideGrip.id,
            merchant: 'peacekeeper',
            merchantLevel: 2.0,
            quest: undefined,
            value: 0.0,
            valueInMainCurrency: 0.0
          }
        ])
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const service = new InventoryItemService()
      Services.get(GlobalFilterService)

      const inventoryItem: IInventoryItem = {
        content: [],
        ignorePrice: false,
        itemId: m9a3SideGrip.id,
        modSlots: [],
        quantity: 2
      }

      // Act
      const price = await service.getPriceAsync(inventoryItem)

      // Assert
      const expected: IInventoryItemPrice = {
        missingPrice: true,
        price: {
          barterItems: [
            {
              itemId: rgd5.id,
              quantity: 2
            }
          ],
          currencyName: 'barter',
          itemId: m9a3SideGrip.id,
          merchant: 'peacekeeper',
          merchantLevel: 3,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        pricesWithContent: [],
        priceWithContentInMainCurrency: 0,
        unitPrice: {
          barterItems: [
            {
              itemId: rgd5.id,
              quantity: 1
            }
          ],
          currencyName: 'barter',
          itemId: m9a3SideGrip.id,
          merchant: 'peacekeeper',
          merchantLevel: 3,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      }

      expect(price).toStrictEqual(expected)
    })

    it.each([
      [
        invalidInventoryItem1,
        {
          missingPrice: true,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: 'invalid',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          pricesWithContent: [],
          priceWithContentInMainCurrency: 0,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: 'invalid',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        }
      ],
      [
        invalidInventoryItem2,
        {
          missingPrice: true,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16Default.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 43345,
            valueInMainCurrency: 43345
          },
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 43345,
              valueInMainCurrency: 43345
            }
          ],
          priceWithContentInMainCurrency: 43345,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16Default.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 43345,
            valueInMainCurrency: 43345
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        }
      ],
      [
        invalidInventoryItem3,
        {
          missingPrice: true,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: berkut.id,
            merchant: 'ragman',
            merchantLevel: 2,
            quest: undefined,
            value: 24509,
            valueInMainCurrency: 24509
          },
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 24509,
              valueInMainCurrency: 24509
            }
          ],
          priceWithContentInMainCurrency: 24509,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: berkut.id,
            merchant: 'ragman',
            merchantLevel: 2,
            quest: undefined,
            value: 24509,
            valueInMainCurrency: 24509
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        }
      ]
    ])(
      'should ignore the price of items that cannot be found',
      async (inventoryItem: IInventoryItem, expected: IInventoryItemPrice) => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        const service = new InventoryItemService()

        // Act
        const price = await service.getPriceAsync(inventoryItem)

        // Assert
        expect(price).toStrictEqual(expected)
      }
    )

    it('should ignore the price of barter items that cannot be found', async () => {
      // Arrange
      useItemServiceMock(
        true,
        undefined,
        [
          {
            barterItems: [
              {
                itemId: 'invalid',
                quantity: 1.0
              }
            ],
            currencyName: 'barter',
            itemId: m9a3SideGrip.id,
            merchant: 'peacekeeper',
            merchantLevel: 3.0,
            quest: undefined,
            value: 0.0,
            valueInMainCurrency: 0.0
          }
        ])
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)
      Services.configure(PresetService)

      const service = new InventoryItemService()
      Services.get(GlobalFilterService)

      const inventoryItem: IInventoryItem = {
        content: [],
        ignorePrice: false,
        itemId: m9a3SideGrip.id,
        modSlots: [],
        quantity: 2
      }

      // Act
      const price = await service.getPriceAsync(inventoryItem)

      // Assert
      const expected: IInventoryItemPrice = {
        missingPrice: true,
        price: {
          barterItems: [
            {
              itemId: 'invalid',
              quantity: 2
            }
          ],
          currencyName: 'barter',
          itemId: '5cadc431ae921500113bb8d5',
          merchant: 'peacekeeper',
          merchantLevel: 3,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        pricesWithContent: [],
        priceWithContentInMainCurrency: 0,
        unitPrice: {
          barterItems: [
            {
              itemId: 'invalid',
              quantity: 1
            }
          ],
          currencyName: 'barter',
          itemId: '5cadc431ae921500113bb8d5',
          merchant: 'peacekeeper',
          merchantLevel: 3,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      }

      expect(price).toStrictEqual(expected)
    })

    it('should ignore the merchant filter when searching for available prices', async () => {
      // Arrange
      useItemServiceMock(
        true,
        undefined,
        [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16Tube.id,
            merchant: 'mechanic',
            merchantLevel: 4.0,
            quest: undefined,
            value: 29400.0,
            valueInMainCurrency: 29400.0
          }
        ])
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)

      const inventoryItemService = new InventoryItemService()
      const globalFilterService = Services.get(GlobalFilterService)
      globalFilterService.save({
        excludeItemsWithoutMatchingPrice: true,
        excludePresetBaseItems: true,
        merchantFilters: [
          {
            enabled: true,
            merchant: 'mechanic',
            merchantLevel: 1
          }
        ]
      })

      const inventoryItem: IInventoryItem = {
        content: [],
        ignorePrice: false,
        itemId: rpk16Tube.id,
        modSlots: [],
        quantity: 1
      }

      // Act
      const price = await inventoryItemService.getPriceAsync(inventoryItem, undefined, true, false)

      // Assert
      expect(price.unitPrice.valueInMainCurrency).toBe(29400)
    })
  })

  describe('getRecoilAsync()', () => {
    it.each([
      [
        {
          content: [],
          ignorePrice: false,
          itemId: salewa.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          horizontalRecoil: 0,
          horizontalRecoilWithMods: 0,
          verticalRecoil: 0,
          verticalRecoilWithMods: 0
        } as IInventoryItemRecoil
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: m9a3Default.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          horizontalRecoil: 280,
          horizontalRecoilWithMods: 280,
          verticalRecoil: 404,
          verticalRecoilWithMods: 404
        } as IInventoryItemRecoil
      ],
      [
        {
          content: [],
          itemId: m9a3Default.id,
          ignorePrice: false,
          modSlots: [
            {
              item: {
                content: [],
                itemId: m9a3Thr.id,
                ignorePrice: false,
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: srd9.id,
                      ignorePrice: false,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_muzzle'
                  }
                ],
                quantity: 1
              },
              modSlotName: 'mod_barrel'
            },
            {
              item: {
                content: [],
                itemId: m9a3SideGrip.id,
                ignorePrice: false,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_pistol_grip'
            },
            {
              item: {
                content: [],
                itemId: m9a3Slide.id,
                ignorePrice: false,
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: m9a3Rs.id,
                      ignorePrice: false,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_sight_rear'
                  },
                  {
                    item: {
                      content: [],
                      itemId: m9a3Fs.id,
                      ignorePrice: false,
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_sight_front'
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
                    itemId: ammo9mmGT.id,
                    ignorePrice: false,
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
            },
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: x400.id,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_tactical'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          horizontalRecoil: 280,
          horizontalRecoilWithMods: 249.34,
          verticalRecoil: 404,
          verticalRecoilWithMods: 362.18
        } as IInventoryItemRecoil
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: rpk16Default.id,
          modSlots: [
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: ammo545us.id,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'chamber0'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          horizontalRecoil: 333,
          horizontalRecoilWithMods: 318,
          verticalRecoil: 112,
          verticalRecoilWithMods: 97
        } as IInventoryItemRecoil
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: rpk16Default.id,
          modSlots: [
            {
              item: undefined,
              modSlotName: 'chamber0'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          horizontalRecoil: 333,
          horizontalRecoilWithMods: 333,
          verticalRecoil: 112,
          verticalRecoilWithMods: 112
        } as IInventoryItemRecoil
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: rpk16Default.id,
          modSlots: [
            {
              item: undefined,
              modSlotName: 'mod_magazine'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          horizontalRecoil: 333,
          horizontalRecoilWithMods: 333,
          verticalRecoil: 112,
          verticalRecoilWithMods: 112
        } as IInventoryItemRecoil
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: mts25512Default.id,
          modSlots: [
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: mts25512cyl.id,
                modSlots: [
                  {
                    modSlotName: 'camora_000'
                  },
                  {
                    item: {
                      content: [],
                      ignorePrice: false,
                      itemId: ammo1270Magnum.id,
                      modSlots: [

                      ],
                      quantity: 1
                    },
                    modSlotName: 'camora_001'
                  },
                  {
                    modSlotName: 'camora_002'
                  },
                  {
                    modSlotName: 'camora_003'
                  },
                  {
                    modSlotName: 'camora_004'
                  }
                ],
                quantity: 1
              },
              modSlotName: 'mod_magazine'
            }
          ],
          'quantity': 1
        } as IInventoryItem,
        {
          horizontalRecoil: 486,
          horizontalRecoilWithMods: 601,
          verticalRecoil: 364,
          verticalRecoilWithMods: 479
        } as IInventoryItemRecoil
      ]
    ])('should get the recoil of an inventory item', async (inventoryItem: IInventoryItem, expected: IInventoryItemRecoil) => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)
      const service = new InventoryItemService()

      // Act
      const recoil = await service.getRecoilAsync(inventoryItem)

      // Assert
      expect(recoil).toStrictEqual({
        horizontalRecoil: expected.horizontalRecoil,
        horizontalRecoilWithMods: expected.horizontalRecoilWithMods,
        verticalRecoil: expected.verticalRecoil,
        verticalRecoilWithMods: expected.verticalRecoilWithMods
      })
    })

    it.each([
      [
        invalidInventoryItem1,
        {
          horizontalRecoil: 0,
          horizontalRecoilWithMods: 0,
          verticalRecoil: 0,
          verticalRecoilWithMods: 0
        } as IInventoryItemRecoil
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: rpk16Default.id,
          modSlots: [
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: 'invalid',
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_pistol_grip'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          horizontalRecoil: rpk16Default.horizontalRecoil,
          horizontalRecoilWithMods: rpk16Default.horizontalRecoil,
          verticalRecoil: rpk16Default.verticalRecoil,
          verticalRecoilWithMods: rpk16Default.verticalRecoil
        } as IInventoryItemRecoil
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: rpk16Default.id,
          modSlots: [
            {
              item: {
                content: [
                  {
                    content: [],
                    ignorePrice: false,
                    itemId: 'invalid',
                    modSlots: [],
                    quantity: 1
                  }
                ],
                ignorePrice: false,
                itemId: rpk16Drum.id,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_magazine'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          horizontalRecoil: rpk16Default.horizontalRecoil,
          horizontalRecoilWithMods: rpk16Default.horizontalRecoil,
          verticalRecoil: rpk16Default.verticalRecoil,
          verticalRecoilWithMods: rpk16Default.verticalRecoil
        } as IInventoryItemRecoil
      ]
    ])('should ignore the recoil of items that cannot be found', async (inventoryItem: IInventoryItem, expected: IInventoryItemRecoil) => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)
      const service = new InventoryItemService()

      // Act
      const recoil = await service.getRecoilAsync(inventoryItem)

      // Assert
      expect(recoil).toStrictEqual(expected)
    })
  })

  describe('getRecoilModifierPercentageAsync()', () => {
    it.each([
      [
        {
          content: [],
          ignorePrice: false,
          itemId: salewa.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          recoilModifierPercentage: 0,
          recoilModifierPercentageWithMods: 0
        } as IRecoilModifierPercentage
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: rpk16MuzzleBreak.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          recoilModifierPercentage: -0.06,
          recoilModifierPercentageWithMods: -0.06
        } as IRecoilModifierPercentage
      ],
      [
        {
          content: [],
          itemId: rpk1615inch.id,
          ignorePrice: false,
          modSlots: [
            {
              item: {
                content: [],
                itemId: rpk16MuzzleBreak.id,
                ignorePrice: false,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_muzzle'
            },
            {
              item: undefined,
              modSlotName: 'mod_test'
            }
          ],
          quantity: 1
        },
        {
          recoilModifierPercentage: -0.03,
          recoilModifierPercentageWithMods: -0.09
        } as IRecoilModifierPercentage
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: x400.id, // Testing the hypothetic case of a mod on which a mod with recoil reduction could be mounted
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
            },
            {
              item: undefined,
              modSlotName: 'mod_test'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          recoilModifierPercentage: 0,
          recoilModifierPercentageWithMods: -0.06
        } as IRecoilModifierPercentage
      ]
    ])('should get the recoil modifier percentage of an inventory item', async (inventoryItem: IInventoryItem, expected: IRecoilModifierPercentage) => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)
      const service = new InventoryItemService()

      // Act
      const recoilModifierPercentage = await service.getRecoilModifierPercentageAsync(inventoryItem)

      // Assert
      expect(recoilModifierPercentage).toStrictEqual(expected)
    })

    it.each([
      [
        invalidInventoryItem1,
        {
          recoilModifierPercentage: 0,
          recoilModifierPercentageWithMods: 0
        } as IRecoilModifierPercentage
      ],
      [
        {
          content: [],
          itemId: rpk1615inch.id,
          ignorePrice: false,
          modSlots: [
            {
              item: {
                content: [],
                itemId: 'invalid',
                ignorePrice: false,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_muzzle'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          recoilModifierPercentage: rpk1615inch.recoilModifierPercentage,
          recoilModifierPercentageWithMods: rpk1615inch.recoilModifierPercentage
        } as IRecoilModifierPercentage
      ]
    ])(
      'should ignore the recoil modifier percentage of items that cannot be found',
      async (inventoryItem: IInventoryItem, expected: IRecoilModifierPercentage) => {
        // Arrange
        useItemServiceMock()
        Services.configure(ItemPropertiesService)
        const service = new InventoryItemService()

        // Act
        const recoilModifierPercentage = await service.getRecoilModifierPercentageAsync(
          inventoryItem
        )

        // Assert
        expect(recoilModifierPercentage).toStrictEqual(expected)
      }
    )
  })

  describe('getWearableModifiersAsync()', () => {
    it.each([
      [
        {
          content: [],
          ignorePrice: false,
          itemId: iskra.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          ergonomicsModifierPercentage: 0,
          movementSpeedModifierPercentage: 0,
          turningSpeedModifierPercentage: 0
        } as IWearableModifiers
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: armor6b13Fl.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          ergonomicsModifierPercentage: armor6b13Fl.ergonomicsModifierPercentage,
          movementSpeedModifierPercentage: armor6b13Fl.movementSpeedModifierPercentage,
          turningSpeedModifierPercentage: armor6b13Fl.turningSpeedModifierPercentage
        } as IWearableModifiers
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: armor6b13FlDefault.id,
          modSlots: [
            {
              modSlotName: 'front_plate',
              item: {
                content: [],
                ignorePrice: false,
                itemId: plate6b33Front.id,
                modSlots: [],
                quantity: 1
              }
            },
            {
              modSlotName: 'back_plate',
              item: {
                content: [],
                ignorePrice: false,
                itemId: plate6b33Back.id,
                modSlots: [],
                quantity: 1
              }
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          ergonomicsModifierPercentage: armor6b13FlDefault.ergonomicsModifierPercentage + plate6b33Front.ergonomicsModifierPercentage + plate6b33Back.ergonomicsModifierPercentage,
          movementSpeedModifierPercentage: armor6b13FlDefault.movementSpeedModifierPercentage + plate6b33Front.movementSpeedModifierPercentage + plate6b33Back.movementSpeedModifierPercentage,
          turningSpeedModifierPercentage: armor6b13FlDefault.turningSpeedModifierPercentage + plate6b33Front.turningSpeedModifierPercentage + plate6b33Back.turningSpeedModifierPercentage
        } as IWearableModifiers
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: lshZ2dtm.id,
          modSlots: [
            {
              item: {
                content: [],
                itemId: lshZ2dtmFs.id,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_equipment'
            },
            {
              item: undefined,
              modSlotName: 'mod_equipment'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          ergonomicsModifierPercentage: lshZ2dtm.ergonomicsModifierPercentage + lshZ2dtmFs.ergonomicsModifierPercentage,
          movementSpeedModifierPercentage: lshZ2dtm.movementSpeedModifierPercentage + lshZ2dtmFs.movementSpeedModifierPercentage,
          turningSpeedModifierPercentage: lshZ2dtm.turningSpeedModifierPercentage + lshZ2dtmFs.turningSpeedModifierPercentage
        } as IWearableModifiers
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: berkut.id,
          modSlots: [],
          quantity: 1
        } as IInventoryItem,
        {
          ergonomicsModifierPercentage: berkut.ergonomicsModifierPercentage,
          movementSpeedModifierPercentage: berkut.movementSpeedModifierPercentage,
          turningSpeedModifierPercentage: berkut.turningSpeedModifierPercentage
        } as IWearableModifiers
      ]
    ])(
      'should get the wearable modifiers of an inventory item',
      async (
        inventoryItem: IInventoryItem,
        expected: IWearableModifiers
      ) => {
        // Arrange
        useItemServiceMock()
        Services.configure(ItemPropertiesService)
        const service = new InventoryItemService()

        // Act
        const wearableModifiers = await service.getWearableModifiersAsync(
          inventoryItem
        )

        // Assert
        expect(wearableModifiers).toStrictEqual(expected)
      }
    )

    it.each([
      [
        invalidInventoryItem1,
        {
          ergonomicsModifierPercentage: 0,
          movementSpeedModifierPercentage: 0,
          turningSpeedModifierPercentage: 0
        } as IWearableModifiers
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: lshZ2dtm.id,
          modSlots: [
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: 'invalid',
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_equipment'
            }
          ],
          quantity: 1
        } as IInventoryItem,
        {
          ergonomicsModifierPercentage: lshZ2dtm.ergonomicsModifierPercentage,
          movementSpeedModifierPercentage: lshZ2dtm.movementSpeedModifierPercentage,
          turningSpeedModifierPercentage: lshZ2dtm.turningSpeedModifierPercentage
        } as IWearableModifiers
      ]
    ])(
      'should ignore wearable modifiers of items that cannot be found',
      async (inventoryItem: IInventoryItem, expected: IWearableModifiers) => {
        // Arrange
        useItemServiceMock()
        Services.configure(ItemPropertiesService)
        const service = new InventoryItemService()

        // Act
        const ergonomicsModifierPercentage = await service.getWearableModifiersAsync(inventoryItem)

        // Assert
        expect(ergonomicsModifierPercentage).toStrictEqual(expected)
      }
    )
  })

  describe('getWeightAsync()', () => {
    it.each([
      [
        inventoryItem,
        {
          weight: 1,
          weightWithContent: 3.53,
          unitWeight: 1
        } as IWeight
      ],
      [
        {
          content: [],
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
        },
        {
          weight: 3.08,
          weightWithContent: 5.779999999999999,
          unitWeight: 3.08
        } as IWeight
      ],
      [
        {
          content: [],
          ignorePrice: false,
          itemId: ammo9mmGT.id,
          modSlots: [],
          quantity: 50
        } as IInventoryItem,
        {
          weight: 0.3,
          weightWithContent: 0.3,
          unitWeight: 0.006
        } as IWeight
      ]
    ])(
      'should get the weight of an inventory item',
      async (inventoryItem: IInventoryItem, expected: IWeight) => {
        // Arrange
        useItemServiceMock()
        const service = new InventoryItemService()

        // Act
        const weight = await service.getWeightAsync(inventoryItem)

        // Assert
        expect(weight).toStrictEqual(expected)
      }
    )

    it.each([
      [
        invalidInventoryItem1,
        {
          weight: 0,
          weightWithContent: 0,
          unitWeight: 0
        } as IWeight
      ],
      [
        invalidInventoryItem2,
        {
          weight: rpk16Default.weight,
          weightWithContent: rpk16Default.weight,
          unitWeight: rpk16Default.weight
        } as IWeight
      ],
      [
        invalidInventoryItem3,
        {
          weight: berkut.weight,
          weightWithContent: berkut.weight,
          unitWeight: berkut.weight
        } as IWeight
      ]
    ])(
      'should ignore the weight of items that cannot be found',
      async (inventoryItem: IInventoryItem, expected: IWeight) => {
        // Arrange
        useItemServiceMock()
        const service = new InventoryItemService()

        // Act
        const weight = await service.getWeightAsync(inventoryItem)

        // Assert
        expect(weight).toStrictEqual(expected)
      }
    )
  })
})



const inventoryItem: IInventoryItem = {
  content: [
    {
      content: [],
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
          item: undefined,
          modSlotName: 'mod_stock'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: rpk16Drum.id,
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_magazine'
        }
      ],
      quantity: 1
    },
    {
      content: [],
      ignorePrice: false,
      itemId: ammo9mmGT.id,
      modSlots: [],
      quantity: 50
    }
  ],
  ignorePrice: false,
  itemId: berkut.id,
  modSlots: [],
  quantity: 1
}

const invalidInventoryItem1: IInventoryItem = {
  content: [],
  ignorePrice: false,
  itemId: 'invalid',
  modSlots: [],
  quantity: 1
}

const invalidInventoryItem2: IInventoryItem = {
  content: [],
  ignorePrice: false,
  itemId: rpk16Default.id,
  modSlots: [
    {
      item: {
        content: [],
        ignorePrice: false,
        itemId: 'invalid',
        modSlots: [],
        quantity: 1
      },
      modSlotName: 'mod_pistol_grip'
    }
  ],
  quantity: 1
}

const invalidInventoryItem3: IInventoryItem = {
  content: [
    {
      content: [],
      ignorePrice: false,
      itemId: 'invalid',
      modSlots: [],
      quantity: 1
    }
  ],
  ignorePrice: false,
  itemId: berkut.id,
  modSlots: [],
  quantity: 1
}
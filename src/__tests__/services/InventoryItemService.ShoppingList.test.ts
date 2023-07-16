import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { InventoryItemService } from '../../services/InventoryItemService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import Services from '../../services/repository/Services'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { usePresetServiceMock } from '../../__mocks__/PresetPropertiesServiceMock'
import { describe, expect, it } from 'vitest'

describe('getShoppingList', () => {
  it('should get a shopping list for an item and all its content, mod (except from default preset) and barter items that must be bought', async () => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)

    const inventoryItemService = new InventoryItemService()
    const globalFilterService = Services.get(GlobalFilterService)
    globalFilterService.saveMerchantFilters([
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
        merchant: 'skier',
        merchantLevel: 2
      }
    ])

    const inventoryItem: IInventoryItem = {
      content: [
        {
          content: [],
          ignorePrice: false,
          itemId: '584147732459775a2b6d9f12', // AKS-74U 5.45x39 assault rifle Default
          modSlots: [
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: '5f6341043ada5942720e2dc5', // AK Aeroknox Scorpius pistol grip
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_pistol_grip'
            },
            {
              item: {
                content: [
                  {
                    content: [],
                    ignorePrice: false,
                    itemId: '56dff3afd2720bba668b4567', // 5.45x39mm PS gs
                    modSlots: [],
                    quantity: 30
                  }
                ],
                ignorePrice: false,
                itemId: '564ca99c4bdc2d16268b4589', // AK-74 5.45x39 6L20 30-round magazine
                modSlots: [],
                quantity: 1.0
              },
              modSlotName: 'mod_magazine'
            }
          ],
          quantity: 1
        },
        {
          content: [],
          ignorePrice: false,
          itemId: '56dff3afd2720bba668b4567', // 5.45x39mm PS gs
          modSlots: [],
          quantity: 60
        },
        {
          content: [],
          ignorePrice: true,
          itemId: '5734795124597738002c6176', // Insulating tape
          modSlots: [],
          quantity: 1
        }
      ],
      ignorePrice: false,
      itemId: '5df8a4d786f77412672a1e3b', // 6Sh118 raid backpack
      modSlots: [],
      quantity: 1
    }

    // Act
    const shoppingListResult = await inventoryItemService.getShoppingList(inventoryItem)

    // Assert
    expect(shoppingListResult.success).toBe(true)
    expect(shoppingListResult.value).to.deep.equal([
      {
        item: {
          capacity: 48,
          categoryId: 'backpack',
          conflictingItemIds: [],
          ergonomicsPercentageModifier: -0.07,
          iconLink: 'https://assets.tarkov.dev/5df8a4d786f77412672a1e3b-icon.webp',
          id: '5df8a4d786f77412672a1e3b',
          imageLink: 'https://assets.tarkov.dev/5df8a4d786f77412672a1e3b-image.webp',
          marketLink: 'https://tarkov.dev/item/6sh118-raid-backpack',
          maxStackableAmount: 1,
          movementSpeedPercentageModifier: -0.05,
          name: '6Sh118 raid backpack',
          prices: [
            {
              barterItems: [
                {
                  itemId: '59f32c3b86f77472a31742f0',
                  quantity: 9
                }
              ],
              currencyName: 'barter',
              itemId: '5df8a4d786f77412672a1e3b',
              merchant: 'prapor',
              merchantLevel: 3,
              quest: {
                id: '6179ac7511973d018217d0b9',
                name: 'Easy Job - Part 1',
                wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Easy_Job_-_Part_1'
              },
              value: 0,
              valueInMainCurrency: 0
            },
            {
              barterItems: [
                {
                  itemId: '5d0375ff86f774186372f685',
                  quantity: 2
                }
              ],
              currencyName: 'barter',
              itemId: '5df8a4d786f77412672a1e3b',
              merchant: 'prapor',
              merchantLevel: 4,
              quest: null,
              value: 0,
              valueInMainCurrency: 0
            }
          ],
          shortName: '6Sh118',
          turningSpeedPercentageModifier: -0.03,
          weight: 3.5,
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6Sh118_raid_backpack'
        },
        quantity: 1,
        price: {
          barterItems: [],
          currencyName: 'barter',
          itemId: '5df8a4d786f77412672a1e3b',
          merchant: 'prapor',
          merchantLevel: 4,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPrice: {
          barterItems: [],
          currencyName: 'barter',
          itemId: '5df8a4d786f77412672a1e3b',
          merchant: 'prapor',
          merchantLevel: 4,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        }
      },
      {
        item: {
          categoryId: 'other',
          conflictingItemIds: [],
          iconLink: 'https://assets.tarkov.dev/5d0375ff86f774186372f685-icon.webp',
          id: '5d0375ff86f774186372f685',
          imageLink: 'https://assets.tarkov.dev/5d0375ff86f774186372f685-image.webp',
          marketLink: 'https://tarkov.dev/item/military-cable',
          maxStackableAmount: 1,
          name: 'Military cable',
          prices: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5d0375ff86f774186372f685',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 53432,
              valueInMainCurrency: 53432
            }
          ],
          shortName: 'MCable',
          weight: 0.65,
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Military_cable'
        },
        quantity: 2,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5d0375ff86f774186372f685',
          merchant: 'flea-market',
          merchantLevel: 0,
          quest: null,
          value: 106864,
          valueInMainCurrency: 106864
        },
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5d0375ff86f774186372f685',
          merchant: 'flea-market',
          merchantLevel: 0,
          quest: null,
          value: 53432,
          valueInMainCurrency: 53432
        }
      },
      {
        item: {
          baseItemId: '57dc2fa62459775949412633',
          caliber: 'Caliber545x39',
          categoryId: 'mainWeapon',
          conflictingItemIds: [],
          defaultPresetId: null,
          ergonomics: 44,
          fireModes: [
            'SingleFire',
            'FullAuto'
          ],
          fireRate: 650,
          horizontalRecoil: 415,
          iconLink: 'https://assets.tarkov.dev/584147732459775a2b6d9f12-icon.webp',
          id: '584147732459775a2b6d9f12',
          imageLink: 'https://assets.tarkov.dev/584147732459775a2b6d9f12-image.webp',
          marketLink: 'https://tarkov.dev/item/kalashnikov-aks-74u-545x39-assault-rifle-default',
          maxStackableAmount: 1,
          minuteOfAngle: 3.44,
          modSlots: [
            {
              compatibleItemIds: [
                '5c0d5e4486f77478390952fe',
                '61962b617c6c7b169525f168',
                '56dfef82d2720bbd668b4567',
                '56dff026d2720bb8668b4567',
                '56dff061d2720bb5668b4567',
                '56dff0bed2720bb0668b4567',
                '56dff216d2720bbd668b4568',
                '56dff2ced2720bb4668b4567',
                '56dff338d2720bbd668b4569',
                '56dff3afd2720bba668b4567',
                '56dff421d2720b5f5a8b4567',
                '56dff4a2d2720bbd668b456a',
                '56dff4ecd2720b5f5a8b4568'
              ],
              maxStackableAmount: 1,
              name: 'chamber0',
              required: false
            },
            {
              compatibleItemIds: [
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
                '5998517986f7746017232f7e',
                '623c3be0484b5003161840dc',
                '628c9ab845c59e5b80768a81',
                '628a664bccaab13006640e47'
              ],
              maxStackableAmount: 1,
              name: 'mod_pistol_grip',
              required: false
            },
            {
              compatibleItemIds: [
                '59ecc28286f7746d7a68aa8c',
                '5ab626e4d8ce87272e4c6e43',
                '57dc347d245977596754e7a1'
              ],
              maxStackableAmount: 1,
              name: 'mod_stock',
              required: false
            },
            {
              compatibleItemIds: [
                '6130ca3fd92c473c77020dbd',
                '5648ac824bdc2ded0b8b457d'
              ],
              maxStackableAmount: 1,
              name: 'mod_charge',
              required: false
            },
            {
              compatibleItemIds: [
                '564ca9df4bdc2d35148b4569',
                '564ca99c4bdc2d16268b4589',
                '55d480c04bdc2d1d4e8b456a',
                '5cbdaf89ae9215000e5b9c94',
                '55d481904bdc2d8c2f8b456a',
                '55d482194bdc2d1d4e8b456b',
                '55d4837c4bdc2d1d4e8b456c',
                '5aaa4194e5b5b055d06310a5',
                '5bed61680db834001d2c45ab',
                '5bed625c0db834001c062946'
              ],
              maxStackableAmount: 1,
              name: 'mod_magazine',
              required: false
            },
            {
              compatibleItemIds: [
                '5ac72e945acfc43f3b691116',
                '5ac7655e5acfc40016339a19',
                '5649aa744bdc2ded0b8b457e',
                '5f633f791b231926f2329f13',
                '5943eeeb86f77412d6384f6b',
                '5cc9a96cd7f00c011c04e04a',
                '615d8f5dd92c473c770212ef',
                '5649ab884bdc2ded0b8b457f',
                '57dc324a24597759501edc20',
                '59bffc1f86f77435b128b872',
                '593d493f86f7745e6b2ceb22',
                '564caa3d4bdc2d17108b458e',
                '57ffb0e42459777d047111c5'
              ],
              maxStackableAmount: 1,
              name: 'mod_muzzle',
              required: false
            },
            {
              compatibleItemIds: [
                '57dc334d245977597164366f',
                '5839a7742459773cf9693481'
              ],
              maxStackableAmount: 1,
              name: 'mod_reciever',
              required: false
            },
            {
              compatibleItemIds: [
                '59d36a0086f7747e673f3946'
              ],
              maxStackableAmount: 1,
              name: 'mod_gas_block',
              required: false
            }
          ],
          name: 'Kalashnikov AKS-74U 5.45x39 assault rifle Default',
          prices: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '584147732459775a2b6d9f12',
              merchant: 'prapor',
              merchantLevel: 1,
              quest: {
                id: '5936d90786f7742b1420ba5b',
                name: 'Debut',
                wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Debut'
              },
              value: 24605,
              valueInMainCurrency: 24605
            },
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '584147732459775a2b6d9f12',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 28999,
              valueInMainCurrency: 28999
            }
          ],
          shortName: 'AKS-74U Default',
          verticalRecoil: 121,
          weight: 1.809,
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kalashnikov_AKS-74U_5.45x39_assault_rifle'
        },
        quantity: 1,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '584147732459775a2b6d9f12',
          merchant: 'prapor',
          merchantLevel: 1.0,
          quest: {
            id: '5936d90786f7742b1420ba5b',
            name: 'Debut',
            wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Debut'
          },
          value: 24605.0,
          valueInMainCurrency: 24605.0
        },
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '584147732459775a2b6d9f12',
          merchant: 'prapor',
          merchantLevel: 1.0,
          quest: {
            id: '5936d90786f7742b1420ba5b',
            name: 'Debut',
            wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Debut'
          },
          value: 24605.0,
          valueInMainCurrency: 24605.0
        }
      },
      {
        item: {
          accuracyPercentageModifier: 0,
          baseItemId: null,
          categoryId: 'rangedWeaponMod',
          conflictingItemIds: [],
          defaultPresetId: null,
          ergonomicsModifier: 12,
          iconLink: 'https://assets.tarkov.dev/5f6341043ada5942720e2dc5-icon.webp',
          id: '5f6341043ada5942720e2dc5',
          imageLink: 'https://assets.tarkov.dev/5f6341043ada5942720e2dc5-image.webp',
          marketLink: 'https://tarkov.dev/item/ak-aeroknox-scorpius-pistol-grip',
          maxStackableAmount: 1,
          modSlots: [],
          name: 'AK Aeroknox Scorpius pistol grip',
          prices: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5f6341043ada5942720e2dc5',
              merchant: 'mechanic',
              merchantLevel: 4,
              quest: null,
              value: 6496,
              valueInMainCurrency: 6496
            },
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5f6341043ada5942720e2dc5',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 45166,
              valueInMainCurrency: 45166
            }
          ],
          recoilPercentageModifier: 0,
          shortName: 'Scorpius',
          weight: 0.14,
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/AK_Aeroknox_Scorpius_pistol_grip'
        },
        quantity: 1,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5f6341043ada5942720e2dc5',
          merchant: 'flea-market',
          merchantLevel: 0.0,
          quest: null,
          value: 45166.0,
          valueInMainCurrency: 45166.0
        },
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5f6341043ada5942720e2dc5',
          merchant: 'flea-market',
          merchantLevel: 0.0,
          quest: null,
          value: 45166.0,
          valueInMainCurrency: 45166.0
        }
      },
      {
        item: {
          accuracyPercentageModifier: 0,
          armorDamagePercentage: 0.35,
          armorPenetrations: [
            6,
            6,
            5,
            2,
            0,
            0
          ],
          blinding: false,
          caliber: 'Caliber545x39',
          categoryId: 'ammunition',
          conflictingItemIds: [],
          durabilityBurnPercentageModifier: 0.1,
          fleshDamage: 48,
          fragmentationChancePercentage: 0.4,
          heavyBleedingPercentageChance: 0,
          iconLink: 'https://assets.tarkov.dev/56dff3afd2720bba668b4567-icon.webp',
          id: '56dff3afd2720bba668b4567',
          imageLink: 'https://assets.tarkov.dev/56dff3afd2720bba668b4567-image.webp',
          lightBleedingPercentageChance: 0,
          marketLink: 'https://tarkov.dev/item/545x39mm-ps-gs',
          maxStackableAmount: 60,
          name: '5.45x39mm PS gs',
          penetrationPower: 31,
          prices: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '56dff3afd2720bba668b4567',
              merchant: 'prapor',
              merchantLevel: 1,
              quest: {
                id: '59674eb386f774539f14813a',
                name: 'Delivery from the Past',
                wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Delivery_from_the_Past'
              },
              value: 109,
              valueInMainCurrency: 109
            },
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '56dff3afd2720bba668b4567',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 224,
              valueInMainCurrency: 224
            }
          ],
          projectiles: 1,
          recoilPercentageModifier: 0,
          shortName: 'PS',
          subsonic: false,
          tracer: false,
          velocity: 890,
          weight: 0.01,
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/5.45x39mm_PS_gs'
        },
        quantity: 90,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '56dff3afd2720bba668b4567',
          merchant: 'prapor',
          merchantLevel: 1.0,
          quest: {
            id: '59674eb386f774539f14813a',
            name: 'Delivery from the Past',
            wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Delivery_from_the_Past'
          },
          value: 9810,
          valueInMainCurrency: 9810
        },
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '56dff3afd2720bba668b4567',
          merchant: 'prapor',
          merchantLevel: 1.0,
          quest: {
            id: '59674eb386f774539f14813a',
            name: 'Delivery from the Past',
            wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Delivery_from_the_Past'
          },
          value: 109,
          valueInMainCurrency: 109
        }
      }
    ] as IShoppingListItem[])
  })

  it('should get a shopping list for items having a barter itself having a barter with multiple times the same item', async () => {
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)

    const inventoryItemService = new InventoryItemService()
    const globalFilterService = Services.get(GlobalFilterService)
    globalFilterService.saveMerchantFilters([
      {
        enabled: true,
        merchant: 'flea-market',
        merchantLevel: 0
      },
      {
        enabled: true,
        merchant: 'mechanic',
        merchantLevel: 2
      },
      {
        enabled: true,
        merchant: 'skier',
        merchantLevel: 2
      }
    ])

    const inventoryItem: IInventoryItem = {
      content: [],
      ignorePrice: false,
      itemId: '5f676b779ab5ec19f028eaf3', // Kel-Tec RFB 7.62x51 rifle Default
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '5b099ac65acfc400186331e1',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_magazine'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '5f2aa46b878ef416f538b567',
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '5f2aa4464b50c14bcf07acdb',
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
            itemId: '5f2aa47a200e2c0ee46efa71',
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '5f2aa493cd375f14e15eea72',
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_mount_000'
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
            itemId: '5f2aa49f9b44de6b1b4e68d4',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_mount'
        }
      ],
      quantity: 1
    }

    // Act
    const shoppingListResult = await inventoryItemService.getShoppingList(inventoryItem)

    // Assert
    expect(shoppingListResult.success).toBe(true)
    expect(shoppingListResult.value).to.deep.equal([
      {
        item: {
          baseItemId: '5f2a9575926fd9352339381f',
          caliber: 'Caliber762x51',
          categoryId: 'mainWeapon',
          conflictingItemIds: [],
          defaultPresetId: null,
          ergonomics: 48,
          fireModes: [
            'SingleFire'
          ],
          fireRate: 700,
          horizontalRecoil: 307,
          iconLink: 'https://assets.tarkov.dev/5f676b779ab5ec19f028eaf3-icon.webp',
          id: '5f676b779ab5ec19f028eaf3',
          imageLink: 'https://assets.tarkov.dev/5f676b779ab5ec19f028eaf3-image.webp',
          marketLink: 'https://tarkov.dev/item/kel-tec-rfb-762x51-rifle-default',
          maxStackableAmount: 1,
          minuteOfAngle: 1.48,
          modSlots: [
            {
              compatibleItemIds: [
                '5a6086ea4f39f99cd479502f',
                '5a608bf24f39f98ffc77720e',
                '58dd3ad986f77403051cba8f',
                '5e023e53d4353e3302577c4c',
                '5efb0c1bd79ff02a1f5e68d9',
                '5e023e6e34d52a55c3304f71',
                '5e023e88277cce2b522ff2b1'
              ],
              maxStackableAmount: 1,
              name: 'chamber0',
              required: false
            },
            {
              compatibleItemIds: [
                '5b7bef1e5acfc43d82528402',
                '5b099ac65acfc400186331e1',
                '5b7bef5d5acfc43bca7067a3',
                '5b7c2d1d5acfc43d1028532a',
                '5b7d37845acfc400170e2f87'
              ],
              maxStackableAmount: 1,
              name: 'mod_magazine',
              required: false
            },
            {
              compatibleItemIds: [
                '5f2aa46b878ef416f538b567'
              ],
              maxStackableAmount: 1,
              name: 'mod_barrel',
              required: false
            },
            {
              compatibleItemIds: [
                '5f2aa47a200e2c0ee46efa71'
              ],
              maxStackableAmount: 1,
              name: 'mod_handguard',
              required: false
            },
            {
              compatibleItemIds: [
                '5f2aa49f9b44de6b1b4e68d4'
              ],
              maxStackableAmount: 1,
              name: 'mod_mount',
              required: false
            }
          ],
          name: 'Kel-Tec RFB 7.62x51 rifle Default',
          prices: [
            {
              barterItems: [
                {
                  'itemId': '590a3efd86f77437d351a25b',
                  'quantity': 2
                }
              ],
              currencyName: 'barter',
              itemId: '5f676b779ab5ec19f028eaf3',
              merchant: 'skier',
              merchantLevel: 2,
              quest: null,
              value: 0,
              valueInMainCurrency: 0
            }
          ],
          shortName: 'RFB Default',
          verticalRecoil: 173,
          weight: 1.95,
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kel-Tec_RFB_7.62x51_rifle'
        },
        price: {
          barterItems: [],
          currencyName: 'barter',
          itemId: '5f676b779ab5ec19f028eaf3',
          merchant: 'skier',
          merchantLevel: 2,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        quantity: 1,
        unitPrice: {
          barterItems: [],
          currencyName: 'barter',
          itemId: '5f676b779ab5ec19f028eaf3',
          merchant: 'skier',
          merchantLevel: 2,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        }
      },
      {
        item: {
          categoryId: 'other',
          conflictingItemIds: [],
          iconLink: 'https://assets.tarkov.dev/590a3efd86f77437d351a25b-icon.webp',
          id: '590a3efd86f77437d351a25b',
          imageLink: 'https://assets.tarkov.dev/590a3efd86f77437d351a25b-image.webp',
          marketLink: 'https://tarkov.dev/item/gas-analyzer',
          maxStackableAmount: 1,
          name: 'Gas analyzer',
          prices: [
            {
              barterItems: [
                {
                  itemId: '5734779624597737e04bf329',
                  quantity: 1
                }
              ],
              currencyName: 'barter',
              itemId: '590a3efd86f77437d351a25b',
              merchant: 'mechanic',
              merchantLevel: 1,
              quest: null,
              value: 0,
              valueInMainCurrency: 0
            }
          ],
          shortName: 'GasAn',
          weight: 0.4,
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Gas_analyzer'
        },
        price: {
          barterItems: [],
          currencyName: 'barter',
          itemId: '590a3efd86f77437d351a25b',
          merchant: 'mechanic',
          merchantLevel: 1,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        quantity: 2,
        unitPrice: {
          barterItems: [],
          currencyName: 'barter',
          itemId: '590a3efd86f77437d351a25b',
          merchant: 'mechanic',
          merchantLevel: 1,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        }
      },
      {
        item: {
          categoryId: 'other',
          conflictingItemIds: [],
          iconLink: 'https://assets.tarkov.dev/5734779624597737e04bf329-icon.webp',
          id: '5734779624597737e04bf329',
          imageLink: 'https://assets.tarkov.dev/5734779624597737e04bf329-image.webp',
          marketLink: 'https://tarkov.dev/item/cpu-fan',
          maxStackableAmount: 1,
          name: 'CPU fan',
          prices: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5734779624597737e04bf329',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 17036,
              valueInMainCurrency: 17036
            }
          ],
          shortName: 'CPU fan',
          weight: 0.1,
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/CPU_fan'
        },
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5734779624597737e04bf329',
          merchant: 'flea-market',
          merchantLevel: 0,
          quest: null,
          value: 34072,
          valueInMainCurrency: 34072
        },
        quantity: 2,
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5734779624597737e04bf329',
          merchant: 'flea-market',
          merchantLevel: 0,
          quest: null,
          value: 17036,
          valueInMainCurrency: 17036
        }
      }
    ] as IShoppingListItem[])
  })

  it('should fail when an item search fails', async () => {
    // Arrange
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)

    const inventoryItemService = new InventoryItemService()

    const inventoryItem: IInventoryItem = {
      content: [],
      ignorePrice: false,
      itemId: 'invalid',
      modSlots: [],
      quantity: 1
    }

    // Act
    const shoppingListResult = await inventoryItemService.getShoppingList(inventoryItem)

    // Assert
    expect(shoppingListResult.success).toBe(false)
  })

  it('should fail when an item price search fails', async () => {
    // Arrange
    useItemServiceMock(false)
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)

    const inventoryItemService = new InventoryItemService()

    const inventoryItem: IInventoryItem = {
      content: [],
      ignorePrice: false,
      itemId: '5b3f16c486f7747c327f55f7', // Armband (White)
      modSlots: [],
      quantity: 1
    }

    // Act
    const shoppingListResult = await inventoryItemService.getShoppingList(inventoryItem)

    // Assert
    expect(shoppingListResult.success).toBe(false)
  })
})
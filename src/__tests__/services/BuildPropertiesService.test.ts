import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IAmmunitionCount } from '../../models/utils/IAmmunitionCount'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import Result from '../../utils/Result'
import Currencies from '../../assets/data/currencies.json'
import { ICurrency } from '../../models/item/ICurrency'

const build1: IBuild = {
  id: 'build_1',
  name: 'Build 1',
  inventorySlots: [
    {
      items: Array<IInventoryItem>(1),
      typeId: 'onBack'
    },
    {
      items: [
        {
          content: [
            {
              content: [],
              itemId: '590c5d4b86f774784e1b9c45', // Iskra ration pack
              modSlots: [],
              quantity: 1
            },
            {
              content: [],
              itemId: '5448fee04bdc2dbc018b4567', // 0.6 liter water bottle
              modSlots: [],
              quantity: 1
            }
          ],
          itemId: '5ca20d5986f774331e7c9602', // WARTECH Berkut BB-102 backpack
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: 'backpack'
    },
    {
      items: [
        {
          content: [],
          itemId: '5c0e541586f7747fa54205c9', // 6B13 M assault armor (Tan)
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: 'bodyArmor'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'earpiece'
    },
    {
      items: [
        {
          content: [],
          itemId: '5d5fca1ea4b93635fd598c07', // Crossbow tactical glasses
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: 'eyewear'
    },
    {
      items: [
        {
          content: [],
          itemId: '5ab8f39486f7745cd93a1cca', // Cold Fear Infrared balaclava
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: 'faceCover'
    },
    {
      items: [
        {
          content: [],
          itemId: '5c0e874186f7745dc7616606', // Maska-1Shch bulletproof helmet (Killa)
          modSlots: [
            {
              item: {
                content: [],
                itemId: '5c0e842486f77443a74d2976', // Maska-1Shch face shield (Killa)
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_equipment'
            }
          ],
          quantity: 1
        }
      ],
      typeId: 'headwear'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'holster'
    },
    {
      items: [
        {
          content: [],
          itemId: '544fb3f34bdc2d03748b456a', // Morphine injector
          modSlots: [],
          quantity: 1
        },
        {
          content: [],
          itemId: '5755383e24597772cb798966', // Vaseline balm
          modSlots: [],
          quantity: 1
        },
        {
          content: [],
          itemId: '5448be9a4bdc2dfd2f8b456a', // RGD-5 hand grenade
          modSlots: [],
          quantity: 1
        },
        {
          content: [],
          itemId: '5c0d5e4486f77478390952fe', // 5.45x39mm PPBS gs "Igolnik"
          modSlots: [],
          quantity: 60
        }
      ],
      typeId: 'pockets'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'pouch'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'scabbard'
    },
    {
      items: [
        {
          content: [
            {
              content: [],
              itemId: '5c0d5e4486f77478390952fe', // 5.45x39mm PPBS gs "Igolnik"
              modSlots: [],
              quantity: 1
            }
          ],
          itemId: '5beed0f50db834001c062b12', // RPK-16 5.45x39 light machine gun
          modSlots: [
            {
              item: {
                content: [],
                itemId: '5beec8ea0db834001a6f9dbf', // AK-12 pistol grip
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_pistol_grip'
            },
            {
              item: {
                content: [],
                itemId: '5beec91a0db834001961942d', // RPK-16 dust cover
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: '5beec9450db83400970084fd', // RPK-16 rear sight base
                      modSlots: [
                        {
                          item: {
                            content: [],
                            itemId: '5bf3f59f0db834001a6fa060', // RPK-16 rear sight
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
                    itemId: '5c0d5e4486f77478390952fe', // 5.45x39mm PPBS gs "Igolnik"
                    modSlots: [],
                    quantity: 95
                  }
                ],
                itemId: '5bed625c0db834001c062946', // RPK-16 5.45x39 95-round drum magazine
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_magazine'
            },
            {
              item: {
                content: [],
                itemId: '5beec8b20db834001961942a', // RPK-16 buffer tube
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: '5beec8c20db834001d2c465c', // AK-12 stock
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
                itemId: '5beec3e30db8340019619424', // RPK-16 handguard
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: '5beecbb80db834001d2c465e', // RPK-16 handguard rail
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_mount_000'
                  },
                  {
                    item: {
                      content: [],
                      itemId: '5beecbb80db834001d2c465e', // RPK-16 handguard rail
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
                itemId: '5beec1bd0db834001e6006f3', // RPK-16 5.45x39 15 inch barrel
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: '5beec3420db834001b095429', // RPK-16 5.45x39 muzzle brake \u0026 compensator
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
      typeId: 'onSling'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'tacticalRig'
    }
  ],
  lastExported: undefined,
  lastUpdated: new Date(1)
}

const build2: IBuild = {
  id: 'build_2',
  name: 'Build 2',
  inventorySlots: [
    {
      items: Array<IInventoryItem>(1),
      typeId: 'onBack'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'backpack'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'bodyArmor'
    },
    {
      items: [
        {
          content: [],
          itemId: '5e4d34ca86f774264f758330', // Walker's Razor Digital headset"
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: 'earpiece'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'eyewear'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'faceCover'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'headwear'
    },
    {
      items: [
        {
          content: [
            {
              content: [],
              itemId: '5efb0da7a29a85116f6ea05f', // 9x19 mm 7N31"
              modSlots: [],
              quantity: 1
            }
          ],
          itemId: '5cadc190ae921500103bb3b6', // Beretta M9A3 9x19 pistol
          modSlots: [
            {
              item: {
                content: [],
                itemId: '5cadc1c6ae9215000f2775a4', // Threaded barrel for M9A3 9x19"
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: '5c6165902e22160010261b28', // Sig SRD 9 9x19mm sound suppressor"
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
                itemId: '5cadc431ae921500113bb8d5', // Polymer pistol grip for M9A3
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_pistol_grip'
            },
            {
              item: {
                content: [],
                itemId: '5cadc55cae921500103bb3be', // M9A3 Slide"
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: '5cadd940ae9215051e1c2316', // Beretta M9A3 Standard Rearsight"
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_sight_rear'
                  },
                  {
                    item: {
                      content: [],
                      itemId: '5cadd919ae921500126a77f3', // M9A3 Standard Frontsight"
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
                    itemId: '5efb0da7a29a85116f6ea05f', // 9x19 mm 7N31"
                    modSlots: [],
                    quantity: 17
                  }
                ],
                itemId: '5cadc2e0ae9215051e1c21e7', // M9A3 9x19 17-round magazine"
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_magazine'
            },
            {
              item: {
                content: [],
                itemId: '5cc9c20cd7f00c001336c65d', // NcSTAR Tactical blue laser LAM-Module"
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_tactical'
            }
          ],
          quantity: 1
        }
      ],
      typeId: 'holster'
    },
    {
      items: Array<IInventoryItem>(4),
      typeId: 'pockets'
    },
    {
      items: [
        {
          content: [],
          itemId: '544a11ac4bdc2d470e8b456a', // Alpha Container
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: 'pouch'
    },
    {
      items: [
        {
          content: [],
          itemId: '5bffdc370db834001d23eca8', // 6h5 Bayonet"
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: 'scabbard'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'onSling'
    },
    {
      items: [
        {
          content: [
            {
              content: [],
              itemId: '544fb45d4bdc2dee738b4568', // Salewa FIRST AID KIT (400/400)"
              modSlots: [],
              quantity: 1
            }
          ],
          itemId: '572b7adb24597762ae139821', // Scav Vest"
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: 'tacticalRig'
    }
  ],
  lastExported: undefined,
  lastUpdated: new Date(1)
}

describe('checkCanAddArmor()', () => {
  it.each([
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'backpack',
            items: [] as IInventoryItem[]
          }
        ]
      } as IBuild,
      {
        failureContext: 'BuildService.checkCanAddArmor()',
        failureMessage: 'Cannot find mod slot "tacticalRig".',
        success: false
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'tacticalRig',
            items: [undefined] as (IInventoryItem | undefined)[]
          }
        ]
      } as IBuild,
      {
        failureContext: '',
        failureMessage: '',
        success: true
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'tacticalRig',
            items: [
              {
                content: [],
                itemId: 'invalid',
                modSlots: [],
                quantity: 1
              }
            ] as (IInventoryItem | undefined)[]
          }
        ]
      } as IBuild,
      {
        failureContext: 'ItemService.getItem()',
        failureMessage: 'Item "invalid" not found.',
        success: false
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'tacticalRig',
            items: [
              {
                content: [],
                itemId: '572b7adb24597762ae139821',
                modSlots: [],
                quantity: 1
              }
            ] as (IInventoryItem | undefined)[]
          }
        ]
      } as IBuild,
      {
        failureContext: '',
        failureMessage: '',
        success: true
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'tacticalRig',
            items: [
              {
                content: [],
                itemId: '5b44cad286f77402a54ae7e5',
                modSlots: [],
                quantity: 1
              }
            ] as (IInventoryItem | undefined)[]
          }
        ]
      } as IBuild,
      {
        failureContext: 'BuildService.checkCanAddArmor()',
        failureMessage:
          'Cannot select a body armor because an armored tactical rig has already been added.',
        success: false
      } as Result
    ]
  ])(
    'should check if an armor can be added to the build',
    async (build: IBuild, expected: Result) => {
      // Arrange
      const service = new BuildPropertiesService()

      // Act
      const result = await service.checkCanAddArmor(build)

      // Assert
      expect(result).toEqual(expected)
    }
  )
})

describe('checkCanAddMod()', () => {
  it.each([
    [
      {
        content: [],
        itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      'invalid',
      '050a1e5b-22f4-4104-236c-6cfa7e8be290/57dc2fa62459775949412633/mod_gas_block/mod_handguard',
      {
        failureContext: 'ItemService.getItem()',
        failureMessage: 'Item "invalid" not found.',
        success: false,
        value: undefined
      } as Result
    ],
    [
      {
        content: [],
        itemId: 'invalid',
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      '5d15ce51d7ad1a1eff619092', // AKS-74U Alfa Arms Goliaf handguard
      '050a1e5b-22f4-4104-236c-6cfa7e8be290/57dc2fa62459775949412633/mod_gas_block/mod_handguard',
      {
        failureContext: 'ItemService.getItem()',
        failureMessage: 'Item "invalid" not found.',
        success: false,
        value: undefined
      } as Result
    ],
    [
      {
        content: [],
        itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
        modSlots: [
          {
            item: {
              content: [],
              itemId: '5ac72e945acfc43f3b691116', // AK-105 5.45x39 muzzle brake - compensator (6P44 0-20)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_muzzle'
          },
          {
            item: {
              content: [],
              itemId: '59d36a0086f7747e673f3946', // AKS-74U gas tube
              modSlots: [
                {
                  item: {
                    content: [],
                    itemId: '57dc32dc245977596d4ef3d3', // AKS-74U wooden handguard (6P26 Sb.6
                    modSlots: [
                      {
                        item: {
                          content: [],
                          itemId: '5c1bc4812e22164bef5cfde7', // Zenit RK-0 foregrip
                          modSlots: [],
                          quantity: 1
                        },
                        modSlotName: 'mod_test'
                      }
                    ],
                    quantity: 1
                  },
                  modSlotName: 'mod_handguard'
                }
              ],
              quantity: 1
            },
            modSlotName: 'mod_gas_block'
          },
          {
            item: {
              content: [],
              itemId: '5d2c76ed48f03532f2136169', // AK AKademia Bastion dust cover
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_test'
          },
          {
            item: undefined,
            modSlotName: 'mod_test2'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      '5d15ce51d7ad1a1eff619092', // AKS-74U Alfa Arms Goliaf handguard
      '050a1e5b-22f4-4104-236c-6cfa7e8be290/57dc2fa62459775949412633/mod_gas_block/mod_handguard',
      {
        failureContext: 'BuildService.checkCanAddMod()',
        failureMessage:
          'Cannot add mod "AKS-74U Alfa Arms Goliaf handguard" because it conflicts with item "AK-105 5.45x39 muzzle brake & compensator (6P44 0-20)".',
        success: false
      } as Result
    ],
    [
      {
        content: [],
        itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
        modSlots: [
          {
            item: {
              content: [],
              itemId: '59bffc1f86f77435b128b872', // SilencerCo Hybrid 46 Direct Thread Mount adapter
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_muzzle'
          },
          {
            item: {
              content: [],
              itemId: '59d36a0086f7747e673f3946', // AKS-74U gas tube
              modSlots: [
                {
                  item: {
                    content: [],
                    itemId: '57dc32dc245977596d4ef3d3', // AKS-74U wooden handguard (6P26 Sb.6)
                    modSlots: [
                      {
                        item: {
                          content: [],
                          itemId: '5c1bc4812e22164bef5cfde7', // Zenit RK-0 foregrip
                          modSlots: [],
                          quantity: 1
                        },
                        modSlotName: 'mod_test'
                      }
                    ],
                    quantity: 1
                  },
                  modSlotName: 'mod_handguard'
                }
              ],
              quantity: 1
            },
            modSlotName: 'mod_gas_block'
          },
          {
            item: {
              content: [],
              itemId: '5d2c76ed48f03532f2136169', // AK AKademia Bastion dust cover
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_test'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      '5d15ce51d7ad1a1eff619092', // AKS-74U Alfa Arms Goliaf handguard
      '050a1e5b-22f4-4104-236c-6cfa7e8be290/57dc2fa62459775949412633/mod_gas_block/mod_handguard',
      {
        failureContext: '',
        failureMessage: '',
        success: true
      } as Result
    ],
    [
      {
        content: [],
        itemId: '587e02ff24597743df3deaeb', // Simonov OP-SKS 7.62x39 semi-automatic carbine (Hunting Rifle Version)
        modSlots: [
          {
            modSlotName: 'chamber0'
          },
          {
            item: {
              content: [],
              itemId: '587e0531245977466077a0f7', // stock_sks_molot_op_sks_std
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_stock'
          },
          {
            item: {
              content: [],
              itemId: '574db213245977459a2f3f5d', // SKS rear sight
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_sight_rear'
          },
          {
            item: {
              content: [],
              itemId: '587df3a12459772c28142567', // SKS 7.62x39 10-round internal box magazine
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_magazine'
          },
          {
            item: {
              content: [],
              itemId: '587e08ee245977446b4410cf', // mount_sks_molot_op_sks_std
              modSlots: [
                {
                  item: {
                    content: [],
                    itemId: '5947db3f86f77447880cf76f', // Axion Kobra EKP-8-02 reflex sight (Dovetail)
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_scope'
                }
              ],
              quantity: 1
            },
            modSlotName: 'mod_mount'
          },
          {
            modSlotName: 'mod_muzzle'
          }
        ],
        quantity: 1
      },
      '5c82342f2e221644f31c060e', // Zenit-BelOMO PSO-1 4x24 scope,
      '050a1e5b-22f4-4104-236c-6cfa7e8be290/587e02ff24597743df3deaeb/mod_mount/mod_scope',
      {
        failureContext: '',
        failureMessage: '',
        success: true
      } as Result
    ]
  ])(
    'should check if a mod can be added to an item',
    async (inventoryItem: IInventoryItem, modId: string, modSlotPath: string, expected: Result) => {
      // Arrange
      const service = new BuildPropertiesService()

      // Act
      const result = await service.checkCanAddMod(inventoryItem, modId, modSlotPath)

      // Assert
      expect(result).toEqual(expected)
    }
  )
})

describe('checkCanAddVest()', () => {
  it.each([
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'bodyArmor',
            items: [
              {
                content: [],
                itemId: '5648a7494bdc2d9d488b4583',
                modSlots: [],
                quantity: 1
              }
            ] as IInventoryItem[]
          }
        ]
      } as IBuild,
      'invalid',
      {
        failureContext: 'ItemService.getItem()',
        failureMessage: 'Item "invalid" not found.',
        success: false
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'bodyArmor',
            items: [
              {
                content: [],
                itemId: '5648a7494bdc2d9d488b4583',
                modSlots: [],
                quantity: 1
              }
            ] as IInventoryItem[]
          }
        ]
      } as IBuild,
      '572b7adb24597762ae139821',
      {
        failureContext: '',
        failureMessage: '',
        success: true
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'backpack',
            items: [undefined] as (IInventoryItem | undefined)[]
          }
        ]
      } as IBuild,
      '5b44cad286f77402a54ae7e5',
      {
        failureContext: 'BuildService.checkCanAddVest()',
        failureMessage: 'Cannot find mod slot "bodyArmor".',
        success: false
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'bodyArmor',
            items: [
              {
                content: [],
                itemId: '5648a7494bdc2d9d488b4583',
                modSlots: [],
                quantity: 1
              }
            ] as IInventoryItem[]
          }
        ]
      } as IBuild,
      '5b44cad286f77402a54ae7e5',
      {
        failureContext: 'BuildService.checkCanAddVest()',
        failureMessage:
          'Cannot select an armored tactical rig because a body armor has already been added.',
        success: false
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'bodyArmor',
            items: [undefined] as (IInventoryItem | undefined)[]
          }
        ]
      } as IBuild,
      '5b44cad286f77402a54ae7e5',
      {
        failureContext: '',
        failureMessage: '',
        success: true
      } as Result
    ]
  ])(
    'should check if a vest can be added to the build',
    async (build: IBuild, vestId: string, expected: Result) => {
      // Arrange
      const service = new BuildPropertiesService()

      // Act
      const result = await service.checkCanAddVest(build, vestId)

      // Assert
      expect(result).toEqual(expected)
    }
  )
})

describe('getAmmunitionCounts()', () => {
  it.each([
    [
      build1,
      [
        {
          caption: '5.45x39mm PPBS gs "Igolnik"',
          id: '5c0d5e4486f77478390952fe',
          count: 156
        }
      ] as IAmmunitionCount[]
    ]
  ])(
    'should get the ammunition counts of a build', async (build: IBuild, expected: IAmmunitionCount[]) => {
      // Arrange
      const service = new BuildPropertiesService()

      // Act
      const ammunitionCounts = await service.getAmmunitionCounts(build)

      // Assert
      expect(ammunitionCounts.success).toBe(true)
      expect(ammunitionCounts.value[0].id).toBe(expected[0].id)
      expect(ammunitionCounts.value[0].count).toBe(expected[0].count)
    }
  )

  it('should fail if an item cannot be found', async () => {
    // Arrange
    const service = new BuildPropertiesService()

    // Act
    const ammunitionCounts = await service.getAmmunitionCounts({
      name: 'Build 1',
      id: 'build1',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'onBack'
        }
      ],
      lastExported: undefined,
      lastUpdated: new Date(1)
    })

    // Assert
    expect(ammunitionCounts.success).toBe(false)
    expect(ammunitionCounts.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getErgonomics()', () => {
  it.each([
    [build1, 39],
    [build2, 54],
    [{
      name: 'Build 3',
      id: 'build3',
      inventorySlots: [
        {
          typeId: 'onBack',
          items: [
            {
              content: [],
              itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
              modSlots: [],
              quantity: 1
            }
          ]
        }
      ],
      lastExported: undefined,
      lastUpdated: new Date(1)
    } as IBuild, 44],
    [
      {
        name: 'Empty build',
        id: 'EmptyBuild',
        inventorySlots: [
          {
            typeId: 'onSling',
            items: []
          },
          {
            typeId: 'onBack',
            items: [undefined]
          },
          {
            typeId: 'holster',
            items: [null]
          }
        ]
      } as IBuild, undefined
    ]
  ])(
    'should get the ergonomics of the main ranged weapon of a build',
    async (build: IBuild, expected: number | undefined) => {
      // Arrange
      const service = new BuildPropertiesService()

      // Act
      const ergonomics = await service.getErgonomics(build)

      // Assert
      if (expected === undefined) {
        expect(ergonomics).toBeUndefined()
      } else {
        expect(ergonomics?.success).toBe(true)
        expect(ergonomics?.value).toBe(expected)
      }
    }
  )

  it('should fail if an item cannot be found', async () => {
    // Arrange
    const service = new BuildPropertiesService()

    // Act
    const ergonomics = await service.getErgonomics(
      {
        name: 'Build 1',
        id: 'build1',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                itemId: 'invalid',
                modSlots: [],
                quantity: 1
              }
            ],
            typeId: 'onSling'
          }
        ],
        lastExported: undefined,
        lastUpdated: new Date(1)
      }
    )

    // Assert
    expect(ergonomics?.success).toBe(false)
    expect(ergonomics?.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getErgonomicsPercentageModifier()', () => {
  it.each([
    [build1, -31],
    [build2, 0]
  ])(
    'should get the ergonomics percentage modifier of a build',
    async (build: IBuild, expected: number) => {
      // Arrange
      const service = new BuildPropertiesService()

      // Act
      const ergonomicsPercentageModifier = await service.getErgonomicsPercentageModifier(
        build
      )

      // Assert
      expect(ergonomicsPercentageModifier.success).toBe(true)
      expect(ergonomicsPercentageModifier.value).toBe(expected)
    }
  )

  it('should fail if an item cannot be found', async () => {
    // Arrange
    const service = new BuildPropertiesService()

    // Act
    const ergonomicsPercentageModifier = await service.getErgonomicsPercentageModifier(
      {
        name: 'Build 1',
        id: 'build1',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                itemId: 'invalid',
                modSlots: [],
                quantity: 1
              }
            ],
            typeId: 'bodyArmor'
          }
        ],
        lastExported: undefined,
        lastUpdated: new Date(1)
      }
    )

    // Assert
    expect(ergonomicsPercentageModifier.success).toBe(false)
    expect(ergonomicsPercentageModifier.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getPrice()', () => {
  it.each([
    [
      build1,
      {
        missingPrice: false,
        price: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 844270,
          valueInMainCurrency: 844270
        },
        pricesWithContent: [
          {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 844270,
            valueInMainCurrency: 844270
          }
        ],
        unitPrice: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 0,
          valueInMainCurrency: 0
        }
      } as IInventoryPrice
    ],
    [
      build2,
      {
        missingPrice: false,
        price: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 166750,
          valueInMainCurrency: 166750
        },
        pricesWithContent: [
          {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 166750,
            valueInMainCurrency: 166750
          }
        ],
        unitPrice: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 0,
          valueInMainCurrency: 0
        }
      } as IInventoryPrice]
  ])(
    'should get the price of a build',
    async (build: IBuild, expected: IInventoryPrice) => {
      // Arrange
      const service = new BuildPropertiesService()

      // Act
      const price = await service.getPrice(build)

      // Assert
      expect(price.success).toBe(true)
      expect(price.value).toStrictEqual(expected)
    }
  )

  it('should have a missing price when no merchants sell the item', async () => {
    // Arrange
    const service = new BuildPropertiesService()
    const build: IBuild = {
      id: '',
      inventorySlots: [
        {
          items: [{
            content: [],
            itemId: '56deee15d2720bee328b4567', // MP-153 12ga 4-shell forend cap
            modSlots: [],
            quantity: 1
          }],
          typeId: 'backpack'
        }
      ],
      lastExported: undefined,
      lastUpdated: new Date(1),
      name: ''
    }

    // Act
    const price = await service.getPrice(build)

    // Assert
    expect(price.success).toBe(true)
    expect(price.value).toStrictEqual({
      missingPrice: true,
      price: {
        currencyName: 'RUB',
        merchant: undefined,
        merchantLevel: undefined,
        requiresQuest: false,
        value: 0,
        valueInMainCurrency: 0
      },
      priceWithContentInMainCurrency: {
        currencyName: 'RUB',
        merchant: undefined,
        merchantLevel: undefined,
        requiresQuest: false,
        value: 0,
        valueInMainCurrency: 0
      },
      pricesWithContent: [],
      unitPrice: {
        currencyName: 'RUB',
        merchant: undefined,
        merchantLevel: undefined,
        requiresQuest: false,
        value: 0,
        valueInMainCurrency: 0
      }
    })
  })

  it('should fail if the main currency cannot be found', async () => {
    // Arrange
    const service = new BuildPropertiesService()
    const mainCurrency = Currencies.find(c => c.name === 'RUB') as ICurrency
    mainCurrency.mainCurrency = false

    // Act
    const price = await service.getPrice(build1)

    // Assert
    expect(price.success).toBe(false)
    expect(price.failureMessage).toBe('Main currency not found.')

    // Clean
    mainCurrency.mainCurrency = true
  })

  it('should fail if an item cannot be found', async () => {
    // Arrange
    const service = new BuildPropertiesService()

    // Act
    const price = await service.getPrice({
      name: 'Build 1',
      id: 'build1',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'onBack'
        }
      ],
      lastExported: undefined,
      lastUpdated: new Date(1)
    })

    // Assert
    expect(price.success).toBe(false)
    expect(price.failureMessage).toBe('Item "invalid" not found.')
  })

  it('should fail if an inventory slot is invalid', async () => {
    // Arrange
    const service = new BuildPropertiesService()

    // Act
    const price = await service.getPrice({
      name: 'Build 1',
      id: 'build1',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              itemId: '57dc2fa62459775949412633', // Kalashnikov AKS- 74U 5.45x39
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'invalid'
        }
      ],
      lastExported: undefined,
      lastUpdated: new Date(1)
    })

    // Assert
    expect(price.success).toBe(false)
    expect(price.failureMessage).toBe('Inventory slot type "invalid" not found.')
  })
})

describe('getNotExportedTooltip()', () => {
  it.each([
    [new Date(1), undefined, 'Build not exported. It will be lost if your browser history is cleared.'],
    [new Date(2), new Date(1), 'Changes made on the 01/01/1970 à 01:00:00 have not been exported. They will be lost if your browser history is cleared. Last export on 01/01/1970 à 01:00:00.']
  ])('should get the tooltip for not exported builds', (lastUpdated: Date, lastExported: Date | undefined, expected: string) => {
    // Arrange
    const service = new BuildPropertiesService()

    // Act
    const tooltip = service.getNotExportedTooltip(lastUpdated, lastExported)

    // Assert
    expect(tooltip).toBe(expected)
  })
})

describe('getRecoil()', () => {
  it.each([
    [build1, { horizontalRecoil: 200, verticalRecoil: 71 }],
    [build2, { horizontalRecoil: 249, verticalRecoil: 423 }],
    [
      {
        name: 'Empty build',
        id: 'EmptyBuild',
        inventorySlots: [
          {
            typeId: 'onSling',
            items: []
          },
          {
            typeId: 'onBack',
            items: [undefined]
          },
          {
            typeId: 'holster',
            items: [null]
          }
        ]
      } as IBuild, undefined
    ]
  ])(
    'should get the recoil of the main ranged weapon of a build',
    async (build: IBuild, expected: { horizontalRecoil: number; verticalRecoil: number; } | undefined) => {
      // Arrange
      const service = new BuildPropertiesService()

      // Act
      const recoil = await service.getRecoil(build)

      // Assert
      if (expected === undefined) {
        expect(recoil).toBeUndefined()
      } else {
        expect(recoil?.success).toBe(true)
        expect(recoil?.value).toStrictEqual(expected)
      }
    }
  )

  it('should fail if an item cannot be found', async () => {
    // Arrange
    const service = new BuildPropertiesService()

    // Act
    const recoil = await service.getRecoil(
      {
        name: 'Build 1',
        id: 'build1',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                itemId: 'invalid',
                modSlots: [],
                quantity: 1
              }
            ],
            typeId: 'onSling'
          }
        ],
        lastExported: undefined,
        lastUpdated: new Date(1)
      }
    )

    // Assert
    expect(recoil?.success).toBe(false)
    expect(recoil?.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getSummary()', () => {
  it.each([
    [
      build1,
      {
        ammunitionCounts: [
          {
            caption: '5.45x39mm PPBS gs "Igolnik"',
            count: 156,
            id: '5c0d5e4486f77478390952fe'
          }
        ],
        ergonomics: 27,
        ergonomicsPercentageModifier: -31,
        exported: false,
        horizontalRecoil: 200,
        id: 'build_1',
        name: 'Build 1',
        lastExported: undefined,
        lastUpdated: new Date(1),
        price: {
          missingPrice: false,
          price: {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 0,
            valueInMainCurrency: 0
          },
          priceWithContentInMainCurrency: {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 844270,
            valueInMainCurrency: 844270
          },
          pricesWithContent: [
            {
              currencyName: 'RUB',
              merchant: undefined,
              merchantLevel: undefined,
              requiresQuest: false,
              value: 844270,
              valueInMainCurrency: 844270
            }
          ],
          unitPrice: {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 0,
            valueInMainCurrency: 0
          }
        },
        verticalRecoil: 71,
        weight: 20.288
      } as IBuildSummary
    ],
    [
      build2,
      {
        ammunitionCounts: [
          {
            caption: '9x19mm PBP gzh',
            count: 18,
            id: '5efb0da7a29a85116f6ea05f'
          }
        ],
        ergonomics: 54,
        ergonomicsPercentageModifier: 0,
        exported: false,
        horizontalRecoil: 249,
        id: 'build_2',
        name: 'Build 2',
        lastExported: undefined,
        lastUpdated: new Date(1),
        price: {
          missingPrice: false,
          price: {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 0,
            valueInMainCurrency: 0
          },
          priceWithContentInMainCurrency: {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 166750,
            valueInMainCurrency: 166750
          },
          pricesWithContent: [
            {
              currencyName: 'RUB',
              merchant: undefined,
              merchantLevel: undefined,
              requiresQuest: false,
              value: 166750,
              valueInMainCurrency: 166750
            }
          ],
          unitPrice: {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 0,
            valueInMainCurrency: 0
          }
        },
        verticalRecoil: 423,
        weight: 3.728
      } as IBuildSummary
    ],
    [
      {
        id: 'emptyBuild',
        inventorySlots: [],
        lastExported: new Date(2),
        lastUpdated: new Date(1),
        name: 'Empty build'
      } as IBuild,
      {
        ammunitionCounts: [],
        ergonomics: undefined,
        ergonomicsPercentageModifier: 0,
        exported: true,
        horizontalRecoil: undefined,
        id: 'emptyBuild',
        name: 'Empty build',
        lastExported: new Date(2),
        lastUpdated: new Date(1),
        price: {
          missingPrice: false,
          price: {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 0,
            valueInMainCurrency: 0
          },
          priceWithContentInMainCurrency: {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 0,
            valueInMainCurrency: 0
          },
          pricesWithContent: [],
          unitPrice: {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 0,
            valueInMainCurrency: 0
          }
        },
        verticalRecoil: undefined,
        weight: 0
      } as IBuildSummary
    ]
  ])(
    'should get the summary of a build',
    async (build: IBuild, expected: IBuildSummary) => {
      // Arrange
      const service = new BuildPropertiesService()

      // Act
      const summary = await service.getSummary(build)

      // Assert
      expect(summary?.success).toBe(true)
      expect(summary?.value).toStrictEqual(expected)
    }
  )

  it('should fail if the main currency cannot be found', async () => {
    // Arrange
    const service = new BuildPropertiesService()
    const mainCurrency = Currencies.find(c => c.name === 'RUB') as ICurrency
    mainCurrency.mainCurrency = false

    // Act
    const summary = await service.getSummary(build1)

    // Assert
    expect(summary.success).toBe(false)
    expect(summary.failureMessage).toBe('Main currency not found.')

    // Clean
    mainCurrency.mainCurrency = true
  })
})

describe('getWeight()', () => {
  it.each([
    [build1, 20.288],
    [build2, 3.728]
  ])(
    'should get the weight of a build',
    async (build: IBuild, expected: number) => {
      // Arrange
      const service = new BuildPropertiesService()

      // Act
      const weight = await service.getWeight(build)

      // Assert
      expect(weight.success).toBe(true)
      expect(weight.value).toBe(expected)
    }
  )

  it('should fail if an item cannot be found', async () => {
    // Arrange
    const service = new BuildPropertiesService()

    // Act
    const weight = await service.getWeight({
      name: 'Build 1',
      id: 'build1',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'onBack'
        }
      ],
      lastExported: undefined,
      lastUpdated: new Date(1)
    })

    // Assert
    expect(weight.success).toBe(false)
    expect(weight.failureMessage).toBe('Item "invalid" not found.')
  })
})
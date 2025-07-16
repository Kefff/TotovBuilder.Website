import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { InventorySlotTypeId } from '../../models/build/InventorySlotTypes'
import { ak12PistolGrip, ak12Stock, alpha, ammo545us, ammo9mmGT, armor6b13FlDefault, banshee, bayonet6Kh5, berkut, cqcm, crossbow, iskra, lshZ2dtm, lshZ2dtmFs, m9a3Default, m9a3Fs, m9a3Magazine, m9a3Rs, m9a3SideGrip, m9a3Slide, m9a3Thr, monocletePe, morphine, plate6b33Back, plate6b33Front, razor, rgd5, rpk1615inch, rpk16Default, rpk16Drum, rpk16DustCover, rpk16Handguard, rpk16MuzzleBreak, rpk16Rail, rpk16Rs, rpk16RsBase, rpk16Tube, salewa, srd9, vaseline, water, x400 } from './itemMocks'

export const build1: IBuild = {
  id: 'build_1',
  name: 'Build 1',
  inventorySlots: [
    {
      items: [
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
        }
      ],
      typeId: InventorySlotTypeId.onSling
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.onBack
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.holster
    },
    {
      items: [
        {
          content: [],
          ignorePrice: false,
          itemId: armor6b13FlDefault.id,
          modSlots: [
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: plate6b33Front.id,
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
      ],
      typeId: InventorySlotTypeId.bodyArmor
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.tacticalRig
    },
    {
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
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.earpiece
    },
    {
      items: [
        {
          content: [
            {
              content: [],
              ignorePrice: false,
              itemId: iskra.id,
              modSlots: [],
              quantity: 1
            },
            {
              content: [],
              ignorePrice: false,
              itemId: water.id,
              modSlots: [],
              quantity: 1
            }
          ],
          ignorePrice: false,
          itemId: berkut.id,
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: InventorySlotTypeId.backpack
    },
    {
      items: [
        {
          content: [],
          ignorePrice: false,
          itemId: morphine.id,
          modSlots: [],
          quantity: 1
        },
        {
          content: [],
          ignorePrice: false,
          itemId: vaseline.id,
          modSlots: [],
          quantity: 1
        },
        {
          content: [],
          ignorePrice: false,
          itemId: rgd5.id,
          modSlots: [],
          quantity: 1
        },
        {
          content: [],
          ignorePrice: false,
          itemId: ammo545us.id,
          modSlots: [],
          quantity: 60
        }
      ],
      typeId: InventorySlotTypeId.pockets
    },
    {
      items: [
        {
          content: [],
          ignorePrice: false,
          itemId: crossbow.id,
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: InventorySlotTypeId.eyewear
    },
    {
      items: [
        {
          content: [],
          ignorePrice: false,
          itemId: cqcm.id,
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: InventorySlotTypeId.faceCover
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.pouch
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.scabbard
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.armband
    },
    {
      items: Array<IInventoryItem>(3),
      typeId: InventorySlotTypeId.special
    }
  ],
  lastExported: new Date(2024, 2, 17),
  lastUpdated: new Date(2024, 2, 17),
  lastWebsiteVersion: '1.1.0'
}

export const build2: IBuild = {
  id: 'build_2',
  name: 'Build 2',
  inventorySlots: [
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.onSling
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.onBack
    },
    {
      items: [
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
        }
      ],
      typeId: InventorySlotTypeId.holster
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.bodyArmor
    },
    {
      items: [
        {
          content: [
            {
              content: [],
              ignorePrice: false,
              itemId: salewa.id,
              modSlots: [],
              quantity: 1
            },
            {
              content: [],
              ignorePrice: false,
              itemId: ammo9mmGT.id,
              modSlots: [],
              quantity: 35
            }
          ],
          ignorePrice: false,
          itemId: banshee.id,
          modSlots: [
            {
              modSlotName: 'front_plate',
              item: {
                content: [],
                ignorePrice: false,
                itemId: monocletePe.id,
                modSlots: [],
                quantity: 1
              }
            },
            {
              modSlotName: 'back_plate',
              item: {
                content: [],
                ignorePrice: false,
                itemId: monocletePe.id,
                modSlots: [],
                quantity: 1
              }
            }
          ],
          quantity: 1
        }
      ],
      typeId: InventorySlotTypeId.tacticalRig
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.headwear
    },
    {
      items: [
        {
          content: [],
          ignorePrice: false,
          itemId: razor.id,
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: InventorySlotTypeId.earpiece
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.backpack
    },
    {
      items: Array<IInventoryItem>(4),
      typeId: InventorySlotTypeId.pockets
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.eyewear
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.faceCover
    },
    {
      items: [
        {
          content: [
            {
              content: [],
              ignorePrice: false,
              itemId: ammo9mmGT.id,
              modSlots: [],
              quantity: 15
            }
          ],
          ignorePrice: false,
          itemId: alpha.id,
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: InventorySlotTypeId.pouch
    },
    {
      items: [
        {
          content: [],
          ignorePrice: false,
          itemId: bayonet6Kh5.id,
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: InventorySlotTypeId.scabbard
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.armband
    },
    {
      items: Array<IInventoryItem>(3),
      typeId: InventorySlotTypeId.special
    }
  ],
  lastExported: undefined,
  lastUpdated: undefined,
  lastWebsiteVersion: undefined
}

export const reducedBuild1: Record<string, unknown> = {
  'n': 'Build 1',
  's': [
    {
      'i': [
        {
          'i': rpk16Default.id,
          'm': [
            {
              'i': {
                'i': ak12PistolGrip.id
              },
              'n': 'mod_pistol_grip'
            },
            {
              'i': {
                'i': rpk16DustCover.id,
                'm': [
                  {
                    'i': {
                      'i': rpk16RsBase.id,
                      'm': [
                        {
                          'i': {
                            'i': rpk16Rs.id
                          },
                          'n': 'mod_sight_rear'
                        }
                      ]
                    },
                    'n': 'mod_sight_rear'
                  }
                ]
              },
              'n': 'mod_reciever'
            },
            {
              'i': {
                'c': [
                  {
                    'i': ammo545us.id,
                    'q': 95
                  }
                ],
                'i': rpk16Drum.id
              },
              'n': 'mod_magazine'
            },
            {
              'i': {
                'i': rpk16Tube.id,
                'm': [
                  {
                    'i': {
                      'i': ak12Stock.id
                    },
                    'n': 'mod_stock'
                  }
                ]
              },
              'n': 'mod_stock_001'
            },
            {
              'i': {
                'i': rpk16Handguard.id,
                'm': [
                  {
                    'i': {
                      'i': rpk16Rail.id
                    },
                    'n': 'mod_mount_000'
                  },
                  {
                    'i': {
                      'i': rpk16Rail.id
                    },
                    'n': 'mod_mount_001'
                  }
                ]
              },
              'n': 'mod_handguard'
            },
            {
              'i': {
                'i': rpk1615inch.id,
                'm': [
                  {
                    'i': {
                      'i': rpk16MuzzleBreak.id
                    },
                    'n': 'mod_muzzle'
                  }
                ]
              },
              'n': 'mod_barrel'
            }
          ]
        }
      ],
      't': 'onSling'
    },
    {
      'i': [
        {
          'i': armor6b13FlDefault.id,
          'm': [
            {
              'i': {
                'i': plate6b33Front.id
              },
              'n': 'front_plate'
            },
            {
              'i': {
                'i': plate6b33Back.id
              },
              'n': 'back_plate'
            }
          ]
        }
      ],
      't': 'bodyArmor'
    },
    {
      'i': [
        {
          'i': lshZ2dtm.id,
          'm': [
            {
              'i': {
                'i': lshZ2dtmFs.id
              },
              'n': 'mod_equipment'
            }
          ]
        }
      ],
      't': 'headwear'
    },
    {
      'i': [
        {
          'c': [
            {
              'i': iskra.id
            },
            {
              'i': water.id
            }
          ],
          'i': berkut.id
        }
      ],
      't': 'backpack'
    },
    {
      'i': [
        {
          'i': morphine.id
        },
        {
          'i': vaseline.id
        },
        {
          'i': rgd5.id
        },
        {
          'i': ammo545us.id,
          'q': 60
        }
      ],
      't': 'pockets'
    },
    {
      'i': [
        {
          'i': crossbow.id
        }
      ],
      't': 'eyewear'
    },
    {
      'i': [
        {
          'i': cqcm.id
        }
      ],
      't': 'faceCover'
    }
  ]
}

export const reducedBuild2: Record<string, unknown> = {
  'n': 'Build 2',
  's': [
    {
      'i': [
        {
          'i': m9a3Default.id,
          'm': [
            {
              'i': {
                'i': m9a3Thr.id,
                'm': [
                  {
                    'i': {
                      'i': srd9.id
                    },
                    'n': 'mod_muzzle'
                  }
                ]
              },
              'n': 'mod_barrel'
            },
            {
              'i': {
                'i': m9a3SideGrip.id
              },
              'n': 'mod_pistol_grip'
            },
            {
              'i': {
                'i': m9a3Slide.id,
                'm': [
                  {
                    'i': {
                      'i': m9a3Rs.id
                    },
                    'n': 'mod_sight_rear'
                  },
                  {
                    'i': {
                      'i': m9a3Fs.id
                    },
                    'n': 'mod_sight_front'
                  }
                ]
              },
              'n': 'mod_reciever'
            },
            {
              'i': {
                'c': [
                  {
                    'i': ammo9mmGT.id,
                    'q': 17
                  }
                ],
                'i': m9a3Magazine.id
              },
              'n': 'mod_magazine'
            },
            {
              'i': {
                'i': x400.id
              },
              'n': 'mod_tactical'
            }
          ]
        }
      ],
      't': 'holster'
    },
    {
      'i': [
        {
          'c': [
            {
              'i': salewa.id
            },
            {
              'i': ammo9mmGT.id,
              'q': 35
            }
          ],
          'i': banshee.id,
          'm': [
            {
              'i': {
                'i': monocletePe.id
              },
              'n': 'front_plate'
            },
            {
              'i': {
                'i': monocletePe.id
              },
              'n': 'back_plate'
            }
          ]
        }
      ],
      't': 'tacticalRig'
    },
    {
      'i': [
        {
          'i': razor.id
        }
      ],
      't': 'earpiece'
    },
    {
      'i': [
        {
          'c': [
            {
              'i': ammo9mmGT.id,
              'q': 15
            }
          ],
          'i': alpha.id
        }
      ],
      't': 'pouch'
    },
    {
      'i': [
        {
          'i': bayonet6Kh5.id
        }
      ],
      't': 'scabbard'
    }
  ]
}
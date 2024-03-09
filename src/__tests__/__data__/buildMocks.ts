import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { ak12PistolGrip, ak12Stock, alpha, ammo545bp, ammo9mmGT, armor6b13FlDefault, bayonet6Kh5, berkut, cf, crossbow, iskra, lshZ2dtm, lshZ2dtmFs, m9a3Default, m9a3Fs, m9a3Magazine, m9a3Rs, m9a3SideGrip, m9a3Slide, m9a3Thr, morphine, razor, rgd5, rpk1615inch, rpk16Default, rpk16Drum, rpk16DustCover, rpk16Handguard, rpk16MuzzleBreak, rpk16Rail, rpk16Rs, rpk16RsBase, rpk16Tube, salewa, scavVest, srd9, vaseline, water, x400 } from './itemMocks'

export const build1: IBuild = {
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
      typeId: 'backpack'
    },
    {
      items: [
        {
          content: [],
          ignorePrice: false,
          itemId: armor6b13FlDefault.id,
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
          ignorePrice: false,
          itemId: crossbow.id,
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
          ignorePrice: false,
          itemId: cf.id,
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
          itemId: ammo545bp.id,
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
                    itemId: ammo545bp.id,
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
      typeId: 'onSling'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'tacticalRig'
    }
  ],
  lastExported: undefined,
  lastUpdated: undefined,
  lastWebsiteVersion: undefined
}

export const build2: IBuild = {
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
          ignorePrice: false,
          itemId: razor.id,
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
          ignorePrice: false,
          itemId: alpha.id,
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
          ignorePrice: false,
          itemId: bayonet6Kh5.id,
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
              ignorePrice: false,
              itemId: salewa.id,
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
      typeId: 'tacticalRig'
    }
  ],
  lastExported: undefined,
  lastUpdated: undefined,
  lastWebsiteVersion: undefined
}
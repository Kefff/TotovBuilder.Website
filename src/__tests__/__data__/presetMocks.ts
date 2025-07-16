import { IInventoryItem } from '../../models/build/IInventoryItem'
import { ak12PistolGrip, ak12Stock, armor6b13FlDefault, bansheeDefault, m9a3Default, m9a3Fs, m9a3Magazine, m9a3Prot, m9a3Rs, m9a3SideGrip, m9a3Slide, m9a3Thr, monocletePe, mts25512755mmRib, mts25512Default, mts25512beech, mts25512choke, mts25512cyl, mts25512wood, plate6b33Back, plate6b33Front, rpk1615inch, rpk16Default, rpk16DustCover, rpk16Handguard, rpk16MuzzleBreak, rpk16Rail, rpk16Rs, rpk16RsBase, rpk16Tube } from './itemMocks'

export const armor6b13FlDefaultPreset: IInventoryItem = {
  content: [],
  itemId: armor6b13FlDefault.id,
  ignorePrice: false,
  modSlots: [
    {
      item: {
        content: [],
        itemId: plate6b33Front.id,
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

export const bansheeDefaultPreset: IInventoryItem = {
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
}

export const m9a3DefaultPreset: IInventoryItem = {
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
              itemId: m9a3Prot.id,
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
        content: [],
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

export const mts25512DefaultPreset: IInventoryItem = {
  content: [],
  ignorePrice: false,
  itemId: mts25512Default.id,
  modSlots: [
    {
      item: {
        content: [],
        itemId: mts25512cyl.id,
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
        itemId: mts25512755mmRib.id,
        modSlots: [
          {
            item: {
              content: [],
              itemId: mts25512choke.id,
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
        itemId: mts25512wood.id,
        ignorePrice: false,
        modSlots: [],
        quantity: 1
      },
      modSlotName: 'mod_stock'
    },
    {
      item: {
        content: [],
        itemId: mts25512beech.id,
        ignorePrice: false,
        modSlots: [],
        quantity: 1
      },
      modSlotName: 'mod_handguard'
    }
  ],
  quantity: 1
}

export const rpk16DefaultPreset: IInventoryItem = {
  content: [],
  itemId: rpk16Default.id,
  ignorePrice: false,
  modSlots: [
    {
      item: {
        content: [],
        itemId: ak12PistolGrip.id,
        ignorePrice: false,
        modSlots: [],
        quantity: 1
      },
      modSlotName: 'mod_pistol_grip'
    },
    {
      item: {
        content: [],
        itemId: rpk16DustCover.id,
        ignorePrice: false,
        modSlots: [
          {
            item: {
              content: [],
              itemId: rpk16RsBase.id,
              ignorePrice: false,
              modSlots: [
                {
                  item: {
                    content: [],
                    itemId: rpk16Rs.id,
                    ignorePrice: false,
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
    },
    {
      item: {
        content: [],
        itemId: rpk16Handguard.id,
        ignorePrice: false,
        modSlots: [
          {
            item: {
              content: [],
              itemId: rpk16Rail.id,
              ignorePrice: false,
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_mount_000'
          },
          {
            item: {
              content: [],
              itemId: rpk16Rail.id,
              ignorePrice: false,
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
          }
        ],
        quantity: 1
      },
      modSlotName: 'mod_barrel'
    }
  ],
  quantity: 1
}



export const PresetMocks: IInventoryItem[] = [
  armor6b13FlDefaultPreset,
  bansheeDefaultPreset,
  m9a3DefaultPreset,
  mts25512DefaultPreset,
  rpk16DefaultPreset
]
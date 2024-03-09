import { IInventoryItem } from '../../models/build/IInventoryItem'

export const armor6b13FlDefaultPreset: IInventoryItem = {
  content: [],
  itemId: '65765f39526e320fbe0357b1',
  ignorePrice: false,
  modSlots: [
    {
      item: {
        content: [],
        itemId: '656f603f94b480b8a500c0d6',
        ignorePrice: false,
        modSlots: [],
        quantity: 1
      },
      modSlotName: 'front_plate'
    },
    {
      item: {
        content: [],
        itemId: '656efd66034e8e01c407f35c',
        ignorePrice: false,
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
  itemId: '5d3f0bc986f7743cb332abdc',
  ignorePrice: false,
  modSlots: [
    {
      item: {

        content: [],
        itemId: '5cadc1c6ae9215000f2775a4',
        ignorePrice: false,
        modSlots: [
          {
            item: {

              content: [],
              itemId: '5cadc390ae921500126a77f1',
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
        itemId: '5cadc431ae921500113bb8d5',
        ignorePrice: false,
        modSlots: [],
        quantity: 1
      },
      modSlotName: 'mod_pistol_grip'
    },
    {
      item: {

        content: [],
        itemId: '5cadc55cae921500103bb3be',
        ignorePrice: false,
        modSlots: [
          {
            item: {

              content: [],
              itemId: '5cadd940ae9215051e1c2316',
              ignorePrice: false,
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_sight_rear'
          },
          {
            item: {

              content: [],
              itemId: '5cadd919ae921500126a77f3',
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
        itemId: '5cadc2e0ae9215051e1c21e7',
        ignorePrice: false,
        modSlots: [],
        quantity: 1
      },
      modSlotName: 'mod_magazine'
    }
  ],
  quantity: 1
}

export const rpk16DefaultPreset: IInventoryItem = {
  content: [],
  itemId: '5c0d1ec986f77439512a1a72',
  ignorePrice: false,
  modSlots: [
    {
      item: {

        content: [],
        itemId: '5beec8ea0db834001a6f9dbf',
        ignorePrice: false,
        modSlots: [],
        quantity: 1
      },
      modSlotName: 'mod_pistol_grip'
    },
    {
      item: {

        content: [],
        itemId: '5beec91a0db834001961942d',
        ignorePrice: false,
        modSlots: [
          {
            item: {
              content: [],
              itemId: '5beec9450db83400970084fd',
              ignorePrice: false,
              modSlots: [
                {
                  item: {
                    content: [],
                    itemId: '5bf3f59f0db834001a6fa060',
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
        itemId: '5beec8b20db834001961942a',
        ignorePrice: false,
        modSlots: [
          {
            item: {
              content: [],
              itemId: '5beec8c20db834001d2c465c',
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
        itemId: '5beec3e30db8340019619424',
        ignorePrice: false,
        modSlots: [
          {
            item: {
              content: [],
              itemId: '5beecbb80db834001d2c465e',
              ignorePrice: false,
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_mount_000'
          },
          {
            item: {
              content: [],
              itemId: '5beecbb80db834001d2c465e',
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
        itemId: '5beec1bd0db834001e6006f3',
        ignorePrice: false,
        modSlots: [
          {
            item: {
              content: [],
              itemId: '5beec3420db834001b095429',
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
  m9a3DefaultPreset,
  rpk16DefaultPreset
]
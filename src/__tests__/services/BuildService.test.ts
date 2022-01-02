import { IBuild } from '../../models/build/IBuild'
import { BuildService } from '../../services/BuildService'
import Configuration from '../../../test-data/configuration.json'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { anything, spy, when } from 'ts-mockito'
import Result, { FailureType } from '../../utils/Result'

const builds: IBuild[] = [
  {
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
          undefined,
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
                modSlotName: 'mod_sight_rear'
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
    lastExported: new Date(1),
    lastUpdated: new Date(1)
  },
  {
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
]

const newBuild: IBuild = {
  id: 'build_3',
  name: 'Kaptain Kolpak',
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
      items: Array<IInventoryItem>(1),
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
      items: [
        {
          content: [],
          itemId: '59e7711e86f7746cae05fbe1', // Kolpak-1S riot helmet
          modSlots: [
            {
              item: {
                content: [],
                itemId: '5ac4c50d5acfc40019262e87', // K1S Visor
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
      items: Array<IInventoryItem>(4),
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
      items: Array<IInventoryItem>(1),
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

beforeEach(() => {
  for (const build of builds) {
    localStorage.setItem(
      Configuration.VITE_BUILD_KEY_PREFIX as string + build.id,
      JSON.stringify(build)
    )
  }

  localStorage.setItem('lang', 'en')
})

afterEach(() => {
  localStorage.clear()
})

describe('add()', () => {
  it('should add a build', () => {
    // Arrange
    const service = new BuildService()

    // Act
    const id = service.add(newBuild)
    const result = service.get(id)

    // Assert
    expect(id).toBeDefined()
    expect(id).not.toBe('')
    expect(result.success).toBe(true)
    expect(result.value.id).toBe(id)
    expect(result.value.name).toBe(newBuild.name)
    expect(JSON.stringify(result.value.inventorySlots)).toBe(
      JSON.stringify(newBuild.inventorySlots)
    ) // stringify() used because undefined is serialized to null and then deserialized to null so equality comparison doesn't work
    expect(service.getAll().length).toBe(3)
  })
})

describe('create()', () => {
  it('should create a new build', () => {
    // Arrange
    const service = new BuildService()

    // Act
    const build = service.create()

    // Assert
    expect(build.id).toBe('')
    expect(build.name).toBe('')
    expect(build.inventorySlots).toStrictEqual([
      {
        items: [undefined],
        typeId: 'onSling'
      },
      {
        items: [undefined],
        typeId: 'onBack'
      },
      {
        items: [undefined],
        typeId: 'holster'
      },
      {
        items: [undefined],
        typeId: 'bodyArmor'
      },
      {
        items: [undefined],
        typeId: 'tacticalRig'
      },
      {
        items: [undefined],
        typeId: 'headwear'
      },
      {
        items: [undefined],
        typeId: 'earpiece'
      },
      {
        items: [undefined, undefined, undefined, undefined],
        typeId: 'pockets'
      },
      {
        items: [undefined],
        typeId: 'backpack'
      },
      {
        items: [
          {
            content: [],
            itemId: '544a11ac4bdc2d470e8b456a',
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
            itemId: '54491bb74bdc2d09088b4567',
            modSlots: [],
            quantity: 1
          }
        ],
        typeId: 'scabbard'
      },
      {
        items: [undefined],
        typeId: 'faceCover'
      },
      {
        items: [undefined],
        typeId: 'eyewear'
      },
      {
        items: [undefined],
        typeId: 'armband'
      },
      {
        items: [
          {
            content: [],
            itemId: '5f4f9eb969cdc30ff33f09db',
            modSlots: [],
            quantity: 1
          }
        ],
        typeId: 'compass'
      }
    ])
  })
})

describe('delete()', () => {
  it('should delete a build', () => {
    // Arrange
    const service = new BuildService()

    // Act
    service.delete(builds[1].id)
    const result = service.get(builds[1].id)

    // Assert
    expect(service.getAll().length).toBe(1)
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe(
      'Build "build_2" not found. It may have been deleted.'
    )
  })
})

describe('fromSharableString()', () => {
  it('should get a build from a sharable string', async () => {
    // Arrange
    const service = new BuildService()
    const sharableString = 'XQAAAAIEAQAAAAAAAABAqEppJBKy3f2nWA1_4C5z8-v7-QmsFsh3-Xw5A4r6cKv_m0sfj0O9x9XIb5ScojjRsy4huWDxzBSG1zyaOOej9yI6eVsg6yXMNsehKkbkF4IxN4W52Wr0SPOgjzuUFCVV1O-07KKY5H2MxwF8NvWFSy9VOl89axpWIZlA4rMaW8zwrHUAdC7epHLneT1sKyazlWteJ--ZEOyd3csaogRVGPNtylBhm8wqX_KVr5aLtkpJU-9ba2mmXnpWUf_-OHdA'

    // Act
    const buildResult = await service.fromSharableString(sharableString)

    // Assert
    expect(buildResult.success).toBe(true)
    expect(buildResult.value).toMatchObject({
      'id': '',
      'inventorySlots': [
        {
          'items': [
            {
              'content': [],
              'itemId': '574d967124597745970e7c94',
              'modSlots': [
                {
                  'item': {
                    'content': [],
                    'itemId': '574dad8024597745964bf05c',
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_stock'
                },
                {
                  'item': {
                    'content': [],
                    'itemId': '574db213245977459a2f3f5d',
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_sight_rear'
                },
                {
                  'item': {
                    'content': [],
                    'itemId': '587df3a12459772c28142567',
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_magazine'
                }
              ],
              'quantity': 1
            }
          ],
          'typeId': 'onSling'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'onBack'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'holster'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'bodyArmor'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'tacticalRig'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'headwear'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'earpiece'
        },
        {
          'items': [
            undefined,
            undefined,
            undefined,
            undefined
          ],
          'typeId': 'pockets'
        },
        {
          'items': [
            {
              'content': [
                {
                  'content': [],
                  'itemId': '5448fee04bdc2dbc018b4567',
                  'modSlots': [],
                  'quantity': 1
                }
              ],
              'itemId': '5c0e805e86f774683f3dd637',
              'modSlots': [],
              'quantity': 1
            }
          ],
          'typeId': 'backpack'
        },
        {
          'items': [
            {
              'content': [],
              'itemId': '544a11ac4bdc2d470e8b456a',
              'modSlots': [],
              'quantity': 1
            }
          ],
          'typeId': 'pouch'
        },
        {
          'items': [
            {
              'content': [],
              'itemId': '54491bb74bdc2d09088b4567',
              'modSlots': [],
              'quantity': 1
            }
          ],
          'typeId': 'scabbard'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'faceCover'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'eyewear'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'armband'
        },
        {
          'items': [
            {
              'content': [],
              'itemId': '5f4f9eb969cdc30ff33f09db',
              'modSlots': [],
              'quantity': 1
            }
          ],
          'typeId': 'compass'
        }
      ],
      'lastExported': undefined,
      'name': ''
    })
  })

  it('should fail when the sharable string is corrupted', async () => {
    // Arrange
    const service = new BuildService()
    const sharableString = 'corrupted'

    // Act
    const buildResult = await service.fromSharableString(sharableString)

    // Assert
    expect(buildResult.success).toBe(false)
    expect(buildResult.failureMessage).toBe('Cannot read the shared link. It seems to be corrupted.')
  })

  it('should fail when the parsing of the reduced build fails', async () => {
    // Arrange
    const service = new BuildService()
    const sharableString = 'XQAAAAIEAQAAAAAAAABAqEppJBKy3f2nWA1_4C5z8-v7-QmsFsh3-Xw5A4r6cKv_m0sfj0O9x9XIb5ScojjRsy4huWDxzBSG1zyaOOej9yI6eVsg6yXMNsehKkbkF4IxN4W52Wr0SPOgjzuUFCVV1O-07KKY5H2MxwF8NvWFSy9VOl89axpWIZlA4rMaW8zwrHUAdC7epHLneT1sKyazlWteJ--ZEOyd3csaogRVGPNtylBhm8wqX_KVr5aLtkpJU-9ba2mmXnpWUf_-OHdA'
    const serviceSpy = spy(service)
    when(serviceSpy.parseReducedBuild(anything())).thenReturn(Result.fail(FailureType.error, '', 'Error'))

    // Act
    const buildResult = await service.fromSharableString(sharableString)

    // Assert
    expect(buildResult.success).toBe(false)
    expect(buildResult.failureMessage).toBe('Cannot read the shared link. It seems to be corrupted.')
  })
})

describe('get()', () => {
  it('should get a build', () => {
    // Arrange
    const service = new BuildService()

    // Act
    const result = service.get(builds[1].id)

    // Assert
    expect(result.success).toBe(true)
    expect(JSON.stringify(result.value)).toBe(JSON.stringify(builds[1])) // stringify() used because undefined is serialized to null and then deserialized to null so equality comparison doesn't work
  })

  it('should fail if the build does not exist', () => {
    // Arrange
    const service = new BuildService()

    // Act
    const result = service.get('invalid')

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe(
      'Build "invalid" not found. It may have been deleted.'
    )
  })
})

describe('getAll()', () => {
  it('should get all builds', () => {
    // Arrange
    const service = new BuildService()

    // Act
    const builds = service.getAll()

    // Assert
    expect(JSON.stringify(builds)).toBe(JSON.stringify(builds)) // stringify() used because undefined is serialized to null and then deserialized to null so equality comparison doesn't work
  })
})

describe('parseReducedBuild()', () => {
  it('should parse a reduced build', () => {
    // Arrange
    const service = new BuildService()
    const reducedBuild = {
      's': [
        {
          't': 'onSling',
          'i': [
            {
              'i': '574d967124597745970e7c94', // Simonov SKS 7.62x39 semi-automatic carbine
              'm': [
                {
                  'n': 'mod_stock',
                  'i': {
                    'i': '574dad8024597745964bf05c' // SKS TOZ wooden stock (56-A-231 Sb.5)
                  }
                },
                {
                  'n': 'mod_sight_rear',
                  'i': {
                    'i': '574db213245977459a2f3f5d' // SKS rear sight
                  }
                },
                {
                  'n': 'mod_magazine',
                  'i': {
                    'c': [
                      {
                        'i': '5656d7c34bdc2d9d198b4587', // 7.62x39mm PS gzh
                        'q': 10
                      }
                    ],
                    'i': '587df3a12459772c28142567' // SKS 7.62x39 10-round internal box magazine
                  }
                },
                {
                  'n': 'mod_muzzle'
                }
              ]
            }
          ]
        },
        {
          't': 'backpack',
          'i': [
            {
              'i': '5c0e805e86f774683f3dd637', // 3V G Paratus 3-Day Operator's Tactical backpack
              'c': [
                {
                  'i': '5448fee04bdc2dbc018b4567' // 0.6 liter water bottle
                }
              ]
            }
          ]
        }
      ]
    }

    // Act
    const buildResult = service.parseReducedBuild(reducedBuild)

    // Assert
    expect(buildResult.success).toBe(true)
    expect(buildResult.value).toMatchObject({
      'id': '',
      'inventorySlots': [
        {
          'items': [
            {
              'content': [],
              'itemId': '574d967124597745970e7c94',
              'modSlots': [
                {
                  'item': {
                    'content': [],
                    'itemId': '574dad8024597745964bf05c',
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_stock'
                },
                {
                  'item': {
                    'content': [],
                    'itemId': '574db213245977459a2f3f5d',
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_sight_rear'
                },
                {
                  'item': {
                    'content': [
                      {
                        'content': [],
                        'itemId': '5656d7c34bdc2d9d198b4587',
                        'modSlots': [],
                        'quantity': 10
                      }
                    ],
                    'itemId': '587df3a12459772c28142567',
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_magazine'
                },
                {
                  'item': undefined,
                  'modSlotName': 'mod_muzzle'
                }
              ],
              'quantity': 1
            }
          ],
          'typeId': 'onSling'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'onBack'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'holster'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'bodyArmor'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'tacticalRig'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'headwear'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'earpiece'
        },
        {
          'items': [
            undefined,
            undefined,
            undefined,
            undefined
          ],
          'typeId': 'pockets'
        },
        {
          'items': [
            {
              'content': [
                {
                  'content': [],
                  'itemId': '5448fee04bdc2dbc018b4567',
                  'modSlots': [],
                  'quantity': 1
                }
              ],
              'itemId': '5c0e805e86f774683f3dd637',
              'modSlots': [],
              'quantity': 1
            }
          ],
          'typeId': 'backpack'
        },
        {
          'items': [
            {
              'content': [],
              'itemId': '544a11ac4bdc2d470e8b456a',
              'modSlots': [],
              'quantity': 1
            }
          ],
          'typeId': 'pouch'
        },
        {
          'items': [
            {
              'content': [],
              'itemId': '54491bb74bdc2d09088b4567',
              'modSlots': [],
              'quantity': 1
            }
          ],
          'typeId': 'scabbard'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'faceCover'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'eyewear'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'armband'
        },
        {
          'items': [
            {
              'content': [],
              'itemId': '5f4f9eb969cdc30ff33f09db',
              'modSlots': [],
              'quantity': 1
            }
          ],
          'typeId': 'compass'
        }
      ],
      'lastExported': undefined,
      'name': ''
    })
  })

  it.each([
    [
      {
        's': []
      },
      'Cannot parse reduced build because it has no inventory slots.'
    ],
    [
      {
        's': [
          {
            't': 'invalid',
            'i': [
              {
                'i': '5c0e805e86f774683f3dd637' // 3V G Paratus 3-Day Operator's Tactical backpack
              }
            ]
          }
        ]
      },
      'Cannot find inventory slot type "invalid".'
    ],
    [
      {
        's': [
          {
            't': 'backpack',
            'i': []
          }
        ]
      },
      'Cannot parse inventory slot without items.'
    ],
    [
      {
        's': [
          {
            'i': [
              {
                'i': '5c0e805e86f774683f3dd637' // 3V G Paratus 3-Day Operator's Tactical backpack
              }
            ]
          }
        ]
      },
      'Cannot parse inventory slot without type ID.'
    ],
    [
      {
        's': [
          {
            't': 'backpack',
            'i': [
              {
                'q': 2
              }
            ]
          }
        ]
      },
      'Cannot parse inventory item without item ID.'
    ],
    [
      {
        's': [
          {
            't': 'backpack',
            'i': [
              {
                'c': [
                  {
                    'q': 2
                  }
                ],
                'i': '5c0e805e86f774683f3dd637' // 3V G Paratus 3-Day Operator's Tactical backpack
              }
            ]
          }
        ]
      },
      'Cannot parse inventory item without item ID.'
    ],
    [
      {
        's': [
          {
            't': 'onSling',
            'i': [
              {
                'i': '574d967124597745970e7c94', // Simonov SKS 7.62x39 semi-automatic carbine
                'm': [
                  {
                    'i': {
                      'i': '574dad8024597745964bf05c' // SKS TOZ wooden stock (56-A-231 Sb.5)
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      'Cannot parse inventory mod slot without mod slot name.'
    ],
    [
      {
        's': [
          {
            't': 'onSling',
            'i': [
              {
                'i': '574d967124597745970e7c94', // Simonov SKS 7.62x39 semi-automatic carbine
                'm': [
                  {
                    'n': 'mod_stock',
                    'i': {
                      'q': 2
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      'Cannot parse inventory item without item ID.'
    ]
  ])('should fail when the parsing of an inventory slot fails', (reducedBuild: Record<string, unknown>, expected: string) => {
    // Arrange
    const service = new BuildService()

    // Act
    const buildResult = service.parseReducedBuild(reducedBuild)

    // Assert
    expect(buildResult.success).toBe(false)
    expect(buildResult.failureMessage).toBe(expected)
  })
})

describe('reduceBuildForSharing()', () => {
  it('should reduce a build', () => {
    // Arrange
    const service = new BuildService()

    // Act
    const reducedBuildResult = service.reduceBuildForSharing(builds[0])

    // Assert
    expect(reducedBuildResult.success).toBe(true)
    expect(reducedBuildResult.value).toStrictEqual({
      's': [
        {
          'i': [
            {
              'c': [
                {
                  'i': '590c5d4b86f774784e1b9c45'
                },
                {
                  'i': '5448fee04bdc2dbc018b4567'
                }
              ],
              'i': '5ca20d5986f774331e7c9602'
            }
          ],
          't': 'backpack'
        },
        {
          'i': [
            {
              'i': '5c0e541586f7747fa54205c9'
            }
          ],
          't': 'bodyArmor'
        },
        {
          'i': [
            {
              'i': '5d5fca1ea4b93635fd598c07'
            }
          ],
          't': 'eyewear'
        },
        {
          'i': [
            {
              'i': '5ab8f39486f7745cd93a1cca'
            }
          ],
          't': 'faceCover'
        },
        {
          'i': [
            {
              'i': '5c0e874186f7745dc7616606',
              'm': [
                {
                  'i': {
                    'i': '5c0e842486f77443a74d2976'
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
              'i': '544fb3f34bdc2d03748b456a'
            },
            {
              'i': '5755383e24597772cb798966'
            },
            {
              'i': '5448be9a4bdc2dfd2f8b456a'
            }
          ],
          't': 'pockets'
        },
        {
          'i': [
            {
              'c': [
                {
                  'i': '5c0d5e4486f77478390952fe'
                }
              ],
              'i': '5beed0f50db834001c062b12',
              'm': [
                {
                  'i': {
                    'i': '5beec8ea0db834001a6f9dbf'
                  },
                  'n': 'mod_pistol_grip'
                },
                {
                  'i': {
                    'i': '5beec91a0db834001961942d',
                    'm': [
                      {
                        'i': {
                          'i': '5beec9450db83400970084fd',
                          'm': [
                            {
                              'i': {
                                'i': '5bf3f59f0db834001a6fa060'
                              },
                              'n': 'mod_sight_rear'
                            }
                          ]
                        },
                        'n': 'mod_sight_rear'
                      }
                    ]
                  },
                  'n': 'mod_sight_rear'
                },
                {
                  'i': {
                    'c': [
                      {
                        'i': '5c0d5e4486f77478390952fe',
                        'q': 95
                      }
                    ],
                    'i': '5bed625c0db834001c062946'
                  },
                  'n': 'mod_magazine'
                },
                {
                  'i': {
                    'i': '5beec8b20db834001961942a',
                    'm': [
                      {
                        'i': {
                          'i': '5beec8c20db834001d2c465c'
                        },
                        'n': 'mod_stock'
                      }
                    ]
                  },
                  'n': 'mod_stock_001'
                },
                {
                  'i': {
                    'i': '5beec3e30db8340019619424',
                    'm': [
                      {
                        'i': {
                          'i': '5beecbb80db834001d2c465e'
                        },
                        'n': 'mod_mount_000'
                      },
                      {
                        'i': {
                          'i': '5beecbb80db834001d2c465e'
                        },
                        'n': 'mod_mount_001'
                      }
                    ]
                  },
                  'n': 'mod_handguard'
                },
                {
                  'i': {
                    'i': '5beec1bd0db834001e6006f3',
                    'm': [
                      {
                        'i': {
                          'i': '5beec3420db834001b095429'
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
        }
      ]
    })
  })

  it('should fail when the build is empty', () => {
    // Arrange
    const service = new BuildService()
    const build: IBuild = {
      id: '123',
      inventorySlots: [
        {
          items: [],
          typeId: 'backpack'
        }
      ],
      lastExported: undefined,
      lastUpdated: new Date(),
      name: 'test'
    }

    // Act
    const reducedBuildResult = service.reduceBuildForSharing(build)

    // Assert
    expect(reducedBuildResult.success).toBe(false)
    expect(reducedBuildResult.failureMessage).toBe('Cannot share build "test" because it is empty.')
  })
})

describe('toSharableURL()', () => {
  it('should reduce a build and transform it into a URL', async () => {
    // Arrange
    const service = new BuildService()

    // Act
    const sharableStringResult = await service.toSharableURL(builds[0])

    // Assert
    expect(sharableStringResult.success).toBe(true)
    expect(sharableStringResult.value).toBe('localhost:3000/s/XQAAAAJWBAAAAAAAAABAqEppdBKy3f9hYmtZKBw8Joeli8FtL5waAEplna0rFgADy4_8ImRJxYWmyKvWKrcuqwBMuD6JgBRc_OQ7V68-e1w_a2jQYTHoQxTNQa0pXq4o6OrQgz-ptjW_JcXZj1ooUSZQxN41WKXr4VXBq3XiV2mnRXGNsld0AjZD-6T5thrMAohGxgkgPIZ8O_rqmk0RAbLm_U_DXzcQRL4KVrb0Wr1nRfrSdCymZUY4Rkn-uzoqICwPIUUWqArjFNHYVswpQP1JMDL87Rb95HVgIEEaFNh74N1YUyX5OyYG2AjYEFAD4ErBeUhY4ZDOugnMbozp5D5LGk1hlx0dihWMLO9hqJmF53BGX3ydwzJEoKSKNORMRcGMzL_QCmS6eKFXvbCe1cOGBfZyc9h7gZRBNhNqRWtoqSUjt4Z8lkKKtidw5QDAUxoUoGVSZnqxzsAOL2QnsWuViOlTQ0GfJZCf7FmDx69BPxoGbM3BCXD3iUzFU9UW-t5iVVATryxsJYRWsTuhDN-huBXSSvTLpP7SJUb3V-h8Imm52_V-qVDUCcp_P-dMLd-FO4ziGtTgtDzjes9HcPtXu2bzSDp4X-Esw857JDl-3X8t54aJS9zh8-jxS-FWzFamSXxK2-crGCCOfvfNwaQOJQa4bNH9CnV89XN9tA_gMRlyOw5mgQx-Mo3PTiPbsLMtqoG6kDyGgEtN41RFu7kWsPSuyXRQFwWXKZnD_-9ExU8')
  })

  it('should fail when an error occurs while reducing the build', async () => {
    // Arrange
    const service = new BuildService()
    const build: IBuild = {
      id: '123',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: new Date(),
      name: 'test'
    }

    // Act
    const sharableStringResult = await service.toSharableURL(build)

    // Assert
    expect(sharableStringResult.success).toBe(false)
    expect(sharableStringResult.failureMessage).toBe('Cannot share build "test" because it is empty.')
  })

  it('should fail when the URL is longer thant 2048 characters', async () => {
    // Arrange
    const service = new BuildService()
    const oldBuildSharingUrl = Configuration.VITE_BUILD_SHARING_URL
    Configuration.VITE_BUILD_SHARING_URL = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

    // Act
    const sharableStringResult = await service.toSharableURL(builds[0])

    // Assert
    expect(sharableStringResult.success).toBe(false)
    expect(sharableStringResult.failureMessage).toBe('Cannot share build "Build 1" by link because it is too large. You can still share it by using the "Cog" menu to export it as a file that can be imported by another person.')

    // Clean
    Configuration.VITE_BUILD_SHARING_URL = oldBuildSharingUrl
  })
})

describe('update()', () => {
  it('should update a build', () => {
    // Arrange
    const service = new BuildService()
    const build = service.get(builds[0].id).value
    build.name = 'New caption'

    // Act / Assert
    const updateResult = service.update(builds[0].id, build)
    expect(updateResult.success).toBe(true)

    const getUpdatedBuildResult = service.get(builds[0].id)
    expect(getUpdatedBuildResult.success).toBe(true)
    expect(getUpdatedBuildResult.value.name).toBe('New caption')
  })

  it('should fail if the build does not exist', () => {
    // Arrange
    const service = new BuildService()
    const build = service.get(builds[0].id).value
    build.id = 'invalid'
    build.name = 'New caption'

    // Act / Assert
    const updateResult = service.update(build.id, build)
    expect(updateResult.success).toBe(false)
    expect(updateResult.failureMessage).toBe(
      'Build "invalid" not found. It may have been deleted.'
    )

    const getResult = service.get(build.id)
    expect(getResult.success).toBe(false)
    expect(getResult.failureMessage).toBe(
      'Build "invalid" not found. It may have been deleted.'
    )
  })
})
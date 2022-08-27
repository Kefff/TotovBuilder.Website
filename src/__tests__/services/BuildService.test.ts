import { IBuild } from '../../models/build/IBuild'
import { BuildService } from '../../services/BuildService'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { anything, spy, when } from 'ts-mockito'
import Result, { FailureType } from '../../utils/Result'
import WebsiteConfigurationMock from '../../../test-data/website-configuration.json'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'

const builds: IBuild[] = [
  {
    id: 'build_1',
    name: 'Build 1',
    inventorySlots: [
      {
        items: [
          {
            content: [],
            ignorePrice: false,
            itemId: '5beed0f50db834001c062b12',
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '5c0d5e4486f77478390952fe',
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'chamber0'
              },
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '5beec8ea0db834001a6f9dbf',
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_pistol_grip'
              },
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '5beec91a0db834001961942d',
                  modSlots: [
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: '5beec9450db83400970084fd',
                        modSlots: [
                          {
                            item: {
                              content: [],
                              ignorePrice: false,
                              itemId: '5bf3f59f0db834001a6fa060',
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
                      itemId: '5c0d5e4486f77478390952fe',
                      modSlots: [],
                      quantity: 95
                    }
                  ],
                  ignorePrice: false,
                  itemId: '5bed625c0db834001c062946',
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_magazine'
              },
              { modSlotName: 'mod_charge' },
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '5beec8b20db834001961942a',
                  modSlots: [
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: '5beec8c20db834001d2c465c',
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
                  itemId: '5beec3e30db8340019619424',
                  modSlots: [
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: '5beecbb80db834001d2c465e',
                        modSlots: [],
                        quantity: 1
                      },
                      modSlotName: 'mod_mount_000'
                    },
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: '5beecbb80db834001d2c465e',
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
                  itemId: '5beec1bd0db834001e6006f3',
                  modSlots: [
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: '5beec3420db834001b095429',
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
      { items: [undefined], typeId: 'onBack' },
      { items: [undefined], typeId: 'holster' },
      {
        items: [
          {
            content: [],
            ignorePrice: false,
            itemId: '5c0e51be86f774598e797894',
            modSlots: [],
            quantity: 1
          }
        ],
        typeId: 'bodyArmor'
      },
      { items: [undefined], typeId: 'tacticalRig' },
      {
        items: [
          {
            content: [],
            ignorePrice: false,
            itemId: '5c17a7ed2e2216152142459c',
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '5a16b7e1fcdbcb00165aa6c9',
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_equipment_000'
              },
              { modSlotName: 'mod_nvg' },
              { modSlotName: 'mod_mount' },
              { modSlotName: 'mod_equipment_001' }
            ],
            quantity: 1
          }
        ],
        typeId: 'headwear'
      },
      { items: [undefined], typeId: 'earpiece' },
      {
        items: [
          {
            content: [],
            ignorePrice: false,
            itemId: '544fb3f34bdc2d03748b456a',
            modSlots: [],
            quantity: 1
          },
          {
            content: [],
            ignorePrice: false,
            itemId: '5755383e24597772cb798966',
            modSlots: [],
            quantity: 1
          },
          {
            content: [],
            ignorePrice: false,
            itemId: '5448be9a4bdc2dfd2f8b456a',
            modSlots: [],
            quantity: 1
          },
          undefined
        ],
        typeId: 'pockets'
      },
      {
        items: [
          {
            content: [
              {
                content: [],
                ignorePrice: true,
                itemId: '590c5d4b86f774784e1b9c45',
                modSlots: [],
                quantity: 1
              },
              {
                content: [],
                ignorePrice: false,
                itemId: '5448fee04bdc2dbc018b4567',
                modSlots: [],
                quantity: 1
              }
            ],
            ignorePrice: false,
            itemId: '5ca20d5986f774331e7c9602',
            modSlots: [],
            quantity: 1
          }
        ],
        typeId: 'backpack'
      },
      { items: [undefined], typeId: 'pouch' },
      { items: [undefined], typeId: 'scabbard' },
      {
        items: [
          {
            content: [],
            ignorePrice: false,
            itemId: '5ab8f39486f7745cd93a1cca',
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
            itemId: '5d5fca1ea4b93635fd598c07',
            modSlots: [],
            quantity: 1
          }
        ],
        typeId: 'eyewear'
      },
      { items: [undefined], typeId: 'armband' },
      { items: [undefined, undefined, undefined], typeId: 'special' }
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
            ignorePrice: false,
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
                ignorePrice: false,
                itemId: '5efb0da7a29a85116f6ea05f', // 9x19 mm 7N31"
                modSlots: [],
                quantity: 1
              }
            ],
            ignorePrice: false,
            itemId: '5cadc190ae921500103bb3b6', // Beretta M9A3 9x19 pistol
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '5cadc1c6ae9215000f2775a4', // Threaded barrel for M9A3 9x19"
                  modSlots: [
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
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
                  ignorePrice: false,
                  itemId: '5cadc431ae921500113bb8d5', // Polymer pistol grip for M9A3
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_pistol_grip'
              },
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '5cadc55cae921500103bb3be', // M9A3 Slide"
                  modSlots: [
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: '5cadd940ae9215051e1c2316', // Beretta M9A3 Standard Rearsight"
                        modSlots: [],
                        quantity: 1
                      },
                      modSlotName: 'mod_sight_rear'
                    },
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
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
                      ignorePrice: false,
                      itemId: '5efb0da7a29a85116f6ea05f', // 9x19 mm 7N31"
                      modSlots: [],
                      quantity: 17
                    }
                  ],
                  ignorePrice: false,
                  itemId: '5cadc2e0ae9215051e1c21e7', // M9A3 9x19 17-round magazine"
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_magazine'
              },
              {
                item: {
                  content: [],
                  ignorePrice: false,
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
            ignorePrice: false,
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
            ignorePrice: false,
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
                ignorePrice: false,
                itemId: '544fb45d4bdc2dee738b4568', // Salewa FIRST AID KIT (400/400)"
                modSlots: [],
                quantity: 1
              }
            ],
            ignorePrice: false,
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
          ignorePrice: false,
          itemId: '59e7711e86f7746cae05fbe1', // Kolpak-1S riot helmet
          modSlots: [
            {
              item: {
                content: [],
                ignorePrice: false,
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
      WebsiteConfigurationMock.buildStorageKeyPrefix + build.id,
      JSON.stringify(build)
    )
  }

  localStorage.setItem(WebsiteConfigurationMock.languageStorageKey, 'en')
})

afterEach(() => {
  localStorage.clear()
})

describe('add()', () => {
  it('should add a build', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

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
            ignorePrice: false,
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
            ignorePrice: false,
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
        items: [undefined, undefined, undefined],
        typeId: 'special'
      }
    ])
  })
})

describe('delete()', () => {
  it('should delete a build', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

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
    const sharableString = 'XQAAAAKBAQAAAAAAAABAqEppVBKy3f2nWA1_4C5z8-v7-PB2PnO3yE24i4uplQNOe2AQti9qfQ3vHsOnTKDq2nEEFb79VsBzBnD-pb-5Nb0_87qgYNgUqN-kUzC-ixXoaUIxP5bVjrq-YghBtAFQa_O4inxq3hwebGM3jUCTpB0ou_BCcoJymajYEBQ2OvPuy_aF8Vtf4UR8KYA6nugVJv5Kd0v6DWN94D7Kgaza5GFSYqrRHItjPLx6krp0SGceYjtn1RNUBX-ea41hpKDXlBkYuxoBe-ZT10P4Ouq0e2Mmn82YwcUUBrZvQhh3uG6Dn_YU1No29Qi4js2uAwpm-nroMnPbxOd9jDkNeED-9xXjIA'

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
              'itemId': '574d967124597745970e7c94', // Simonov SKS 7.62x39 carbine
              'modSlots': [
                {
                  'item': {
                    'content': [],
                    'ignorePrice': false,
                    'itemId': '574dad8024597745964bf05c', // SKS TOZ wooden stock (56-A-231 Sb.5)
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_stock'
                },
                {
                  'item': {
                    'content': [],
                    'ignorePrice': false,
                    'itemId': '574db213245977459a2f3f5d', // SKS rear sight
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_sight_rear'
                },
                {
                  'item': {
                    'content': [],
                    'itemId': '587df3a12459772c28142567', // SKS 7.62x39 10-round internal box magazine
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
                  'ignorePrice': false,
                  'itemId': '5448fee04bdc2dbc018b4567', // Bottle of water (0.6L)
                  'modSlots': [],
                  'quantity': 1
                }
              ],
              'ignorePrice': false,
              'itemId': '5c0e805e86f774683f3dd637', // 3V Gear Paratus 3-Day Operator's Tactical backpack
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
              'ignorePrice': false,
              'itemId': '544a11ac4bdc2d470e8b456a', // Secure container Alpha
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
              'ignorePrice': false,
              'itemId': '54491bb74bdc2d09088b4567', // ER FULCRUM BAYONET
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
              'ignorePrice': false,
              'itemId': '5f4f9eb969cdc30ff33f09db', // EYE MK.2 professional hand-held compass
              'modSlots': [],
              'quantity': 1
            },
            undefined,
            undefined
          ],
          'typeId': 'special'
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
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()

    // Act
    const result = service.get(builds[1].id)

    // Assert
    expect(result.success).toBe(true)
    expect(JSON.stringify(result.value)).toBe(JSON.stringify(builds[1])) // stringify() used because undefined is serialized to null and then deserialized to null so equality comparison doesn't work
  })

  it('should fail if the build does not exist', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()

    // Act
    const result = service.get('invalid')

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe(
      'Build "invalid" not found. It may have been deleted.'
    )
  })

  it('should update an obsolete build', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()
    const date = new Date()
    const build: IBuild = {
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '5f4f9eb969cdc30ff33f09db', // EYE MK.2 professional hand-held compass
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'compass'
        }
      ],
      lastExported: date,
      lastUpdated: date,
      name: 'Obsolete build'
    }
    const id = service.add(build)

    // Act
    const updatedBuildResult = service.get(id)

    // Assert
    expect(updatedBuildResult.success).toBe(true)
    expect(updatedBuildResult.value).toStrictEqual({
      id,
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '5f4f9eb969cdc30ff33f09db', // EYE MK.2 professional hand-held compass
              modSlots: [],
              quantity: 1
            },
            undefined,
            undefined
          ],
          typeId: 'special'
        }
      ],
      lastExported: date,
      lastUpdated: date,
      name: 'Obsolete build'
    })
  })
})

describe('getAll()', () => {
  it('should get all builds', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

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
          'items': [undefined, undefined, undefined],
          'typeId': 'special'
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

describe('reduceBuild()', () => {
  it('should reduce a build', () => {
    // Arrange
    const service = new BuildService()

    // Act
    const reducedBuildResult = service.reduceBuild(builds[0])

    // Assert
    expect(reducedBuildResult.success).toBe(true)
    expect(reducedBuildResult.value).toStrictEqual({
      's': [
        {
          'i': [
            {
              'i': '5beed0f50db834001c062b12', // RPK-16 5.45x39 light machine gun
              'm': [
                {
                  'i': {
                    'i': '5c0d5e4486f77478390952fe' // 5.45x39mm PPBS gs \"Igolnik\"
                  },
                  'n': 'chamber0'
                },
                {
                  'i': {
                    'i': '5beec8ea0db834001a6f9dbf' // AK-12 pistol grip
                  },
                  'n': 'mod_pistol_grip'
                },
                {
                  'i': {
                    'i': '5beec91a0db834001961942d', // RPK-16 dust cover
                    'm': [
                      {
                        'i': {
                          'i': '5beec9450db83400970084fd', // RPK-16 rear sight base
                          'm': [
                            {
                              'i': {
                                'i': '5bf3f59f0db834001a6fa060' // RPK-16 rear sight
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
                        'i': '5c0d5e4486f77478390952fe', // 5.45x39mm PPBS gs \"Igolnik\"
                        'q': 95
                      }
                    ],
                    'i': '5bed625c0db834001c062946' // RPK-16 5.45x39 95-round drum magazine
                  },
                  'n': 'mod_magazine'
                },
                {
                  'i': {
                    'i': '5beec8b20db834001961942a', // RPK-16 buffer tube
                    'm': [
                      {
                        'i': {
                          'i': '5beec8c20db834001d2c465c' // AK-12 stock
                        },
                        'n': 'mod_stock'
                      }
                    ]
                  },
                  'n': 'mod_stock_001'
                },
                {
                  'i': {
                    'i': '5beec3e30db8340019619424', // RPK-16 handguard
                    'm': [
                      {
                        'i': {
                          'i': '5beecbb80db834001d2c465e' // RPK-16 handguard rail
                        },
                        'n': 'mod_mount_000'
                      },
                      {
                        'i': {
                          'i': '5beecbb80db834001d2c465e' // RPK-16 handguard rail
                        },
                        'n': 'mod_mount_001'
                      }
                    ]
                  },
                  'n': 'mod_handguard'
                },
                {
                  'i': {
                    'i': '5beec1bd0db834001e6006f3', // RPK-16 5.45x39 15 inch barrel
                    'm': [
                      {
                        'i': {
                          'i': '5beec3420db834001b095429' // RPK-16 5.45x39 muzzle brake-compensator
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
              'i': '5c0e51be86f774598e797894' // 6B13 assault armor (Flora)
            }
          ],
          't': 'bodyArmor'
        },
        {
          'i': [
            {
              'i': '5c17a7ed2e2216152142459c', // Crye Precision AirFrame helmet (Tan)',
              'm': [
                {
                  'i': {
                    'i': '5a16b7e1fcdbcb00165aa6c9' // Ops-Core FAST multi-hit ballistic face shield
                  },
                  'n': 'mod_equipment_000'
                }
              ]
            }
          ],
          't': 'headwear'
        },
        {
          'i': [
            {
              'i': '544fb3f34bdc2d03748b456a' // Morphine injector
            },
            {
              'i': '5755383e24597772cb798966' // Vaseline balm
            },
            {
              'i': '5448be9a4bdc2dfd2f8b456a' // RGD-5 hand grenade
            }
          ],
          't': 'pockets'
        },
        {
          'i': [
            {
              'c': [
                {
                  'i': '590c5d4b86f774784e1b9c45', // Iskra ration pack
                  'p': ''
                },
                {
                  'i': '5448fee04bdc2dbc018b4567' // Bottle of water (0.6L)
                }
              ],
              'i': '5ca20d5986f774331e7c9602' // WARTECH Berkut BB-102 backpack
            }
          ],
          't': 'backpack'
        },
        {
          'i': [
            {
              'i': '5ab8f39486f7745cd93a1cca' // Cold Fear infrared balaclava
            }
          ],
          't': 'faceCover'
        },
        {
          'i': [
            {
              'i': '5d5fca1ea4b93635fd598c07' // Crossbow tactical glasses
            }
          ],
          't': 'eyewear'
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
    const reducedBuildResult = service.reduceBuild(build)

    // Assert
    expect(reducedBuildResult.success).toBe(false)
    expect(reducedBuildResult.failureMessage).toBe('Cannot share build "test" because it is empty.')
  })
})

describe('toSharableURL()', () => {
  it('should reduce a build and transform it into a URL', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()

    // Act
    const sharableStringResult = await service.toSharableURL(builds[0])

    // Assert
    expect(sharableStringResult.success).toBe(true)
    expect(sharableStringResult.value).toBe('localhost:3000/s/XQAAAAJmBAAAAAAAAABAqEppdBKy3f2nWA1_4C5z8-v7-PB2PnO4TJBDN_RrefeMTA1oIOQNSLQmTZKQMA3nTnTUbHr2mi1gpHZ1QN0VIdkLEh60ZqLDitEtmoaW0W0HNH_zGoKaZEYJaP-iZbZ58SWF1EzZsZPqQKFC_vbt94cj3bvtzDD7pDiJOzAUPS4f-zBgDNFZaE2HYlN3Rz5M49-4gT5jlmRMoea0PcfnKGWOu8u8tLcMaC60pI27hakRDzyTuI4L8cYmi0QwjxRlItBak0OtOuG-v429VWpY_8LQtmewFcw-MWPYRuIj7UvZmreC9JUBrXokMOkD2EMRJmxeWr5xHf4Vs8zN5KN1dcMu7IWmt8WqBVNv-JM58Llo5jQE5TKnNPfD-joOOLpz48N6zW0E0DmgbkCCVNFhu-yHjiRyAyf04PMJIaKUvdNBdsm0NHnE7LdClTap-mQfC-nqV-k6mVFHnFL2kq7Ql_bAZyq4Ik6N4D7cvOhv2cJc9D3TNgdfAFJLbe9HMlDEQMAdEKPZ3RB0Z2tCpgwNkadeJMLdxab88Hy6Q3E8RCk78TwWmQCBRDcNNiyozBLO9hLg_5YfogDLAkPR3w59d3cPMRzqK28ZuDvblEyEucXvXnFRHD3OBlV59umKbt95m9rYcW7hlw_xWVQY_WZI9neXWYIlgpDYuacwp8IvIzbNCrVke9sIMVsMJ77sqDXtoZ00fot9AhpDkRciED16Kpm3v1UK6Qafo3-5TZQq_HdHHPgwVS0PfP_srPgE')
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
    useWebsiteConfigurationServiceMock()
    Services.get(WebsiteConfigurationService).configuration.buildSharingUrl = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

    const service = new BuildService()

    // Act
    const sharableStringResult = await service.toSharableURL(builds[0])

    // Assert
    expect(sharableStringResult.success).toBe(false)
    expect(sharableStringResult.failureMessage).toBe('Cannot share build "Build 1" by link because it is too large. You can still share it by using the "Cog" menu to export it as a file that can be imported by another person.')
  })
})

describe('update()', () => {
  it('should update a build', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()
    const build = service.get(builds[0].id).value
    build.name = 'New name'

    // Act / Assert
    const updateResult = service.update(builds[0].id, build)
    expect(updateResult.success).toBe(true)

    const getUpdatedBuildResult = service.get(builds[0].id)
    expect(getUpdatedBuildResult.success).toBe(true)
    expect(getUpdatedBuildResult.value.name).toBe('New name')
  })

  it('should fail if the build does not exist', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()
    const build = service.get(builds[0].id).value
    build.id = 'invalid'
    build.name = 'New name'

    // Act / Assert
    const updateResult = service.update(build.id, build)
    expect(updateResult.success).toBe(false)
    expect(updateResult.failureMessage).toBe('Build "invalid" not found. It may have been deleted.')

    const getResult = service.get(build.id)
    expect(getResult.success).toBe(false)
    expect(getResult.failureMessage).toBe('Build "invalid" not found. It may have been deleted.')
  })
})
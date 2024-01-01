import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'
import { BuildService } from '../../services/BuildService'

describe('parseReducedBuild()', () => {
  it('should parse a reduced build', () => {
    // Arrange
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

    Services.configure(BuildService)
    const service = new ReductionService()

    // Act
    const buildResult = service.parseReducedBuild(reducedBuild)

    // Assert
    expect(buildResult.success).toBe(true)
    expect(buildResult.value).toEqual({
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '574d967124597745970e7c94',
              modSlots: [
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: '574dad8024597745964bf05c',
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_stock'
                },
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: '574db213245977459a2f3f5d',
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_sight_rear'
                },
                {
                  item: {
                    content: [
                      {
                        content: [],
                        ignorePrice: false,
                        itemId: '5656d7c34bdc2d9d198b4587',
                        modSlots: [],
                        quantity: 10
                      }
                    ],
                    ignorePrice: false,
                    itemId: '587df3a12459772c28142567',
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_magazine'
                },
                {
                  item: undefined,
                  modSlotName: 'mod_muzzle'
                }
              ],
              quantity: 1
            }
          ],
          typeId: 'onSling'
        },
        {
          items: [
            undefined
          ],
          typeId: 'onBack'
        },
        {
          items: [
            undefined
          ],
          typeId: 'holster'
        },
        {
          items: [
            undefined
          ],
          typeId: 'bodyArmor'
        },
        {
          items: [
            undefined
          ],
          typeId: 'tacticalRig'
        },
        {
          items: [
            undefined
          ],
          typeId: 'headwear'
        },
        {
          items: [
            undefined
          ],
          typeId: 'earpiece'
        },
        {
          items: [
            undefined,
            undefined,
            undefined,
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
                  ignorePrice: false,
                  itemId: '5448fee04bdc2dbc018b4567',
                  modSlots: [],
                  quantity: 1
                }
              ],
              ignorePrice: false,
              itemId: '5c0e805e86f774683f3dd637',
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
          items: [
            undefined
          ],
          typeId: 'faceCover'
        },
        {
          items: [
            undefined
          ],
          typeId: 'eyewear'
        },
        {
          items: [
            undefined
          ],
          typeId: 'armband'
        },
        {
          items: [undefined, undefined, undefined],
          typeId: 'special'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: ''
    } as IBuild)
  })

  it.each([
    [
      {
        's': null
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
    useWebsiteConfigurationServiceMock()

    Services.configure(BuildService)
    const service = new ReductionService()

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
    Services.configure(BuildService)
    const service = new ReductionService()

    // Act
    const reducedBuildResult = service.reduceBuild({
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
      lastUpdated: new Date(1),
      lastWebsiteVersion: '999.999.999'
    })

    // Assert
    expect(reducedBuildResult).toStrictEqual({
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
                  'p': 1
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
})
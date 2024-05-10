import { anything, instance, mock, verify } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { BuildService } from '../../services/BuildService'
import { LogService } from '../../services/LogService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'
import { build1, build2, reducedBuild1, reducedBuild2 } from '../__data__/buildMocks'
import { berkut, morphine, rpk16, rpk16Drum } from '../__data__/itemMocks'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('parseReducedBuild()', () => {
  it.each([
    [
      reducedBuild1,
      {
        ...build1,
        id: '',
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined
      }
    ],
    [
      reducedBuild2,
      {
        ...build2,
        id: '',
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined
      }
    ]
  ])('should parse a reduced build', (reducedBuild: Record<string, unknown>, expected: IBuild) => {
    // Arrange
    Services.configure(BuildService)
    const service = new ReductionService()

    // Act
    const build = service.parseReducedBuild(reducedBuild)

    // Assert
    expect(build).toEqual(expected)
  })

  it.each([
    [
      {
        's': [
          {
            't': 'invalid',
            'i': [
              {
                'i': berkut.id
              }
            ]
          }
        ]
      },
      {
        id: '',
        inventorySlots: [
          {
            items: [
              undefined
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
              undefined
            ],
            typeId: 'backpack'
          },
          {
            items: [
              undefined
            ],
            typeId: 'pouch'
          },
          {
            items: [
              undefined
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
            items: [
              undefined,
              undefined,
              undefined
            ],
            typeId: 'special'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: ''
      } as IBuild,
      'messages.cannotFindInventorySlotType'
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
      {
        id: '',
        inventorySlots: [
          {
            items: [
              undefined
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
              undefined
            ],
            typeId: 'backpack'
          },
          {
            items: [
              undefined
            ],
            typeId: 'pouch'
          },
          {
            items: [
              undefined
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
            items: [
              undefined,
              undefined,
              undefined
            ],
            typeId: 'special'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: ''
      } as IBuild,
      'messages.cannotParseInventorySlotWithoutItems'
    ],
    [
      {
        's': [
          {
            'i': [
              {
                'i': berkut.id
              }
            ]
          }
        ]
      },
      {
        id: '',
        inventorySlots: [
          {
            items: [
              undefined
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
              undefined
            ],
            typeId: 'backpack'
          },
          {
            items: [
              undefined
            ],
            typeId: 'pouch'
          },
          {
            items: [
              undefined
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
            items: [
              undefined,
              undefined,
              undefined
            ],
            typeId: 'special'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: ''
      } as IBuild,
      'messages.cannotParseInventorySlotWithoutTypeId'
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
      {
        id: '',
        inventorySlots: [
          {
            items: [
              undefined
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
              undefined
            ],
            typeId: 'backpack'
          },
          {
            items: [
              undefined
            ],
            typeId: 'pouch'
          },
          {
            items: [
              undefined
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
            items: [
              undefined,
              undefined,
              undefined
            ],
            typeId: 'special'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: ''
      } as IBuild,
      'messages.cannotParseInventoryItemWithoutItemId'
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
                'i': berkut.id
              }
            ]
          }
        ]
      },
      {
        id: '',
        inventorySlots: [
          {
            items: [
              undefined
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
                content: [],
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
              undefined
            ],
            typeId: 'pouch'
          },
          {
            items: [
              undefined
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
            items: [
              undefined,
              undefined,
              undefined
            ],
            typeId: 'special'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: ''
      } as IBuild,
      'messages.cannotParseInventoryItemWithoutItemId'
    ],
    [
      {
        's': [
          {
            't': 'onSling',
            'i': [
              {
                'i': rpk16.id,
                'm': [
                  {
                    'i': {
                      'i': rpk16Drum.id
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: '',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: rpk16.id,
                modSlots: [],
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
              undefined
            ],
            typeId: 'backpack'
          },
          {
            items: [
              undefined
            ],
            typeId: 'pouch'
          },
          {
            items: [
              undefined
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
            items: [
              undefined,
              undefined,
              undefined
            ],
            typeId: 'special'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: ''
      } as IBuild,
      'messages.cannotParseInventoryModSlotWithoutModSlotName'
    ],
    [
      {
        's': [
          {
            't': 'onSling',
            'i': [
              {
                'i': rpk16.id,
                'm': [
                  {
                    'n': 'mod_magazine',
                    'i': {
                      'q': 1
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: '',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: rpk16.id,
                modSlots: [
                  {
                    item: undefined,
                    modSlotName: 'mod_magazine'
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
              undefined
            ],
            typeId: 'backpack'
          },
          {
            items: [
              undefined
            ],
            typeId: 'pouch'
          },
          {
            items: [
              undefined
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
            items: [
              undefined,
              undefined,
              undefined
            ],
            typeId: 'special'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: ''
      } as IBuild,
      'messages.cannotParseInventoryItemWithoutItemId'
    ]
  ])('should ignore elements that could not be parsed and log an error', (reducedBuild: Record<string, unknown>, expectedBuild: IBuild, expectedErrorMessageKey: string) => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const service = new ReductionService()

    // Act
    const build = service.parseReducedBuild(reducedBuild)

    // Assert
    expect(build).toStrictEqual(expectedBuild)
    verify(logServiceMock.logError(expectedErrorMessageKey))
  })

  it('should return undefined and log an error when a build has no inventory slots', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const service = new ReductionService()

    // Act
    const build = service.parseReducedBuild({
      's': null
    })

    // Assert
    expect(build).toBeUndefined()
    verify(logServiceMock.logError('message.cannotParseBuildWithoutInventorySlots', anything()))
  })
})

describe('reduceBuild()', () => {
  it.each([
    [
      build1,
      reducedBuild1
    ],
    [
      build2,
      reducedBuild2
    ],
    [
      {
        id: '',
        name: 'Build 3',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: morphine.id,
                modSlots: [],
                quantity: 1
              },
              undefined,
              undefined,
              undefined
            ],
            typeId: 'pockets'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined
      } as IBuild,
      {
        'n': 'Build 3',
        's': [
          {
            'i': [
              {
                'i': '544fb3f34bdc2d03748b456a'
              }
            ],
            't': 'pockets'
          }
        ]
      }
    ]
  ])('should reduce a build', (build: IBuild, expected: Record<string, unknown>) => {
    // Arrange
    Services.configure(BuildService)
    const service = new ReductionService()

    // Act
    const reducedBuildResult = service.reduceBuild(build)

    // Assert
    expect(reducedBuildResult).toStrictEqual(expected)
  })
})
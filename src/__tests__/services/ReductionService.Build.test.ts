import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { BuildService } from '../../services/BuildService'
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
    const buildResult = service.parseReducedBuild(reducedBuild)

    // Assert
    expect(buildResult.success).toBe(true)
    expect(buildResult.value).toEqual(expected)
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
                'i': berkut.id
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
                'i': berkut.id
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
                'i': berkut.id
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
      'Cannot parse inventory mod slot without mod slot name.'
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
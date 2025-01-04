import { describe, expect, it } from 'vitest'
import { IBuild } from '../../../models/build/IBuild'
import { Migration181 } from '../../../utils/migrations/Migration1.8.1'
import { ammo545us, ammo9mmGT, berkut, m9a3Default, m9a3Magazine, ms2000, rpk16Default, rpk16Drum } from '../../__data__/itemMocks'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'

describe('migrateBuildUnrelatedData() and migrateBuild()', () => {
  it('should update obsolete builds to remove chamber mod slots from weapons', async () => {
    // Arrange
    useItemServiceMock()
    useWebsiteConfigurationServiceMock()

    const obsoleteBuild = {
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: rpk16Default.id,
              modSlots: [
                {
                  modSlotName: 'chamber',
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: ammo545us.id,
                    modSlots: [],
                    quantity: 1
                  }
                },
                {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Default.id,
                  modSlots: [
                    {
                      modSlotName: 'magazine',
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: rpk16Drum.id,
                        modSlots: [],
                        quantity: 1
                      }
                    }
                  ],
                  quantity: 1
                }
              ],
              quantity: 1
            }
          ],
          typeId: 'onSling'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: rpk16Default.id,
              modSlots: [
                {
                  modSlotName: 'chamber',
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: ammo545us.id,
                    modSlots: [],
                    quantity: 1
                  }
                },
                {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Default.id,
                  modSlots: [
                    {
                      modSlotName: 'magazine',
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: rpk16Drum.id,
                        modSlots: [],
                        quantity: 1
                      }
                    }
                  ],
                  quantity: 1
                }
              ],
              quantity: 1
            }
          ],
          typeId: 'onBack'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: m9a3Default.id,
              modSlots: [
                {
                  modSlotName: 'chamber',
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: ammo9mmGT.id,
                    modSlots: [],
                    quantity: 1
                  }
                },
                {
                  modSlotName: 'magazine',
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: m9a3Magazine.id,
                    modSlots: [],
                    quantity: 1
                  }
                }
              ],
              quantity: 1
            }
          ],
          typeId: 'holster'
        },
        {
          items: [
            {
              content: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Default.id,
                  modSlots: [
                    {
                      modSlotName: 'magazine',
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: rpk16Drum.id,
                        modSlots: [],
                        quantity: 1
                      }
                    },
                    {
                      modSlotName: 'chamber',
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: ammo545us.id,
                        modSlots: [],
                        quantity: 1
                      }
                    }
                  ],
                  quantity: 1
                },
                {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Default.id,
                  modSlots: [
                    {
                      modSlotName: 'magazine',
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: rpk16Drum.id,
                        modSlots: [],
                        quantity: 1
                      }
                    }
                  ],
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
            undefined,
            {
              content: [],
              ignorePrice: false,
              itemId: ms2000.id,
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'pockets'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: '1.8.0',
      name: 'Obsolete build'
    } as IBuild

    const migration = new Migration181()

    // Act
    const result1 = await migration.migrateBuildUnrelatedDataPromise()
    const result2 = await migration.migrateBuildPromise(obsoleteBuild)

    // Assert
    expect(result1).toBe(true)
    expect(result2).toBe(true)
    expect(obsoleteBuild).toStrictEqual({
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: rpk16Default.id,
              modSlots: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Default.id,
                  modSlots: [
                    {
                      modSlotName: 'magazine',
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: rpk16Drum.id,
                        modSlots: [],
                        quantity: 1
                      }
                    }
                  ],
                  quantity: 1
                }
              ],
              quantity: 1
            }
          ],
          typeId: 'onSling'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: rpk16Default.id,
              modSlots: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Default.id,
                  modSlots: [
                    {
                      modSlotName: 'magazine',
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: rpk16Drum.id,
                        modSlots: [],
                        quantity: 1
                      }
                    }
                  ],
                  quantity: 1
                }
              ],
              quantity: 1
            }
          ],
          typeId: 'onBack'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: m9a3Default.id,
              modSlots: [
                {
                  modSlotName: 'magazine',
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: m9a3Magazine.id,
                    modSlots: [],
                    quantity: 1
                  }
                }
              ],
              quantity: 1
            }
          ],
          typeId: 'holster'
        },
        {
          items: [
            {
              content: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Default.id,
                  modSlots: [
                    {
                      modSlotName: 'magazine',
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: rpk16Drum.id,
                        modSlots: [],
                        quantity: 1
                      }
                    }
                  ],
                  quantity: 1
                },
                {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Default.id,
                  modSlots: [
                    {
                      modSlotName: 'magazine',
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: rpk16Drum.id,
                        modSlots: [],
                        quantity: 1
                      }
                    }
                  ],
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
            undefined,
            {
              content: [],
              ignorePrice: false,
              itemId: ms2000.id,
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'pockets'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: '1.8.0',
      name: 'Obsolete build'
    } as IBuild)
  })
})
import { anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IBuild } from '../../../models/build/IBuild'
import { IInventorySlot } from '../../../models/build/IInventorySlot'
import { IPrice } from '../../../models/item/IPrice'
import { IBuildsImportResult } from '../../../models/utils/IBuildsImportResult'
import { BuildPropertiesService } from '../../../services/BuildPropertiesService'
import { GlobalFilterService } from '../../../services/GlobalFilterService'
import { ImportService } from '../../../services/ImportService'
import { InventoryItemService } from '../../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../../services/InventorySlotPropertiesService'
import { InventorySlotService } from '../../../services/InventorySlotService'
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'
import { BuildsImportComponentService } from '../../../services/components/BuildsImportComponentService'
import Services from '../../../services/repository/Services'
import Result, { FailureType } from '../../../utils/Result'
import { berkut, iskra } from '../../__data__/itemMocks'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { useVersionServiceMock } from '../../__mocks__/VersionServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'

describe('readBuilds()', () => {
  it('should read builds from a file', async () => {
    // Arrange
    useItemServiceMock(true, [berkut, iskra], prices)
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useVersionServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildPropertiesService)
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotPropertiesService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)

    const importServiceMock = mock<ImportService>()
    when(importServiceMock.getBuildsFromFile(anything())).thenResolve(Result.ok<IBuild[]>([
      {
        id: 'build1',
        inventorySlots: [
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
          } as IInventorySlot
        ],
        lastExported: new Date(2023, 1, 1),
        lastUpdated: new Date(2023, 1, 1),
        lastWebsiteVersion: '1.6.0',
        name: 'Build 1'
      }
    ]))
    Services.configure(ImportService, undefined, instance(importServiceMock))

    const service = new BuildsImportComponentService()
    const fileMock = mock<File>()

    // Act
    const result = await service.readBuilds(instance(fileMock))

    // Assert
    expect(result.success).toBe(true)
    expect(result.value).toStrictEqual({
      buildSummaries: [
        {
          armorModifiers: {
            armorClass: 0,
            durability: 0
          },
          ergonomics: 0,
          exported: true,
          id: 'build1',
          lastExported: new Date(2023, 1, 1),
          lastUpdated: new Date(2023, 1, 1),
          name: 'Build 1',
          price: {
            missingPrice: false,
            priceInMainCurrency: 20762,
            priceByCurrency: [
              {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '',
                merchant: '',
                merchantLevel: 0,
                quest: undefined,
                value: 20762,
                valueInMainCurrency: 20762
              }
            ]
          },
          recoil: {
            horizontalRecoil: 0,
            verticalRecoil: 0
          },
          shoppingList: [
            {
              item: {
                ...berkut,
                prices: [
                  {
                    barterItems: [],
                    currencyName: 'RUB',
                    itemId: berkut.id,
                    merchant: 'ragman',
                    merchantLevel: 1,
                    quest: undefined,
                    value: 24509,
                    valueInMainCurrency: 24509
                  },
                  {
                    barterItems: [],
                    currencyName: 'RUB',
                    itemId: berkut.id,
                    merchant: 'flea-market',
                    merchantLevel: 0,
                    quest: undefined,
                    value: 26665,
                    valueInMainCurrency: 26665
                  },
                  {
                    barterItems: [
                      {
                        itemId: iskra.id,
                        quantity: 2
                      }
                    ],
                    currencyName: 'barter',
                    itemId: berkut.id,
                    merchant: 'ragman',
                    merchantLevel: 1,
                    quest: undefined,
                    value: 0,
                    valueInMainCurrency: 0
                  }
                ]
              },
              price: {
                barterItems: [],
                currencyName: 'barter',
                itemId: berkut.id,
                merchant: 'ragman',
                merchantLevel: 1,
                quest: undefined,
                value: 0,
                valueInMainCurrency: 0
              },
              quantity: 1,
              unitPrice: {
                barterItems: [],
                currencyName: 'barter',
                itemId: berkut.id,
                merchant: 'ragman',
                merchantLevel: 1,
                quest: undefined,
                value: 0,
                valueInMainCurrency: 0
              }
            },
            {
              item: {
                ...iskra,
                prices: [
                  {
                    barterItems: [],
                    currencyName: 'RUB',
                    itemId: iskra.id,
                    merchant: 'flea-market',
                    merchantLevel: 0,
                    quest: undefined,
                    value: 10381,
                    valueInMainCurrency: 10381
                  }
                ]
              },
              price: {
                barterItems: [],
                currencyName: 'RUB',
                itemId: iskra.id,
                merchant: 'flea-market',
                merchantLevel: 0,
                quest: undefined,
                value: 20762,
                valueInMainCurrency: 20762
              },
              quantity: 2,
              unitPrice: {
                barterItems: [],
                currencyName: 'RUB',
                itemId: iskra.id,
                merchant: 'flea-market',
                merchantLevel: 0,
                quest: undefined,
                value: 10381,
                valueInMainCurrency: 10381
              }
            }
          ],
          wearableModifiers: {
            ergonomicsPercentageModifier: -0.02,
            movementSpeedPercentageModifier: 0,
            turningSpeedPercentageModifier: 0
          },
          weight: 1
        }
      ],
      builds: [
        {
          id: 'build1',
          inventorySlots: [
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
            }
          ],
          lastExported: new Date(2023, 1, 1),
          lastUpdated: new Date(2023, 1, 1),
          lastWebsiteVersion: '1.6.0',
          name: 'Build 1'
        }
      ]
    } as IBuildsImportResult)
  })

  it('should return when no file is provided', async () => {
    // Arrange
    const service = new BuildsImportComponentService()

    // Act
    const result = await service.readBuilds(undefined)

    // Assert
    expect(result.success).toBe(true)
  })

  it('should fail when builds cannot be read from the file', async () => {
    // Arrange
    Services.configure(BuildPropertiesService)

    const importServiceMock = mock<ImportService>()
    when(importServiceMock.getBuildsFromFile(anything())).thenResolve(Result.fail(FailureType.error, undefined, 'Error'))
    Services.configure(ImportService, undefined, instance(importServiceMock))

    const service = new BuildsImportComponentService()

    const fileMock = mock<File>()

    // Act
    const result = await service.readBuilds(instance(fileMock))

    // Assert
    expect(result.success).toBe(false)
  })
})

const prices: IPrice[] = [
  {
    barterItems: [],
    currencyName: 'RUB',
    itemId: berkut.id,
    merchant: 'ragman',
    merchantLevel: 1,
    quest: undefined,
    value: 24509,
    valueInMainCurrency: 24509
  },
  {
    barterItems: [],
    currencyName: 'RUB',
    itemId: berkut.id,
    merchant: 'flea-market',
    merchantLevel: 0,
    quest: undefined,
    value: 26665,
    valueInMainCurrency: 26665
  },
  {
    barterItems: [
      {
        itemId: iskra.id,
        quantity: 2
      }
    ],
    currencyName: 'barter',
    itemId: berkut.id,
    merchant: 'ragman',
    merchantLevel: 1,
    quest: undefined,
    value: 0,
    valueInMainCurrency: 0
  },
  {
    barterItems: [],
    currencyName: 'RUB',
    itemId: iskra.id,
    merchant: 'flea-market',
    merchantLevel: 0,
    quest: undefined,
    value: 10381,
    valueInMainCurrency: 10381
  }
]
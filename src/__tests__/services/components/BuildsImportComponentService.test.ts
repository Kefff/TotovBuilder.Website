import { describe, expect, it } from 'vitest'
import { BuildsImportComponentService } from '../../../services/components/BuildsImportComponentService'
import { anything, instance, mock, when } from 'ts-mockito'
import { ImportService } from '../../../services/ImportService'
import Result, { FailureType } from '../../../utils/Result'
import { IInventorySlot } from '../../../models/build/IInventorySlot'
import Services from '../../../services/repository/Services'
import { BuildPropertiesService } from '../../../services/BuildPropertiesService'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { useVersionServiceMock } from '../../__mocks__/VersionServiceMock'
import { InventorySlotPropertiesService } from '../../../services/InventorySlotPropertiesService'
import { InventoryItemService } from '../../../services/InventoryItemService'
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'
import { GlobalFilterService } from '../../../services/GlobalFilterService'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { usePresetServiceMock } from '../../__mocks__/PresetPropertiesServiceMock'
import { IBuild } from '../../../models/build/IBuild'

describe('readBuilds()', () => {
  it('should read builds from a file', async () => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useVersionServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildPropertiesService)
    Services.configure(GlobalFilterService)
    Services.configure(InventorySlotPropertiesService)
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)

    const importServiceMock = mock<ImportService>()
    when(importServiceMock.getBuildsFromFile(anything())).thenReturn(Promise.resolve(Result.ok<IBuild[]>([
      {
        id: 'build1',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: '5ca20d5986f774331e7c9602', // WARTECH Berkut BB-102 backpack
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
    ])))
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
          ergonomics: undefined,
          exported: true,
          horizontalRecoil: undefined,
          id: 'build1',
          lastExported: new Date(2023, 1, 1),
          lastUpdated: new Date(2023, 1, 1),
          name: 'Build 1',
          price: {
            missingPrice: false,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: null,
              value: 0,
              valueInMainCurrency: 0
            },
            priceWithContentInMainCurrency: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: null,
              value: 23444,
              valueInMainCurrency: 23444
            },
            pricesWithContent: [
              {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '',
                merchant: '',
                merchantLevel: 0,
                quest: null,
                value: 23444,
                valueInMainCurrency: 23444
              }
            ],
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: null,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPriceIgnoreStatus: 'notIgnored'
          },
          shoppingList: [
            {
              item: {
                capacity: 20,
                categoryId: 'backpack',
                conflictingItemIds: [],
                ergonomicsPercentageModifier: -0.02,
                iconLink: 'https://assets.tarkov.dev/5ca20d5986f774331e7c9602-icon.webp',
                id: '5ca20d5986f774331e7c9602',
                imageLink: 'https://assets.tarkov.dev/5ca20d5986f774331e7c9602-image.webp',
                marketLink: 'https://tarkov.dev/item/wartech-berkut-bb-102-backpack',
                maxStackableAmount: 1,
                movementSpeedPercentageModifier: 0,
                name: 'WARTECH Berkut BB-102 backpack',
                prices: [
                  {
                    barterItems: [],
                    currencyName: 'RUB',
                    itemId: '5ca20d5986f774331e7c9602',
                    merchant: 'ragman',
                    merchantLevel: 1,
                    quest: null,
                    value: 23444,
                    valueInMainCurrency: 23444
                  },
                  {
                    barterItems: [],
                    currencyName: 'RUB',
                    itemId: '5ca20d5986f774331e7c9602',
                    merchant: 'flea-market',
                    merchantLevel: 0,
                    quest: null,
                    value: 24046,
                    valueInMainCurrency: 24046
                  },
                  {
                    barterItems: [
                      {
                        itemId: '5c0d2727d174af02a012cf58',
                        quantity: 1
                      }
                    ],
                    currencyName: 'barter',
                    itemId: '5ca20d5986f774331e7c9602',
                    merchant: 'ragman',
                    merchantLevel: 1,
                    quest: null,
                    value: 0,
                    valueInMainCurrency: 0
                  }
                ],
                shortName: 'Berkut',
                turningSpeedPercentageModifier: 0,
                weight: 1,
                wikiLink: 'https://escapefromtarkov.fandom.com/wiki/WARTECH_Berkut_BB-102_backpack'
              },
              price: {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '5ca20d5986f774331e7c9602',
                merchant: 'ragman',
                merchantLevel: 1,
                quest: null,
                value: 23444,
                valueInMainCurrency: 23444
              },
              quantity: 1,
              unitPrice: {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '5ca20d5986f774331e7c9602',
                merchant: 'ragman',
                merchantLevel: 1,
                quest: null,
                value: 23444,
                valueInMainCurrency: 23444
              }
            }
          ],
          verticalRecoil: undefined,
          wearableModifiers: {
            ergonomicsPercentageModifier: 0,
            ergonomicsPercentageModifierWithMods: -0.02,
            movementSpeedPercentageModifier: 0,
            movementSpeedPercentageModifierWithMods: 0,
            turningSpeedPercentageModifier: 0,
            turningSpeedPercentageModifierWithMods: 0
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
                  itemId: '5ca20d5986f774331e7c9602',
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
    })
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
    when(importServiceMock.getBuildsFromFile(anything())).thenReturn(Promise.resolve(Result.fail(FailureType.error, undefined, 'Error')))
    Services.configure(ImportService, undefined, instance(importServiceMock))

    const service = new BuildsImportComponentService()

    const fileMock = mock<File>()

    // Act
    const result = await service.readBuilds(instance(fileMock))

    // Assert
    expect(result.success).toBe(false)
  })
})
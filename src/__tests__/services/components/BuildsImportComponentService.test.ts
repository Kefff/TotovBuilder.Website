import { anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IBuild } from '../../../models/build/IBuild'
import { IInventorySlot } from '../../../models/build/IInventorySlot'
import { IBackpack } from '../../../models/item/IBackpack'
import { IItem } from '../../../models/item/IItem'
import { IPrice } from '../../../models/item/IPrice'
import { BuildPropertiesService } from '../../../services/BuildPropertiesService'
import { GlobalFilterService } from '../../../services/GlobalFilterService'
import { ImportService } from '../../../services/ImportService'
import { InventoryItemService } from '../../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../../services/InventorySlotPropertiesService'
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'
import { BuildsImportComponentService } from '../../../services/components/BuildsImportComponentService'
import Services from '../../../services/repository/Services'
import Result, { FailureType } from '../../../utils/Result'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { useVersionServiceMock } from '../../__mocks__/VersionServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'

describe('readBuilds()', () => {
  it('should read builds from a file', async () => {
    // Arrange
    useItemServiceMock(true, [berkut, crikent], prices)
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
    when(importServiceMock.getBuildsFromFile(anything())).thenResolve(Result.ok<IBuild[]>([
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
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            priceWithContentInMainCurrency: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 20762,
              valueInMainCurrency: 20762
            },
            pricesWithContent: [
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
            ],
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
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
                presetWearableModifiers: undefined,
                prices: [
                  {
                    barterItems: [],
                    currencyName: 'RUB',
                    itemId: '5ca20d5986f774331e7c9602',
                    merchant: 'ragman',
                    merchantLevel: 1,
                    quest: undefined,
                    value: 24509,
                    valueInMainCurrency: 24509
                  },
                  {
                    barterItems: [],
                    currencyName: 'RUB',
                    itemId: '5ca20d5986f774331e7c9602',
                    merchant: 'flea-market',
                    merchantLevel: 0,
                    quest: undefined,
                    value: 26420,
                    valueInMainCurrency: 26420
                  },
                  {
                    barterItems: [
                      {
                        itemId: '56742c284bdc2d98058b456d',
                        quantity: 2
                      }
                    ],
                    currencyName: 'barter',
                    itemId: '5ca20d5986f774331e7c9602',
                    merchant: 'ragman',
                    merchantLevel: 1,
                    quest: undefined,
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
                currencyName: 'barter',
                itemId: '5ca20d5986f774331e7c9602',
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
                itemId: '5ca20d5986f774331e7c9602',
                merchant: 'ragman',
                merchantLevel: 1,
                quest: undefined,
                value: 0,
                valueInMainCurrency: 0
              }
            },
            {
              item: {
                categoryId: 'other',
                conflictingItemIds: [],
                iconLink: 'https://assets.tarkov.dev/56742c284bdc2d98058b456d-icon.webp',
                id: '56742c284bdc2d98058b456d',
                imageLink: 'https://assets.tarkov.dev/56742c284bdc2d98058b456d-image.webp',
                marketLink: 'https://tarkov.dev/item/crickent-lighter',
                maxStackableAmount: 1,
                name: 'Crickent lighter',
                prices: [
                  {
                    barterItems: [],
                    currencyName: 'RUB',
                    itemId: '56742c284bdc2d98058b456d',
                    merchant: 'flea-market',
                    merchantLevel: 0,
                    quest: undefined,
                    value: 10381,
                    valueInMainCurrency: 10381
                  }
                ],
                shortName: 'Crickent',
                weight: 0.05,
                wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Crickent_lighter'
              },
              price: {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '56742c284bdc2d98058b456d',
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
                itemId: '56742c284bdc2d98058b456d',
                merchant: 'flea-market',
                merchantLevel: 0,
                quest: undefined,
                value: 10381,
                valueInMainCurrency: 10381
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

const berkut: IBackpack = {
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
  presetWearableModifiers: undefined,
  prices: [],
  shortName: 'Berkut',
  turningSpeedPercentageModifier: 0,
  weight: 1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/WARTECH_Berkut_BB-102_backpack'
}

const crikent: IItem = {
  categoryId: 'other',
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/56742c284bdc2d98058b456d-icon.webp',
  id: '56742c284bdc2d98058b456d',
  imageLink: 'https://assets.tarkov.dev/56742c284bdc2d98058b456d-image.webp',
  marketLink: 'https://tarkov.dev/item/crickent-lighter',
  maxStackableAmount: 1,
  name: 'Crickent lighter',
  prices: [],
  shortName: 'Crickent',
  weight: 0.05,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Crickent_lighter'
}

const prices: IPrice[] = [
  {
    barterItems: [],
    currencyName: 'RUB',
    itemId: '5ca20d5986f774331e7c9602',
    merchant: 'ragman',
    merchantLevel: 1,
    quest: undefined,
    value: 24509,
    valueInMainCurrency: 24509
  },
  {
    barterItems: [],
    currencyName: 'RUB',
    itemId: '5ca20d5986f774331e7c9602',
    merchant: 'flea-market',
    merchantLevel: 0,
    quest: undefined,
    value: 26420,
    valueInMainCurrency: 26420
  },
  {
    barterItems: [
      {
        itemId: '56742c284bdc2d98058b456d',
        quantity: 2
      }
    ],
    currencyName: 'barter',
    itemId: '5ca20d5986f774331e7c9602',
    merchant: 'ragman',
    merchantLevel: 1,
    quest: undefined,
    value: 0,
    valueInMainCurrency: 0
  },
  {
    barterItems: [],
    currencyName: 'RUB',
    itemId: '56742c284bdc2d98058b456d',
    merchant: 'flea-market',
    merchantLevel: 0,
    quest: undefined,
    value: 10381,
    valueInMainCurrency: 10381
  }
]
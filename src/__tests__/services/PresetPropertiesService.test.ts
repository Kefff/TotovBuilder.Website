import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ItemService } from '../../services/ItemService'
import { PresetPropertiesService } from '../../services/PresetPropertiesService'
import Services from '../../services/repository/Services'
import { useItemFetcherServiceMock } from '../../__mocks__/ItemFetcherServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { IArmorMod } from '../../models/item/IArmorMod'
import { InventoryItemService } from '../../services/InventoryItemService'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IMod } from '../../models/item/IMod'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import { anyString, spy, verify } from 'ts-mockito'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'

describe('isPreset()', () => {
  it.each([
    ['584147732459775a2b6d9f12', true],
    ['5648ac824bdc2ded0b8b457d', false],
    ['5c1d0c5f86f7744bb2683cf0', false]
  ])(
    'should determine if an item is a preset',
    async (itemId: string, expected: boolean) => {
      // Arrange
      useWebsiteConfigurationServiceMock()
      useItemFetcherServiceMock()
      Services.configure(ItemService)
      Services.configure(ItemPropertiesService)

      const presetPropertiesService = new PresetPropertiesService()
      const itemResult = await Services.get(ItemService).getItem(itemId)

      // Act
      const result = presetPropertiesService.isPreset(itemResult.value)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('updatePresetProperties', () => {
  it('should update the properties of an armor mod', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    useItemServiceMock(
      true,
      [
        {
          armorClass: 1,
          armoredAreas: ['TopOfTheHead'],
          baseItemId: undefined,
          blindnessProtectionPercentage: 0,
          categoryId: 'armorMod',
          conflictingItemIds: [],
          defaultPresetId: 'presetArmorMod',
          durability: 10,
          ergonomicsPercentageModifier: 0.05,
          iconLink: '',
          id: 'baseArmorMod',
          imageLink: '',
          marketLink: '',
          material: 'Aluminum',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          movementSpeedPercentageModifier: 0.04,
          name: 'Base armor mod',
          presetErgonomicsPercentageModifier: undefined,
          prices: [],
          ricochetChance: 'low',
          shortName: 'bam',
          turningSpeedPercentageModifier: 0.03,
          weight: 1,
          wikiLink: ''
        } as IArmorMod,
        {
          armorClass: 1,
          armoredAreas: ['TopOfTheHead'],
          baseItemId: 'baseArmorMod',
          blindnessProtectionPercentage: 0,
          categoryId: 'armorMod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          durability: 10,
          ergonomicsPercentageModifier: 0.05,
          iconLink: '',
          id: 'presetArmorMod',
          imageLink: '',
          marketLink: '',
          material: 'Aluminum',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          movementSpeedPercentageModifier: 0.04,
          name: 'Preset armor mod',
          presetErgonomicsPercentageModifier: undefined,
          prices: [],
          ricochetChance: 'low',
          shortName: 'pam',
          turningSpeedPercentageModifier: 0.03,
          weight: 1,
          wikiLink: ''
        } as IArmorMod,
        {
          armorClass: 1,
          armoredAreas: ['Eyes'],
          baseItemId: undefined,
          blindnessProtectionPercentage: 0,
          categoryId: 'armorMod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          durability: 20,
          ergonomicsPercentageModifier: 0.10,
          iconLink: '',
          id: 'childMod',
          imageLink: '',
          marketLink: '',
          material: 'Glass',
          maxStackableAmount: 1,
          modSlots: [],
          movementSpeedPercentageModifier: 0.20,
          name: 'Child armor mod',
          presetErgonomicsPercentageModifier: undefined,
          prices: [],
          ricochetChance: 'low',
          shortName: 'cam',
          turningSpeedPercentageModifier: 0.30,
          weight: 1,
          wikiLink: ''
        } as IArmorMod
      ],
      undefined,
      [
        {
          content: [],
          ignorePrice: false,
          itemId: 'presetArmorMod',
          modSlots: [
            {
              modSlotName: '',
              item: {
                content: [],
                ignorePrice: false,
                itemId: 'childMod',
                modSlots: [],
                quantity: 1
              }
            }
          ],
          quantity: 1
        }
      ])
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)

    const presetPropertiesService = new PresetPropertiesService()
    const itemResult = await Services.get(ItemService).getItem('presetArmorMod')
    const armorMod = itemResult.value as IArmorMod

    // Act
    await presetPropertiesService.updatePresetProperties([armorMod])

    // Assert
    expect(armorMod.ergonomicsPercentageModifier).toBe(0.05)
    expect(armorMod.presetErgonomicsPercentageModifier).toBe(0.15)
  })

  it('should update the properties of a headwear', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    useItemServiceMock(
      true,
      [
        {
          armorClass: 1,
          armoredAreas: ['TopOfTheHead'],
          baseItemId: undefined,
          blocksHeadphones: false,
          categoryId: 'headwear',
          conflictingItemIds: [],
          deafening: 'None',
          defaultPresetId: 'presetHeadwear',
          durability: 10,
          ergonomicsPercentageModifier: 0.05,
          iconLink: '',
          id: 'baseArmorMod',
          imageLink: '',
          marketLink: '',
          material: 'Aluminum',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          movementSpeedPercentageModifier: 0.04,
          name: 'Base headwear',
          presetErgonomicsPercentageModifier: undefined,
          prices: [],
          ricochetChance: 'low',
          shortName: 'bh',
          turningSpeedPercentageModifier: 0.03,
          weight: 1,
          wikiLink: ''
        } as IHeadwear,
        {
          armorClass: 1,
          armoredAreas: ['TopOfTheHead'],
          baseItemId: 'baseHeadwear',
          blocksHeadphones: false,
          categoryId: 'armorMod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          deafening: 'None',
          durability: 10,
          ergonomicsPercentageModifier: 0.05,
          iconLink: '',
          id: 'presetHeadwear',
          imageLink: '',
          marketLink: '',
          material: 'Aluminum',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          movementSpeedPercentageModifier: 0.04,
          name: 'Preset headwear',
          presetErgonomicsPercentageModifier: undefined,
          prices: [],
          ricochetChance: 'low',
          shortName: 'ph',
          turningSpeedPercentageModifier: 0.03,
          weight: 1,
          wikiLink: ''
        } as IHeadwear,
        {
          armorClass: 1,
          armoredAreas: ['Eyes'],
          baseItemId: undefined,
          blindnessProtectionPercentage: 0,
          categoryId: 'armorMod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          durability: 20,
          ergonomicsPercentageModifier: 0.10,
          iconLink: '',
          id: 'childMod',
          imageLink: '',
          marketLink: '',
          material: 'Glass',
          maxStackableAmount: 1,
          modSlots: [],
          movementSpeedPercentageModifier: 0.20,
          name: 'Child armor mod',
          presetErgonomicsPercentageModifier: undefined,
          prices: [],
          ricochetChance: 'low',
          shortName: 'cam',
          turningSpeedPercentageModifier: 0.30,
          weight: 1,
          wikiLink: ''
        } as IArmorMod
      ],
      undefined,
      [
        {
          content: [],
          ignorePrice: false,
          itemId: 'presetHeadwear',
          modSlots: [
            {
              modSlotName: '',
              item: {
                content: [],
                ignorePrice: false,
                itemId: 'childMod',
                modSlots: [],
                quantity: 1
              }
            }
          ],
          quantity: 1
        }
      ])
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)

    const presetPropertiesService = new PresetPropertiesService()
    const itemResult = await Services.get(ItemService).getItem('presetHeadwear')
    const headwear = itemResult.value as IHeadwear

    // Act
    await presetPropertiesService.updatePresetProperties([headwear])

    // Assert
    expect(headwear.ergonomicsPercentageModifier).toBe(0.05)
    expect(headwear.presetErgonomicsPercentageModifier).toBe(0.15)
  })

  it('should update the properties of a mod', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    useItemServiceMock(
      true,
      [
        {
          baseItemId: undefined,
          categoryId: 'mod',
          conflictingItemIds: [],
          defaultPresetId: 'presetMod',
          ergonomicsModifier: 5,
          iconLink: '',
          id: 'baseMod',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          name: 'Base mod',
          presetErgonomicsModifier: undefined,
          prices: [],
          shortName: 'bm',
          weight: 1,
          wikiLink: ''
        } as IMod,
        {
          baseItemId: 'baseMod',
          categoryId: 'mod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          ergonomicsModifier: 5,
          iconLink: '',
          id: 'presetMod',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          name: 'Preset mod',
          presetErgonomicsModifier: undefined,
          prices: [],
          shortName: 'pm',
          weight: 1,
          wikiLink: ''
        } as IMod,
        {
          baseItemId: undefined,
          categoryId: 'mod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          ergonomicsModifier: 10,
          iconLink: '',
          id: 'childMod',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          modSlots: [],
          name: 'Child mod',
          presetErgonomicsModifier: undefined,
          prices: [],
          shortName: 'cm',
          weight: 1,
          wikiLink: ''
        } as IMod
      ],
      undefined,
      [
        {
          content: [],
          ignorePrice: false,
          itemId: 'presetMod',
          modSlots: [
            {
              modSlotName: '',
              item: {
                content: [],
                ignorePrice: false,
                itemId: 'childMod',
                modSlots: [],
                quantity: 1
              }
            }
          ],
          quantity: 1
        }
      ])
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)

    const presetPropertiesService = new PresetPropertiesService()
    const itemResult = await Services.get(ItemService).getItem('presetMod')
    const mod = itemResult.value as IMod

    // Act
    await presetPropertiesService.updatePresetProperties([mod])

    // Assert
    expect(mod.ergonomicsModifier).toBe(5)
    expect(mod.presetErgonomicsModifier).toBe(15)
  })

  it('should update the properties of a ranged weapon', async () => {
    // Arrange
    useItemFetcherServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemService)
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)

    const presetPropertiesService = new PresetPropertiesService()
    const itemResult = await Services.get(ItemService).getItem('584147732459775a2b6d9f12') // Kalashnikov AKS-74U 5.45x39 assault rifle Default
    const rangedWeapon = itemResult.value as IRangedWeapon

    // Act
    await presetPropertiesService.updatePresetProperties([rangedWeapon])

    // Assert
    expect(rangedWeapon.ergonomics).toBe(44)
    expect(rangedWeapon.horizontalRecoil).toBe(415)
    expect(rangedWeapon.verticalRecoil).toBe(121)
    expect(rangedWeapon.presetErgonomics).toBe(64)
    expect(rangedWeapon.presetHorizontalRecoil).toBe(257)
    expect(rangedWeapon.presetVerticalRecoil).toBe(75)
  })

  it('should update the properties of a ranged weapond mod', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    useItemServiceMock(
      true,
      [
        {
          accuracyPercentageModifier: 0.04,
          baseItemId: undefined,
          categoryId: 'rangedWeaponMod',
          conflictingItemIds: [],
          defaultPresetId: 'presetRangedWeaponMod',
          ergonomicsModifier: 5,
          iconLink: '',
          id: 'baseRangedWeaponMod',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          name: 'Base ranged weapon mod',
          presetErgonomicsModifier: undefined,
          presetRecoilPercentageModifier: undefined,
          prices: [],
          recoilPercentageModifier: 0.06,
          shortName: 'brwm',
          weight: 1,
          wikiLink: ''
        } as IRangedWeaponMod,
        {
          accuracyPercentageModifier: 0.04,
          baseItemId: 'baseRangedWeaponMod',
          categoryId: 'rangedWeaponMod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          ergonomicsModifier: 5,
          iconLink: '',
          id: 'presetRangedWeaponMod',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          name: 'Preset ranged weapon mod',
          presetErgonomicsModifier: undefined,
          presetRecoilPercentageModifier: undefined,
          prices: [],
          recoilPercentageModifier: 0.06,
          shortName: 'prwm',
          weight: 1,
          wikiLink: ''
        } as IRangedWeaponMod,
        {
          accuracyPercentageModifier: 0.03,
          baseItemId: undefined,
          categoryId: 'rangedWeaponMod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          ergonomicsModifier: 10,
          iconLink: '',
          id: 'childMod',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          modSlots: [],
          name: 'Child ranged weapon mod',
          presetErgonomicsModifier: undefined,
          presetRecoilPercentageModifier: undefined,
          prices: [],
          recoilPercentageModifier: 0.2,
          shortName: 'crwm',
          weight: 1,
          wikiLink: ''
        } as IRangedWeaponMod
      ],
      undefined,
      [
        {
          content: [],
          ignorePrice: false,
          itemId: 'presetRangedWeaponMod',
          modSlots: [
            {
              modSlotName: '',
              item: {
                content: [],
                ignorePrice: false,
                itemId: 'childMod',
                modSlots: [],
                quantity: 1
              }
            }
          ],
          quantity: 1
        }
      ])
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)

    const presetPropertiesService = new PresetPropertiesService()
    const itemResult = await Services.get(ItemService).getItem('presetRangedWeaponMod')
    const rangedWeaponMod = itemResult.value as IRangedWeaponMod

    // Act
    await presetPropertiesService.updatePresetProperties([rangedWeaponMod])

    // Assert
    expect(rangedWeaponMod.accuracyPercentageModifier).toBe(0.04)
    expect(rangedWeaponMod.ergonomicsModifier).toBe(5)
    expect(rangedWeaponMod.recoilPercentageModifier).toBe(0.06)
    expect(rangedWeaponMod.presetErgonomicsModifier).toBe(15)
    expect(rangedWeaponMod.presetRecoilPercentageModifier).toBe(0.26)
  })

  it('should should do nothing to an item that is not a preset', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    useItemServiceMock(
      true,
      [
        {
          baseItemId: undefined,
          categoryId: 'mod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          ergonomicsModifier: 5,
          iconLink: '',
          id: 'nonPresetMod',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          name: 'Non preset mod',
          presetErgonomicsModifier: undefined,
          prices: [],
          shortName: 'pm',
          weight: 1,
          wikiLink: ''
        } as IMod,
        {
          baseItemId: undefined,
          categoryId: 'mod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          ergonomicsModifier: 10,
          iconLink: '',
          id: 'childMod',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          modSlots: [],
          name: 'Child mod',
          presetErgonomicsModifier: undefined,
          prices: [],
          shortName: 'cm',
          weight: 1,
          wikiLink: ''
        } as IMod
      ],
      undefined,
      [])
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)

    const presetPropertiesService = new PresetPropertiesService()
    const itemResult = await Services.get(ItemService).getItem('nonPresetMod')
    const mod = itemResult.value as IMod

    // Act
    await presetPropertiesService.updatePresetProperties([mod])

    // Assert
    expect(mod.ergonomicsModifier).toBe(5)
    expect(mod.presetErgonomicsModifier).toBe(undefined)
  })

  it('should notify presets that it cannot update', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    useItemServiceMock(
      true,
      [
        {
          baseItemId: undefined,
          categoryId: 'mod',
          conflictingItemIds: [],
          defaultPresetId: 'presetMod',
          ergonomicsModifier: 5,
          iconLink: '',
          id: 'baseMod',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          name: 'Base mod',
          presetErgonomicsModifier: undefined,
          prices: [],
          shortName: 'bm',
          weight: 1,
          wikiLink: ''
        } as IMod,
        {
          baseItemId: 'baseMod',
          categoryId: 'mod',
          conflictingItemIds: [],
          defaultPresetId: undefined,
          ergonomicsModifier: 5,
          iconLink: '',
          id: 'presetMod',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          modSlots: [{
            compatibleItemIds: ['childMod'],
            maxStackableAmount: 1,
            name: 'slot1',
            required: false
          }],
          name: 'Preset mod',
          presetErgonomicsModifier: undefined,
          prices: [],
          shortName: 'pm',
          weight: 1,
          wikiLink: ''
        } as IMod
      ],
      undefined,
      [
        {
          content: [],
          ignorePrice: false,
          itemId: 'presetMod',
          modSlots: [
            {
              modSlotName: '',
              item: {
                content: [],
                ignorePrice: false,
                itemId: 'childMod',
                modSlots: [],
                quantity: 1
              }
            }
          ],
          quantity: 1
        }
      ])
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)
    Services.configure(NotificationService)

    const notificationService = Services.get(NotificationService)
    const notificationServiceSpy = spy(notificationService)

    const presetPropertiesService = new PresetPropertiesService()
    const itemResult = await Services.get(ItemService).getItem('presetMod')
    const mod = itemResult.value as IMod

    // Act
    await presetPropertiesService.updatePresetProperties([mod])

    // Assert
    verify(notificationServiceSpy.notify(NotificationType.error, anyString(), true)).once()
    expect(mod.ergonomicsModifier).toBe(5)
    expect(mod.presetErgonomicsModifier).toBe(undefined)
  })
})
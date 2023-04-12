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
import { anyString, anything, instance, mock, spy, verify, when } from 'ts-mockito'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import Result, { FailureType } from '../../utils/Result'
import { IErgonomics } from '../../models/utils/IErgonomics'
import { IErgonomicsPercentageModifier } from '../../models/utils/IErgonomicsPercentageModifier'
import { IRecoil } from '../../models/utils/IRecoil'
import { IRecoilPercentageModifier } from '../../models/utils/IRecoilPercentageModifier'

describe('isPreset()', () => {
  it.each([
    ['584147732459775a2b6d9f12', true],
    ['5648ac824bdc2ded0b8b457d', false],
    ['5c1d0c5f86f7744bb2683cf0', false]
  ])(
    'should determine if an item is a preset',
    async (itemId: string, expected: boolean) => {
      // Arrange
      useItemFetcherServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
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
    useTarkovValuesServiceMock()
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
    useTarkovValuesServiceMock()
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
    useTarkovValuesServiceMock()
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
    useTarkovValuesServiceMock()
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
    useTarkovValuesServiceMock()
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
    useTarkovValuesServiceMock()
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

  it('should notify presets it did not find', async () => {
    // Arrange
    useTarkovValuesServiceMock()
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
      [])
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

  it.each([
    ['presetArmorMod', true, true, true, true],
    ['presetMod', true, true, true, true],
    ['presetRangedWeaponMod', true, true, true, true],
    ['presetRangedWeaponMod', false, true, true, true],
    ['584147732459775a2b6d9f12', true, true, true, true],
    ['584147732459775a2b6d9f12', false, true, true, true]
  ])('should notify presets it cannot update', async (
    presetId: string,
    ergonomicsFailure: boolean,
    ergonomicsPercentageModifierFailure: boolean,
    recoilFailure: boolean,
    recoilPercentageModifierFailure: boolean) => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemPropertiesService)
    Services.configure(NotificationService)

    const inventoryItemServiceMock = mock<InventoryItemService>()
    when(inventoryItemServiceMock.getErgonomics(anything()))
      .thenReturn(Promise.resolve(
        ergonomicsFailure
          ? Result.fail(FailureType.error)
          : Result.ok({
            ergonomics: 0,
            ergonomicsWithMods: 0
          } as IErgonomics)))
    when(inventoryItemServiceMock.getErgonomicsPercentageModifier(anything()))
      .thenReturn(Promise.resolve(
        ergonomicsPercentageModifierFailure
          ? Result.fail(FailureType.error)
          : Result.ok({
            ergonomicsPercentageModifier: 0,
            ergonomicsPercentageModifierWithMods: 0
          } as IErgonomicsPercentageModifier)))
    when(inventoryItemServiceMock.getRecoil(anything()))
      .thenReturn(Promise.resolve(
        recoilFailure
          ? Result.fail(FailureType.error)
          : Result.ok({
            horizontalRecoil: 0,
            horizontalRecoilWithMods: 0,
            verticalRecoil: 0,
            verticalRecoilWithMods: 0
          } as IRecoil)))
    when(inventoryItemServiceMock.getRecoilPercentageModifier(anything()))
      .thenReturn(Promise.resolve(
        recoilPercentageModifierFailure
          ? Result.fail(FailureType.error)
          : Result.ok({
            recoilPercentageModifier: 0,
            recoilPercentageModifierWithMods: 0
          } as IRecoilPercentageModifier)))
    Services.configure(InventoryItemService, undefined, instance(inventoryItemServiceMock))

    const notificationService = Services.get(NotificationService)
    const notificationServiceSpy = spy(notificationService)


    useItemServiceMock(
      true,
      [
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
          modSlots: [],
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
          modSlots: [],
          name: 'Preset mod',
          presetErgonomicsModifier: undefined,
          prices: [],
          shortName: 'pm',
          weight: 1,
          wikiLink: ''
        } as IMod,
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
          modSlots: [],
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
          baseItemId: '57dc2fa62459775949412633',
          caliber: 'Caliber545x39',
          defaultPresetId: null,
          ergonomics: 44,
          fireMods: ['SingleFire', 'FullAuto'],
          fireRate: 650,
          horizontalRecoil: 415,
          minuteOfAngle: 3.44,
          modSlots: [],
          verticalRecoil: 121,
          categoryId: 'mainWeapon',
          conflictingItemIds: [],
          iconLink: 'https://assets.tarkov.dev/584147732459775a2b6d9f12-icon.webp',
          id: '584147732459775a2b6d9f12',
          imageLink: 'https://assets.tarkov.dev/584147732459775a2b6d9f12-image.webp',
          maxStackableAmount: 1,
          marketLink: 'https://tarkov.dev/item/kalashnikov-aks-74u-545x39-assault-rifle-default',
          name: 'Kalashnikov AKS-74U 5.45x39 assault rifle Default',
          presetErgonomics: undefined,
          presetHorizontalRecoil: undefined,
          presetVerticalRecoil: undefined,
          prices: [],
          shortName: 'AKS-74U Default',
          weight: 1.809,
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kalashnikov_AKS-74U_5.45x39_assault_rifle'
        } as IRangedWeapon
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
        },
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
        },
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
        },
        {
          content: [],
          ignorePrice: false,
          itemId: '584147732459775a2b6d9f12',
          modSlots: [
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: '57e3dba62459770f0c32322b',
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_pistol_grip'
            },
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: '57dc347d245977596754e7a1',
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_stock'
            },
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: '564ca99c4bdc2d16268b4589',
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_magazine'
            },
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: '57dc324a24597759501edc20',
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_muzzle'
            },
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: '57dc334d245977597164366f',
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_reciever'
            },
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: '59d36a0086f7747e673f3946',
                modSlots: [
                  {
                    item: {
                      content: [],
                      ignorePrice: false,
                      itemId: '57dc32dc245977596d4ef3d3',
                      modSlots: [],
                      quantity: 1
                    },
                    modSlotName: 'mod_handguard'
                  }
                ],
                quantity: 1
              },
              modSlotName: 'mod_gas_block'
            }
          ],
          quantity: 1
        }
      ])

    const presetPropertiesService = new PresetPropertiesService()
    const itemResult = await Services.get(ItemService).getItem(presetId)
    const originalItem = { ...itemResult.value }

    // Act
    await presetPropertiesService.updatePresetProperties([itemResult.value])

    // Assert
    verify(notificationServiceSpy.notify(NotificationType.error, anyString(), true)).once()
    expect(itemResult.value).toStrictEqual(originalItem)
  })
})
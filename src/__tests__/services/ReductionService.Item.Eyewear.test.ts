import { describe, expect, it } from 'vitest'
import { IEyewear } from '../../models/item/IEyewear'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'ac': 1,
        'bp': 0.1,
        'c': 'eyewear',
        'ic': 'https://assets.tarkov.dev/603409c80ca681766b6a0fb2-icon.webp',
        'i': '603409c80ca681766b6a0fb2',
        'im': 'https://assets.tarkov.dev/603409c80ca681766b6a0fb2-image.webp',
        'm': 'https://tarkov.dev/item/npp-klass-condor-glasses',
        'ma': 'Glass',
        'n': 'NPP KlASS Condor glasses',
        's': 'Condor',
        'w': 0.03,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/NPP_KlASS_Condor_glasses'
      },
      {
        armorClass: 1,
        armoredAreas: [],
        baseItemId: undefined,
        blindnessProtectionPercentage: 0.1,
        categoryId: 'eyewear',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        durability: 0,
        ergonomicsModifierPercentage: 0,
        iconLink: 'https://assets.tarkov.dev/603409c80ca681766b6a0fb2-icon.webp',
        id: '603409c80ca681766b6a0fb2',
        imageLink: 'https://assets.tarkov.dev/603409c80ca681766b6a0fb2-image.webp',
        marketLink: 'https://tarkov.dev/item/npp-klass-condor-glasses',
        material: 'Glass',
        maxStackableAmount: 1,
        modSlots: [],
        movementSpeedModifierPercentage: 0,
        name: 'NPP KlASS Condor glasses',
        presetArmorModifiers: undefined,
        presetWearableModifiers: undefined,
        prices: [],
        shortName: 'Condor',
        turningSpeedModifierPercentage: 0,
        weight: 0.03,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/NPP_KlASS_Condor_glasses'
      } as IEyewear
    ]
  ])('should parse a reduced eyewear', (reducedEyeWear: Record<string, unknown>, expected: IEyewear) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const eyeWear = service.parseReducedItem(reducedEyeWear)

    // Assert
    expect(eyeWear).toStrictEqual(expected)
  })
})
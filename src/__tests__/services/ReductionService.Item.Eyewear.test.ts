import { describe, expect, it } from 'vitest'
import { ReductionService } from '../../services/ReductionService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import { IEyewear } from '../../models/item/IEyewear'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'bp': 0.1,
        'c': 'eyewear',
        'ic': 'https://assets.tarkov.dev/603409c80ca681766b6a0fb2-icon.webp',
        'i': '603409c80ca681766b6a0fb2',
        'im': 'https://assets.tarkov.dev/603409c80ca681766b6a0fb2-image.webp',
        'm': 'https://tarkov.dev/item/npp-klass-condor-glasses',
        'n': 'NPP KlASS Condor glasses',
        's': 'Condor',
        'w': 0.03,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/NPP_KlASS_Condor_glasses'
      },
      {
        blindnessProtectionPercentage: 0.1,
        categoryId: 'eyewear',
        conflictingItemIds: [],
        iconLink: 'https://assets.tarkov.dev/603409c80ca681766b6a0fb2-icon.webp',
        id: '603409c80ca681766b6a0fb2',
        imageLink: 'https://assets.tarkov.dev/603409c80ca681766b6a0fb2-image.webp',
        maxStackableAmount: 1,
        marketLink: 'https://tarkov.dev/item/npp-klass-condor-glasses',
        name: 'NPP KlASS Condor glasses',
        prices: [],
        shortName: 'Condor',
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
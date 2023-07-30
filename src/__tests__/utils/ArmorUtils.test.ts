import { ArmorUtils } from '../../utils/ArmorUtils'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { describe, expect, it } from 'vitest'

describe('getArmorPenetrationTooltip()', () => {
  it.each([
    [1, 0, `Armor class 1 penetration : 0
Penetrated after > 20 bullets`],
    [2, 1, `Armor class 2 penetration : 1
Penetrated after 13 - 20 bullets`],
    [3, 2, `Armor class 3 penetration : 2
Penetrated after 9 - 13 bullets`],
    [4, 3, `Armor class 4 penetration : 3
Penetrated after 5 - 9 bullets`],
    [5, 4, `Armor class 5 penetration : 4
Penetrated after 3 - 5 bullets`],
    [6, 5, `Armor class 6 penetration : 5
Penetrated after 1 - 3 bullets`],
    [6, 6, `Armor class 6 penetration : 6
Penetrated after < 1 bullets`]
  ])('should get the tooltip for an armor penetration', (armorClass: number, penetration: number, expected: string) => {
    // Arrange
    useTarkovValuesServiceMock()

    // Act
    const tooltip = ArmorUtils.getArmorPenetrationTooltip(armorClass, penetration)

    // Assert
    expect(tooltip).toBe(expected)
  })
})
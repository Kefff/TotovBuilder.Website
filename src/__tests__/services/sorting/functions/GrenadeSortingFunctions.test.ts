import { IGrenade } from '../../../../models/item/IGrenade'
import { GrenadeSortingFunctions } from '../../../../services/sorting/functions/GrenadeSortingFunctions'

describe('compareByFleshDamage()', () => {
  it.each([
    [
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'RGD5', fragmentsAmount: 1 } as IGrenade,
      { categoryId: 'cat2', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'RGD5', fragmentsAmount: 1 } as IGrenade,
      -1
    ],
    [
      { categoryId: 'cat2', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'RGD5', fragmentsAmount: 1 } as IGrenade,
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'RGD5', fragmentsAmount: 1 } as IGrenade,
      1
    ],
    [
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6d686f77467977ba6cc', caption: 'F-1', fragmentsAmount: 1 } as IGrenade,
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'RGD5', fragmentsAmount: 1 } as IGrenade,
      -15
    ],
    [
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'RGD5', fragmentsAmount: 1 } as IGrenade,
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6d686f77467977ba6cc', caption: 'F-1', fragmentsAmount: 1 } as IGrenade,
      15
    ],
    [
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'F-1', fragmentsAmount: 1 } as IGrenade,
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'RGD5', fragmentsAmount: 1 } as IGrenade,
      -1
    ],
    [
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'RGD5', fragmentsAmount: 1 } as IGrenade,
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'F-1', fragmentsAmount: 1 } as IGrenade,
      1
    ],
    [
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'RGD5', fragmentsAmount: 1 } as IGrenade,
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'RGD5', fragmentsAmount: 1 } as IGrenade,
      0
    ],
    [
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'RGD5', fragmentsAmount: 0 } as IGrenade,
      { categoryId: 'cat1', fragmentAmmunitionId: '5996f6cb86f774678763a6ca', caption: 'RGD5', fragmentsAmount: 0 } as IGrenade,
      0
    ],
    [
      { categoryId: 'cat1', fragmentAmmunitionId: 'invalid', caption: 'RGD5', fragmentsAmount: 1 } as IGrenade,
      { categoryId: 'cat1', fragmentAmmunitionId: 'invalid', caption: 'RGD5', fragmentsAmount: 1 } as IGrenade,
      0
    ]
  ])('should compare by category, flesh damage and caption', async (grenade1: IGrenade, grenade2: IGrenade, expected: number) => {
    // Arrange
    const sortingFunctions = new GrenadeSortingFunctions()
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions['fleshDamage'](grenade1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions['fleshDamage'](grenade2)

    // Act
    const sortingValue = sortingFunctions.comparisonFunctions['fleshDamage'](grenade1, propertyValue1, grenade2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(expected)
  })
})

describe('setSortingProperty()', () => {
  it.each([
    ['explosionDelay'],
    ['explosionDelay'],
    ['fragmentsAmount'],
    ['maximumExplosionRange']
  ])('should sort by a property', async (property: string) => {
    // Arrange
    const item1 = {
      categoryId: 'cat',
      explosionDelay: 1,
      maximumExplosionRange: 1,
      fragmentsAmount: 1
    } as IGrenade

    const item2 = {
      categoryId: 'cat',
      explosionDelay: 2,
      maximumExplosionRange: 2,
      fragmentsAmount: 2
    } as IGrenade

    const sortingFunctions = new GrenadeSortingFunctions()

    // Act
    const propertyValue1 = await sortingFunctions.getValueToCompareFunctions[property](item1)
    const propertyValue2 = await sortingFunctions.getValueToCompareFunctions[property](item2)
    const sortingValue = sortingFunctions.comparisonFunctions[property](item1, propertyValue1, item2, propertyValue2)

    // Assert
    expect(sortingValue).toBe(-1)
  })
})
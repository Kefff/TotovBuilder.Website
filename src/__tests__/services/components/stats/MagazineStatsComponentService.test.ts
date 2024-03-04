import { IAmmunition } from '../../../../models/item/IAmmunition'
import { IMagazine } from '../../../../models/item/IMagazine'
import { MagazineStatsComponentService } from '../../../../services/components/stats/MagazineStatsComponentService'
import { NotificationService } from '../../../../services/NotificationService'
import Services from '../../../../services/repository/Services'
import { useItemServiceMock } from '../../../__mocks__/ItemServiceMock'
import { describe, expect, it } from 'vitest'

describe('getAcceptedCartridgesNames()', () => {
  it('should get the accepted ammunition names of a magazine', async () => {
    // Arrange
    useItemServiceMock(
      true,
      [
        {
          id: '5c0d5e4486f77478390952fe',
          name: '5.45x39mm PPBS gs \'Igolnik\''
        } as IAmmunition,
        {
          id: '56d59d3ad2720bdb418b4577',
          name: '9x19mm Pst gzh'
        } as IAmmunition,
        {
          id: '56dfef82d2720bbd668b4567',
          name: '5.45x39mm BP gs'
        } as IAmmunition
      ])
    Services.configure(NotificationService)

    const magazine = {
      acceptedAmmunitionIds: [
        '5c0d5e4486f77478390952fe',
        '56dfef82d2720bbd668b4567',
        'invalid'
      ]
    } as IMagazine
    const magazineStatsComponentService = new MagazineStatsComponentService()

    // Act
    const names = await magazineStatsComponentService.getAcceptedCartridgesNames(magazine)

    // Assert
    expect(names).toStrictEqual([
      '5.45x39mm PPBS gs \'Igolnik\'',
      '5.45x39mm BP gs'
    ])
  })
})
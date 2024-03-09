import { describe, expect, it } from 'vitest'
import { IAmmunition } from '../../../../models/item/IAmmunition'
import { IMagazine } from '../../../../models/item/IMagazine'
import { NotificationService } from '../../../../services/NotificationService'
import { MagazineStatsComponentService } from '../../../../services/components/stats/MagazineStatsComponentService'
import Services from '../../../../services/repository/Services'
import { ammo545bp, ammo9mmGT } from '../../../__data__/itemMocks'
import { useItemServiceMock } from '../../../__mocks__/ItemServiceMock'

describe('getAcceptedCartridgesNames()', () => {
  it('should get the accepted ammunition names of a magazine', async () => {
    // Arrange
    useItemServiceMock(
      true,
      [
        ppbs,
        ammo9mmGT,
        ammo545bp
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
      ppbs.name,
      ammo545bp.name
    ])
  })
})

const ppbs = {
  id: '5c0d5e4486f77478390952fe',
  name: '5.45x39mm PPBS gs \'Igolnik\''
} as IAmmunition
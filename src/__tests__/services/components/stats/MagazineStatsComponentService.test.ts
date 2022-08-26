import { IMagazine } from '../../../../models/item/IMagazine'
import { MagazineStatsComponentService } from '../../../../services/components/stats/MagazineStatsComponentService'
import { NotificationService } from '../../../../services/NotificationService'
import Services from '../../../../services/repository/Services'
import { useItemServiceMock } from '../../../../__mocks__/ItemServiceMock'

describe('getAcceptedCartridgesNames()', () => {
  it('should get the accepted ammunition names of a magazine', async () => {
    // Arrange
    useItemServiceMock()
    Services.configure(NotificationService)

    const magazine = {
      acceptedAmmunitionIds: [
        '5c0d5e4486f77478390952fe',
        '56dfef82d2720bbd668b4567',
        '56dff026d2720bb8668b4567',
        '56dff061d2720bb5668b4567',
        '56dff0bed2720bb0668b4567',
        '56dff216d2720bbd668b4568',
        '56dff2ced2720bb4668b4567',
        '56dff338d2720bbd668b4569',
        '56dff3afd2720bba668b4567',
        '56dff421d2720b5f5a8b4567',
        '56dff4a2d2720bbd668b456a',
        '56dff4ecd2720b5f5a8b4568',
        'invalid'
      ]
    } as IMagazine
    const magazineStatsComponentService = new MagazineStatsComponentService()

    // Act
    const names = await magazineStatsComponentService.getAcceptedCartridgesNames(magazine)

    // Assert
    expect(names).toStrictEqual([
      '5.45x39mm PPBS gs "Igolnik"',
      '5.45x39mm BP gs',
      '5.45x39mm BS gs',
      '5.45x39mm BT gs',
      '5.45x39mm FMJ',
      '5.45x39mm HP',
      '5.45x39mm PP gs',
      '5.45x39mm PRS gs',
      '5.45x39mm PS gs',
      '5.45x39mm SP',
      '5.45x39mm T gs',
      '5.45x39mm US gs'
    ])
  })
})
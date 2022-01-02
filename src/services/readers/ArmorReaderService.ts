import { IArmor } from '../../models/item/IArmor'
import { IItem } from '../../models/item/IItem'
import RicochetChances from '../../assets/data/ricochet-chances.json'
import { BaseItemReaderService } from './BaseItemReaderService'

/**
 * Represents a reader that populates armor properties from Tarkov item data.
 */
export class ArmorReaderService extends BaseItemReaderService<IArmor> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IArmor> {
    const props = tarkovItem['_props'] as Record<string, unknown>
    const armor = await super.read(tarkovItem, categoryId, itemToPopulate)

    armor.armorClass = Number.parseInt(props['armorClass'] as string)
    armor.durability = armor.armorClass > 0 ? props['MaxDurability'] as number : 0
    armor.ergonomicsPercentageModifier = props['weaponErgonomicPenalty'] as number
    armor.material = props['ArmorMaterial'] as string
    armor.movementSpeedPercentageModifier = props['speedPenaltyPercent'] as number
    armor.turningSpeedPercentageModifier = props['mousePenalty'] as number

    armor.armoredAreas = []

    for (const armorZone of props['armorZone'] as string[]) {
      if (armorZone === 'Head') {
        // Head is ignored because it is subdivised in smaller segments
        continue
      }
      armor.armoredAreas.push(armorZone)
    }

    const headSegments = (props['headSegments'] ?? []) as string[]

    for (const armorZone of headSegments) {
      armor.armoredAreas.push(armorZone)
    }

    const ricochetParams = props['RicochetParams'] as Record<string, unknown>

    if (ricochetParams !== undefined) {
      const ricochetX = ricochetParams['x'] as number
      armor.ricochetChance = RicochetChances.find((rc) => ricochetX >= rc.resourceXMinValue && ricochetX <= rc.resourceXMaxValue)?.name
    }

    return armor
  }
}
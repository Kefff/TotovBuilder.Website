import { IAmmunition } from '../../models/item/IAmmunition'
import ArmorPenetrations from '../../assets/data/armor-penetrations.json'
import { LogService } from '../LogService'
import Services from '../repository/Services'
import { BaseItemReaderService } from './BaseItemReaderService'
import { IItem } from '../../models/item/IItem'

/**
 * Represents a reader that populates ammunition properties from Tarkov item data.
 */
export class AmmunitionReaderService extends BaseItemReaderService<IAmmunition> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IAmmunition> {
    const props = tarkovItem['_props'] as Record<string, unknown>
    const ammunition = await super.read(tarkovItem, categoryId, itemToPopulate) as IAmmunition

    ammunition.accuracyPercentageModifier = props['ammoAccr'] as number
    ammunition.armorDamagePercentage = props['ArmorDamage'] as number
    ammunition.caliber = props['Caliber'] as string
    ammunition.blinding = props['IsLightAndSoundShot'] as boolean
    ammunition.durabilityBurnPercentageModifier = Math.round((props['DurabilityBurnModificator'] as number - 1) * 100)
    ammunition.fleshDamage = props['Damage'] as number
    ammunition.fragmentationChancePercentage = Math.round(props['FragmentationChance'] as number * 100) // Round to avoid floating point imprecision that generates long numbers
    ammunition.heavyBleedingPercentageChance = Math.round(props['HeavyBleedingDelta'] as number * 100)
    ammunition.lightBleedingPercentageChance = Math.round(props['LightBleedingDelta'] as number * 100)
    ammunition.penetrationPower = props['PenetrationPower'] as number
    ammunition.projectiles = props['ProjectileCount'] as number
    ammunition.recoilPercentageModifier = props['ammoRec'] as number
    ammunition.tracer = props['Tracer'] as boolean
    ammunition.velocity = props['InitialSpeed'] as number
    ammunition.subsonic = ammunition.velocity < 343

    const armorPenetrations = ArmorPenetrations.find((ap) => ap.id === ammunition.id)

    if (armorPenetrations !== undefined) {
      ammunition.armorPenetrations = armorPenetrations.armorPenetrations
    } else {
      Services.get(LogService).logWarning('message.armorPenetrationsNotFound', { id: ammunition.id })
      ammunition.armorPenetrations = []
    }

    return ammunition
  }
}
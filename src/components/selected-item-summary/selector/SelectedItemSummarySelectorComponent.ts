import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IInventoryItem } from '../../../models/build/IInventoryItem'
import { IInventoryModSlot } from '../../../models/build/IInventoryModSlot'
import { IItem } from '../../../models/item/IItem'
import { IArmorModifiers } from '../../../models/utils/IArmorModifiers'
import { InventoryItemService } from '../../../services/InventoryItemService'
import { ItemPropertiesService } from '../../../services/ItemPropertiesService'
import { ItemService } from '../../../services/ItemService'
import Services from '../../../services/repository/Services'
import AmmunitionSummary from '../../summary/ammunition/AmmunitionSummaryComponent.vue'
import ArmorModSummary from '../../summary/armor-mod/ArmorModSummaryComponent.vue'
import ArmorSummary from '../../summary/armor/ArmorSummaryComponent.vue'
import BackpackSummary from '../../summary/backpack/BackpackSummaryComponent.vue'
import ContainerSummary from '../../summary/container/ContainerSummaryComponent.vue'
import EyewearSummary from '../../summary/eyewear/EyewearSummaryComponent.vue'
import GrenadeSummary from '../../summary/grenade/GrenadeSummaryComponent.vue'
import HeadwearSummary from '../../summary/headwear/HeadwearSummaryComponent.vue'
import MagazineSummary from '../../summary/magazine/MagazineSummaryComponent.vue'
import MeleeWeaponSummary from '../../summary/melee-weapon/MeleeWeaponSummaryComponent.vue'
import ModSummary from '../../summary/mod/ModSummaryComponent.vue'
import RangedWeaponModSummary from '../../summary/ranged-weapon-mod/RangedWeaponModSummaryComponent.vue'
import RangedWeaponSummary from '../../summary/ranged-weapon/RangedWeaponSummaryComponent.vue'
import VestSummary from '../../summary/vest/VestSummaryComponent.vue'
import SelectedItemSummary from '../item/SelectedItemSummaryComponent.vue'

export default defineComponent({
  components: {
    AmmunitionSummary,
    ArmorModSummary,
    ArmorSummary,
    BackpackSummary,
    ContainerSummary,
    EyewearSummary,
    GrenadeSummary,
    HeadwearSummary,
    MagazineSummary,
    MeleeWeaponSummary,
    ModSummary,
    RangedWeaponModSummary,
    RangedWeaponSummary,
    SelectedItemSummary,
    VestSummary
  },
  props: {
    modelValue: {
      type: Object as PropType<IInventoryItem>,
      required: true
    },
    canBeLooted: {
      type: Boolean,
      required: false,
      default: true
    },
    preset: {
      type: Object as PropType<IInventoryModSlot>,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const armorModifiers = ref<IArmorModifiers>()
    const isAmmunition = ref(false)
    const isArmor = ref(false)
    const isArmorMod = ref(false)
    const isBackpack = ref(false)
    const isContainer = ref(false)
    const isEyewear = ref(false)
    const isGrenade = ref(false)
    const isHeadwear = ref(false)
    const isMagazine = ref(false)
    const isMeleeWeapon = ref(false)
    const isMod = ref(false)
    const isRangedWeapon = ref(false)
    const isRangedWeaponMod = ref(false)
    const isVest = ref(false)
    const item = ref<IItem>()

    watch(() => props.modelValue.itemId, () => setItem())

    onMounted(async () => await setItem())

    /**
     * Sets the item based on the inventory item passed to the component and determines which summary component to display.
     */
    async function setItem() {
      const itemResult = await Services.get(ItemService).getItem(props.modelValue.itemId)

      if (itemResult.success) {
        item.value = itemResult.value
        await setItemType(item.value)
      } else {
        item.value = undefined
        armorModifiers.value = undefined
      }
    }

    /**
     * Sets the type of specialized summary component to display.
     * @param item - Item.
     */
    async function setItemType(item: IItem) {
      if (item.categoryId === 'other') {
        isAmmunition.value = false
        isArmor.value = false
        isArmorMod.value = false
        isBackpack.value = false
        isContainer.value = false
        isEyewear.value = false
        isGrenade.value = false
        isHeadwear.value = false
        isMagazine.value = false
        isMeleeWeapon.value = false
        isMod.value = false
        isRangedWeapon.value = false
        isRangedWeaponMod.value = false
        isVest.value = false

        return
      }

      const itemPropertiesService = Services.get(ItemPropertiesService)

      if (itemPropertiesService.isAmmunition(item)) {
        isAmmunition.value = true
      }
      else if (itemPropertiesService.isArmor(item)) {
        isArmor.value = true
        await setArmorModifiers()
      }
      else if (itemPropertiesService.isArmorMod(item)) {
        isArmorMod.value = true
      }
      else if (itemPropertiesService.isBackpack(item)) {
        isBackpack.value = true
      }
      else if (itemPropertiesService.isContainer(item)) {
        isContainer.value = true
      }
      else if (itemPropertiesService.isEyewear(item)) {
        isEyewear.value = true
      }
      else if (itemPropertiesService.isGrenade(item)) {
        isGrenade.value = true
      }
      else if (itemPropertiesService.isHeadwear(item)) {
        isHeadwear.value = true
      }
      else if (itemPropertiesService.isMagazine(item)) {
        isMagazine.value = true
      }
      else if (itemPropertiesService.isMeleeWeapon(item)) {
        isMeleeWeapon.value = true
      }
      else if (itemPropertiesService.isMod(item)) {
        isMod.value = true
      }
      else if (itemPropertiesService.isRangedWeapon(item)) {
        isRangedWeapon.value = true
      }
      else if (itemPropertiesService.isRangedWeaponMod(item)) {
        isRangedWeaponMod.value = true
      }
      else if (itemPropertiesService.isVest(item)) {
        isVest.value = true
        await setArmorModifiers()
      }
    }

    /**
     * Sets the armor modifiers for items with armor.
     */
    async function setArmorModifiers() {
      const frontPlateModSlot = props.modelValue.modSlots.find(ms => ms.modSlotName === 'front_plate')

      if (frontPlateModSlot == null) {
        const armorModifiersResult = await Services.get(InventoryItemService).getArmorModifiers(props.modelValue)

        if (armorModifiersResult.success) {
          armorModifiers.value = armorModifiersResult.value

        } else {
          armorModifiers.value = undefined
        }

        return
      }

      // When the item has an armor plate slot, no armor modifier is displayed because
      // it is the armor plate that defines the armor value
      armorModifiers.value = {
        armorClass: 0,
        durability: 0
      }
    }

    return {
      armorModifiers,
      isAmmunition,
      isArmor,
      isArmorMod,
      isBackpack,
      isContainer,
      isEyewear,
      isGrenade,
      isHeadwear,
      isMagazine,
      isMeleeWeapon,
      isMod,
      isRangedWeapon,
      isRangedWeaponMod,
      isVest,
      item
    }
  }
})
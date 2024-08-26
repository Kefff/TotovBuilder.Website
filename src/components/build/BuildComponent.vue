<template>
  <div class="build">
    <Toolbar :buttons="toolbarButtons">
      <template #center>
        <div class="build-title">
          <div v-show="!isEditing">
            {{ build.name }}
          </div>
          <InputTextField
            v-show="!isLoading && isEditing"
            v-model:value="build.name"
            :caption="$t('caption.name')"
            :centered="true"
            :required="true"
            caption-mode="placeholder"
            class="build-name"
          />
          <Tooltip
            v-if="!isLoading && !summary.exported && !isNewBuild"
            :tooltip="notExportedTooltip"
          >
            <font-awesome-icon
              icon="exclamation-triangle"
              class="build-not-exported"
            />
          </Tooltip>
        </div>
      </template>
      <template #right>
        <NotificationButton />
      </template>
    </Toolbar>
    <div
      v-show="!isLoading"
      class="build-summary-container"
    >
      <div class="build-summary">
        <div
          v-if="hasSummaryStats"
          class="build-summary-group"
        >
          <Tooltip
            v-if="hasSummaryVerticalRecoil"
            :tooltip="$t('caption.verticalRecoil')"
            class="build-summary-value"
          >
            <font-awesome-icon
              icon="arrows-alt-v"
              class="icon-before-text"
            />
            <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, summary.recoil.verticalRecoil) }}</span>
          </Tooltip>
          <Tooltip
            v-if="hasSummaryVerticalRecoil"
            :tooltip="$t('caption.horizontalRecoil')"
            class="build-summary-value"
          >
            <font-awesome-icon
              icon="arrows-alt-h"
              class="icon-before-text"
            />
            <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, summary.recoil.horizontalRecoil) }}</span>
          </Tooltip>
          <Tooltip
            v-if="hasSummaryErgonomics"
            :tooltip="$t('caption.ergonomics')"
            class="build-summary-value"
          >
            <font-awesome-icon
              icon="hand-paper"
              class="icon-before-text"
            />
            <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, summary.ergonomics) }}</span>
          </Tooltip>
        </div>
        <div
          v-if="hasSummaryArmor || hasSummaryWearableModifiers"
          class="build-summary-group"
        >
          <Tooltip
            v-if="hasSummaryArmor"
            :tooltip="$t('caption.armorClass')"
            class="build-summary-value"
          >
            <font-awesome-icon
              icon="award"
              class="icon-before-text"
            />
            <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.armorClass, summary.armorModifiers.armorClass) }}</span>
          </Tooltip>
          <Tooltip
            v-if="hasSummaryErgonomicsModifierPercentage"
            :tooltip="$t('caption.ergonomicsModifierPercentage')"
            class="build-summary-value"
          >
            <font-awesome-icon
              icon="hand-paper"
              class="icon-before-text"
            />
            <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.ergonomicsModifierPercentage)">
              {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, summary.wearableModifiers.ergonomicsModifierPercentage) }}
            </span>
          </Tooltip>
          <Tooltip
            v-if="hasSummaryMovementSpeedModifierPercentage"
            :tooltip="$t('caption.movementSpeedModifierPercentage')"
            class="build-summary-value"
          >
            <font-awesome-icon
              icon="walking"
              class="icon-before-text"
            />
            <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.movementSpeedModifierPercentage)">
              {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, summary.wearableModifiers.movementSpeedModifierPercentage) }}
            </span>
          </Tooltip>
          <Tooltip
            v-if="hasSummaryTurningSpeedModifierPercentage"
            :tooltip="$t('caption.turningSpeedModifierPercentage')"
            class="build-summary-value"
          >
            <font-awesome-icon
              icon="undo"
              class="icon-before-text"
            />
            <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.turningSpeedModifierPercentage)">
              {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, summary.wearableModifiers.turningSpeedModifierPercentage) }}
            </span>
          </Tooltip>
        </div>
        <div
          v-if="hasSummaryPrice || hasSummaryWeight"
          class="build-summary-group"
        >
          <div
            v-if="hasSummaryPrice"
            class="build-summary-value"
          >
            <InventoryPrice
              v-if="
                !isLoading"
              :inventory-price="summary.price"
              :is-build="true"
            />
          </div>
          <Tooltip
            v-if="hasSummaryWeight"
            :tooltip="$t('caption.weight')"
            class="build-summary-value"
          >
            <font-awesome-icon
              icon="weight-hanging"
              class="icon-before-text"
            />
            <span :class="StatsUtils.getWeightColorClass(summary.weight)">{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, summary.weight) }}</span>
          </Tooltip>
        </div>
      </div>
    </div>

    <!-- Inventory slots -->
    <div
      v-if="isLoading"
      class="build-loading"
    >
      <Loading />
    </div>
    <div
      v-if="!isLoading && !isEditing && isEmpty"
      class="build-empty-message"
    >
      <div class="build-empty-message-text">
        <p class="build-empty-message-line">
          {{ $t('message.emptyBuild1') }}
        </p>
        <p class="build-empty-message-line">
          {{ $t('message.emptyBuild2') }}
          <Button
            class="build-empty-message-button"
            @click="startEdit()"
          >
            <font-awesome-icon
              icon="edit"
              class="icon-before-text"
            />
            <span>{{ $t('caption.edit') }}</span>
          </Button>
          {{ $t('message.emptyBuild3') }}
        </p>
      </div>
    </div>
    <div
      v-else-if="!isLoading"
      class="build-inventory-slots"
    >
      <InventorySlot
        v-for="(inventorySlot, index) of build.inventorySlots"
        :key="`${path}/${inventorySlot.typeId}`"
        v-model:collapsed="collapseStatuses[index]"
        :inventory-slot="build.inventorySlots[index]"
        :path="`${path}/${inventorySlotPathPrefix}${inventorySlot.typeId}`"
        @update:inventory-slot="onInventorySlotChanged(index, $event)"
      />
    </div>
  </div>

  <!-- Deletion confirmation dialog -->
  <Dialog
    v-model:visible="deleting"
    :closable="false"
    :modal="true"
    :draggable="false"
  >
    <div>
      <span>{{ $t('message.confirmDeleteBuild', { name: build.name }) }}</span>
    </div>
    <template #footer>
      <div class="build-deletion-confirmation-buttons">
        <Button
          :label="$t('caption.delete')"
          severity="danger"
          @click="confirmDelete()"
        >
          <font-awesome-icon
            icon="trash"
            class="icon-before-text"
          />
          <span>{{ $t('caption.delete') }}</span>
        </Button>
        <Button
          outlined
          @click="cancelDelete()"
        >
          <font-awesome-icon
            icon="undo"
            class="icon-before-text"
          />
          <span>{{ $t('caption.cancel') }}</span>
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" src="./BuildComponent.ts" />
<style scoped lang="css" src="./BuildComponent.css" />

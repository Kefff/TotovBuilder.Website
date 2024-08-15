<template>
  <div class="build">
    <div class="build-title">
      <div v-show="!isEditing">
        {{ build.name }}
      </div>
      <InputTextField
        v-show="!isLoading && isEditing"
        v-model:value="build.name"
        :caption="$t('caption.name')"
        caption-mode="placeholder"
        :required="true"
      />
      <Tooltip
        v-if="!isLoading && !summary.exported && !isNewBuild"
        :tooltip="notExportedTooltip"
      >
        <font-awesome-icon
          icon="exclamation-triangle"
          class="build-toolbar-not-exported"
        />
      </Tooltip>
    </div>
    <Toolbar>
      <template #content>
        <div class="toolbar-part">
          <Tooltip
            :apply-hover-style="false"
            position="right"
            :tooltip="$t('caption.backToBuilds')"
          >
            <Button
              class="p-button-text p-button-sm button-discreet"
              :disabled="isEditing"
              @click="goToBuilds()"
            >
              <font-awesome-icon icon="arrow-left" />
            </Button>
          </Tooltip>
          <Button
            v-show="!isEditing"
            class="toolbar-button"
            :disabled="isLoading"
            @click="startEdit()"
          >
            <font-awesome-icon
              icon="edit"
              class="icon-before-text"
            />
            <span>{{ $t('caption.edit') }}</span>
          </Button>
          <Button
            v-show="isEditing"
            class="p-button-success toolbar-button"
            :disabled="invalid"
            @click="save()"
          >
            <font-awesome-icon
              icon="save"
              class="icon-before-text"
            />
            <span>{{ $t('caption.save') }}</span>
          </Button>
          <Tooltip
            :apply-hover-style="false"
            :tooltip="$t('caption.shoppingList')"
          >
            <Button
              class="p-button-text p-button-sm button-discreet"
              :disabled="summary.shoppingList.length === 0"
              @click="() => displayShoppingList()"
            >
              <font-awesome-icon icon="shopping-cart" />
            </Button>
          </Tooltip>
          <Tooltip
            :apply-hover-style="false"
            :tooltip="$t('caption.copyBuild')"
          >
            <Button
              :disabled="isLoading || isNewBuild"
              class="p-button-text p-button-sm button-discreet"
              @click="copy()"
            >
              <font-awesome-icon icon="copy" />
            </Button>
          </Tooltip>
          <BuildShare :build="build" />
          <Tooltip
            :apply-hover-style="false"
            :tooltip="$t('caption.exportBuild')"
          >
            <Button
              class="p-button-text p-button-sm button-discreet"
              :disabled="isLoading || isEditing"
              @click="exportBuild()"
            >
              <font-awesome-icon icon="file-export" />
            </Button>
          </Tooltip>
        </div>
        <div class="toolbar-part toolbar-center">
          <div
            v-show="!isLoading"
            class="build-toolbar-summary"
          >
            <div
              v-if="hasSummaryStats"
              class="build-toolbar-summary-group"
            >
              <Tooltip
                v-if="hasSummaryVerticalRecoil"
                :tooltip="$t('caption.verticalRecoil')"
                class="build-toolbar-summary-value"
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
                class="build-toolbar-summary-value"
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
                class="build-toolbar-summary-value"
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
              class="build-toolbar-summary-group"
            >
              <Tooltip
                v-if="hasSummaryArmor"
                :tooltip="$t('caption.armorClass')"
                class="build-toolbar-summary-value"
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
                class="build-toolbar-summary-value"
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
                class="build-toolbar-summary-value"
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
                class="build-toolbar-summary-value"
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
              class="build-toolbar-summary-group"
            >
              <div
                v-if="hasSummaryPrice"
                class="build-toolbar-summary-value"
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
                class="build-toolbar-summary-value"
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
        <div class="toolbar-part">
          <div class="build-toolbar-right">
            <Tooltip
              :apply-hover-style="false"
              :tooltip="$t('caption.merchantItemsOptions')"
            >
              <Button
                class="p-button-text p-button-sm button-discreet"
                :disabled="isLoading"
                @click="displayMerchantItemsOptions()"
              >
                <font-awesome-icon icon="user-tag" />
              </Button>
            </Tooltip>
            <Tooltip
              :apply-hover-style="false"
              :tooltip="$t('caption.options')"
            >
              <Button
                class="p-button-text p-button-sm button-discreet"
                @click="displayGeneralOptions()"
              >
                <font-awesome-icon icon="cog" />
              </Button>
            </Tooltip>
            <NotificationButton />
            <Button
              v-show="isEditing"
              class="p-button-danger toolbar-button"
              @click="cancelEdit()"
            >
              <font-awesome-icon
                icon="undo"
                class="icon-before-text"
              />
              <span>{{ $t('caption.cancel') }}</span>
            </Button>
            <Button
              v-show="!isEditing"
              class="p-button-danger toolbar-button"
              :disabled="isLoading"
              @click="startDelete()"
            >
              <font-awesome-icon
                icon="trash"
                class="icon-before-text"
              />
              <span>{{ $t('caption.delete') }}</span>
            </Button>
          </div>
        </div>
      </template>
    </Toolbar>

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
      <Button
        class="p-button-danger"
        :label="$t('caption.delete')"
        @click="confirmDelete()"
      >
        <font-awesome-icon
          icon="trash"
          class="icon-before-text"
        />
        <span>{{ $t('caption.delete') }}</span>
      </Button>
      <Button
        class="p-button-text button-discreet"
        @click="cancelDelete()"
      >
        <font-awesome-icon
          icon="undo"
          class="icon-before-text"
        />
        <span>{{ $t('caption.cancel') }}</span>
      </Button>
    </template>
  </Dialog>
</template>

<script lang="ts" src="./BuildComponent.ts" />
<style scoped lang="css" src="./BuildComponent.css" />

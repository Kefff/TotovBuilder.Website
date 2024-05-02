<template>
  <div class="build">
    <div class="build-title">
      <span
        v-if="!isLoading && !summary.exported && !isNewBuild"
        v-tooltip.top="notExportedTooltip"
        class="build-toolbar-not-exported"
      >
        <font-awesome-icon icon="exclamation-triangle" />
      </span>
      <span v-show="!editing">
        {{ build.name }}
      </span>
      <InputTextField
        v-show="!isLoading && editing"
        v-model="build.name"
        :caption="$t('caption.name')"
        caption-mode="placeholder"
        :required="true"
        required-message-position="right"
      />
    </div>
    <div :class="toolbarCssClass">
      <div class="toolbar-line">
        <div class="toolbar-part">
          <Button
            v-tooltip.right="$t('caption.backToBuilds')"
            class="p-button-text p-button-sm button-discreet"
            :disabled="editing"
            @click="goToBuilds()"
          >
            <font-awesome-icon icon="arrow-left" />
          </Button>
          <Button
            v-show="!editing"
            class="toolbar-button"
            :disabled="isLoading || hasLoadingError"
            @click="startEdit()"
          >
            <font-awesome-icon
              icon="edit"
              class="icon-before-text"
            />
            <span>{{ $t('caption.edit') }}</span>
          </Button>
          <Button
            v-show="editing"
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
          <ShoppingList :shopping-list="summary.shoppingList" />
          <Button
            v-tooltip.top="$t('caption.copyBuild')"
            :disabled="isLoading || hasLoadingError || isNewBuild"
            class="p-button-text p-button-sm button-discreet"
            @click="copy()"
          >
            <font-awesome-icon icon="copy" />
          </Button>
          <BuildShare
            :build="build"
            :has-loading-error="hasLoadingError"
          />
          <Button
            v-tooltip.top="$t('caption.exportBuild')"
            class="p-button-text p-button-sm button-discreet"
            :disabled="isLoading || hasLoadingError || editing"
            @click="exportBuild()"
          >
            <font-awesome-icon icon="file-export" />
          </Button>
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
              <div
                v-if="hasSummaryVerticalRecoil"
                v-tooltip.top="$t('caption.verticalRecoil')"
                class="build-toolbar-summary-value"
              >
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, summary.recoil.verticalRecoil) }}</span>
                <font-awesome-icon
                  icon="arrows-alt-v"
                  class="icon-after-text"
                />
              </div>
              <div
                v-if="hasSummaryVerticalRecoil"
                v-tooltip.top="$t('caption.horizontalRecoil')"
                class="build-toolbar-summary-value"
              >
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, summary.recoil.horizontalRecoil) }}</span>
                <font-awesome-icon
                  icon="arrows-alt-h"
                  class="icon-after-text"
                />
              </div>
              <div
                v-if="hasSummaryErgonomics"
                v-tooltip.top="$t('caption.ergonomics')"
                class="build-toolbar-summary-value"
              >
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, summary.ergonomics) }}</span>
                <font-awesome-icon
                  icon="hand-paper"
                  class="icon-after-text"
                />
              </div>
            </div>
            <div
              v-if="hasSummaryArmor || hasSummaryWearableModifiers"
              class="build-toolbar-summary-group"
            >
              <div
                v-if="hasSummaryArmor"
                v-tooltip.top="$t('caption.armorClass')"
                class="build-toolbar-summary-value"
              >
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.armorClass, summary.armorModifiers.armorClass) }}</span>
                <font-awesome-icon
                  icon="award"
                  class="icon-after-text"
                />
              </div>
              <div
                v-if="hasSummaryErgonomicsPercentageModifier"
                v-tooltip.top="$t('caption.ergonomicsPercentageModifier')"
                class="build-toolbar-summary-value"
              >
                <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.ergonomicsPercentageModifier)">
                  {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, summary.wearableModifiers.ergonomicsPercentageModifier) }}
                </span>
                <font-awesome-icon
                  icon="hand-paper"
                  class="icon-after-text"
                />
              </div>
              <div
                v-if="hasSummaryMovementSpeedPercentageModifier"
                v-tooltip.top="$t('caption.movementSpeedPercentageModifier')"
                class="build-toolbar-summary-value"
              >
                <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.movementSpeedPercentageModifier)">
                  {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, summary.wearableModifiers.movementSpeedPercentageModifier) }}
                </span>
                <font-awesome-icon
                  icon="walking"
                  class="icon-after-text"
                />
              </div>
              <div
                v-if="hasSummaryTurningSpeedPercentageModifier"
                v-tooltip.top="$t('caption.turningSpeedPercentageModifier')"
                class="build-toolbar-summary-value"
              >
                <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.turningSpeedPercentageModifier)">
                  {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, summary.wearableModifiers.turningSpeedPercentageModifier) }}
                </span>
                <font-awesome-icon
                  icon="undo"
                  class="icon-after-text"
                />
              </div>
            </div>
            <div
              v-if="hasSummaryPrice || hasSummaryWeight"
              class="build-toolbar-summary-group"
            >
              <div class="build-toolbar-summary-value">
                <InventoryPrice
                  v-if="!isLoading"
                  :inventory-price="summary.price"
                  :is-build="true"
                />
              </div>
              <div
                v-tooltip.top="$t('caption.weight')"
                class="build-toolbar-summary-value"
              >
                <span :class="StatsUtils.getWeightColorClass(summary.weight)">{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, summary.weight) }}</span>
                <font-awesome-icon
                  icon="weight-hanging"
                  class="icon-after-text"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="toolbar-part">
          <div class="build-toolbar-right">
            <MerchantItemsOptions />
            <GeneralOptions v-model:visible="generalOptionsSidebarVisible">
              <template #additional-display-options>
                <div
                  class="sidebar-option-with-hover"
                  @click="collapseAll()"
                >
                  <font-awesome-icon
                    icon="minus-square"
                    class="icon-before-text"
                  />
                  <span>{{ $t('caption.collapseAll') }}</span>
                </div>
                <div
                  class="sidebar-option-with-hover"
                  @click="expandWithItem()"
                >
                  <font-awesome-icon
                    icon="search-plus"
                    class="icon-before-text"
                  />
                  <span>{{ $t('caption.expandWithItem') }}</span>
                </div>
                <div
                  v-if="editing"
                  class="sidebar-option-with-hover"
                  @click="expandAll()"
                >
                  <font-awesome-icon
                    icon="plus-square"
                    class="icon-before-text"
                  />
                  <span>{{ $t('caption.expandAll') }}</span>
                </div>
              </template>
            </GeneralOptions>
            <NotificationButton />
            <Button
              v-show="editing"
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
              v-show="!editing"
              class="p-button-danger toolbar-button"
              :disabled="isLoading || hasLoadingError"
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
      </div>
      <div class="toolbar-gradient" />
    </div>

    <!-- Inventory slots -->
    <div
      v-show="isLoading"
      class="build-loading"
    >
      <Loading />
    </div>
    <div
      v-show="!isLoading"
      id="build-content"
    >
      <div
        v-if="!editing && isEmpty"
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
      <div v-else>
        <InventorySlot
          v-for="(inventorySlot, index) of build.inventorySlots"
          :key="path + '/' + inventorySlot.typeId"
          v-model:modelValue="build.inventorySlots[index]"
          v-model:collapsed="collapseStatuses[index]"
          :path="path + '/' + inventorySlotPathPrefix + inventorySlot.typeId"
        />
      </div>
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

  <!-- Loading error -->
  <LoadingError
    v-model:hasItemsLoadingError="hasItemsLoadingError"
    v-model:hasWebsiteConfigurationLoadingError="hasWebsiteConfigurationLoadingError"
  />
</template>

<script lang="ts" src="./BuildComponent.ts" />
<style scoped lang="css" src="./BuildComponent.css" />

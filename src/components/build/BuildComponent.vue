<template>
  <div class="build">
    <div class="build-title">
      <span
        v-if="!summary.exported && !isNewBuild"
        v-tooltip.top="notExportedTooltip"
        class="build-toolbar-not-exported"
      >
        <font-awesome-icon icon="exclamation-triangle" />
      </span>
      <span v-show="!editing">
        {{ build.name }}
      </span>
      <InputTextField
        v-show="editing"
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
            :class="'p-button-text p-button-sm button-discreet' + (editing ? ' p-disabled' : '')"
            @click="goToBuilds()"
          >
            <font-awesome-icon icon="arrow-left" />
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
          <Button
            v-show="!editing"
            class="toolbar-button"
            @click="startEdit()"
          >
            <font-awesome-icon
              icon="edit"
              class="icon-before-text"
            />
            <span>{{ $t('caption.edit') }}</span>
          </Button>
          <ShoppingList :shopping-list="summary.shoppingList" />
          <Button
            v-tooltip.top="$t('caption.copy')"
            :class="'p-button-text p-button-sm button-discreet' + (editing ? ' p-disabled' : '')"
            @click="copy()"
          >
            <font-awesome-icon
              icon="copy"
            />
          </Button>
          <ShareBuild :build="build" />
          <Button
            v-tooltip.top="$t('caption.exportBuild')"
            :class="'p-button-text p-button-sm button-discreet' + (editing ? ' p-disabled' : '')"
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
            <div class="build-toolbar-summary-group">
              <div
                v-if="summary.ergonomics != null"
                v-tooltip.top="$t('caption.ergonomics')"
                class="build-toolbar-summary-value"
              >
                <span>{{ summary.ergonomics }}</span>
                <font-awesome-icon
                  icon="hand-paper"
                  class="icon-after-text"
                />
              </div>
              <div
                v-if="summary.verticalRecoil != null"
                v-tooltip.top="$t('caption.verticalRecoil')"
                class="build-toolbar-summary-value"
              >
                <span>{{ summary.verticalRecoil }}</span>
                <font-awesome-icon
                  icon="arrows-alt-v"
                  class="icon-after-text"
                />
              </div>
              <div
                v-if="summary.horizontalRecoil != null"
                v-tooltip.top="$t('caption.horizontalRecoil')"
                class="build-toolbar-summary-value"
              >
                <span>{{ summary.horizontalRecoil }}</span>
                <font-awesome-icon
                  icon="arrows-alt-h"
                  class="icon-after-text"
                />
              </div>
            </div>
            <div class="build-toolbar-summary-group">
              <div
                v-if="summary.wearableModifiers != null && summary.wearableModifiers.ergonomicsPercentageModifierWithMods !== 0"
                v-tooltip.top="$t('caption.ergonomicsPercentageModifier')"
                class="build-toolbar-summary-value"
              >
                <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.ergonomicsPercentageModifierWithMods)">
                  {{ StatsUtils.getDisplayValue(summary.wearableModifiers.ergonomicsPercentageModifierWithMods, true, true) }}
                </span>
                <font-awesome-icon
                  icon="hand-paper"
                  class="icon-after-text"
                />
              </div>
              <div
                v-if="summary.wearableModifiers != null && summary.wearableModifiers.movementSpeedPercentageModifierWithMods !== 0"
                v-tooltip.top="$t('caption.movementSpeedPercentageModifier')"
                class="build-toolbar-summary-value"
              >
                <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.movementSpeedPercentageModifierWithMods)">
                  {{ StatsUtils.getDisplayValue(summary.wearableModifiers.movementSpeedPercentageModifierWithMods, true, true) }}
                </span>
                <font-awesome-icon
                  icon="walking"
                  class="icon-after-text"
                />
              </div>
              <div
                v-if="summary.wearableModifiers != null && summary.wearableModifiers.turningSpeedPercentageModifierWithMods !== 0"
                v-tooltip.top="$t('caption.turningSpeedPercentageModifier')"
                class="build-toolbar-summary-value"
              >
                <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.turningSpeedPercentageModifierWithMods)">
                  {{ StatsUtils.getDisplayValue(summary.wearableModifiers.turningSpeedPercentageModifierWithMods, true, true) }}
                </span>
                <font-awesome-icon
                  icon="undo"
                  class="icon-after-text"
                />
              </div>
            </div>
            <div class="build-toolbar-summary-group">
              <div class="build-toolbar-summary-value">
                <InventoryPrice
                  v-if="!isLoading"
                  :inventory-price="summary.price"
                />
              </div>
            </div>
            <div class="build-toolbar-summary-group">
              <div
                v-tooltip.top="$t('caption.weight')"
                class="build-toolbar-summary-value"
              >
                <div v-if="summary.weight !== 0">
                  <span :class="StatsUtils.getWeightColorClass(summary.weight)">{{ summary.weight.toFixed(3) }}</span>
                  <font-awesome-icon
                    icon="weight-hanging"
                    class="icon-after-text"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="toolbar-part">
          <div class="build-toolbar-right">
            <MerchantItemsOptions v-model:visible="merchantItemsOptionsSidebarVisible">
              <template #button>
                <Button
                  v-tooltip.top="$t('caption.merchantItemsOptions')"
                  class="p-button-text p-button-sm button-discreet"
                  @click="merchantItemsOptionsSidebarVisible = true"
                >
                  <font-awesome-icon
                    icon="user-tag"
                  />
                </Button>
              </template>
            </MerchantItemsOptions>
            <DisplayOptions v-model:visible="displayOptionsSidebarVisible">
              <template #button>
                <Button
                  v-tooltip.top="$t('caption.merchantItemsOptions')"
                  class="p-button-text p-button-sm button-discreet"
                  @click="displayOptionsSidebarVisible = true"
                >
                  <font-awesome-icon
                    icon="tv"
                  />
                </Button>
              </template>
              <template #additional-options>
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
            </DisplayOptions>
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
    <div
      v-show="isLoading"
      class="build-loading"
    >
      <Loading />
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

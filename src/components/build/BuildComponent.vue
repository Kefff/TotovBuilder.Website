<template>
  <div class="build">
    <div class="build-title">
      <span
        v-if="!summary.exported"
        v-tooltip.top="notExportedTooltip"
        class="build-toolbar-not-exported"
      >
        <font-awesome-icon icon="exclamation-triangle" />
      </span>
      <span v-if="!editing">
        {{ build.name }}
      </span>
      <InputTextField
        v-else
        v-model="build.name"
        :caption="$t('caption.name')"
        caption-mode="placeholder"
        :required="true"
        required-message-position="right"
      />
    </div>
    <div class="toolbar">
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
            v-if="editing"
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
            v-if="!editing"
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
            v-tooltip.top="$t('caption.export')"
            :class="'p-button-text p-button-sm button-discreet' + (editing ? ' p-disabled' : '')"
            @click="exportBuild()"
          >
            <font-awesome-icon icon="file-export" />
          </Button>
        </div>
        <div class="toolbar-part toolbar-center">
          <div class="build-toolbar-summary">
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
            <div
              v-if="summary.ergonomicsPercentageModifier != null && summary.ergonomicsPercentageModifier !== 0"
              v-tooltip.top="$t('caption.ergonomicsPercentageModifier')"
              class="build-toolbar-summary-value"
            >
              <span :class="StatsUtils.getValueColorClass(summary.ergonomicsPercentageModifier)">{{ StatsUtils.getDisplayValue(summary.ergonomicsPercentageModifier, true, true) }}</span>
              <font-awesome-icon
                icon="hand-paper"
                class="icon-after-text"
              />
            </div>
            <div class="build-toolbar-summary-value">
              <InventoryPrice
                :inventory-price="summary.price"
                :show-space-for-icon="false"
              />
            </div>
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
        <div class="toolbar-part">
          <div class="build-toolbar-right">
            <Button
              v-tooltip.top="$t('caption.options')"
              class="p-button-text p-button-sm button-discreet"
              @click="toggleOptionsPanel"
            >
              <font-awesome-icon icon="cog" />
            </Button>
            <Button
              v-tooltip.top="$t('caption.displayOptions')"
              class="p-button-text p-button-sm button-discreet"
              @click="toggleDisplayOptionsPanel"
            >
              <font-awesome-icon
                icon="tv"
              />
            </Button>
            <NotificationButton />
            <Button
              v-if="editing"
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
              v-if="!editing"
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
    <div v-if="!isInitializing">
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
      v-if="isInitializing"
      class="build-loading"
    >
      <Loading />
    </div>
  </div>

  <!-- Options panel -->
  <OverlayPanel
    ref="optionsPanel"
    :dismissable="true"
    :base-z-index="3"
  >
    <div class="build-options-panel">
      <div class="build-options-panel-item">
        <LanguageSelector />
      </div>
      <div
        class="build-options-panel-item build-merchant-filter"
      >
        <MerchantFilter />
      </div>
    </div>
  </OverlayPanel>

  <!-- View display options panel -->
  <OverlayPanel
    ref="displayOptionsPanel"
    :dismissable="true"
    :base-z-index="3"
  >
    <div class="build-options-panel">
      <div
        class="build-options-panel-item build-options-panel-item-with-hover"
        @click="collapseAll()"
      >
        <font-awesome-icon
          icon="minus-square"
          class="icon-before-text"
        />
        <span>{{ $t('caption.collapseAll') }}</span>
      </div>
      <div
        class="build-options-panel-item build-options-panel-item-with-hover"
        @click="expandWithItem()"
      >
        <font-awesome-icon
          icon="search-plus"
          class="icon-before-text"
        />
        <span>{{ $t('caption.expandWithItem') }}</span>
      </div>
      <div
        class="build-options-panel-item build-options-panel-item-with-hover"
        @click="expandAll()"
      >
        <font-awesome-icon
          icon="plus-square"
          class="icon-before-text"
        />
        <span>{{ $t('caption.expandAll') }}</span>
      </div>
    </div>
  </OverlayPanel>

  <!-- Deletion confirmation dialog -->
  <Dialog
    v-model:visible="deleting"
    :closable="false"
    :header="$t('caption.confirmation')"
    :modal="true"
    :base-z-index="2"
    :draggable="false"
  >
    <div>
      <font-awesome-icon
        icon="exclamation-triangle"
        class="build-warning-icon"
      />
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

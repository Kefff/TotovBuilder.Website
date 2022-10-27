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
          <div>
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
          </div>
          <Button
            v-if="!editing"
            v-tooltip.right="$t('caption.backToBuilds')"
            class="toolbar-button"
            @click="goToBuilds()"
          >
            <font-awesome-icon icon="arrow-left" />
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
          <ShareBuild :build="build" />
          <Button
            v-tooltip.top="$t('caption.moreFunctionalities')"
            class="p-button-text p-button-sm button-discreet build-functionalities-button"
            @click="toggleAdvancedPanel"
          >
            <font-awesome-icon icon="cog" />
          </Button>
          <NotificationButton />
          <Button
            v-tooltip.top="$t('caption.collapseAll')"
            class="p-button-text p-button-sm button-discreet"
            @click="collapseAll()"
          >
            <font-awesome-icon icon="minus-square" />
          </Button>
          <Button
            v-tooltip.top="$t('caption.expandWithItem')"
            class="p-button-text p-button-sm button-discreet"
            @click="expandWithItem()"
          >
            <font-awesome-icon icon="search-plus" />
          </Button>
          <Button
            v-tooltip.top="$t('caption.expandAll')"
            class="p-button-text p-button-sm button-discreet"
            @click="expandAll()"
          >
            <font-awesome-icon icon="plus-square" />
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
            <div
              v-if="summary.ammunitionCounts.length > 0"
              v-tooltip.top="$t('caption.ammunitionList')"
            >
              <Button
                class="toolbar-button"
                @click="toggleAmmunitionCounts"
              >
                <img
                  src="/assets/caliber.webp"
                  class="custom-icon build-caliber-icon"
                >
              </Button>
            </div>
          </div>
        </div>
        <div class="toolbar-part">
          <div class="build-toolbar-right">
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

  <!-- Ammunition counts -->
  <OverlayPanel
    ref="ammunitionCountsPanel"
    :dismissable="true"
  >
    <div
      v-for="ammunitionCount of summary.ammunitionCounts"
      :key="ammunitionCount.id"
      class="build-toolbar-ammunition-count"
    >
      <div class="build-toolbar-ammunition-count-count">
        {{ ammunitionCount.count.toLocaleString() }}
      </div>
      <div>{{ ammunitionCount.name }}</div>
    </div>
  </OverlayPanel>

  <!-- Advanced panel -->
  <OverlayPanel
    ref="advancedPanel"
    :dismissable="true"
  >
    <div class="build-advanced-panel">
      <div
        :class="'build-advanced-panel-item' + (editing ? ' p-disabled' : '')"
        @click="copy()"
      >
        <font-awesome-icon
          icon="copy"
          class="icon-before-text"
        />
        <span>{{ $t('caption.copy') }}</span>
      </div>
      <div
        :class="'build-advanced-panel-item' + (editing ? ' p-disabled' : '')"
        @click="exportBuild()"
      >
        <font-awesome-icon
          icon="file-export"
          class="icon-before-text"
        />
        <span>{{ $t('caption.export') }}</span>
      </div>
      <div class="build-advanced-panel-item">
        <LanguageSelector />
      </div>
      <div
        class="build-advanced-panel-item build-merchant-filter"
      >
        <MerchantFilter />
      </div>
    </div>
  </OverlayPanel>

  <!-- Deletion confirmation dialog -->
  <Dialog
    v-model:visible="deleting"
    :closable="false"
    :header="$t('caption.confirmation')"
    :modal="true"
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
        class="p-button-text"
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

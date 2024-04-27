<template>
  <Dialog
    v-model:visible="hasChangelogDisplayed"
    :closable="true"
    :close-on-escape="true"
    :dismissable-mask="true"
    :draggable="false"
    :header="$t('caption.changelog')"
    :modal="true"
  >
    <div class="changelog">
      <Loading v-show="isLoading" />
      <div v-if="!isLoading && changelogs.length > 0">
        <div
          v-for="changelog of changelogs"
          :key="changelog.version"
          class="changelog-element"
        >
          <div class="changelog-title">
            <span>{{ $t('caption.changelogTitle', { date: changelog.date.toLocaleDateString(), version: changelog.version }) }}</span>
            <span
              v-if="changelog.isNew"
              class="changelog-new"
            >
              {{ $t('caption.new') }}
            </span>
          </div>
          <ul>
            <li
              v-for="(change, index) of changelog.changes"
              :key="index"
              class="changelog-change"
            >
              {{ change.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" src="./ChangelogComponent.ts" />
<style lang="css" src="./ChangelogComponent.css" />
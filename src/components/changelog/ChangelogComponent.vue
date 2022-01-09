<template>
  <div
    v-if="hasNewVersion"
    class="changelog-notification"
  >
    <div>
      <div class="changelog-notification-element">
        <span class="changelog-notification-message">{{ $t('message.newVersion', { newVersion: currentVersion }) }}</span>
      </div>
      <div class="changelog-notification-element">
        <a
          class="link"
          :disabled="hasChangelogDisplayed"
          @click="showChangelog()"
        >
          {{ $t('caption.seeChanges') }}
        </a>
        <font-awesome-icon
          class="changelog-notification-dismiss-icon"
          icon="times"
          @click="dismissNotification()"
        />
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="hasChangelogDisplayed"
    :closable="true"
    :header="$t('caption.changelog')"
    :modal="true"
    @hide="closeChangelog()"
  >
    <div class="changelog">
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
  </Dialog>
</template>

<script lang="ts" src="./ChangelogComponent.ts" />
<style lang="css" src="./ChangelogComponent.css" />
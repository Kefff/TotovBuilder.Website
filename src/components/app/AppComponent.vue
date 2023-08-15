<template>
  <div class="app-title">
    <div>
      <img
        v-tooltip.bottom="$t('caption.approvedByPrapor')"
        :src="isSanta ? '/assets/santa_prapor_smiling.webp' : '/assets/prapor_smiling.webp'"
        class="app-title-prapor"
      >
      <h1>
        <div class="app-title-part1">
          TOTOV
        </div>
        <div class="app-title-part2">
          BUILDER
        </div>
      </h1>
    </div>
  </div>
  <Changelog
    v-if="!isLoading"
    v-model="hasChangelogDisplayed"
  />
  <router-view />
  <div class="app-footer">
    <div class="app-footer-line">
      <div class="app-footer-element">
        <font-awesome-icon
          icon="envelope"
          class="app-footer-element-icon"
        />
        <a
          :href="'mailto:' + contactAddress"
          class="link"
        >{{ $t('caption.contact') }}</a>
      </div>
      <div class="app-footer-element">
        <font-awesome-icon
          :icon="['fab', 'discord']"
          class="app-footer-element-icon"
        />
        <a
          :href="discordUrl"
          target="_blank"
          class="link"
        >{{ $t('caption.discord') }}</a>
      </div>
      <div class="app-footer-element">
        <font-awesome-icon
          icon="bug"
          class="app-footer-element-icon"
        />
        <a
          :href="bugReportUrl"
          target="_blank"
          class="link"
        >{{ $t('caption.reportBug') }}</a>
      </div>
      <div class="app-footer-element">
        <font-awesome-icon
          icon="clipboard-list"
          class="app-footer-element-icon"
        />
        <a
          class="link"
          @click="displayChangelog()"
        >
          {{ $t('caption.changelog') }}
        </a>
      </div>
      <div class="app-footer-element">
        <font-awesome-icon
          :icon="['fab', 'github']"
          class="app-footer-element-icon"
        />
        <a
          :href="githubUrl"
          target="_blank"
          class="link"
        >{{ $t('caption.github') }}</a>
      </div>
    </div>
    <div class="app-footer-line">
      <div class="app-api-disclaimer">
        <span>
          {{ $t('message.apiDisclaimer1') }}
          <a
            href="https://tarkov.dev/"
            target="_blank"
            class="link"
          >
            {{ $t('message.apiDisclaimer2') }}
          </a>.
          {{ $t('message.apiDisclaimer3') }}
          <a
            href="https://opencollective.com/tarkov-dev"
            target="_blank"
            class="link"
          >
            {{ $t('message.apiDisclaimer4') }}
          </a>.
        </span>
      </div>
    </div>
    <div class="app-footer-line">
      <div class="app-api-disclaimer">
        <span>{{ $t('message.battleStateDisclaimer1') }}</span>
        <span>{{ $t('message.battleStateDisclaimer2') }}</span>
      </div>
    </div>
    <div class="app-footer-line">
      <div class="app-api-disclaimer">
        © {{ copyrightYear }} Kefff
      </div>
    </div>

    <Notification />
  </div>
</template>

<script lang="ts" src="./AppComponent.ts" />
<style lang="css" src="./AppComponent.css" />
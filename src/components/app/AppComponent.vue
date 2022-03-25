<template>
  <div class="app-title">
    <h1>
      <div class="app-title-part1">
        TOTOV
      </div>
      <img
        v-tooltip.bottom="$t('caption.approvedByPrapor')"
        :src="isSanta ? '/assets/santa_prapor_smiling.webp' : '/assets/prapor_smiling.webp'"
        class="app-title-prapor"
      >
      <div class="app-title-part2">
        BUILDER
      </div>
    </h1>
  </div>
  <Changelog v-model="hasChangelogDisplayed" />
  <router-view />
  <div class="app-footer">
    <div class="app-footer-line">
      <div class="app-footer-element">
        <font-awesome-icon
          :icon="['fab', 'discord']"
          class="app-footer-element-icon"
        />
        <a
          :href="discordLink"
          target="_blank"
          class="link"
        >{{ $t('caption.discord') }}</a>
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
          icon="bug"
          class="app-footer-element-icon"
        />
        <a
          :href="reportBugAddress"
          target="_blank"
          class="link"
        >{{ $t('caption.reportBug') }}</a>
      </div>
      <div class="app-footer-element">
        <font-awesome-icon
          :icon="['fab', 'github']"
          class="app-footer-element-icon"
        />
        <a
          :href="githubAddress"
          target="_blank"
          class="link"
        >{{ $t('caption.github') }}</a>
      </div>
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
    </div>
    <div class="app-footer-line">
      <div class="app-tarkov-market-disclaimer">
        <span>
          {{ $t('message.tarkovMarketDisclaimer1') }}
          <a
            href="https://tarkov.dev/"
            target="_blank"
            class="link"
          >{{ $t('message.tarkovMarketDisclaimer2') }}</a>.
        </span>
        <!-- <span>
          {{ $t('message.tarkovMarketDisclaimer3') }}
          <a
            class="link"
            href="https://www.patreon.com/kokarn"
            target="_blank"
          >
            <span class="app-tarkov-market-disclaimer-patreon-link">
              <img
                src="/assets/patreon.webp"
                :title="$t('caption.patreon')"
                class="app-tarkov-market-disclaimer-patreon-icon"
              >
              <span>Patreon</span>
            </span>
          </a>.
        </span> -->
      </div>
    </div>
    <div class="app-footer-line">
      <div class="app-tarkov-market-disclaimer">
        <span>{{ $t('message.battleStateDisclaimer1') }}</span>
        <span>{{ $t('message.battleStateDisclaimer2') }}</span>
      </div>
    </div>
    <div class="app-footer-line">
      <div class="app-tarkov-market-disclaimer">
        © {{ copyrightYear }} Kefff
      </div>
    </div>
  </div>

  <Notification />
</template>

<script lang="ts" src="./AppComponent.ts" />
<style lang="css" src="./AppComponent.css" />
<template>
  <div class="app-container">
    <div class="app-title">
      <div>
        <Tooltip :tooltip="$t('caption.approvedByPrapor')">
          <img
            :src="isSanta ? Images.santaPraporSmiling : Images.praporSmiling"
            class="app-title-prapor"
          >
        </Tooltip>
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
    <div class="app-content">
      <router-view />
    </div>
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
          </span>
        </div>
        <div class="app-api-disclaimer">
          <span>
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
    </div>
  </div>

  <!-- Global sidebars -->
  <GlobalSidebar position="left" />
  <GlobalSidebar position="right" />

  <!-- Loading error -->
  <LoadingError />

  <!-- Notification -->
  <Notification />
</template>










<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue'
import Images from '../images'
import vueI18n from '../plugins/vueI18n'
import { GeneralOptionsService } from '../services/GeneralOptionsService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { NotificationService, NotificationType } from '../services/NotificationService'
import { VersionService } from '../services/VersionService'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../services/repository/ServiceInitializationState'
import Services from '../services/repository/Services'
import LanguageUtils from '../utils/LanguageUtils'
import LoadingError from './LoadingErrorComponent.vue'
import Notification from './NotificationComponent.vue'
import GlobalSidebar from './sidebar/GlobalSidebarComponent.vue'

const _versionService = Services.get(VersionService)
const _websiteConfigurationService = Services.get(WebsiteConfigurationService)

const _isTouchScreen = matchMedia('(hover: none)').matches

const bugReportUrl = ref<string>()
const contactAddress = ref<string>()
const discordUrl = ref<string>()
const githubUrl = ref<string>()
const hasNewVersion = ref(false)
const loading = ref(true)
const version = ref('1.0.0')

const copyrightYear = computed(() => {
  const year = new Date().getFullYear()
  let text = '2021'

  if (year > 2021) {
    text += '-' + year
  }

  return text
})
const isSanta = computed(() => {
  const date = new Date()
  const santaMinDate = new Date(date.getFullYear(), 11, 21).getTime()
  const santaMaxDate = new Date(date.getFullYear(), 11, 29, 23, 59, 59).getTime()

  return date.getTime() >= santaMinDate && date.getTime() <= santaMaxDate
})

provide('isTouchScreen', _isTouchScreen) // cf. https://stackoverflow.com/a/63666289

onMounted(() => {
  if (_websiteConfigurationService.initializationState === ServiceInitializationState.initializing) {
    _websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)
    loading.value = true
  } else {
    onWebsiteConfigurationServiceInitialized()
  }

  setLanguage()
})

/**
 * Displays the changelog.
 */
function displayChangelog() {
  Services.get(GlobalSidebarService).display({
    displayedComponentType: 'ChangelogSidebar',
    position: 'right'
  })
}

/**
 * Displays the new version notification.
 */
function displayNewVersionNotification() {
  Services.get(NotificationService).notify(
    NotificationType.information,
    vueI18n.t('message.newVersion', { newVersion: version.value }),
    0,
    [
      {
        action: () => displayChangelog(),
        caption: vueI18n.t('caption.seeChanges'),
        icon: undefined,
        name: 'seeChanges',
        type: NotificationType.success
      }
    ],
    true)
}

/**
 * Reacts to the website configuration service being initialized.
 */
async function onWebsiteConfigurationServiceInitialized() {
  bugReportUrl.value = _websiteConfigurationService.configuration.bugReportUrl
  contactAddress.value = _websiteConfigurationService.configuration.contactAddress
  discordUrl.value = _websiteConfigurationService.configuration.discordUrl
  githubUrl.value = _websiteConfigurationService.configuration.githubUrl

  Services.get(GeneralOptionsService).getAllowCookiesIndicator() // Used to trigger the allow cookie check and display a notification

  await _versionService.getVersion().then(v => version.value = v)
  hasNewVersion.value = await _versionService.checkHasNewVersion()

  if (hasNewVersion.value) {
    displayNewVersionNotification()
  }

  if (_websiteConfigurationService.configuration.postUpdatePeriod) {
    Services.get(NotificationService).notify(NotificationType.information, vueI18n.t('message.postUpdatePeriod'), 0)
  }
}

/**
 * Sets the language.
 */
function setLanguage() {
  const language = localStorage.getItem(Services.get(WebsiteConfigurationService).configuration.languageStorageKey) ?? 'en'
  LanguageUtils.setLanguage(language)
}
</script>










<style>
body {
  background-color: var(--surface-transparent-0);
  backdrop-filter: blur(2px);
  /* Required for the #app to be able to use height:100% */
  display: flex;
  font-size: 1rem;
  height: 100%;
  margin: 0;
  overflow: hidden;
  width: 100%;
}

h1 {
  font-size: 3rem;
  margin: 0;
  /* Required for Chrome, otherwise letters are overlapping */
  letter-spacing: 2px;
  /* Required for Chrome and Firefox to have the same behaviour */
  line-height: 3rem;
}

html {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  background-color: var(--surface-0);
  background-image: url('../../assets/images/Background.webp');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
  color: var(--text-color);
  font-family: var(--font-main);
  font-size: 14px;
  height: 100%;
  letter-spacing: 0.25px;
  /* Required otherwise the right Sidebar breaks the layout while its open animation plays */
  position: fixed;
  scrollbar-color: var(--primary-color3) rgba(0, 0, 0, 0);
  width: 100%;
}

html * {
  scrollbar-width: thin;
}

#app {
  display: flex;
  justify-content: center;
  overflow: auto;
  width: 100%;
}

.p-button {
  min-width: initial !important;
}
</style>

<style scoped>
@import '../css/link.css';

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 137rem;
  padding-left: 1rem;
  padding-right: 1rem;
  width: 100%;
}

.app-api-disclaimer {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 0.85rem;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.app-api-disclaimer > span {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
}

.app-api-disclaimer > span > a {
  margin-left: 0.25rem;
}

.app-content {
  align-items: center;
  display: flex;
  flex-grow: 2;
  justify-content: center;
  padding-bottom: 3rem;
  padding-top: 3rem;
  width: 100%;
}

.app-footer {
  display: flex;
  flex-direction: column;
}

.app-footer-line {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
  margin-left: auto;
  margin-right: auto;
}

.app-footer-element {
  align-items: center;
  display: flex;
  flex-direction: row;
  font-size: 1rem;
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  text-align: center;
}

.app-footer-element-icon {
  margin-right: 0.5rem;
}

.app-title {
  display: flex;
  font-family: var(--font-title);
  justify-content: center;
}

.app-title > div {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
}

.app-title > div > h1 {
  font-size: 2.475rem;
}

.app-title-part1 {
  margin-left: 0.5rem;
  font-style: italic;
}

.app-title-part2 {
  color: var(--error-color);
  margin-left: 0.5rem;
}

.app-title-prapor {
  height: 4.5rem;
  width: 4.5rem;
}
</style>
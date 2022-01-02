<template>
  <div class="welcome">
    <div>
      <div>
        <h2>{{ $t('message.welcome1') }}Totov <span class="welcome-builder">Builder</span>{{ $t('message.welcome2') }}</h2>
        <p>Totov <span class="welcome-builder">Builder</span>{{ $t('message.welcome3') }}</p>
        <p>{{ $t('message.welcome4') }}</p>
        <p>{{ $t('message.welcome5') }}</p>
        <p>{{ $t('message.welcome6') }}</p>
      </div>
      <div class="welcome-warning">
        <h3 class="welcome-warning-title">
          <font-awesome-icon
            icon="exclamation-triangle"
            class="welcome-warning-icon"
          />
          {{ $t('message.welcomeWarning1') }}
        </h3>
        <p class="welcome-warning-text">
          {{ $t('message.welcomeWarning2') }} <span><font-awesome-icon icon="cog" /> {{ $t('caption.export') }}</span> {{ $t('message.welcomeWarning3') }}
        </p>
        <p class="welcome-warning-lost">
          {{ $t('message.welcomeWarning4') }}
        </p>
        <p class="welcome-warning-text">
          {{ $t('message.welcomeWarning5') }} <span><font-awesome-icon icon="cog" /> {{ $t('caption.import') }}</span>  {{ $t('message.welcomeWarning6') }}
        </p>
      </div>
      <div class="welcome-actions">
        <div class="welcome-actions-list">
          <div class="welcome-action">
            <h2>{{ $t('message.welcomeChooseLanguage') }}</h2>
            <LanguageSelector />
          </div>
          <div
            v-if="hasBuilds"
            class="welcome-action"
          >
            <h2>{{ $t('message.welcomeContinue') }}</h2>
            <Button
              class="welcome-button"
              @click="displayBuilds()"
            >
              <font-awesome-icon
                icon="list"
                class="icon-before-text"
              />
              <span>{{ $t('caption.showBuilds') }}</span>
            </Button>
          </div>
          <div
            v-else
            class="welcome-action"
          >
            <h2>{{ $t('message.welcomeGetStarted') }}</h2>
            <Button
              class="welcome-button"
              @click="openNewBuild()"
            >
              <font-awesome-icon
                icon="plus"
                class="icon-before-text"
              />
              <span>{{ $t('caption.createNewBuild') }}</span>
            </Button>
            <Button
              class="welcome-button"
              @click="showBuildsImportPopup()"
            >
              <font-awesome-icon
                icon="file-import"
                class="icon-before-text"
              />
              <span>{{ $t('caption.importBuilds') }}</span>
            </Button>
          </div>
        </div>
        <div class="welcome-actions-list">
          <div class="welcome-action">
            <h2>{{ $t('message.welcomeConfigureMerchants') }}</h2>
            <MerchantFilter :show-title="false" />
          </div>
        </div>
      </div>
    </div>

    <!-- Import -->
    <BuildsImport
      v-model="isImporting"
      v-model:has-imported="hasImported"
    />
  </div>
</template>

<script lang="ts" src="./WelcomeComponent.ts" />
<style scoped lang="css" src="./WelcomeComponent.css" />
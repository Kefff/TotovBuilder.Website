<template>
  <div class="welcome">
    <div>
      <div
        v-if="!hasBuilds"
        class="welcome-text"
      >
        <h2>{{ $t('message.welcome1') }}Totov <span class="welcome-builder">Builder</span>{{ $t('message.welcome2') }}</h2>
        <p>Totov <span class="welcome-builder">Builder</span>{{ $t('message.welcome3') }}</p>
        <p>{{ $t('message.welcome4') }}</p>
        <p>{{ $t('message.welcome5') }}</p>
        <p>{{ $t('message.welcome6') }}</p>
      </div>
      <div
        v-else
        class="welcome-text"
      >
        <h2>{{ $t('message.welcomeBack') }}</h2>
      </div>
      <div
        v-show="isLoading"
        class="welcome-loading"
      >
        <Loading />
      </div>
      <div
        v-show="!isLoading && !isImporting"
        class="welcome-actions"
      >
        <div
          v-if="hasBuilds"
          class="welcome-action"
        >
          <Button
            class="welcome-button"
            @click="displayBuilds()"
          >
            <font-awesome-icon
              icon="list"
              class="icon-before-text"
            />
            <span>{{ $t('message.welcomeShowBuilds') }}</span>
          </Button>
        </div>
        <div
          v-if="!hasBuilds"
          class="welcome-action"
        >
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
        </div>
        <div
          v-if="!hasBuilds"
          class="welcome-action"
        >
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
        <div class="welcome-action">
          <Button
            class="welcome-button"
            @click="displayMerchantItemsOptions()"
          >
            <font-awesome-icon
              icon="user-tag"
              class="icon-before-text"
            />
            <span>{{ $t('message.welcomeConfigureMerchants') }}</span>
          </Button>
        </div>
        <div class="welcome-action">
          <Button
            class="welcome-button"
            @click="displayGeneralOptions()"
          >
            <font-awesome-icon
              icon="language"
              class="icon-before-text"
            />
            <span>{{ $t('message.welcomeChooseLanguage') }}</span>
          </Button>
        </div>
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
          {{ $t('message.welcomeWarning2') }} <span><font-awesome-icon icon="file-export" /> {{ $t('caption.exportBuilds') }}</span> {{ $t('message.welcomeWarning3') }}
        </p>
        <p class="welcome-warning-lost">
          {{ $t('message.welcomeWarning4') }}
        </p>
        <p class="welcome-warning-text">
          {{ $t('message.welcomeWarning5') }} <span><font-awesome-icon icon="file-import" /> {{ $t('caption.importBuilds') }}</span> {{ $t('message.welcomeWarning6') }}
        </p>
      </div>
    </div>

    <!-- Import -->
    <BuildsImport
      v-if="!isLoading"
      v-model:is-importing="isImporting"
      v-model:has-imported="hasImported"
    />
  </div>
</template>

<script lang="ts" src="./WelcomeComponent.ts" />
<style scoped lang="css" src="./WelcomeComponent.css" />
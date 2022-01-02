<template>
  <Button
    v-if="!editing"
    @click="share()"
  >
    <font-awesome-icon
      icon="share-alt"
      class="icon-before-text"
    />
    <span>{{ $t('caption.share') }}</span>
  </Button>

  <Dialog
    v-model:visible="isSharing"
    :closable="true"
    :header="$t('message.shareBuild', { name: build.name })"
    :modal="true"
    @hide="closeSharingDialog()"
  >
    <div>
      {{ $t('message.shareBuildExplanation') }}
    </div>
    <div class="build-share">
      <InputTextField
        v-model="shareLink"
        :caption="$t('caption.link')"
        caption-mode="placeholder"
        class="build-share-input"
        @update:modelValue="onUpdateShareLink()"
      />
      <Button
        v-tooltip.top="$t('caption.copyLink')"
        class="build-share-button"
        @click="copyLink()"
      >
        <font-awesome-icon
          icon="copy"
        />
      </Button>
    </div>
  </Dialog>
</template>

<script lang="ts" src="./BuildShareComponent.ts" />
<style scoped lang="css" src="./BuildShareComponent.css" />
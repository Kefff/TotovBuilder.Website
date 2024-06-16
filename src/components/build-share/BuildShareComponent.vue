<template>
  <div>
    <Tooltip
      :tooltip="$t('caption.share')"
      :apply-hover-style="false"
    >
      <Button
        class="p-button-text p-button-sm button-discreet"
        :disabled="editing"
        @click="share()"
      >
        <font-awesome-icon icon="share-alt" />
      </button>
    </Tooltip>
  </div>

  <Dialog
    v-model:visible="isSharing"
    :closable="true"
    :header="$t('message.shareBuild', { name: build.name })"
    :modal="true"
    :draggable="false"
    @hide="closeSharingDialog()"
  >
    <div>
      {{ $t('message.shareBuildExplanation') }}
    </div>
    <div class="build-share">
      <InputTextField
        v-model:value="shareLink"
        :caption="$t('caption.link')"
        caption-mode="placeholder"
        class="build-share-input"
      />
      <Tooltip
        :tooltip="$t('caption.copyLink')"
        :apply-hover-style="false"
      >
        <Button
          class="build-share-button"
          @click="copyLink()"
        >
          <font-awesome-icon icon="copy" />
        </Button>
      </Tooltip>
    </div>
  </Dialog>
</template>

<script lang="ts" src="./BuildShareComponent.ts" />
<style scoped lang="css" src="./BuildShareComponent.css" />
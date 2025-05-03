<script setup lang="ts">
import { computed } from 'vue'
import { IShareButton } from '../models/utils/IShareButton'
import { ShareButtons } from '../models/utils/ShareButtons'
import Services from '../services/repository/Services'
import { SeoService } from '../services/SeoService'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import Tooltip from './TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    getDescriptionFunction?: () => Promise<string | undefined>
    getTitleFunction?: () => Promise<string | undefined>
    getUrlToShareFunction: () => Promise<string | undefined>
  }>(),
  {
    getDescriptionFunction: () => Promise.resolve(Services.get(SeoService).description),
    getTitleFunction: () => Promise.resolve(Services.get(SeoService).title)
  })

const shareButtons = computed(() => {
  let buttons = Object.keys(ShareButtons).map(key => ShareButtons[key as keyof typeof ShareButtons]) as IShareButton[]

  if (!WebBrowserUtils.isTouchScreen().value) {
    buttons = buttons.filter(b => !b.mobileOnly)
  }

  buttons = buttons.sort((b1, b2) => b1.position - b2.position)

  return buttons
})

/**
 * Reacts to the click on a share button.
 *
 * Gets the URL to use to share and opens it.
 * @param shareButton - Clicked share button.
 */
async function onClickAsync(shareButton: IShareButton): Promise<void> {
  const urlToShare = await props.getUrlToShareFunction()

  if (urlToShare == null) {
    return
  }

  const description = await props.getDescriptionFunction?.()
  const title = await props.getTitleFunction?.()
  shareButton.onClick(urlToShare, description, title)
}
</script>










<template>
  <div class="share-buttons">
    <Tooltip
      v-for="shareButton of shareButtons"
      :key="shareButton.name"
      :tooltip="$t(shareButton.tooltip)"
      :disabled-on-mobile="true"
    >
      <a
        class="link"
        :style="`color: ${shareButton.iconColor};`"
        @click="() => onClickAsync(shareButton)"
      >
        <font-awesome-icon
          v-if="shareButton.iconName != null"
          :icon="shareButton.iconName"
        />
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            :d="shareButton.iconSvgData"
          />
        </svg>
      </a>
    </Tooltip>
  </div>
</template>










<style scoped>
.share-buttons {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: center;
  font-size: 1.5rem;
  flex-wrap: wrap;
  width: 100%;
}

.share-buttons a {
  align-items: center;
  display: flex;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
}
</style>
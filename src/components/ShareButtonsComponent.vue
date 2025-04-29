<script setup lang="ts">
import { SocialMedia, SocialMedias } from '../models/utils/SocialMedias'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import Tooltip from './TooltipComponent.vue'

const props = defineProps<{ getUrlToShareFunction: () => Promise<string | undefined> }>()

/**
 * Reacts to the click on a share button.
 *
 * Gets the URL to use to share and opens it.
 */
async function onClickAsync(socialMedia: SocialMedia | 'link'): Promise<void> {
  const urlToShare = await props.getUrlToShareFunction()

  if (urlToShare == null) {
    return
  }

  if (socialMedia === 'link') {
    WebBrowserUtils.copyToClipboardAsync(urlToShare)

    return
  }

  const socialMediaUrl = SocialMedias.getSocialMediaShareUrl(socialMedia, urlToShare)
  window.open(socialMediaUrl, '_blank')
}
</script>










<template>
  <div class="share-buttons">
    <Tooltip
      :tooltip="$t('caption.shareByLink')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-link"
        @click="() => onClickAsync('link')"
      >
        <font-awesome-icon :icon="['fas', 'link']" />
      </a>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.shareOnDiscord')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-discord"
        @click="() => onClickAsync(SocialMedias.discord.name)"
      >
        <font-awesome-icon :icon="['fab', SocialMedias.discord.iconName]" />
      </a>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.shareOnReddit')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-reddit"
        @click="() => onClickAsync(SocialMedias.reddit.name)"
      >
        <font-awesome-icon :icon="['fab', SocialMedias.reddit.iconName]" />
      </a>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.shareOnWhatsapp')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-whatsapp"
        @click="() => onClickAsync(SocialMedias.whatsapp.name)"
      >
        <font-awesome-icon :icon="['fab', SocialMedias.whatsapp.iconName]" />
      </a>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.shareOnMessenger')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-messenger"
        @click="() => onClickAsync(SocialMedias.messenger.name)"
      >
        <font-awesome-icon :icon="['fab', SocialMedias.messenger.iconName]" />
      </a>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.shareOnTelegram')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-telegram"
        @click="() => onClickAsync(SocialMedias.telegram.name)"
      >
        <font-awesome-icon :icon="['fab', SocialMedias.telegram.iconName]" />
      </a>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.shareOnTwitter')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-twitter"
        @click="() => onClickAsync(SocialMedias.twitter.name)"
      >
        <font-awesome-icon :icon="['fab', SocialMedias.twitter.iconName]" />
      </a>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.shareOnBluesky')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-bluesky"
        @click="() => onClickAsync(SocialMedias.bluesky.name)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2c-18.2 64.8-84.4 81.4-143.3 71.3C456 322 482.2 380 425.6 438c-107.4 110.2-154.3-27.6-166.3-62.9c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z"
          />
        </svg>
      </a>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.shareOnMastodon')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-mastodon"
        @click="() => onClickAsync(SocialMedias.mastodon.name)"
      >
        <font-awesome-icon :icon="['fab', SocialMedias.mastodon.iconName]" />
      </a>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.shareOnFacebook')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-facebook"
        @click="() => onClickAsync(SocialMedias.facebook.name)"
      >
        <font-awesome-icon :icon="['fab', SocialMedias.facebook.iconName]" />
      </a>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.shareOnVKontakte')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-vk"
        @click="() => onClickAsync(SocialMedias.vKontakte.name)"
      >
        <font-awesome-icon :icon="['fab', SocialMedias.vKontakte.iconName]" />
      </a>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.shareOnWeChat')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-weixin"
        @click="() => onClickAsync(SocialMedias.weChat.name)"
      >
        <font-awesome-icon :icon="['fab', SocialMedias.weChat.iconName]" />
      </a>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.shareByMail')"
      :disabled-on-mobile="true"
    >
      <a
        class="link share-buttons-mail"
        @click="() => onClickAsync(SocialMedias.mail.name)"
      >
        <font-awesome-icon :icon="SocialMedias.mail.iconName" />
      </a>
    </tooltip>
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

.share-buttons-bluesky {
  color: #0085ff;
}

.share-buttons-discord {
  color: #5865f2;
}

.share-buttons-whatsapp {
  color: #25d366;
}

.share-buttons-facebook {
  color: #0866ff;
}

.share-buttons-link {
  color: white;
  font-size: 1.25rem;
}

.share-buttons-mail {
  color: white;
  font-size: 1.25rem;
}

.share-buttons-mastodon {
  color: #5b4be1;
}

.share-buttons-messenger {
  color: #0866ff;
}

.share-buttons-reddit {
  color: #ff4500;
}

.share-buttons-telegram {
  color: #3390ec;
}

.share-buttons-twitter {
  color: #249ef1;
}

.share-buttons-vk {
  color: #0079fe;
}

.share-buttons-weixin {
  color: #2aae67;
}
</style>
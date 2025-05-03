/* eslint-disable no-irregular-whitespace */
import vueI18n from '../../plugins/vueI18n'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import { IShareButton, ShareButtonTarget } from './IShareButton'

/**
 * Represents the definition of share buttons.
 */
export class ShareButtons {
  /**
   * Bluesky.
   */
  public static bluesky: IShareButton = {
    iconColor: '#0085ff',
    iconSvgData: 'M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2c-18.2 64.8-84.4 81.4-143.3 71.3C456 322 482.2 380 425.6 438c-107.4 110.2-154.3-27.6-166.3-62.9c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z',
    mobileOnly: false,
    name: ShareButtonTarget.bluesky,
    position: 7,
    tooltip: vueI18n.t('caption.shareOnBluesky'),
    onClick: (urlToShare: string, title?: string, text?: string) => {
      const isMobile = WebBrowserUtils.isTouchScreen().value
      const url = isMobile
        ? `bluesky://intent/compose?text=${title}\n${text}\n${urlToShare}`
        : `https://bsky.app/intent/compose?text=${title}\n${text}\n${urlToShare}`
      window.open(url)
    }
  }

  /**
   * Discord.
   */
  public static discord: IShareButton = {
    iconColor: '#5865f2',
    iconName: ['fab', 'discord'],
    mobileOnly: false,
    name: ShareButtonTarget.discord,
    position: 1,
    tooltip: vueI18n.t('caption.shareOnDiscord'),
    onClick: (urlToShare: string, title?: string, text?: string) => {
      // TODO
    }
  }

  /**
   * Facebook.
   */
  public static facebook: IShareButton = {
    iconColor: '#0866ff',
    iconName: ['fab', 'facebook'],
    mobileOnly: false,
    name: ShareButtonTarget.facebook,
    position: 8,
    tooltip: vueI18n.t('caption.shareOnFacebook'),
    onClick: (urlToShare: string) => {
      const url = encodeURI(`https://www.facebook.com/sharer.php?u=${urlToShare}`)
      window.open(url)
    }
  }

  /**
   * Mail.
   */
  public static link: IShareButton = {
    iconColor: 'white',
    iconName: ['fas', 'link'],
    mobileOnly: false,
    name: ShareButtonTarget.link,
    position: 0,
    tooltip: vueI18n.t('caption.shareByMail'),
    onClick: (urlToShare: string) => WebBrowserUtils.copyToClipboardAsync(urlToShare)
  }

  /**
   * Mail.
   */
  public static mail: IShareButton = {
    iconColor: 'white',
    iconName: ['fas', 'envelope'],
    mobileOnly: false,
    name: ShareButtonTarget.mail,
    position: 10,
    tooltip: vueI18n.t('caption.shareByMail'),
    onClick: (urlToShare: string, title?: string, text?: string) => {
      const url = encodeURI(`mailto:?subject=${title}&body=${title}\n${text}\n${urlToShare}"`)
      window.open(url)
    }
  }

  /**
   * Messenger.
   */
  public static messenger: IShareButton = {
    iconColor: '#0866ff',
    iconName: ['fab', 'facebook-messenger'],
    mobileOnly: true,
    name: ShareButtonTarget.messenger,
    position: 4,
    tooltip: vueI18n.t('caption.shareOnMessenger'),
    onClick: (urlToShare: string) => {
      const url = encodeURI(`fb-messenger://share?link=${urlToShare}`)
      window.open(url)
    }
  }

  /**
   * Reddit.
   */
  public static reddit: IShareButton = {
    iconColor: '#ff4500',
    iconName: ['fab', 'reddit-alien'],
    mobileOnly: false,
    name: ShareButtonTarget.reddit,
    position: 2,
    tooltip: vueI18n.t('caption.shareOnReddit'),
    onClick: (urlToShare: string, title?: string, text?: string) => {
      const url = encodeURI(`https://www.reddit.com/submit?url=${urlToShare}&title=${title}\n${text}`)
      window.open(url)
    }
  }

  /**
   * Sms.
   */
  public static sms: IShareButton = {
    iconColor: 'white',
    iconName: ['fas', 'sms'],
    mobileOnly: true,
    name: ShareButtonTarget.sms,
    position: 9,
    tooltip: vueI18n.t('caption.shareBySms'),
    onClick: (urlToShare: string, title?: string, text?: string) => {
      const url = encodeURI(`sms:?body=${title}\n${text}\n${urlToShare}`)
      window.open(url)
    }
  }

  /**
   * Telegram.
   */
  public static telegram: IShareButton = {
    iconColor: '#3390ec',
    iconName: ['fab', 'telegram'],
    mobileOnly: false,
    name: ShareButtonTarget.telegram,
    position: 5,
    tooltip: vueI18n.t('caption.shareOnTelegram'),
    onClick: (urlToShare: string, title?: string, text?: string) => {
      const url = encodeURI(`https://t.me/share/url?url=${urlToShare}&text=${title}   ${text}`)
      window.open(url)
    }
  }

  /**
   * Twitter.
   */
  public static twitter: IShareButton = {
    iconColor: '#249ef1',
    iconName: ['fab', 'twitter'],
    mobileOnly: false,
    name: ShareButtonTarget.twitter,
    position: 6,
    tooltip: vueI18n.t('caption.shareOnTwitter'),
    onClick: (urlToShare: string, title?: string, text?: string) => {
      const url = encodeURI(`https://twitter.com/intent/tweet?url=${urlToShare}&text=${title}\n${text}`)
      window.open(url)
    }
  }

  /**
   * Whatsapp.
   */
  public static whatsapp: IShareButton = {
    iconColor: '#25d366',
    iconName: ['fab', 'whatsapp'],
    mobileOnly: false,
    name: ShareButtonTarget.whatsapp,
    position: 3,
    tooltip: vueI18n.t('caption.shareOnWhatsapp'),
    onClick: (urlToShare: string, title?: string, text?: string) => {
      const url = encodeURI(`whatsapp://send?text=${title}\n${text}\n${urlToShare}`)
      window.open(url)
    }
  }
}
/**
 * Supported targets for sharing buttons.
 */
export enum ShareButtonTarget {
  /**
   * Bluesky.
   */
  bluesky = 'bluesky',

  /**
   * Discord.
   */
  discord = 'discord',

  /**
   * Facebook.
   */
  facebook = 'facebook',

  /**
   * Link.
   */
  link = 'link',

  /**
   * Mail.
   */
  mail = 'mail',

  /**
   * Messenger.
   */
  messenger = 'messenger',
  /**
   * Reddit.
   */
  reddit = 'reddit',
  /**
   * Sms.
   */
  sms = 'sms',
  /**
   * Telegram.
   */
  telegram = 'telegram',
  /**
   * Twitter.
   */
  twitter = 'twitter',
  /**
   * Whatsapp.
   */
  whatsapp = 'whatsapp',
}

/**
 * Provides the functionalities of a button for sharing content.
 */
export interface IShareButton {
  /**
   * Color of the share button icon in CSS format.
   */
  iconColor: string,

  /**
   * Color of the share button icon.
   */
  iconName?: string[],

  /**
   * Data of the SVG share button icon. Only used when iconName is not provided.
   */
  iconSvgData?: string

  /**
   * Indicates whether sharing to this social media is only available on mobile.
   */
  mobileOnly: boolean,

  /**
   * Name.
   */
  name: ShareButtonTarget,

  /**
   * Position of the share button in the list of share buttons.
   */
  position: number

  /**
   * Tooltip displayed when hovering the share button.
   */
  tooltip: string

  /**
   * Action to execute when the share button is clicked.
   */
  onClick(urlToShare: string, title?: string, text?: string): void
}
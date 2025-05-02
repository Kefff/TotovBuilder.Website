/**
 * Supported media names.
 */
export enum SocialMedia {
  bluesky = 'bluesky',
  discord = 'discord',
  facebook = 'facebook',
  mail = 'mail',
  messenger = 'messenger',
  reddit = 'reddit',
  telegram = 'telegram',
  twitter = 'twitter',
  vKontakte = 'vKontakte',
  weChat = 'weChat',
  whatsapp = 'whatsapp',
}

/**
 * Provides the functionalities of a social media.
 */
export interface ISocialMedia {
  /**
   * Icon name.
   */
  iconName: string,

  /**
   * Name.
   */
  name: SocialMedia,

  /**
   * Indicates whether the link to share must be shortened.
   */
  useUrlShortener: boolean
}
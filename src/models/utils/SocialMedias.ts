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
 * Represents the supported social medias.
 */
export class SocialMedias {
  public static bluesky: ISocialMediaDefinition = {
    iconName: 'bluesky',
    name: SocialMedia.bluesky,
    useUrlShortener: false
  }

  public static discord: ISocialMediaDefinition = {
    iconName: 'discord',
    name: SocialMedia.discord,
    useUrlShortener: false
  }

  public static facebook: ISocialMediaDefinition = {
    iconName: 'facebook',
    name: SocialMedia.facebook,
    useUrlShortener: false
  }

  public static mail: ISocialMediaDefinition = {
    iconName: 'envelope',
    name: SocialMedia.mail,
    useUrlShortener: false
  }

  public static messenger: ISocialMediaDefinition = {
    iconName: 'facebook-messenger',
    name: SocialMedia.messenger,
    useUrlShortener: false
  }

  public static reddit: ISocialMediaDefinition = {
    iconName: 'reddit-alien',
    name: SocialMedia.reddit,
    useUrlShortener: false
  }

  public static telegram: ISocialMediaDefinition = {
    iconName: 'telegram',
    name: SocialMedia.telegram,
    useUrlShortener: false
  }

  public static twitter: ISocialMediaDefinition = {
    iconName: 'twitter',
    name: SocialMedia.twitter,
    useUrlShortener: true
  }

  public static vKontakte: ISocialMediaDefinition = {
    iconName: 'vk',
    name: SocialMedia.vKontakte,
    useUrlShortener: false
  }

  public static weChat: ISocialMediaDefinition = {
    iconName: 'weixin',
    name: SocialMedia.weChat,
    useUrlShortener: false
  }

  public static whatsapp: ISocialMediaDefinition = {
    iconName: 'whatsapp',
    name: SocialMedia.whatsapp,
    useUrlShortener: false
  }


  /**
 * Gets the URL for sharing a something on a social media.
 * @param socialMedia - Social media.
 * @param urlToShare - URL to share.
 */
  public static getSocialMediaShareUrl(socialMedia: SocialMedia, urlToShare: string, title?: string, description?: string): string {
    let socialMediaUrl = ''

    switch (socialMedia) {
      case SocialMedia.bluesky:
        socialMediaUrl = ''
        break
      case SocialMedia.discord:
        socialMediaUrl = ''
        break
      case SocialMedia.facebook:
        socialMediaUrl = `https://www.facebook.com/sharer.php?u=${urlToShare}`
        break
      case SocialMedia.mail:
        socialMediaUrl = ''
        break
      case SocialMedia.messenger:
        socialMediaUrl = ''
        break
      case SocialMedia.reddit:
        socialMediaUrl = ''
        break
      case SocialMedia.telegram:
        socialMediaUrl = ''
        break
      case SocialMedia.twitter:
        socialMediaUrl = `https://twitter.com/intent/tweet?url=${urlToShare}&text=${title}\n${description}\n`
        break
      case SocialMedia.vKontakte:
        socialMediaUrl = ''
        break
      case SocialMedia.weChat:
        socialMediaUrl = ''
        break
      case SocialMedia.whatsapp:
        socialMediaUrl = ''
        break
    }

    return encodeURI(socialMediaUrl)
  }
}

/**
 * Provides the functionalities of a social media definition.
 */
interface ISocialMediaDefinition {
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
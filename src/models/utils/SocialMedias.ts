import { ISocialMedia, SocialMedia } from './ISocialMedia'

/**
 * Represents the supported social medias.
 */
export class SocialMedias {
  public static bluesky: ISocialMedia = {
    iconName: 'bluesky',
    name: SocialMedia.bluesky,
    useUrlShortener: false
  }

  public static discord: ISocialMedia = {
    iconName: 'discord',
    name: SocialMedia.discord,
    useUrlShortener: false
  }

  public static facebook: ISocialMedia = {
    iconName: 'facebook',
    name: SocialMedia.facebook,
    useUrlShortener: false
  }

  public static mail: ISocialMedia = {
    iconName: 'envelope',
    name: SocialMedia.mail,
    useUrlShortener: false
  }

  public static messenger: ISocialMedia = {
    iconName: 'facebook-messenger',
    name: SocialMedia.messenger,
    useUrlShortener: false
  }

  public static reddit: ISocialMedia = {
    iconName: 'reddit-alien',
    name: SocialMedia.reddit,
    useUrlShortener: false
  }

  public static telegram: ISocialMedia = {
    iconName: 'telegram',
    name: SocialMedia.telegram,
    useUrlShortener: false
  }

  public static twitter: ISocialMedia = {
    iconName: 'twitter',
    name: SocialMedia.twitter,
    useUrlShortener: true
  }

  public static vKontakte: ISocialMedia = {
    iconName: 'vk',
    name: SocialMedia.vKontakte,
    useUrlShortener: false
  }

  public static weChat: ISocialMedia = {
    iconName: 'weixin',
    name: SocialMedia.weChat,
    useUrlShortener: false
  }

  public static whatsapp: ISocialMedia = {
    iconName: 'whatsapp',
    name: SocialMedia.whatsapp,
    useUrlShortener: false
  }
}
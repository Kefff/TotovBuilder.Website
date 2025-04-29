/**
 * Supported media names.
 */
export enum SocialMedia {
  bluesky = 'bluesky',
  discord = 'discord',
  facebook = 'facebook',
  mastodon = 'mastodon',
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
    name: SocialMedia.bluesky
  }

  public static discord: ISocialMediaDefinition = {
    iconName: 'discord',
    name: SocialMedia.discord
  }

  public static facebook: ISocialMediaDefinition = {
    iconName: 'facebook',
    name: SocialMedia.facebook
  }

  public static mastodon: ISocialMediaDefinition = {
    iconName: 'mastodon',
    name: SocialMedia.mastodon
  }

  public static mail: ISocialMediaDefinition = {
    iconName: 'envelope',
    name: SocialMedia.mail
  }

  public static messenger: ISocialMediaDefinition = {
    iconName: 'facebook-messenger',
    name: SocialMedia.messenger
  }

  public static reddit: ISocialMediaDefinition = {
    iconName: 'reddit-alien',
    name: SocialMedia.reddit
  }

  public static telegram: ISocialMediaDefinition = {
    iconName: 'telegram',
    name: SocialMedia.telegram
  }

  public static twitter: ISocialMediaDefinition = {
    iconName: 'twitter',
    name: SocialMedia.twitter
  }

  public static vKontakte: ISocialMediaDefinition = {
    iconName: 'vk',
    name: SocialMedia.vKontakte
  }

  public static weChat: ISocialMediaDefinition = {
    iconName: 'weixin',
    name: SocialMedia.weChat
  }

  public static whatsapp: ISocialMediaDefinition = {
    iconName: 'whatsapp',
    name: SocialMedia.whatsapp
  }


  /**
 * Gets the URL for sharing a something on a social media.
 * @param socialMedia - Social media.
 * @param urlToShare - URL to share.
 */
  public static getSocialMediaShareUrl(socialMedia: SocialMedia, urlToShare: string): string {
    switch (socialMedia) {
      case SocialMedia.bluesky:
        return ''
      case SocialMedia.discord:
        return ''
      case SocialMedia.facebook:
        // return 'https://www.facebook.com/sharer.php?u=https://www.totovbuilder.com/s/XQAAAAL9BgAAAAAAAABBKEnKkjM2lYkrJxkWGvsWno5Sckyrv4-fRQJfkT1g33VVwznLHK0oo86r-na3Q0zbBjRNIU1YWEAs9Ynlz81oJjWK2xI3T9rl34NnRjnmRadnSQtsd_yXbl14oVXEnZzgnKC7E1B2hC_XUZ6OlJpr4Q_eqwVgzQ6qUYbpsOLouHoSSKLlckAKyXoxSUBBhX_75gjre6sSpxHPRou9u8f-Jygo0B6DYi5rHTmV1f9RDLKTr9trsius9HpGU8rLUUXAzT6eKNSh_kmtsar1JtmIW5mTPYVn-9KMZkmNArnVF1k-x2qdLlDbUd4r8gYF7LeT-kAM0b_WqCp-gtyY-HltQQ_gcio9JKh_prp6PwGgLenL2wKRCnnYVphCUq0u1_Vacj22Lf4bO70ICxbx0Y2RBXGqZxdEMzg7g1l3Qf_-z007SPAecdWqNwQmbXzy7nfcCyMSfvH4GzvLbs8xgLDhhTBJ5UBdyGBk9CZ9Rq_uW7BG6X4cGJgJyEBk5XiU5RzgOFSlfAE3mSgVHj9ZPLhGxb70zhM3kFVdy1ZBUpA4H1J-XqUpeY89RHvGazU27i4d9bU878ncEg-Uz_LpNSvbayJMo0npPc0JTdkWUAS61YO3URzXJj0uv1zlNWeSbNDF-tBeAgjUhTWKMFtvbYPsu6K7tzRgSPg-KhUgt8eFBSRJctMJsuxwNx8JPaJBIuw9Q0B_UIYiejZMxAk2nYKsXcIx_VI0e4Nt5ZEWdCSZC4eMevbe8mps9vBPUs1Aw6421DxtkqmSkRgsJPDw5aaeEQ2aeZXj054i6hRXpHNKULH0KmzZtqM8Qq5BcujjjWFhHQjqm09mC_tq6xYCRcA9nLhOp4c810W6bFZ3c09YmhMSU8AFyPcq4WA9HzCUEf_PNTCtRlMVU5hgnR3ugAqmd5g3BexGhI2N6PKmwTGMzMZQGM0DaMZ6P_mTNGKbmgUVZHAQsjX_IbsTAsO6KKD6vVAiHcfj0gGfv-VFUSGzFgFarYl_g22QH-kyqV_t27vK5qGeycgh_6s3OWx4lR2XDLqyQOAC29FGWU0Px8cZ-DAtf97uaND86g6DAqBsvb_PlUTFxJGXNcDHALDJeD68zzDw1i5MfDeHvxTEu4HH7Qzdh2DqoG528h6I5SiJv7CjAzOf_bJKMvjg-gmn87--iiD_S9FGAA'
        return `https://www.facebook.com/sharer.php?u=${urlToShare}`
      case SocialMedia.mastodon:
        return ''
      case SocialMedia.mail:
        return ''
      case SocialMedia.messenger:
        return ''
      case SocialMedia.reddit:
        return ''
      case SocialMedia.telegram:
        return ''
      case SocialMedia.twitter:
        return ''
      case SocialMedia.vKontakte:
        return ''
      case SocialMedia.weChat:
        return ''
      case SocialMedia.whatsapp:
        return ''
    }
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
  name: SocialMedia
}
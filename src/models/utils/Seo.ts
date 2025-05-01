import { useSeoMeta } from '@unhead/vue'
import { computed, ref } from 'vue'
import vueI18n from '../../plugins/vueI18n'
import { ISeoMetadata } from './ISeoMetadata'

/**
 * Represent utility methods for setting SEO metadata
 */
export class Seo {
  /**
   * Description.
   */
  public static get description(): string | undefined {
    return this._description.value
  }
  private static _description = ref<string>()

  /**
   * Image URL.
   */
  public static get image(): string | undefined {
    return this._image.value
  }
  private static _image = ref<string>()

  /**
   * Image alt text.
   */
  public static get imageAlt(): string | undefined {
    return this._imageAlt.value
  }
  private static _imageAlt = ref<string>()

  /**
   * Current page URL.
   */
  public static get url(): string | undefined {
    return this._url.value
  }
  private static _url = ref<string>()

  /**
   * Title.
   */
  public static get title(): string | undefined {
    return this._title.value
  }
  private static _title = ref<string>()

  /**
   * Initializes SEO metadata.
   */
  public static initialize(): void {
    this.updateSeoMetadata()
    useSeoMeta({
      description: this._description,
      ogDescription: this._description,
      ogImageAlt: this._imageAlt.value,
      ogImageUrl: computed(() => this._image.value), // For some reason, without a computed it is not reactive
      ogSiteName: vueI18n.t('caption.totovBuilder'),
      ogTitle: this._title,
      ogType: 'website',
      ogUrl: this._url.value,
      title: this._title,
      twitterCard: 'summary_large_image',
      twitterDescription: this._description,
      twitterImage: computed(() => this._image.value), // For some reason, without a computed it is not reactive
      twitterImageAlt: this._imageAlt.value,
      twitterTitle: this._title
    })
  }

  /**
   * Updates SEO metadata.
   * @param seoMetadata - SEO metadata values.
   */
  public static updateSeoMetadata(seoMetadata?: ISeoMetadata): void {
    this._description.value = seoMetadata?.description ?? vueI18n.t('caption.metaDescription')
    this._image.value = seoMetadata?.image ?? `${window.location.origin}/images/seo-card.png`
    this._imageAlt.value = seoMetadata?.imageAlt != null ? `${seoMetadata?.imageAlt} - ${vueI18n.t('caption.totovBuilder')}` : vueI18n.t('caption.metaTitle')
    this._title.value = seoMetadata?.title != null ? `${seoMetadata?.title} - ${vueI18n.t('caption.totovBuilder')}` : vueI18n.t('caption.metaTitle')
    this._url.value = seoMetadata?.url ?? `${window.location.origin}${window.location.pathname}`
  }
}
import { useSeoMeta } from '@unhead/vue'
import { ref } from 'vue'
import vueI18n from '../../plugins/vueI18n'
import { ISeoMetadata } from './ISeoMetadata'

/**
 * Represent utility methods for setting SEO metadata
 */
export class Seo {
  private static _description = ref<string>()
  private static _image = ref<string>()
  private static _imageAlt = ref<string>()
  private static _url = ref<string>()
  private static _title = ref<string>()

  /**
   * Initializes SEO metadata.
   */
  public static initialize(): void {
    this.updateSeoMetadata()
    useSeoMeta({
      description: this._description,
      ogDescription: this._description,
      ogImageAlt: this._image.value,
      ogImageUrl: this._imageAlt.value,
      ogSiteName: vueI18n.t('caption.totovBuilder'),
      ogTitle: this._title,
      ogType: 'website',
      ogUrl: this._url.value,
      title: this._title,
      twitterCard: 'summary_large_image',
      twitterDescription: this._description,
      twitterImage: this._image.value,
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
    this._image.value = seoMetadata?.image ?? '/images/seo-card.png'
    this._imageAlt.value = seoMetadata?.imageAlt != null ? `${seoMetadata?.imageAlt} - ${vueI18n.t('caption.totovBuilder')}` : vueI18n.t('caption.metaTitle')
    this._title.value = seoMetadata?.title != null ? `${seoMetadata?.title} - ${vueI18n.t('caption.totovBuilder')}` : vueI18n.t('caption.metaTitle')
    this._url.value = seoMetadata?.url
  }
}
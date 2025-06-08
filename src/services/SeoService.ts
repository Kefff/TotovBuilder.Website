import { useSeoMeta } from '@unhead/vue'
import { computed, ref } from 'vue'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { BuildsToTextType } from '../models/utils/IBuildsToTextOptions'
import { ISeoMetadata } from '../models/utils/ISeoMetadata'
import vueI18n from '../plugins/vueI18n'
import { BuildPropertiesService } from './BuildPropertiesService'
import Services from './repository/Services'

export class SeoService {
  /**
   * Description.
   */
  public get description(): string | undefined {
    return this._description.value
  }
  private _description = ref<string>()

  /**
   * Image URL.
   */
  public get image(): string | undefined {
    return this._image.value
  }
  private _image = ref<string>()

  /**
   * Image alt text.
   */
  public get imageAlt(): string | undefined {
    return this._imageAlt.value
  }
  private _imageAlt = ref<string>()

  /**
   * Current page URL.
   */
  public get url(): string | undefined {
    return this._url.value
  }
  private _url = ref<string>()

  /**
   * Title.
   */
  public get title(): string | undefined {
    return this._title.value
  }
  private _title = ref<string>()

  /**
   * Gets the description of a build formatted for SEO.
   */
  public getBuildSeoDescription(summary: IBuildSummary): string {
    const description = Services.get(BuildPropertiesService).getStatsAsString(
      summary,
      {
        includeEmojis: true,
        includeLink: false,
        includePrices: true,
        language: 'en',
        linkOnly: false,
        type: BuildsToTextType.simpleText
      },
      true)

    return description
  }

  /**
   * Gets SEO metadata corresponding to a build summary.
   * @param summary - Build summary.
   * @param sharableUrl - Sharable URL of the build.
   */
  public getBuildSeoMetadata(summary: IBuildSummary, sharableUrl: string): ISeoMetadata {
    const description = this.getBuildSeoDescription(summary)
    const title = summary.name !== '' ? summary.name : vueI18n.t('caption.newBuild')

    return {
      description,
      image: summary.shoppingList[0]?.item?.imageLink,
      imageAlt: title,
      title,
      url: sharableUrl
    }
  }

  /**
   * Initializes SEO metadata.
   * Must be called during the setup of a Vue component as it uses a composable that required it.
   */
  public initialize(): void {
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
  public updateSeoMetadata(seoMetadata?: ISeoMetadata): void {
    this._description.value = seoMetadata?.description ?? vueI18n.t('caption.metaDescription')
    this._image.value = seoMetadata?.image ?? `${window.location.origin}/images/seo-card.jpg`
    this._imageAlt.value = seoMetadata?.imageAlt != null ? `${seoMetadata?.imageAlt} - ${vueI18n.t('caption.totovBuilder')}` : vueI18n.t('caption.metaTitle')
    this._title.value = seoMetadata?.title != null ? `${seoMetadata?.title} - ${vueI18n.t('caption.totovBuilder')}` : vueI18n.t('caption.metaTitle')
    this._url.value = seoMetadata?.url ?? `${window.location.origin}${window.location.pathname}`
  }
}
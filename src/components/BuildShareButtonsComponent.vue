<script setup lang="ts">
import { IBuild } from '../models/build/IBuild'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { ShareButtons } from '../models/utils/ShareButtons'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import { BuildService } from '../services/BuildService'
import Services from '../services/repository/Services'
import { SeoService } from '../services/SeoService'
import ShareButtonsComponent from './ShareButtonsComponent.vue'

const props = withDefaults(
  defineProps<{
    build: IBuild,
    hidden?: (keyof typeof ShareButtons)[]
  }>(),
  {
    hidden: () => []
  })

const _buildService = Services.get(BuildService)
const _buildPropertiesService = Services.get(BuildPropertiesService)
const _seoService = Services.get(SeoService)

let _getSummaryPromise: Promise<IBuildSummary> | undefined = undefined
let _summary: IBuildSummary | undefined = undefined

/**
 * Gets the description of a build for SEO.
 */
async function getSeoDescriptionAsync(): Promise<string> {
  if (_summary == null && _getSummaryPromise == null) {
    _getSummaryPromise = _buildPropertiesService.getSummaryAsync(props.build)
    _summary = await _getSummaryPromise
  } else {
    await _getSummaryPromise
  }

  const description = _seoService.getBuildSeoDescription(_summary!)

  return description
}

/**
 * Gets the title of a build for SEO.
 */
async function getSeoTitleAsync(): Promise<string> {
  if (_summary == null && _getSummaryPromise == null) {
    _getSummaryPromise = _buildPropertiesService.getSummaryAsync(props.build)
    _summary = await _getSummaryPromise
  } else {
    await _getSummaryPromise
  }

  return _summary!.name
}
</script>










<template>
  <ShareButtonsComponent
    :get-url-to-share-function="() => _buildService.toSharableUrlAsync(build)"
    :get-description-function="getSeoDescriptionAsync"
    :get-title-function="getSeoTitleAsync"
    :hidden="hidden"
  />
</template>
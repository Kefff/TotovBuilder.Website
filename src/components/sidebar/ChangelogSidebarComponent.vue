<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { IChangelogEntry } from '../../models/configuration/IChangelogEntry'
import vueI18n from '../../plugins/vueI18n'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import { VersionService } from '../../services/VersionService'
import Services from '../../services/repository/Services'
import Loading from '../LoadingComponent.vue'

defineProps<{ parameters: undefined }>()

const _globalSidebarService = Services.get(GlobalSidebarService)

const changelogs = ref<IChangelogEntry[]>([])
const isLoading = ref(true)

onMounted(() => loadChangelogAsync())

/**
 * Loads the changelog.
 */
async function loadChangelogAsync(): Promise<void> {
  isLoading.value = true

  const fetchedChangelogs = await Services.get(VersionService).getChangelogAsync()
  nextTick(() => isLoading.value = false)

  if (fetchedChangelogs.length > 0) {
    changelogs.value = fetchedChangelogs
  } else {
    _globalSidebarService.close('ChangelogSidebar')
  }
}
</script>










<template>
  <Loading v-if="isLoading" />
  <div
    v-else
    class="sidebar-option"
  >
    <div>
      <div
        v-for="changelog of changelogs"
        :key="changelog.version"
        class="changelog-element"
      >
        <div class="changelog-title">
          <span>{{ $t('caption.changelogTitle', { date: changelog.date.toLocaleDateString(), version: changelog.version }) }}</span>
          <span
            v-if="changelog.isNew"
            class="changelog-new"
          >
            {{ $t('caption.new') }}
          </span>
        </div>
        <ul>
          <li
            v-for="(change, index) of changelog.changes"
            :key="index"
            class="changelog-change"
          >
            {{ change[vueI18n.locale.value] }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>










<style scoped>
.changelog-change {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.changelog-change:first-child {
  margin-top: 0.5rem;
}

.changelog-element {
  margin-top: 1rem;
}

.changelog-element:first-child {
  margin-top: 0;
}

.changelog-new {
  color: var(--primary-color);
  margin-left: 1rem;
}

.changelog-title {
  font-weight: bolder;
  letter-spacing: 1px;
}
</style>
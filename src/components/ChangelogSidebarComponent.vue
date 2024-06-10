<template>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="tv" />
    </div>
    <span>{{ $t('caption.changelog') }}</span>
  </div>
  <div class="sidebar-option">
    <Loading v-show="isLoading" />
    <div v-if="!isLoading && changelogs.length > 0">
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
            {{ change.text }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { IChangelogEntry } from '../models/configuration/IChangelogEntry'
import { VersionService } from '../services/VersionService'
import Services from '../services/repository/Services'
import Loading from './LoadingComponent.vue'

defineProps<{ parameters: undefined }>()

const changelogs = ref<IChangelogEntry[]>([])
const isLoading = ref(true)

onMounted(() => {
  loadChangelog()
})

/**
 * Loads the changelog.
 */
async function loadChangelog() {
  isLoading.value = true
  const fetchedChangelogs = await Services.get(VersionService).getChangelog()
  isLoading.value = false

  if (fetchedChangelogs == null) {
    // TODO: AFFICHER UNE ERREUR QUAND LES CHANGELOGS NE SONT PAS CHARGES

    return
  }

  changelogs.value = fetchedChangelogs
}
</script>










<style scoped>
@import '../css/link.css';
@import '../css/sidebar.css';

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
  font-weight: bold;
  letter-spacing: 1px;
}
</style>
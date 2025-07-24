import { App } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ItemsComponent from '../components/ItemsComponent.vue'
import Welcome from '../components/WelcomeComponent.vue'
import Services from '../services/repository/Services'
import { SeoService } from '../services/SeoService'
import LanguageUtils from '../utils/LanguageUtils'
import applicationInsights from './applicationInsights'
import vueI18n from './vueI18n'

const Build = (): unknown => import('../components/BuildComponent.vue')
const Builds = (): unknown => import('../components/BuildsComponent.vue')

const routes: RouteRecordRaw[] = [
  {
    component: Welcome,
    name: 'Welcome',
    path: '/',
    beforeEnter: (to, from): void => {
      const language = LanguageUtils.getLanguage()
      LanguageUtils.setLanguage(language)

      applicationInsights.trackPageView({
        name: 'Welcome',
        refUri: from.path,
        uri: to.path
      })
    }
  },
  {
    component: Welcome,
    name: 'WelcomeWithLanguage',
    path: '/:language',
    beforeEnter: (to, from, next): void => {
      const language = to.params.language as string
      LanguageUtils.setLanguage(language)

      next()
    }
  },
  {
    component: Builds,
    name: 'Builds',
    path: '/builds',
    beforeEnter: (to, from): void => {
      Services.get(SeoService).updateSeoMetadata({
        title: vueI18n.t('caption.builds')
      })
      applicationInsights.trackPageView({
        name: 'Builds',
        refUri: from.path,
        uri: to.path
      })
    }
  },
  {
    component: Build,
    name: 'NewBuild',
    path: '/build',
    beforeEnter: (to, from): void => {
      Services.get(SeoService).updateSeoMetadata({
        title: vueI18n.t('caption.newBuild')
      })
      applicationInsights.trackPageView({
        name: 'NewBuild',
        refUri: from.path,
        uri: to.path
      })
    }
  },
  {
    component: Build,
    name: 'CopyBuild',
    path: '/copy/:id',
    beforeEnter: (to, from): void => {
      applicationInsights.trackPageView({
        name: 'CopyBuild',
        refUri: from.path,
        uri: to.path
      })
    }
  },
  {
    component: Build,
    name: 'ShareBuild',
    path: '/s/:sharedBuild',
    beforeEnter: (to, from): void => {
      applicationInsights.trackPageView({
        name: 'SharedBuild',
        refUri: from.path,
        uri: to.path
      })
    }
  },
  {
    component: Build,
    name: 'Build',
    path: '/build/:id',
    beforeEnter: (to, from): void => {
      Services.get(SeoService).updateSeoMetadata({
        title: vueI18n.t('caption.build')
      })
      applicationInsights.trackPageView({
        name: 'CopyBuild',
        refUri: from.path,
        uri: to.path
      })
    }
  },
  {
    component: ItemsComponent,
    name: 'Items',
    path: '/items',
    beforeEnter: (to, from): void => {
      Services.get(SeoService).updateSeoMetadata({
        title: vueI18n.t('caption.items')
      })
      applicationInsights.trackPageView({
        name: 'Items',
        refUri: from.path,
        uri: to.path
      })
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: { name: 'Welcome' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export function useVueRouter(app: App<Element>): void {
  app.use(router)
}

export default router
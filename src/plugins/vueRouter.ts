import { App } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Welcome from '../components/WelcomeComponent.vue'
import LanguageUtils from '../utils/LanguageUtils'
import applicationInsights from './applicationInsights'

const Build = () => import('../components/build/BuildComponent.vue')
const Builds = () => import('../components/BuildsComponent.vue')

const routes: RouteRecordRaw[] = [
  {
    component: Welcome,
    name: 'Welcome',
    path: '/',
    beforeEnter: (to, from) => {
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
    beforeEnter: (to, from, next) => {
      const language = to.params.language as string
      LanguageUtils.setLanguage(language)
      next()
    }
  },
  {
    component: Builds,
    name: 'Builds',
    path: '/builds',
    beforeEnter: (to, from) => {
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
    beforeEnter: (to, from) => {
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
    beforeEnter: (to, from) => {
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
    beforeEnter: (to, from) => {
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
    beforeEnter: (to, from) => {
      applicationInsights.trackPageView({
        name: 'CopyBuild',
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
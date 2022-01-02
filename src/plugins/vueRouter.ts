import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Builds from '../components/builds/BuildsComponent.vue'
import BuildComponent from '../components/build/BuildComponent.vue'
import Welcome from '../components/welcome/WelcomeComponent.vue'
import { App } from 'vue'
import LanguageUtils from '../utils/LanguageUtils'

const routes: RouteRecordRaw[] = [
  {
    component: Welcome,
    name: 'Welcome',
    path: '/',
    beforeEnter: () => {
      LanguageUtils.setMeta()
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
    path: '/builds'
  },
  {
    component: BuildComponent,
    name: 'NewBuild',
    path: '/build'
  },
  {
    component: BuildComponent,
    name: 'Build',
    path: '/build/:id'
  },
  {
    component: BuildComponent,
    name: 'SharedBuild',
    path: '/s/:sharedBuild'
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

export function useRouter(app: App<Element>): void {
  app.use(router)
}

export default router
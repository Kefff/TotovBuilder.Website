import { Tooltip } from 'floating-vue'
import 'floating-vue/dist/style.css'
import { App } from 'vue'

export function useFloatingVue(app: App<Element>): void {
  app.component('VTooltip', Tooltip)
}
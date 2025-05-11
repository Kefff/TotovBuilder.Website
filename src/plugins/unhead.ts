import { createHead } from '@unhead/vue/client'
import { App } from 'vue'

export function useUnhead(app: App<Element>): void {
  const unhead = createHead()
  app.use(unhead)
}
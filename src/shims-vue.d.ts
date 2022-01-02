// Makes imports of .vue files not shown as in error.
// Cf. https://github.com/vuejs/vue/issues/5298#issuecomment-761577986
declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}
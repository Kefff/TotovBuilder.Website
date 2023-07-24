import { defineComponent, onMounted, ref } from 'vue'
import Services from '../../services/repository/Services'
import { GeneralOptionsService } from '../../services/GeneralOptionsService'
import StringUtils from '../../utils/StringUtils'

export default defineComponent({
  emits: ['update:visible'],
  setup: () => {
    const allowCookies = ref(true)
    const sidebarVisible = ref(false)

    onMounted(() => {
      getAllowCookies()
    })

    /**
     * Gets the allow cookie indicator.
     */
    function getAllowCookies() {
      allowCookies.value = Services.get(GeneralOptionsService).getAllowCookiesIndicator()
    }

    /**
     * Sets the allow cookie indicator.
     */
    function onAllowCookiesChanged() {
      Services.get(GeneralOptionsService).setAllowCookiesIndicator(allowCookies.value)
      sidebarVisible.value = false
    }

    /**
     * Toggles a the allow cookes indicator.
     * @param filter - Filter.
     */
    function toggleAllowCookies() {
      allowCookies.value = !allowCookies.value
      onAllowCookiesChanged()
    }

    return {
      allowCookies,
      onAllowCookiesChanged,
      sidebarVisible,
      StringUtils,
      toggleAllowCookies
    }
  }
})
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useNavigatorStore = defineStore('navigator', () => {
  /* ----------------------
   Navigator Toggle
  ----------------------- */
  const navToggleStatus = ref(false)

  const saveNavigatorToggle = (toggleStatus) => {
    navToggleStatus.value = toggleStatus
    localStorage.setItem('navigatorToggle', JSON.stringify(toggleStatus))
  }

  const getStorageNavigatorToggle = computed(() => {
    const storageNavigatorToggle = localStorage.getItem('navigatorToggle')
    if (storageNavigatorToggle) {
      navToggleStatus.value = JSON.parse(storageNavigatorToggle)
    }
    return navToggleStatus.value
  })

  return { navToggleStatus, saveNavigatorToggle, getStorageNavigatorToggle }
})

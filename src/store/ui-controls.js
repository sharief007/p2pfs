import { defineStore } from 'pinia'

const useControlsStore = defineStore('controls', {
  state: () => ({
    leftDrawer: true,
    rightDrawer: true
  }),
  getters: {},
  actions: {
    toggleLeftDrawer() {
      console.log('Fuck you')
      this.leftDrawer = !this.leftDrawer
    },
    toggleRightDrawer() {
      this.rightDrawer = !this.rightDrawer
    }
  }
})

export default useControlsStore

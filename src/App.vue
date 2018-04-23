<template>
  <div id="app">
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { AeHeader, AeButton } from '@aeternity/aepp-components'

export default {
  name: 'app',
  components: {
    AeHeader,
    AeButton
  },
  data () {
    return {
      goToRoute: '',
      amount: 0
    }
  },
  computed: {
    account () {
      return this.$store.state.account
    }
  },
  methods: {
    // keysListener (evt) {
    // let queryData = {}
    // if ((evt.keyCode === 114 || evt.keyCode === 82) && evt.shiftKey) {
    //   // letter "r" or "R"
    //   this.goToRoute = 'refund'
    //   queryData = { refund: 1000 }
    // } else if ((evt.keyCode === 115 || evt.keyCode === 83) && evt.shiftKey) {
    //   // letter "r" or "R" =
    //   this.goToRoute = 'serve'
    // } else if ((evt.keyCode === 112 || evt.keyCode === 80) && evt.shiftKey) {
    //   // letter "p" or "P" = PFAND
    //   this.goToRoute = 'refund'
    //   queryData = { refund: 10 }
    // }
    // this.$router.push({ path: this.goToRoute, query: queryData })
    // }
  },
  created () {
    // document.addEventListener('keydown', this.keysListener)
  },
  destroyed () {
    // document.removeEventListener('keydown', this.keysListener)
  },
  mounted () {
    console.info('Vue App mounted')
  }
}
</script>

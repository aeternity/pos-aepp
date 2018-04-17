<template>
  <div id="app">
    <ae-header name="Bæer POS"></ae-header>

    <ae-button v-if="account && account.pub" type='dramatic' :to="{name: 'check'}">🔍</ae-button>

    <router-view></router-view>
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
  computed: {
    account () {
      return this.$store.state.account
    }
  },
  methods: {
    async updateBalance () {
      const pubKey = this.$store.state.account.pub
      if (pubKey) {
        try {
          const balance = await this.$store.getters.clientInternal.accounts.getBalance(pubKey)
          this.$store.commit('setBalance', balance)
        } catch (err) {
          console.log(err)
        }
      }
    }
  },
  mounted () {
    // Get URL params (account info)

    // this.account = this.$route.query

    // DEBUG async fetch
    // const blabla = this.fetchAsync('https://sdk-testnet.aepps.com/v2/top')
    //                     .then((value) => console.log(value))
    //                     .catch((error) => console.warn(error))

    console.info('Vue App mounted')

    this.updateBalance()
    setInterval(() => {
      console.log('interval')
      this.updateBalance()
    }, 10000)
  }
}
</script>

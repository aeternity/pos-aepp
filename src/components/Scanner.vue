<template>
  <div class="Scanner">
    <div class="input">
      <h6 class="text--center">ACTION:</h6>
      <h1 class="text--center">{{mode}} {{amount ?  amount + ' AET' : ''}}</h1>
      <h3 v-if="warningMsg" class="text--center text--alert">{{warningMsg}}</h3>
      <form @submit.prevent="inputCheck">

        <input ref="qr" type="text" id="qr" name="qr" v-model="qr"
                        @blur="refocusInput()"
                        :disabled="loadingMsg ? true : false"
                        class="input--huge"
                        :class="{ 'input--error': barStatus === 'closed', 'input--ok': barStatus === 'open' }" />

      </form>
    </div>
    <h3 v-if="loadingMsg" class="text--center text--loading">{{loadingMsg}}</h3>
    <h2 class="text--center">Latest Transactions</h2>
    <div class="text--center">
      <div :key="beerOrder.hash" v-for="beerOrder in beerOrders" :class="{ 'tx--ok': beerOrder.response, 'tx--error': !beerOrder.response }">
        {{ beerOrder.tx_hash }} | <strong>{{ beerOrder.msg }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
import { AeLoader } from '@aeternity/aepp-components'

export default {
  name: 'Scanner',
  components: {
    AeLoader
  },
  data () {
    return {
      qr: null,
      mode: 'Serve Beer',
      amount: 0,
      warningMsg: '',
      loadingMsg: ''
    }
  },
  computed: {
    barStatus () {
      return this.$store.getters.barStatus
    },
    beerOrders () {
      return this.$store.state.beerOrders
    },
    account () {
      return this.$store.state.account
    },
    wallet () {
      return {
        priv: this.account.priv,
        pub: this.account.pub
      }
    },
    client () {
      return this.$store.getters.client
    }
  },
  methods: {
    setWarning (msg) {
      this.warningMsg = msg
    },
    unsetWarning () {
      this.warningMsg = ''
    },
    setLoading (msg) {
      this.loadingMsg = msg
    },
    unsetLoading (msg) {
      this.loadingMsg = ''
    },
    setMode (mode) {
      this.mode = mode
    },
    setAmount (amount) {
      this.amount = amount
    },
    refocusInput () {
      this.$refs.qr.focus()
    },
    setBarStatus (status) {
      this.$store.dispatch('updateBarStatus', status)
    },
    inputCheck () {
      const data = this.qr
      if (this.barStatus === 'open' && data) {
        if (data.match(/^\d/)) {
          // GOT: number:
          // set amount (preparing for "refund mode")
          this.setMode('Refund')
          this.setAmount(data)
          this.setWarning('🔑 Public Key:')
        } else if (data.startsWith('ak$')) {
          // GOT: Public Key:
          // set "refund mode" making sure the amount is set
          this.setMode('Refund')
          if (this.amount <= 0) {
            // GOT: Public Key, and no amount
            // ask for amount
            this.setWarning('💰 You need to set an amount first:')
          } else {
            // GOT: Public Key, and amount
            // actually refund
            this.unsetWarning()
            this.setLoading(`refunding ${this.amount} to ${data}...`)
          }
        } else if (data.startsWith('th$')) {
          // GOT: transaction + signature as string: "tx_hash sig":
          // set "serving mode" and check beer transaction
          this.setMode('Serve Beer')
          this.setAmount(0)
          this.unsetWarning()
          let pubKeySig = data.split(' ')
          this.setLoading(`checking transaction ${pubKeySig[0]}...`)
          // this.$store.dispatch('inputCheck', data)
        } else if (data === 'closed') {
          this.setWarning('🔒 BAR IS NOW CLOSED')
          this.setBarStatus('closed')
        } else {
          // GOT: anything else
          // actually refund
          this.setWarning('🤔 Unrecognized command')
        }
      } else {
        if (data === 'open') {
          this.setWarning('🍺 BAR IS NOW OPEN')
          this.setBarStatus('open')
        } else {
          if (data) {
            this.setWarning('🔒 Sorry! Bar is closed')
          } else {
            this.setWarning('🤔 Unrecognized command')
          }
        }
      }
      // empty input
      this.qr = ''
      // debug
      console.log('mode:', this.mode, ' – amount', this.amount)
    }
  },
  mounted () {
    this.$refs.qr.focus()
  }
}
</script>

<style scoped lang="scss">

.tx--ok{
  color: green;
}

.tx--error{
  color: red;
}

</style>

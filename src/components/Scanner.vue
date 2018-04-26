<template>
  <div class="scanner">
    <div class="left">
      <div class="input">
        <h1>{{mode}} {{amount ?  amount + ' AET' : ''}}</h1>
        <form @submit.prevent="inputCheck">
          <h6>BALANCE: {{barBalance}} AET</h6>
          <input ref="qr" type="text" id="qr" name="qr" v-model="qr"
                          autocomplete="off"
                          autofocus
                          @blur="refocusInput()"
                          :disabled="loadingMsg ? true : false"
                          class="input--huge"
                          :class="{ 'input--error': barStatus === 'closed' || barStatus === 'out_of_beers' , 'input--ok': barStatus === 'open' }" />

        </form>
        <h3 v-if="warningMsg" class="text--alert">{{warningMsg}}</h3>
      </div>
      <h3 v-if="loadingMsg" class="text--loading">{{loadingMsg}}</h3>
    </div>
    <div class="right">
      <h6 class="pretitle pretitle--grey">BAR PUBLIC KEY: <strong>{{cutHashes(account.pub, 6, 91)}}</strong></h6>
      <h2>Latest Transactions</h2>
      <div>
        <div :key="index" v-for="(posTx, index) in posTransactions" :class="{ 'tx--ok': posTx.success, 'tx--error': !posTx.success }">
          <h6 class="pretitle"><strong>{{ posTx.ts ? printDate(posTx.ts) : '' }}</strong> <em>{{ posTx.tx_hash ? ' • ' + cutHashes(posTx.tx_hash, 6, 46) : '' }}</em></h6>
          <h3 class="title">{{ posTx.msg }}</h3>
        </div>
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
    accessKey () {
      return this.$store.getters.accessKey
    },
    barStatus () {
      return this.$store.getters.barStatus
    },
    barBalance (state) {
      return this.$store.getters.barBalance
    },
    posTransactions () {
      // eslint-disable-next-line no-undef
      const localStorageTxs = JSON.parse(localStorage.getItem('posTransactions'))
      if (localStorageTxs) {
        this.$store.commit('SET_TRANSACTIONS', localStorageTxs)
        return this.$store.getters.posTransactions
      } else {
        return this.$store.getters.posTransactions
      }
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
    cutHashes (hash, cutStart, cutEnd) {
      return hash.substr(0, cutStart) + '...' + hash.substr(cutEnd + 1)
    },
    printDate (ts) {
      const date = new Date(ts)
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()).padStart(2, '0')}/${date.getFullYear()} – ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    setWarning (msg) {
      this.warningMsg = msg
    },
    setLoading (msg) {
      this.loadingMsg = msg
    },
    setMode (mode) {
      this.mode = mode
    },
    setAmount (amount) {
      this.amount = amount
    },
    refocusInput () {
      setTimeout(() => {
        if (this.$refs.qr) {
          this.$refs.qr.focus()
        }
      }, 1000)
    },
    setBarStatus (status) {
      // console.log('emitting set_bar_state with accessKey', this.accessKey, ' and status: ', status)
      this.$socket.emit('set_bar_state', this.accessKey, status, (data) => {
        // console.log('set bar status callback: ', data)
        if (data.success) {
          data.msg = `BAR ${status}`
          this.$store.commit('ADD_TRANSACTION', data)
        }
      })
    },
    refund (pubKey) {
      // console.log(`emitting refund with accessKey ${this.accessKey}, amount: ${this.amount} and pubKey ${pubKey}`)
      this.$socket.emit('refund', this.accessKey, pubKey, this.amount, (data) => {
        // console.log('refund callback: ', data)
        this.$store.commit('ADD_TRANSACTION', data)
        this.setMode('Serve Beer')
        this.setAmount(0)
        this.setWarning('')
      })
    },
    checkTransaction (data) {
      let tHashSig = data.split(' ')
      // console.log(`emitting scan with accessKey ${this.accessKey} txHash: ${tHashSig[0]} and signature ${tHashSig[1]}`)
      this.$socket.emit('scan', this.accessKey, tHashSig[0], tHashSig[1], (data) => {
        // console.log('scan callback: ', data)
        this.$store.commit('ADD_TRANSACTION', data)
        this.setMode('Serve Beer')
        this.setAmount(0)
        this.setWarning('')
      })
    },
    inputCheck () {
      const data = this.qr
      if (!data) {
        this.setWarning('🤔 Unrecognized command')
        return
      }
      // console.log('current bar status', this.barStatus)
      if (this.barStatus !== 'closed' || data === 'open') {
        if (data.match(/^\d/)) {
          // GOT: number:
          // set amount (preparing for "refund mode")
          this.setMode('Refund')
          this.setAmount(data)
          this.setWarning('🔑 Insert Public Key')
        } else if (data.startsWith('ak$')) {
          // GOT: Insert Public Key
          // set "refund mode" making sure the amount is set
          this.setMode('Refund')
          if (this.amount <= 0) {
            // GOT: Public Key, and no amount
            // ask for amount
            this.setWarning('💰 You need to set an amount first:')
          } else {
            // GOT: Public Key, and amount
            // actually refund
            this.setWarning('')
            this.setLoading(`refunding ${this.amount} to ${data}...`)
            // emit refund event
            this.refund(data)
            this.setLoading('')
          }
        } else if (data.startsWith('th$') && this.barStatus !== 'out_of_beers') {
          // GOT: transaction + signature as string: "tx_hash sig":
          // set "serving mode" and check beer transaction
          this.setMode('Serve Beer')
          this.setAmount(0)
          this.setWarning('')
          const tHashSig = data.split(' ')
          this.setLoading(`checking transaction ${tHashSig[0]}...`)
          this.checkTransaction(data)
          this.setLoading('')
          // this.$store.dispatch('inputCheck', data)
        } else if (data === 'closed') {
          this.setWarning('🔒 BAR IS NOW CLOSED')
          this.setBarStatus('closed')
        } else if (data === 'out_of_beers') {
          this.setWarning('🔒 BAR IS OUT OF BEERS')
          this.setBarStatus('out_of_beers')
        } else if (data === 'open') {
          this.setWarning('🍺 BAR IS NOW OPEN')
          this.setBarStatus('open')
          this.setAmount(0)
          this.setMode('Serve Beer')
          this.setWarning('')
        } else {
          // GOT: anything else or "th$...", but bar is out of beer)
          // actually refund
          if (this.barStatus === 'out_of_beers') {
            this.setWarning('🔒 BAR IS OUT OF BEERS')
          } else {
            this.setWarning('🤔 Unrecognized command')
          }
        }
      } else {
        if (this.barStatus === 'closed') {
          this.setWarning('🔒 BAR IS CLOSED')
        } else {
          this.setWarning('🔒 BAR IS OUT OF BEERS')
        }
      }
      // empty input
      this.qr = ''
      // debug
      // console.log('mode:', this.mode, ' – amount', this.amount)
      // console.log('updating balance...')
      this.$store.dispatch('updateBalance')
    }
  },
  mounted () {
    // setTimeout(() => {
    //   if (this.$refs.qr) {
    //     this.$refs.qr.focus()
    //   }
    // }, 1000)
    // refresh balance once
    this.$store.dispatch('updateBalance')
  }
}
</script>

<style scoped lang="scss">

.tx--ok{
  color: green
}
.tx--error{
  color: red
}
.scanner{
  display: flex;
}
.left, .right {
  padding: 2vw;
  overflow-y: scroll;
  height: 100vh;
  position: fixed;
  width: 50%;
  position: relative;
}
.right{
  border-left: 1px solid black;
  right: 0;
}
.pretitle, .title{
  padding: 0;
  margin: 0;
}
.title{
  margin-bottom: 2rem;
}
.pretitle{
  font-weight: 100;
  &--grey{
    color: gray;
  }
}

</style>

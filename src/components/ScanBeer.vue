<template>
  <div class="ScanBeer">
    <div class="input">
      <form @submit.prevent="checkTransaction">
        <h1 class="text--center">Serve Beer</h1>
        <input autofocus class="input--huge" type="text" id="qr" name="qr" v-model="qr"/>
      </form>
    </div>
    <div v-if="state === 'waiting'" class="waiting">
      <ae-loader /> Waiting
    </div>
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
  name: 'ScanBeer',
  components: {
    AeLoader
  },
  data () {
    return {
      qr: null,
      amount: {
        amount: 0,
        symbol: 'Æ'
      },
      units: [
        { symbol: 'Æ', name: 'æternity' }
      ],
      state: 'input'
    }
  },
  computed: {
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
    checkTransaction () {
      // get sting like "tx_hash signature"
      const data = this.qr
      if (data) {
        this.$store.dispatch('checkTransaction', data)
      }
    }
  },
  mounted () {

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

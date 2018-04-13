<template>
  <div class="check">
    <div v-if="state === 'input'" class="input">
      <form @submit.prevent="checkTransaction">
        <h2>Scanned QR</h2>
        <input autofocus type="text" id="qr" name="qr" v-model="qr"/>
        <button type="submit" @click="checkTransaction">Send</button>
      </form>
    </div>
    <div v-if="state === 'waiting'" class="waiting">
      <ae-loader /> Waiting
    </div>
    <div v-if="state === 'done'" class="done">
      Done
    </div>
    <h2>Latest Transactions</h2>
    <ul>
      <li :key="tx.hash" v-for="tx in txs">
        Beers taken: <strong>{{ tx.beers }}</strong> - {{ tx.hash }}
      </li>
    </ul>
  </div>
</template>

<script>
import { AeLoader } from '@aeternity/aepp-components'

export default {
  name: 'Check',
  components: {
    AeLoader
  },
  data () {
    return {
      txs: [
        {
          hash: 'th$hQqUV7BY7i64ZFxhxNzQ5Cf2BUUvh9r1r3MpwAUaqfsMWFoeH',
          beers: 0
        },
        {
          hash: 'th$hQqUV7BY7i64ZFxhxNzQ5Cf2BUUvh9r1r3MfwAUaqfKMWFoeH',
          beers: 0
        },
        {
          hash: 'th$hQqUV7BY7i64ZFxhxNzQ5hf2BUUvh9r1r3MpwAUaqfKMWFoeH',
          beers: 0
        },
        {
          hash: 'th$hQqUV7BY7i64ZFxhxNzQ5jf2BUUvh9r1r3MpwAUaqfKMWFoeH',
          beers: 1
        },
        {
          hash: 'th$hQqUV7BY7i64ZFxhxNzQnnf2BUUvh9r1r3MpwAUaqfKMWFoeH',
          beers: 1
        }
      ],
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
    async checkTransaction () {
      try {
        // TODO: check scanned QR and show results here
        this.state = 'done'
      } catch (err) {
        console.log(err)
        this.state = 'input'
      }
    }
  },
  mounted () {

  }
}
</script>

<style scoped lang="scss">

</style>

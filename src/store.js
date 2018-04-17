import Vuex from 'vuex'
import Vue from 'vue'
import { AeternityClient } from '@aeternity/aepp-sdk'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    account: {
      pub: 'ak$3evGruG5reEY4eWDKCuZxkDBp4KTRyj4YJp98BGTgSegqURNpaTs2FEzVxHbiZwA4Z48JatQzNBoZEGM732BwDRhz3Ng3U',
      priv: '94e013ac4089d5002ccf6b4807952f3bd387540ce2af5d66e5490760a7086b85',
      domain: 'Beer Bar',
      name: 'beer_bar.aet'
    },
    balance: 0
  },
  getters: {
    client () {
      const provider = new AeternityClient.providers.HttpProvider(
        'republica.aepps.com',
        443,
        { secured: true, internal: false }
      )
      return new AeternityClient(provider)
    },
    clientInternal () {
      const provider = new AeternityClient.providers.HttpProvider(
        'republica.aepps.com',
        443,
        { secured: true, internal: true }
      )
      return new AeternityClient(provider)
    }
  },
  mutations: {
    setAccount (state, {pub, priv, name, domain}) {
      state.account.pub = pub
      state.account.priv = priv
      state.account.name = name
      state.account.domain = domain
      // eslint-disable-next-line no-undef
      localStorage.setItem('account', JSON.stringify(state.account))
    },
    setBalance (state, newBalance) {
      state.balance = newBalance
    }
  }
})

export default store

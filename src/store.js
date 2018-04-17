import Vuex from 'vuex'
import Vue from 'vue'
import { AeternityClient } from '@aeternity/aepp-sdk'
// import { reject } from 'any-promise'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    access_key: 'secret!',
    account: {
      pub: 'ak$3evGruG5reEY4eWDKCuZxkDBp4KTRyj4YJp98BGTgSegqURNpaTs2FEzVxHbiZwA4Z48JatQzNBoZEGM732BwDRhz3Ng3U',
      priv: '94e013ac4089d5002ccf6b4807952f3bd387540ce2af5d66e5490760a7086b85',
      domain: 'beer_bar.aet',
      name: 'Beer Bar'
    },
    beerOrders: [
      {
        tx_hash: 'th$oYzwYEyjG4ckKd7vnkzGT7Xn4aY1EM6N3pVmMeSxAqhmtzve5',
        signature: 'MEUCIQDyWWfOVLtjwRObNe^mN5czdvBQKIJUO0PP7N7A-gpnQQIgaZg-irjSzwH8BoztI9JcXaPXE9IbWErO8sP2M0undNMì',
        sender: 'ak$3Jyki2rvn5wuwTsxXBs2tKMNugG9Qx7vNSxmEgwjAqqCKnEMiqY3TKcut551ThbCfA94AvQYiEZV7bEnvjyRZnvW25HAsY',
        amount: 1000,
        scanned_at: 1523978941,
        block_id: '56r4rtygse',
        response: false,
        msg: 'There was a problem with BLABLA'
      },
      {
        tx_hash: 'th$oYzwYEyjG4ckKd7vnkzGT7Xn4aY1EM6N3pVmMeSxAqhmtzve5',
        signature: 'MEUCIQDyWWfOVLtjwRObNe^mN5czdvBQKIJUO0PP7N7A-gpnQQIgaZg-irjSzwH8BoztI9JcXaPXE9IbWErO8sP2M0undNMì',
        sender: 'ak$3Jyki2rvn5wuwTsxXBs2tKMNugG9Qx7vNSxmEgwjAqqCKnEMiqY3TKcut551ThbCfA94AvQYiEZV7bEnvjyRZnvW25HAsY',
        amount: 1000,
        scanned_at: 1523978941,
        block_id: '56r4rtygse',
        response: true,
        msg: 'OK'
      },
      {
        tx_hash: 'th$oYzwYEyjG4ckKd7vnkzGT7Xn4aY1EM6N3pVmMeSxAqhmtzve5',
        signature: 'MEUCIQDyWWfOVLtjwRObNe^mN5czdvBQKIJUO0PP7N7A-gpnQQIgaZg-irjSzwH8BoztI9JcXaPXE9IbWErO8sP2M0undNMì',
        sender: 'ak$3Jyki2rvn5wuwTsxXBs2tKMNugG9Qx7vNSxmEgwjAqqCKnEMiqY3TKcut551ThbCfA94AvQYiEZV7bEnvjyRZnvW25HAsY',
        amount: 1000,
        scanned_at: 1523978941,
        block_id: '56r4rtygse',
        response: true,
        msg: 'OK'
      }
    ],
    balance: 0
  },
  getters: {
    lastBeerHash (state) {
      if (state.beerOrders.length <= 0) {
        return null
      }
      return state.beerOrders[0]
    },
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
    addOrder (state, order) {
      state.beerOrders.unshift(order)
      // eslint-disable-next-line no-undef
      localStorage.setItem('beerOrders', JSON.stringify(state.beerOrders))
    },
    setAccount (state) {
      // eslint-disable-next-line no-undef
      localStorage.setItem('account', JSON.stringify(state.account))
    },
    setBalance (state, newBalance) {
      state.balance = newBalance
    }
  },
  actions: {
    async checkTransaction ({ commit, state, getters }, data) {
      // debug
      // let data = 'th$oYzwYEyjG4ckKd7vnkzGT7Xn4aY1EM6N3pVmMeSxAqhmtzve5 MEUCIQDyWWfOVLtjwRObNe^mN5czdvBQKIJUO0PP7N7A-gpnQQIgaZg-irjSzwH8BoztI9JcXaPXE9IbWErO8sP2M0undNMì'
      data = data.split(' ')
      const txHash = data[0]
      // const sig = data[1]
      // const pubKey = state.account.pub
      if (txHash && txHash.startsWith('th$')) {
        try {
          const txInfo = await getters.client.tx.getTransaction(txHash)
          console.log('TX', txInfo.tx.sender)
          // commit('someActions', someParams)
          // return balance
        } catch (err) {
          console.log(err)
        }
      }
      return 0
    }
  }
})

export default store

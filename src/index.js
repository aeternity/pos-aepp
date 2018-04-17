// import socketio from 'socket.io'
// import VueSocketio from 'vue-socket.io'
import './custom.scss'
import Vue from 'vue'
import VueRouter from 'vue-router'
import AsyncComputed from 'vue-async-computed'
import VeeValidate from 'vee-validate'
import App from './App.vue'
import getRouter from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(AsyncComputed)
Vue.use(VeeValidate)

// export const SocketInstance = socketio('http://localhost:4113')
// Vue.use(VueSocketio, SocketInstance, store)

console.info('about to render Vue App')
new Vue({
  router: getRouter(store),
  store,
  render: h => h(App),
  beforeCreate () {
    try {
      // eslint-disable-next-line no-undef
      store.commit('setAccount')
    } catch (e) {
      console.log(e)
    }
  }
}).$mount('#app')

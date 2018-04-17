import Router from 'vue-router'
// import Home from './components/Home.vue'
import ScanBeer from './components/ScanBeer.vue'
import Refund from './components/Refund.vue'

export default (store) => {
  const routes = [
    {
      path: '/',
      name: 'home',
      component: ScanBeer,
      props: route => ({ query: route.query })
    },
    {
      path: '/serve',
      name: 'serve',
      component: ScanBeer
      // beforeEnter (to, from, next) {
      //   if (!store.state.account || !store.state.account.priv) return next({ name: 'home' })
      //   next()
      // }
    },
    {
      path: '/refund',
      name: 'refund',
      component: Refund
      // beforeEnter (to, from, next) {
      //   if (!store.state.account || !store.state.account.priv) return next({ name: 'home' })
      //   next()
      // }
    }
  ]
  const router = new Router({mode: 'history', routes: routes})
  return router
}

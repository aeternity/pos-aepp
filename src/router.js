import Router from 'vue-router'
import Home from './components/Home.vue'
import Check from './components/Check.vue'

export default (store) => {
  const routes = [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: route => ({ query: route.query })
    },
    {
      path: '/check',
      name: 'check',
      component: Check
      // beforeEnter (to, from, next) {
      //   if (!store.state.account || !store.state.account.priv) return next({ name: 'home' })
      //   next()
      // }
    }
  ]

  const router = new Router({routes})
  return router
}

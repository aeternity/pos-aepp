import Router from 'vue-router'
// import Home from './components/Home.vue'
import Scanner from './components/Scanner.vue'

export default (store) => {
  const routes = [
    {
      path: '/',
      name: 'home',
      component: Scanner,
      props: route => ({ query: route.query })
    }
  ]
  const router = new Router({mode: 'history', routes: routes})
  return router
}

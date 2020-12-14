import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '線上相簿',
      login: false
    }
  },
  {
    path: '/reg',
    name: 'Reg',
    component: () => import(/* webpackChunkName: "reg" */ '../views/Reg.vue'),
    meta: {
      title: '線上相簿|註冊',
      login: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      title: '線上相簿|登入',
      login: false
    }
  },
  {
    path: '/album',
    name: 'Album',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "album" */ '../views/Album.vue'),
    meta: {
      login: true
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.login && !store.state.user.id) {
    next('/login')
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  let title = ''
  if (to.name === 'Album') {
    title = store.state.user.name + '的相簿'
  } else {
    title = to.meta.title
  }

  document.title = title
})

export default router

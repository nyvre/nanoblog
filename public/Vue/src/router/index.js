import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import LogInPage from '../views/LogInPage.vue'
import SignUp from '../views/SignUp.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: {prop: "username"}
  },
  {
    path: '/login',
    name: 'LogInPage',
    component: LogInPage,
    props: {prop: "username"}
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = new VueRouter({
  routes
})

export default router

import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import User from '../components/user/user.vue'
import Right from '../components/right/right.vue'
import Role from '../components/role/role.vue'
import { Message } from 'element-ui'
Vue.use(Router)
const router = new Router({
  routes: [{
    path: '/',
    component: Login
  }, {
    name: 'login',
    path: '/login',
    component: Login
  }, {
    name: 'home',
    path: '/home',
    component: Home,
    children: [{
      name: 'users',
      path: '/users',
      component: User
    }, {
      name: 'rights',
      path: '/rights',
      component: Right
    }, {
      name: 'roles',
      path: '/roles',
      component: Role
    }]
  }]
})
// 开始写路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      Message.warning('请先登录')
      router.push({
        name: 'login'
      })
      return
    }
    next()
  }
})
export default router

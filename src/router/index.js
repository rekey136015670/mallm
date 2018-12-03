import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import User from '../components/user/user.vue'
import Right from '../components/right/right.vue'
import Role from '../components/role/role.vue'
import {
  Message
} from 'element-ui'
import Goods from '../components/goods/goodslist.vue'
import Goodsadd from '../components/goods/goodsadd.vue'
import Params from '../components/goods/cateparams.vue'
import Categories from '../components/goods/goodscate.vue'
import Orders from '../components/order/order.vue'
import Reports from '../components/report/report.vue'
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
    }, {
      name: 'goods',
      path: '/goods',
      component: Goods
    }, {
      name: 'goodsadd',
      path: '/goodsadd',
      component: Goodsadd
    }, {
      name: 'params',
      path: '/params',
      component: Params
    }, {
      name: 'categories',
      path: '/categories',
      component: Categories
    }, {
      name: 'orders',
      path: '/orders',
      component: Orders
    }, {
      name: 'reports',
      path: '/reports',
      component: Reports
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

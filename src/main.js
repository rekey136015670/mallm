// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router/index'
import './assets/css/index.css'
import MyHttpServer from '../src/plugins/http'
import moment from 'moment'
// 下面这个代码是自动就有的,开发的调试信息,生产环境中是否需要输出?
Vue.config.productionTip = false
// 使用vue的插件
Vue.use(ElementUI)
// 使用axios的插件,模仿饿了吗的插件引入方法
Vue.use(MyHttpServer)
// 全局定义过滤器
Vue.filter('fmtDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

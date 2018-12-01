// 开发vue的拆件
import axios from 'axios'
const MyHttpServer = {}
MyHttpServer.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  Vue.prototype.$http = axios
  // 添加一个请求拦截器
  axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    if(config.url !=='login'){
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers['Authorization']=AUTH_TOKEN
    }
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

  // // 添加一个响应拦截器
  // axios.interceptors.response.use(function (response) {
  //   // Do something with response data
  //   return response;
  // }, function (error) {
  //   // Do something with response error
  //   return Promise.reject(error);
  // });

}

export default MyHttpServer

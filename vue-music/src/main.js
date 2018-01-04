import 'babel-polyfill'     // 解决不支持es6语法的问题
import Vue from 'vue'
import App from './App'
import router from './router'    // 这里的router就是我们导出的router实例
import VueLazyLoad from 'vue-lazyload'

import fastclick from 'fastclick'      // 解决移动端点击事件存在300毫秒延迟的问题

import 'common/stylus/index.styl'

Vue.use(VueLazyLoad, {
  loading: require('common/images/default.png')
})

Vue.config.productionTip = false
fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

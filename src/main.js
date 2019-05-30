// Vue
import Vue from 'vue'
import App from './App'
// store
import store from '@/store/index'
// 多国语
import i18n from './i18n'
// 核心插件
import d2Admin from '@/plugin/d2admin'

// 菜单和路由设置
import router from './router'
import menuHeader from '@/menu/header'
import menuAside from '@/menu/aside'
import { frameInRoutes } from '@/router/routes'

import VueHighcharts from 'vue-highcharts'
import axios from 'axios'
import DataTables from 'vue-data-tables'
import 'video.js/dist/video-js.css'
import 'videojs-flash'
import 'videojs-contrib-hls.js/src/videojs.hlsjs'
var VideoPlayer = require('vue-video-player')
// VideoPlayer.config({
//   youtube: true, // default false
//   switcher: false, // default true
//   hls: false // default true
// })
Vue.use(VideoPlayer)
Vue.prototype.$http = axios
Vue.use(VueHighcharts)
Vue.use(DataTables)
Vue.config.productionTip = false

// 核心插件
Vue.use(d2Admin)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
    // 设置顶栏菜单
    this.$store.commit('d2admin/menu/headerSet', menuHeader)

    this.$store.commit('d2admin/menu/asideSet', menuAside)

    // 初始化菜单搜索功能
    this.$store.commit('d2admin/search/init', menuHeader)
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  }
}).$mount('#app')

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Vuex from 'vuex'

import Axios from 'axios'
Vue.prototype.$ajax = Axios

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import infiniteScroll from 'vue-infinite-scroll' //滚动加载
import VueLazyLoad from 'vue-lazyload' //图片加载动画

//引入样式
import "./assets/css/base.css"
import "./assets/css/checkout.css"
import "./assets/css/login.css"
import "./assets/css/product.css"

//注册全局组件
import headerNav from './components/headerNav'
import footerNav from './components/footerNav'
import Crumb from './components/crumb'
import { currency } from './utils/currency' //过滤器
Vue.component('headerNav', headerNav)
Vue.component('footerNav', footerNav)
Vue.component('Crumb', Crumb)
Vue.filter('currency', currency) //全局过滤器

Vue.config.productionTip = false

Vue.use(infiniteScroll)
Vue.use(VueLazyLoad, {
    loading: "./static/loading-svg/loading-bars.svg"
})

Vue.use(ElementUI)

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        cartCount: 0
    },
    mutations: {
        cartCount(state, num) {
            state.cartCount += num;
        },
        initCartCount(state, num) { //初始避免累加
            state.cartCount = num;
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})
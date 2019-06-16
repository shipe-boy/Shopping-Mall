import Vue from 'vue'
import Router from 'vue-router'


import GoodsList from '../views/GoodsList'
import Cart from '../views/cart'
import Address from '../views/address'
import OrderConfirm from '../views/orderConfirm'
import OrderSuccess from '../views/orderSuccess'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    { 
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    { 
      path: '/address',
      name: 'address',
      component: Address
    },
    { 
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: OrderConfirm
    },
    { 
      path: '/orderSuccess',
      name: 'orderSuccess',
      component: OrderSuccess
    }
  
  ]
})

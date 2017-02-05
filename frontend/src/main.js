// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import vueResource from 'vue-resource'


import App from './App'
import users from './components/users'
import confirm from './components/test'
import verify from './components/verify'
import login from './components/login'

Vue.use(vueResource)
Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  base: __dirname, 
  routes: [
    {path: '/', component: login},
    {path: '/register', component: users},
    {path: '/test', component: confirm},
    {path: '/verifySummoner', component: verify}
    ]
});


/* eslint-disable no-new */
new Vue({
  router,
  template: `
    <div id="app">
      <!--<ul>
        <li><router-link to="/">Users</router-link></li>
        <li><router-link to="/confirm">Test</router-link></li>
      </ul>-->
      <router-view></router-view>
    </div>
  `
}).$mount('#app')

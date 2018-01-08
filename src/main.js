// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import axios from 'axios';
import router from './router';
import store from './store/store.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import md5 from 'js-md5';
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.md5 = md5;//md5加密
Vue.prototype.$http = axios;
// Vue.prototype.$http.defaults.baseURL = 'http://103.230.242.79:9008';
Vue.prototype.$http.defaults.baseURL = 'http://192.168.0.197:9008';
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

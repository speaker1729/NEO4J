import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ol from 'ol'; // 引入 OpenLayers
import 'ol/ol.css'; // 引入 OpenLayers 的样式文件

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './plugins/router'
import store from './plugins/store'
import vuetify from './plugins/vuetify';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadScript from 'vue-plugin-load-script';
 
Vue.use(LoadScript);

Vue.config.productionTip = false
Vue.use(LoadScript);

Vue.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js")
Vue.loadScript("https://unpkg.com/cardsJS/dist/cards.min.js")
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')



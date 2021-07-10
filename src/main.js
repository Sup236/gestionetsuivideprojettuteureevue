import Vue from 'vue';
import VeeValidate from "vee-validate";
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import cors from 'core-js';
import 'bootstrap';

Vue.config.productionTip = false

Vue.use(VeeValidate);

new Vue({
  vuetify,
  router,
  store,
  cors,

  render: h => h(App)
}).$mount('#app')

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

/**
 * On créer une vue avec le diférents plugins et librairie dont on a besoin pour l'application
 */
new Vue({
  vuetify, // Plugins graphique
  router, // Facilité la navigation dans l'application
  store, // Permet ici de géré un utilisateur connecté
  cors, // Est utiliser pour les requetes au serveur back end

  render: h => h(App)
}).$mount('#app')

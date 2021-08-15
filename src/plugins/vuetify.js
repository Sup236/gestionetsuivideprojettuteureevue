import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import UserDataService from "@/services/UserDataService";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
    faHome,
    faUser,
    faUserPlus,
    faSignInAlt,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import {library} from "@fortawesome/fontawesome-svg-core";
import '@mdi/font/css/materialdesignicons.css'

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);
Vue.use(Vuetify);
Vue.component('font-awesome-icon', FontAwesomeIcon);

/**
 * Ici nous configurons vuetify pour avoir accès à différent type d'icon graphique
 */
export default new Vuetify({
    data: () => ({
        items: UserDataService.getAdmin(),
        values: [],
        value: null
    }),
    icons: {
        iconfont: 'mdi',
    },
});

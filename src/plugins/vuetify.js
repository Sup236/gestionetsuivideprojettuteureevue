import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import UserDataService from "@/services/UserDataService";

Vue.use(Vuetify);

export default new Vuetify({
    data: () => ({
        items: UserDataService.getAll(),
        values: [],
        value: null
    }),
});

<!--
  Cette vue est la vue principale,
  Elle contient la barre de navigation de l'application
  Ainsi que les différents bouton de navigation/connexion
  Certain bouton ne s'affiche que lorsque l'utilisateur est connecté (les boutons de déconnexion et de profile)
  Les autres ne s'affiche que quand il n'y a personne de connecté
 -->
<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center">
        Gestion et suivi de projet tuteurée
      </div>
      <div>
        <div v-if="this.loggedIn === false">
          <v-icon @click="$router.push('/signUp')" class="pa-4 ml-5">
            mdi-account-plus
          </v-icon>

          <v-icon @click="$router.push('/signIn')" class="pa-4 ml-5">
            mdi-account-check
          </v-icon>
        </div>
        <div v-else>
          <v-icon @click="logout" class="pa4 ml-5">
            mdi-account-cancel
          </v-icon>
          <v-icon @click="$router.push('/profile')" class="pa-4 ml-5">
            mdi-account
          </v-icon>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
/**
 * @vue-computed {boolean} loggedIn - Indique s'il y a un utilisateur de connecté
 *
 * @vue-event {route || alert} logout - Fait appelle à la fonction logout qui se trouve dans le store
 * Si elle réussi elle revoie vers la première page
 * Sinon elle affiche l'erreur
 */
export default {
  name: 'app',

  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },

  methods: {

    logout() {
      this.$store.dispatch('gitModule/logout')
      this.$store.dispatch('auth/logout').then(
          () => {
            this.$router.push('/');
          },
          error => {
            this.loading = false;
            this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
          });
    }
  }
};
</script>

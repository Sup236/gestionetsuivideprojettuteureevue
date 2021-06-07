<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center">
        Gestion et suivi de projet tuteurée
      </div>

      <v-btn to="/SignUp" class="pa-4 ml-5 left">
        S'inscrire
      </v-btn>

      <v-btn to="/SignIn" class="pa-4 ml-5 left">
        Connexion
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'app',
};
</script>

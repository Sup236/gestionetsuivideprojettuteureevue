<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center">
        Gestion et suivi de projet tuteurée
      </div>
      <div>
        <v-icon @click="$router.push('/SignUp')" class="pa-4 ml-5">
          mdi-account-plus
        </v-icon>

        <v-icon @click="$router.push('/SignIn')" class="pa-4 ml-5">
          mdi-account-check
        </v-icon>
      </div>
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

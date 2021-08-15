<!--
  Sur cette page on affiche les données qui concerne l'utilisateur connecté
  On créer également un boutton qui redirige vers la page qui correspond à son rôle
-->
<template>
  <v-card max-width="500" class="mx-auto">
    <v-card-title>Profile:</v-card-title>
    <v-card-text>
      {{currentUser.name}} {{currentUser.firstName}}
    </v-card-text>

    <v-card-title>Email:</v-card-title>
    <v-card-text>{{currentUser.email}}</v-card-text>

    <v-card-title>Authorities:</v-card-title>
    <v-card-text v-if="currentUser.role === 0">Vous devez attendre qu'un admin vous donne l'autorisation qui vous convient</v-card-text>
    <v-card-text v-if="currentUser.role === 1">Etudiant</v-card-text>
    <v-card-text v-if="currentUser.role === 2">Enseignant</v-card-text>
    <v-card-text v-if="currentUser.role === 3">Admin</v-card-text>

    <div v-if="currentUser.role === 3" class="mx-16">
      <v-btn @click="adminPage" color="green" class="mx-16">Gestion des utilisateurs</v-btn>
    </div>
    <div v-if="currentUser.role === 2" class="mx-16">
      <v-btn @click="enseignantPage" color="green" class="mx-16">Gestion des projets</v-btn>
    </div>
    <div v-if="currentUser.role === 1" class="mx-16">
      <v-btn @click="etudiantPage" color="green" class="mx-16">Gestion des projets</v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'profile',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    adminPage(){
      this.$router.push('/admin');
    },

    enseignantPage(){
      this.$router.push('/enseignant');
    },

    etudiantPage(){
      this.$router.push('/etudiant');
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/SignIn');
    }
  }
};
</script>
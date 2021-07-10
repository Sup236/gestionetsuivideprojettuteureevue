<template>
  <div>
    <header>
      <h1>Profile: </h1>
      <h3>
        {{currentUser.name}} {{currentUser.firstName}}
      </h3>
    </header>
    <p>
      <strong>Id:</strong>
      {{currentUser.id}}
    </p>
    <p>
      <strong>Email:</strong>
      {{currentUser.email}}
    </p>
    <strong>Authorities:</strong>
    <p v-if="currentUser.role === 0">Vous devez attendre qu'un admin vous donne l'autorisation qui vous convient</p>
    <p v-if="currentUser.role === 1">Etudiant</p>
    <p v-if="currentUser.role === 2">Enseignant</p>
    <p v-if="currentUser.role === 3">Admin</p>
    <div v-if="currentUser.role === 3">
      <v-btn @click="adminPage" color="green">Gestion des utilisaters</v-btn>
    </div>
    <div v-if="currentUser.role === 2">
      <v-btn @click="enseignantPage" color="green">Gestion des projets</v-btn>
    </div>

  </div>
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
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/SignIn');
    }
  }
};
</script>
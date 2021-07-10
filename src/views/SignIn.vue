<template>
  <div class="submit-form mt-3 mx-auto">
    <p class="headline">Connexion</p>

    <div v-if="!submitted">
      <v-form ref="form" lazy-validation>
        <v-text-field
            v-model="user.name"
            :rules="[(v) => !!v || 'Il faut un nom']"
            label="name"
            required
        >
        </v-text-field>

        <v-text-field
            v-model="user.password"
            :rules="[(v) => !!v || 'Il faut un mot de passe']"
            label="password"
            type="password"
            required
        >
        </v-text-field>
      </v-form>
      <v-btn color="primary" class="mt-3" @click="connection">Connexion</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  data(){
    return{
      user: {
        name: "",
        password: "",
      },
      loading: false,
      submitted: false
    };
  },

  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },

  created() {
    if (this.loggedIn)
      this.$router.push('/profile');
  },

  methods: {
    connection() {
      this.loading = true;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          this.loading = false;
          return;
        }
      if (this.user.name && this.user.password){
        this.$store.dispatch('auth/login', this.user).then(
            () => {
              console.log(this.$store.state.auth.user);
              this.$router.push('/profile');
            },
            error => {
              this.loading = false;
              this.message =
                  (error.response && error.response.data) ||
                  error.message ||
                  error.toString();
            });
        }
      })
    }
  }
}
</script>

<style>
.submit-form{
  max-width: 350px;
  margin: auto;
}
</style>
<template>
  <div class="submit-form mt-3 mx-auto">
    <p class="headline">Connextion</p>

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
import AuthService from "@/services/auth.service";

export default {
  name: "SignIn",

  data(){
    return{
      user: {
        name: "",
        password: "",
      },
      submitted: false
    };
  },

  methods: {
    connection() {
      var data = {
        name: this.user.name,
        password: this.user.password,
      }

      AuthService.signIn(data).then((response) => {
        this.user.name = response.data.name;
        console.log(response.data);
        this.submitted = true;
      })
      .catch((e) => {
        console.log(e);
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
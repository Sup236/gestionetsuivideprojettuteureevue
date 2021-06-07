<template>
  <div class="submit-form mt-3 mx-auto">
    <p class="headline">Inscription</p>

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
          v-model="user.firstName"
          :rules="[(v) => !!v || 'Il faut un prenom']"
          label="firstName"
          required
        >
        </v-text-field>

        <v-text-field
            v-model="user.email"
            :rules="[(v) => !!v || 'Il faut une adresse mail']"
            label="email"
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

      <v-btn color="primary" class="mt-3" @click="saveUser">Enregistrer</v-btn>
    </div>

    <div v-else>
      <v-card class="mx-auto">
        <v-card-title>
          Enregistrement réussi
        </v-card-title>

        <v-card-subtitle>
          click sur le boutton pour vous connecté
        </v-card-subtitle>

        <v-card-actions color="success" @click="signIn">SignIn</v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import UserDataService from "@/services/UserDataService";

export default {
  name: "SignUp",

  data(){
    return{
      user:{
        id: null,
        name: "",
        firstName: "",
        email: "",
        role: "",
        password: "",
      },
      submitted: false
    };
  },

  methods: {
    saveUser(){
      var data ={
        name: this.user.name,
        firstName: this.user.firstName,
        email: this.user.email,
        role: 0,
        password: this.user.password,
      }

      UserDataService.create(data)
        .then((response) => {
          this.user.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    signIn(){
      this.submitted = false;
      this.user = {};
      this.$router.push("/SignIn");
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
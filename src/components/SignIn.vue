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

        <v-btn color="primary" class="v-btn" @click="connection" >Connexion</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import UserDataService from "@/services/UserDataService";

export default {
  name: "SignIn",

  data(){
    return{
      user:{
        name: "",
        password: "",
      },
      submitted: false
    };
  },

  methods: {
    connection(){
      var data = {
        name: this.user.name,
        password: this.user.password,
      }

      UserDataService.signIn(data)
        .then((response) => {
          this.user.id = response.data.id;
          this.submitted = true;

          if (response.data.role === 3){
            this.$router.push("/admin");
          }else if (response.data.role === 2) {
            this.$router.push("/enseignant");
          }else if (response.data.role === 1) {
            this.$router.push("/etudiant");
          }else {
            this.$router.push("/profile");
          }
        })
      .catch((e) => {
        console.log(e);
      });

    },
  }
}
</script>

<style>
.submit-form{
  max-width: 350px;
  margin: auto;
}
</style>
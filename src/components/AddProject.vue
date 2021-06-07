<template>
  <div class="submit-form mt-3 mx-auto">
    <p class="headline">Ajouter un projet</p>

    <div v-if="!submitted">
      <v-form ref="form" lazy-validation>
        <v-text-field
            v-model="project.sujet"
            :rules="[(v) => !!v || 'Il faut un sujet']"
            label="Sujet"
            required
        ></v-text-field>

        <v-text-field
          v-model="project.annee"
          :rules="[(v) => !!v || 'il faut une année']"
          label="Annee"
          required
          ></v-text-field>

        <v-autocomplete
          v-model="project.users"
          :items="project.users"
          :rules="[v => !!v || 'Il faut au moins un participant']"
          outlined
          dense
          multiple
          chips
          small-chips
          label="Participant"
          required
          return-object
          v-show="isReady"
        >
        </v-autocomplete>

        <v-select
          v-model="project.users"
          name="users"
          id="users"
        >
          <option v-bind:value="project.users.name">{{ project.users.name }}</option>
        </v-select>
      </v-form>

      <v-btn color="primary" class="mt-3" @click="saveProject">Enregistrer</v-btn>
    </div>

    <div v-else>
      <v-card class="mx-auto">
        <v-card-title>
          Enregistrement réussi
        </v-card-title>

        <v-card-subtitle>
          Clicker sur le boutton pour ajouter un nouveau projet
        </v-card-subtitle>

        <v-card-actions>
          <v-btn color="success" @click="newProject">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import ProjectDataService from "@/services/ProjectDataService";
import UserDataService from "@/services/UserDataService";

export default {
  name: "add-project",
  data() {
    return {
      project: {
        id: null,
        sujet: "",
        annee: "",
        users: "",
        etat: false,
      },
      submitted: false,
      isReady: false,
    };
  },

  methods: {
    saveProject(){
      var data = {
        sujet: this.project.sujet,
        annee: this.project.annee,
        users: this.project.users,
        etat: this.project.etat,
      };

      ProjectDataService.create(data)
        .then((response) => {
          this.project.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    newProject(){
      this.submitted = false;
      this.project = {};
    },

    getUsers() {
      UserDataService.getAll().then((data) => {
        this.project.users = JSON.parse(JSON.stringify(data.data));
        console.log(this.project.users);
        this.isReady = true;
      });
    },
  },

  mounted() {
    this.getUsers();
  },
};
</script>

<style>
  .submit-form{
    max-width: 300px;
  }
</style>
<template>
  <div v-if="currentProject" class="edit-form py-3">
    <p class="headline">Modiffier un projet</p>
    <v-form ref="form" lazy-validation>
      <v-text-field
        v-model="currentProject.sujet"
        :rules="[(v) => !!v || 'Il faut un sujet']"
        label="Sujet"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentProject.annee"
        :rules="[(v) => !!v || 'Il faut une date pour se projet']"
        label="Annee"
        required
      ></v-text-field>

      <label><strong>Etat:</strong></label>
      {{ currentProject.etat ? "Archiver" : "Non archiver" }}

      <v-divider class="my-5"></v-divider>

      <v-btn v-if="currentProject.etat"
             @click="updateArchivage(false)"
             color="primary"
             small
             class="mr-2"
      >
        Ne pas archiver
      </v-btn>

      <v-btn v-else
             @click="updateArchivage(true)"
             color="primary"
             small
             class="mr-2"
      >
        Archiver
      </v-btn>

      <v-btn color="error" small class="mr-2" @click="deleteProject">
        Supprimer
      </v-btn>

      <v-btn color="success" small @click="updateProject">
        Mettre à jour
      </v-btn>
    </v-form>

    <p class="mt-3">{{ message }}</p>
  </div>

  <div v-else>
    <p>Clicker sur un projet</p>
  </div>
</template>

<script>
import ProjectDataService from "@/services/ProjectDataService";

export default {
  name: "Project",

  data(){
    return {
      currentProject: null,
      message: "",
    };
  },

  methods: {
    getProject(id){
      ProjectDataService.get(id)
        .then((response) => {
          this.currentProject = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updateArchivage(etat){
      var data = {
        id: this.currentProject.id,
        sujet: this.currentProject.sujet,
        annee: this.currentProject.annee,
        etat: etat,
      };

      ProjectDataService.update(this.currentProject.id, data)
        .then((response) => {
          this.currentProject.etat = etat;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updateProject(){
      ProjectDataService.update(this.currentProject.id, this.currentProject)
        .then((response) => {
          console.log(response.data);
          this.message = "Le projet a bien été mis à jour";
        })
        .catch((e) => {
          console.log(e);
        });
    },

    deleteProject(){
      ProjectDataService.delete(this.currentProject.id)
        .then((response) => {
          console.log(response.data);
          this.$router.push({ name: "projects" });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.message = "";
    this.getProject(this.$route.params.id);
  },
};
</script>

<style>
  .edit-form {
    max-width: 300px;
    margin: auto;
  }
</style>
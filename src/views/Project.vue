<template>
  <v-row v-if="currentProject !== null">
    <v-col cols="12">
      <h1 class="mt-5 px-5">Projet tuteuré: {{ currentProject.sujet}}</h1>
    </v-col>

    <v-col cols="12" md="4" v-if="!currentProject.etat">
      <v-file-input
          type="file"
          label="Compte-rendu de Réunion"
          show-size
          small-chips
          multiple
          clearable
          @click="mkdirProject(currentProject)"
          @change="upload"
      >
        <template v-slot:selection="{ text, index }">
          <v-chip
            small
            text-color="white"
            color="#295671"
            close
            @click:close="remove(index)"
          >
            {{ text }}
          </v-chip>
        </template>
      </v-file-input>
    </v-col>
    <v-col cols="12" md="3" v-if="!currentProject.etat || currentProject.etat && currentUser.role === 2">
      gitlab
    </v-col>
    <v-col cols="12" md="3" class="pa-5 ml-15" v-if="!currentProject.etat && currentUser.role === 2">
      <h5>Soutenance: </h5>
      <v-text-field
          v-model="currentProject.noteSoutenance"
          type="number"
          name="noteS"
          label="Note sur 20"
      ></v-text-field>
      <v-btn>Proposer</v-btn>
      <h5>Rapport: </h5>
      <v-text-field
          v-model="currentProject.noteRapport"
          type="number"
          name="noteR"
          label="Note sur 20"
      ></v-text-field>
      <v-btn>Proposer</v-btn>
      <h5>Technique: </h5>
      <v-text-field
          v-model="currentProject.noteTechnique"
          type="number"
          name="noteT"
          label="Note sur 20"
      ></v-text-field>
      <v-btn>Proposer</v-btn>
    </v-col>
    <v-col cols="12" md="3" class="pa-5 ml-15" v-if="currentProject.etat || currentUser.role === 1">
      <h5>Soutenance: {{ currentProject.noteSoutenance }}/20</h5>
      <h5>Rapport: {{ currentProject.noteRapport }}/20</h5>
      <h5>Technique: {{ currentProject.noteTechnique }}/20</h5>
    </v-col>
    <v-col cols="12" md="4">
      Affichage des compte-rendu
    </v-col>
    <v-col cols="12" md="12" v-if="!currentProject.etat">
      <p>Note: <i>Tant que ce projet n'est pas archiver les notes ne sont pas définitive</i></p>
    </v-col>
  </v-row>
</template>

<script>
import ProjectDataService from "@/services/ProjectDataService";
import FileDataService from "@/services/FileDataService";

export default {
  name: "Project",

  data(){
    return {
      currentProject: null,
      currentFile : "",
      files: [],
      message: "",
      enseignantInProject: false,
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },

  created(){
    if (this.currentUser.role !== 2)
      this.$router.push('/profile');
    const currentURL = document.location.href;
    const projectId = currentURL.substring(currentURL.lastIndexOf(":")+1);
    this.getProject(projectId);
  },

  methods: {
    getProject(id){
      ProjectDataService.get(id)
        .then((response) => {
          this.currentProject = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    mkdirProject(project) {
      FileDataService.mkdirProject(project).then((response) => {
        console.log(response.data.message);
      });
    },

    remove(index) {
      this.files.splice(index, 1)
    },

    noteSoutenanceProposition() {

    },

    upload(e) {

      this.currentFile = e[0];

      const formData = new FormData();

      formData.append(this.currentFile.name, this.currentFile);

      FileDataService.upload(formData, this.currentProject)
          .then((response) => {
            console.log(response.data.message);
          })
          .catch(err => {
            console.log(err);
      });
    }
  },
};
</script>

<style>
</style>
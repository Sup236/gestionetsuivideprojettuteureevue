<!--
  Cette page permet d'évaluer si on est enseignant et d'afficher les notes d'un projet si on est étudiant
  Cette page fonctionne de la même manière que pour update un projet ou un utilisateur, voir admin.vue pour le script
-->
<template>
  <v-col cols="12" md="3" class="pa-5 ml-15">
    <h5>Soutenance: </h5>
    <v-text-field
        v-model="currentProject.noteSoutenance"
        type="number"
        name="noteS"
        label="Note sur 20"
    ></v-text-field>
    <v-btn @click="noteSoutenanceProposition">Proposer</v-btn>
    <h5>Rapport: </h5>
    <v-text-field
        v-model="currentProject.noteRapport"
        type="number"
        name="noteR"
        label="Note sur 20"
    ></v-text-field>
    <v-btn @click="noteRapportProposition">Proposer</v-btn>
    <h5>Technique: </h5>
    <v-text-field
        v-model="currentProject.noteTechnique"
        type="number"
        name="noteT"
        label="Note sur 20"
    ></v-text-field>
    <v-btn @click="noteTechniqueProposition">Proposer</v-btn>
  </v-col>
</template>

<script>
import ProjectDataService from "@/services/ProjectDataService";

export default {
  name: "Evaluation",
  data(){
    return {
      currentProject: {
        noteSoutenance: null,
        noteRapport: null,
        noteTechnique: null,
      }
    }
  },

  created(){
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

    noteSoutenanceProposition() {
      let data = {
        noteSoutenance: this.currentProject.noteSoutenance,
      }
      ProjectDataService.update(this.currentProject.id, data).then((response) => {
        console.log("Update: " + response.data.message);
      })
    },

    noteRapportProposition() {
      let data = {
        noteRapport: this.currentProject.noteRapport,
      }
      ProjectDataService.update(this.currentProject.id, data).then((response) => {
        console.log("Update: " + response.data.message);
      })
    },

    noteTechniqueProposition() {
      let data = {
        noteTechnique: this.currentProject.noteTechnique,
      }
      ProjectDataService.update(this.currentProject.id, data).then((response) => {
        console.log("Update: " + response.data.message);
      })
    },
  }
}
</script>

<style scoped>

</style>
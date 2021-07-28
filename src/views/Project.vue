<template>
  <v-row v-if="currentProject !== null">
    <v-col cols="12">
      <h1 class="mt-5 px-5">Projet tuteuré: {{ currentProject.sujet}}</h1>
    </v-col>
    <v-col cols="12" md="4" v-if="!currentProject.etat">
      <upload-files></upload-files>
    </v-col>
    <v-col cols="12" md="3" v-if="!currentProject.etat || currentProject.etat && currentUser.role === 2">
      <git-components></git-components>
    </v-col>
    <Evaluation v-if="!currentProject.etat && currentUser.role === 2"></Evaluation>
    <v-col align="center" justify="center" cols="12" md="3" class="pa-5 ml-15" v-if="currentProject.etat || currentUser.role === 1">
      <h5>Soutenance: {{ currentProject.noteSoutenance }}/20</h5>
      <h5>Rapport: {{ currentProject.noteRapport }}/20</h5>
      <h5>Technique: {{ currentProject.noteTechnique }}/20</h5>
    </v-col>
    <v-col cols="12" md="12" v-if="!currentProject.etat">
      <p>Note: <i>Tant que ce projet n'est pas archiver les notes ne sont pas définitive</i></p>
    </v-col>
  </v-row>
</template>

<script>
import ProjectDataService from "@/services/ProjectDataService";
import Evaluation from "@/components/Evaluation";
import UploadFiles from "@/components/UploadFiles";
import GitComponents from "@/components/GitComponents";

export default {
  name: "Project",

  components: {
    Evaluation,
    UploadFiles,
    GitComponents
  },

  data(){
    return {
      currentProject: null,
      enseignantInProject: false,
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },

  created(){
    if (this.currentUser.role === 3 && this.currentUser === 0)
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
  },
};
</script>

<style>
</style>
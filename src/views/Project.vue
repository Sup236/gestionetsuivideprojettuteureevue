<!--
  Ici on retrouve les diférentes fonctionnaliter dont nous avous besoin pour gérer et suivre un projet
  Certaine d'entre elles peuvent ne pas s'affiché si nous sommes étudiant
-->
<template>
  <v-row v-if="currentProject !== null">
    <v-col cols="12">
      <h1 class="mt-5 px-5">Projet tuteuré: {{ currentProject.sujet}}</h1>
    </v-col>
    <v-col cols="12" md="4" class="mt-n3">
      <upload-files></upload-files>
    </v-col>
    <v-col cols="12" md="4" v-if="!currentProject.etat || currentProject.etat && currentUser.role === 2">
      <git-components></git-components>
    </v-col>
    <Evaluation v-if="!currentProject.etat && currentUser.role === 2"></Evaluation>
    <v-col align="right" justify="center" cols="12" md="3" class="pa-5 ml-15" v-if="currentProject.etat || currentUser.role === 1">
      <h5 v-if="currentProject.noteSoutenance">Soutenance: {{ currentProject.noteSoutenance }}/20</h5>
      <h5 v-if="currentProject.noteRapport">Rapport: {{ currentProject.noteRapport }}/20</h5>
      <h5 v-if="currentProject.noteTechnique">Technique: {{ currentProject.noteTechnique }}/20</h5>
    </v-col>

    <v-col cols="12" md="12" mb="16">
      <depot-final></depot-final>
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
import UploadService from "@/services/UploadFilesService";
import DepotFinal from "@/components/DepotFinal";

export default {
  name: "Project",

  /**
   * Cette page utilise 4 commposants different, chaqu'une décrie une fonctionnalité
   */
  components: {
    Evaluation,
    UploadFiles,
    GitComponents,
    DepotFinal,
  },

  /**
   * @vue-data {object} currentProject - Sert a contenir le projet courant
   *
   * @vue-computed {object} currentUser - Indique l'utilisateur courant
   *
   * @vue-event {} created - verifie le rôle de l'utilisateur
   * Si ce n'est pas un étudiant ou un enseignant redirige vers la page profile
   * Sinon récupère le projet choisi
   * @vue-event {} getProject - récupère les information du projet choisi et créer un dossier pour se projet sur le serveur back end
   */
  data(){
    return {
      currentProject: null,
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
          UploadService.mkdirProject(this.currentProject);
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
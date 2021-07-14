<template>
  <v-row v-if="currentProject !== null">
    <v-col cols="12">
      <h1 class="mt-5 px-5">Projet tuteuré: {{ currentProject.sujet}}</h1>
    </v-col>

    <v-col cols="12" md="4" v-if="!currentProject.etat">
      Upload/Download:
      <v-progress-linear
          v-model="progress"
          color="light-blue"
          height="25"
          reactive
      >
        <strong>{{ progress }} %</strong>
      </v-progress-linear>
      <v-file-input
          counter
          label="File input"
          @change="selectFile"
          show-size
          small-chips
      >
      </v-file-input>
      <v-btn color="success" dark small @click="upload">
        Upload
        <v-icon right dark>mdi-cloud-upload</v-icon>
      </v-btn>
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
    <v-col cols="12" md="3" class="pa-5 ml-15" v-if="currentProject.etat || currentUser.role === 1">
      <h5>Soutenance: {{ currentProject.noteSoutenance }}/20</h5>
      <h5>Rapport: {{ currentProject.noteRapport }}/20</h5>
      <h5>Technique: {{ currentProject.noteTechnique }}/20</h5>
    </v-col>
    <v-col cols="12" md="4">
      <v-list>
        <v-subheader>Compte-rendu de réunion:</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item v-for="(file, index) in fileInfos" :key="index">
            <a :href="file.url">{{ file.name }}</a>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-col>
    <v-col cols="12" md="12" v-if="!currentProject.etat">
      <p>Note: <i>Tant que ce projet n'est pas archiver les notes ne sont pas définitive</i></p>
    </v-col>
  </v-row>
</template>

<script>
import ProjectDataService from "@/services/ProjectDataService";
import UploadFilesService from "@/services/UploadFilesService";

export default {
  name: "Project",

  data(){
    return {
      currentProject: null,
      currentFile: undefined,
      progress: 0,
      message: "",
      fileInfos: [],
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
    selectFile(file) {
      this.progress = 0;
      this.currentFile = file;
    },

    upload() {
      if (!this.currentFile) {
        this.message = "Please select a file!";
        return;
      }

      this.message = "";

      UploadFilesService.upload(this.currentFile, this.currentProject, (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
        console.log(this.currentFile);
      })
          .then((response) => {
            this.message = response.data.message;
            //return UploadFilesService.getFiles(this.currentProject);
          })
          .then((files) => {
            this.fileInfos = files.data;
          })
          .catch(() => {
            this.progress = 0;
            this.message = "Could not upload the file!";
            this.currentFile = undefined;
          });
    },

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
  },
};
</script>

<style>
</style>
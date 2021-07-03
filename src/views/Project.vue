<template>
  <v-row v-if="currentProject !== null">
    <v-col cols="12">
      <h1 class="mt-5 px-5">Projet tuteuré: {{ currentProject.sujet}}</h1>
    </v-col>

    <v-col cols="12" md="3">
      <v-file-input
          v-model="files"
          label="Compte-rendu de Réunion"
          show-size
          small-chips
          multiple
          clearable
          @click="mkdirProject(currentProject)"
          @change="upload($event)"
      >
        <template v-slot:selection="{ text, index}">
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
      currentFile : undefined,
      files: [],
      message: "",
    };
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
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    mkdirProject(project) {
      console.log(project)
      FileDataService.mkdirProject(project).then((response) => {
        console.log(response.data.message);
      });
    },

    remove(index) {
      this.files.splice(index, 1)
    },

    async upload(e) {
      console.log(e);

      var someFile = new File(e, 'test.pdf', {
        contentType: "application/pdf"
      })

      FileDataService.upload(someFile, this.currentProject).then((response) => {
            console.log(response.data.message);
          }).catch(e => Error(e));
    }
  },
};
</script>

<style>
</style>
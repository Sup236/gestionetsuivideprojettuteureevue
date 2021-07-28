<template>
  <div>
    <div v-if="currentFile">
      <div>
        <v-progress-linear
            v-model="progress"
            color="light-blue"
            height="25"
            reactive
        >
          <strong>{{ progress }} %</strong>
        </v-progress-linear>
      </div>
    </div>

    <v-row no-gutters justify="center" align="center">
      <v-col cols="8">
        <v-file-input
            show-size
            accept=".pdf, .odt, .md, .txt, .doc"
            label="Compte-rendu .pdf/.odt/.md/.txt/.doc"
            @change="selectFile"
        ></v-file-input>
      </v-col>

      <v-col cols="4" class="pl-2">
        <v-btn color="success" dark small @click="upload">
          Upload
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="message" border="left" color="blue-grey" dark>
      {{ message }}
    </v-alert>

    <v-card v-if="fileInfos.length > 0" class="mx-auto">
      <v-list>
        <v-subheader>Compte-rendu de réunion:</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item v-for="(file, index) in fileInfos" :key="index">
            <a @click="download(file.name)">{{ file.name }}</a>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import UploadService from "../services/UploadFilesService";
import ProjectDataService from "@/services/ProjectDataService";

export default {
  name: "upload-files",
  data() {
    return {
      currentProject: null,
      currentFile: undefined,
      progress: 0,
      message: "",

      fileInfos: []
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
            this.getFile(this.currentProject)
          })
          .catch((e) => {
            console.log(e);
          });
    },

    getFile(project){
      UploadService.getFiles(project).then((files) => {
        if (!files)
          this.fileInfos = [];
        else
          this.fileInfos = files.data;
      });
    },

    selectFile(file) {
      this.progress = 0;
      this.currentFile = file;
      UploadService.mkdirProject(this.currentProject)
    },

    upload() {
      if (!this.currentFile) {
        this.message = "Please select a file!";
        return;
      }

      this.message = "";

      UploadService.upload(this.currentFile, this.currentProject,(event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
          .then((response) => {
            this.message = response.data.message;
            return UploadService.getFiles(this.currentProject).then((files) => {
              this.fileInfos = files.data;
            });
          })
          .catch(() => {
            this.progress = 0;
            this.message = "Could not upload the file!";
            this.currentFile = undefined;
          });
    },

    download(fileName) {
      console.log(fileName);
      const nameFile = fileName;
      UploadService.download(this.currentProject,fileName).then(res => {
        console.log(res);
        let fileUrl = window.URL.createObjectURL(new Blob([res.data]));
        let element = document.createElement('a');

        // problème selon les formats de ficher

        element.href = fileUrl
        element.setAttribute('download', nameFile);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      });
    }
  },
};
</script>

<style scoped>

</style>
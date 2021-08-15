<!--
  Cette page correspond au composant UploadFile
  On y retrouve v-file-input qui permet de choisir un fichier d'un certain type (.pdf, .odt, ...)
  On y retrouve également un boutton upload qui envoie le fichier choisi sur le serveur
  Il y a également la liste des fichers se trouvant sur le serveur s'il y en a
-->
<template>
  <div>
    <v-row no-gutters justify="center" align="center">
      <v-col cols="8" v-if="!currentProject.etat || currentProject.etat && currentUser.role === 2">
        <v-file-input
            show-size
            accept=".pdf, .odt, .md, .txt, .doc"
            label="Compte-rendu .pdf/.odt/.md/.txt/.doc"
            @change="selectFile"
        ></v-file-input>
      </v-col>

      <v-col cols="4" class="pl-2" v-if="!currentProject.etat || currentProject.etat && currentUser.role === 2">
        <v-btn color="success" dark small @click="upload">
          Upload
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-card v-if="fileInfos.length > 0" class="mt-6 mx-auto">
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

/**
 * @vue-data {object, file, string, []} currentProject - Permet de contenir le projet courant
 * currentFile - Permet de contenir le fichier selectionner
 * message - Permet d'afficher un message si un ficher n'est pas selectionner
 * fileInfos - permet de contenir les information du ficher selectionner
 *
 * @vue-computed {object} currentUser - Permet de récupérer l'utilisateur courant
 *
 * @vue-event {} created - Permet de récupéré le projet courant par rapport à l'id dans url
 * @vue-event {project, files} getProject - Permet de récupéré le projet courant et appelle la fonction pour récupérer les fichiers du projet
 * @vue-event {files} getFile - Permet de récupéré les fichiers d'un projet
 * @vue-event {file} selectFile - Permet de récupéré le fichié selectionné
 * @vue-event {[], message} upload - Permet d'enregistré le ficher selectionné sur le serveur back end
 * permet également de récupéré la liste nouvelle liste des fichiers se trouvant sur le serveur
 * renvoie un message lorsque tout c'est bien passer ou bien lorsqu'il y a un problème
 * @vue-event {file} download - enregistre sur l'ordinateur de l'utilisateur le fichier selectionner par un click
 */
export default {
  name: "upload-files",
  data() {
    return {
      currentProject: null,
      currentFile: undefined,
      message: "",

      fileInfos: []
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
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
      this.currentFile = file;
    },

    upload() {
      if (!this.currentFile) {
        this.message = "Please select a file!";
        return;
      }

      this.message = "";

      UploadService.upload(this.currentFile, this.currentProject,(event) => {
        console.log(event);
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
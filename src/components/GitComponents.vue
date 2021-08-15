<!--
  Cette page contien un formulaire pour commit et push sur le gitlab de l'iut
  Elle contien également la liste des commits du dernier dépôt utiliser pour commit et push
  Cette liste pocède les mêmes fonctionnalité que la liste des utilisateurs dans admin.vue à l'exiption des actions
-->
<template>
  <v-col>
    <v-btn
        @click="clone"
        v-if="currentProject.clone"
        color="success"
        small
        dark
    >
      clone
      <v-icon right dark>mdi-cloud-download</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="800px">
      <template v-slot:activator="{ on, attrs }">
        <v-icon
            color="amber darken-4"
            v-bind="attrs"
            v-on="on"
            size="50"
            class="pa-5 ml-16"
        >
          mdi-gitlab
        </v-icon>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Initialization du gitlab IUT</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    v-model="gitlab.userName"
                    :rules="[(v) => !!v || 'Il faut ton identifiant IUT']"
                    label="Identifiant"
                    required
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    v-model="gitlab.accessToken"
                    :rules="[(v) => !!v || 'Il faut ton access Tokens']"
                    label="Access Token"
                    required
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    v-model="gitlab.repositoryName"
                    :rules="[(v) => !!v || 'Il faut le nom du repository']"
                    label="Nom de repository"
                    required
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    v-model="gitlab.msgCommit"
                    :rules="[(v) => !!v || 'Il faut un message pour le commit']"
                    label="message du commit"
                    placeholder="Initial commit"
                    required
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-file-input
                    show-size
                    @change="selectFile"
                >
                </v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="latestCommit"
      :search="search"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Liste des commits</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field v-model="search" label="Recherche" append-icon="mdi-magnify" single-line
                        hide-details></v-text-field>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-col>
</template>

<script>
import GitDataService from "../services/GitDataService";
import ProjectDataService from "@/services/ProjectDataService";

/**
 * @vue-data {string, object, boolean, object, [object], object, [object]}
 * search - Permet la recherche dans v-data-table
 * currentProject - Contien un élément de project à modifier, clone permet de stocker l'url qui redirige vers le dépôt du projet
 * dialog - Boolean permetant d'afficher ou non le formulaire pour commit et push
 * gitlab - Contien les information pour commit et push
 * headers - Contien la liste des différentes colonnes de v-data-table, pour les parametres voir admin.vue
 * lastCommit - Contien les informations du dernier commit
 * latestCommit - Contien la liste des derniers commit
 *
 * @vue-computed {object} currentUser - renvoie l'utilisateur courant
 *
 * @vue-watch {} dialog - Permet d'afficher ou non les formulaire
 *
 * @vue-event {} created - Récupère le projet courant et les derniers commit si c possible
 * @vue-event {project} getProject - Permet de récupéré le projet courant
 * @vue-event {file} selectFile - Permet de récupéré le fichié selectionné pour le push
 * @vue-event {} close - Ferme la boite de dialog
 * @vue-event {message} save - Permet de modifier la valeur de currentProject.clone,
 * Upload le ficher selection pour pouvoir le push en suite
 * @vue-event {[]} getLatestCommit - Récupère la liste des derniers commits
 * @vue-event {} getDisplayCommit - Permet le bonne affichage des commits
 * @vue-event {windows.location} clone - Redirige vers le dépôt gitlab du projet
 * @vue-event {} mounted - Réinitialize les derniers commit
 */
export default {
  name: "git-components",
  data() {
    return {
      search: '',
      currentProject: {
        clone: '',
      },
      dialog: false,
      gitlab: {
        userName: '',
        accessToken: '',
        repositoryName: '',
        msgCommit: '',
      },

      headers: [
        {text: "Mail de l'auteur", align: "Start", value: "author_email", sortable: false},
        {text: "Nom de l'auteur", value: "author_name", sortable: false},
        {text: "Message", value: "message", sortable: false},
      ],

      lastCommit: {
        author_mail: "",
        author_name: "",
        date: "",
        message: "",
      },

      latestCommit: [],
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  created() {
    const currentURL = document.location.href;
    const projectId = currentURL.substring(currentURL.lastIndexOf(":") + 1);
    this.getProject(projectId);
    this.getLatestCommit(projectId);
  },

  methods: {
    getProject(id) {
      ProjectDataService.get(id)
          .then((response) => {
            this.currentProject = response.data;
          })
          .catch((e) => {
            console.log(e);
          });
    },

    selectFile(file) {
      this.currentFile = file;
    },

    close() {
      this.dialog = false;
    },

    save() {
      this.currentProject.clone = `https://gitlab.iut-bm.univ-fcomte.fr/${this.gitlab.userName}/${this.gitlab.repositoryName}`;
      ProjectDataService.update( this.currentProject.id, this.currentProject).then(res => {
        console.log(res.data);
      })

      if (!this.currentFile) {
        this.message = "Please select a file!";
        return;
      }

      GitDataService.uploadForPush(this.currentFile, this.currentProject).then(res => {
        console.log(res.data);
        GitDataService.initRepository(this.gitlab, this.currentProject).then(res => {
          console.log(res.data);
        });
      })

      this.close();
    },

    getLatestCommit(id) {
      GitDataService.lastCommit(id).then(res => {
        for (let i = 0; i < res.data.all.length; i++) {
          this.latestCommit = (res.data.all.map(this.getDisplayCommit));
        }
      })
    },

    getDisplayCommit(lastCommit) {
      return {
        author_email: lastCommit.author_email,
        author_name: lastCommit.author_name,
        message: lastCommit.message,
      }
    },

    clone() {
      window.location.href = this.currentProject.clone;
    }
  },

  mounted() {
    const currentURL = document.location.href;
    const projectId = currentURL.substring(currentURL.lastIndexOf(":") + 1);
    this.getLatestCommit(projectId);
  }
}
</script>

<style>
</style>
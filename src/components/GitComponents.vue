<template>
  <v-col>
    <v-dialog v-model="dialog" max-width="800px">
      <template v-slot:activator="{ on, attrs }">
        <v-icon
            color="amber darken-4"
            v-bind="attrs"
            v-on="on"
            size="250"
            class="pa-16 ml-16"
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
  </v-col>
</template>

<script>
import GitDataService from "../services/GitDataService";
import ProjectDataService from "@/services/ProjectDataService";

export default {
  name: "git-components",
  data(){
    return{
      currentProject: null,
      dialog: false,
      gitlab: {
        userName: '',
        accessToken: '',
        repositoryName: '',
        msgCommit: '',
      }
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

    selectFile(file) {
      this.currentFile = file;
    },

    close(){
      this.dialog = false;
    },

    save(){
      console.log(this.gitlab);
      GitDataService.initRepository(this.gitlab, this.currentProject).then(res => {
        console.log(res);
      });

      this.close();
    }
  }
}
</script>

<style>
</style>
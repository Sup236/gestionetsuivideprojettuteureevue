<template>
  <v-row align="center" class="list px-3 mx-auto">
    <v-col cols="12" md="8">
      <v-text-field v-model="search" label="Recherche" append-icon="mdi-magnify" single-line
                    hide-details></v-text-field>
    </v-col>

    <v-col cols="12" sm="12">
      <v-data-table
          :headers="headers"
          :items="projects"
          :search="search"
          class="elevation-1"
          hide-default-footer
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="production(item)"
            color="amber accent-3"
          >
            mdi-archive
          </v-icon>
          <v-icon
              small
              color="green darken-1"
              @click="projectDetails(item)"
          >
            mdi-arrow-right-bold
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import ProjectDataService from "@/services/ProjectDataService";
import UserDataService from "@/services/UserDataService";

export default {
  name: "archive",

  data() {
    return {
      search: '',
      projects: [],
      etudiants: [],
      enseignants: [],
      headers: [
        {text: "Sujets", align: "Start", value: "sujet"},
        {text: "Années", type: "date", value: "annee"},
        {text: "Etudiants", value: "etudiants"},
        {text: "Tuteures", value: "enseignants"},
        {text: "Actions", value: "actions", sortable: false}
      ],
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      ProjectDataService.getAllArchive()
          .then((response) => {
            this.projects = response.data.map(this.getDisplayProject);
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
    },

    initializeEnseignant(){
      UserDataService.getEnseignant().then((response) => {
        const dataEnseignant = JSON.parse(JSON.stringify(response.data));
        for (let i = 0; i < dataEnseignant.length; i++){
          this.enseignants.push(dataEnseignant[i]);
        }
      }).catch((e) => {
        console.log(e);
      });
    },

    initializeEtudiants() {
      UserDataService.getEtudiant().then((response) => {
        const dataEtudiant = JSON.parse(JSON.stringify(response.data));
        for (let i = 0; i < dataEtudiant.length; i++) {
          this.etudiants.push(dataEtudiant[i]);
        }
      }).catch((e) => {
        console.log(e);
      });
    },

    production(project) {
      if (project.etat)
        ProjectDataService.archive(project.id)
    },

    projectDetails(project) {
      this.$router.push(`/enseignant/projects:${project.id}`)
    },

    getDisplayProject(project) {
      let etudiantList = [];
      let enseignantList = [];
      project.users.forEach(user => {
        if (user.role === 1) {
          this.etudiants.push(user)
          etudiantList.push(user.name)
        }else if (user.role === 2) {
          this.enseignants.push(user)
          enseignantList.push(user.name)
        }
      })
      return {
        id: project.id,
        sujet: project.sujet.length > 10 ? project.sujet.substr(0, 10) : project.sujet,
        annee: project.annee,
        etudiants: etudiantList,
        enseignants: enseignantList,
      };
    },
  }
}
</script>

<style scoped>

</style>
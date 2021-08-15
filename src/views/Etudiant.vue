<!--
  Même système d'affichage que admin.vue
  Ici nous affichons seulement les projets qui concerne l'étudiant qui est connecté
-->
<template>
  <v-row align="center" class="list px-3 mx-auto">
    <v-col cols="12" sm="12">
      <v-data-table
          :headers="headers"
          :items="projects"
          :search="search"
          class="elevation-1"
          hide-default-footer
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Projets Tuteurés</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-text-field v-model="search" label="Recherche" append-icon="mdi-magnify" single-line hide-details></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="amber accent-3"
                   dark
                   class="mb-2 mr-8"
                   @click="archivePage"
            >
              Archive
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
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
  name: "Etudiant",

  data() {
    return {
      search: '',
      allProject: [],
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
    this.initializeEnseignant();
    this.initializeEtudiants();
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  methods: {
    initialize() {
      ProjectDataService.getAll()
          .then((response) => {
            this.allProjects = response.data.map(this.getDisplayProject);
            this.allProjects.forEach(project => {
              project.etudiants.forEach(etudiant => {
                if (this.currentUser.name === etudiant){
                  this.projects.push(project);
                }
              })
            })
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

    projectDetails(project) {
      this.$router.push(`/etudiant/projects:${project.id}`)
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

    archivePage() {
      return this.$router.push('/enseignant/archive')
    }
  }
}
</script>

<style>
</style>
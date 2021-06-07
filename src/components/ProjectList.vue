<template>
  <v-row align="center" class="list px-3 mx-auto">
    <v-col cols="12" md="8">
      <v-text-field v-model="sujet" label="Recherche par Sujet"></v-text-field>
    </v-col>

    <v-col cols="12" md="4">
      <v-btn small @click="rechercheSujet">
        Recherche
      </v-btn>
    </v-col>

    <v-col cols="12" sm="12">
      <v-card-title>Projets</v-card-title>

      <v-data-table
        :headers="headers"
        :items="projects"
        disable-pagination
        :hide-default-footer="true"
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-icon small class="mr-2" @click="editProject(item.id)">mdi-pencil</v-icon>
          <v-icon small @click="deleteProject(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>

      <v-card-actions v-if="projects.length > 0">
        <v-btn small color="error" @click="removeAllProjects">
          Tout supprimer
        </v-btn>
      </v-card-actions>
    </v-col>
  </v-row>
</template>

<script>
import ProjectDataService from "@/services/ProjectDataService";

export default {
  name: "projects-list",
  data(){
    return {
      projects: [],
      sujet: "",
      headers: [
        { text: "Sujet", align: "start", sortable: false, value: "sujet" },
        { text: "Annee", value: "annee", sortable: false },
        { text: "Users", value: "users", sortable: false },
        { text: "etat", value: "etat", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },

  methods: {
    retrieveProjects(){
      ProjectDataService.getAll()
        .then((response) => {
          this.projects = response.data.map(this.getDisplayProject);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList(){
      this.retrieveProjects();
    },

    removeAllProjects(){
        ProjectDataService.deleteAll()
            .then((response) => {
              console.log(response.data);
              this.refreshList();
            })
            .catch((e) => {
              console.log(e);
            });
    },

    rechercheSujet(){
      ProjectDataService.findBySujet(this.sujet)
        .then((response) => {
          this.projects = response.data.map(this.getDisplayProject);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    editProject(id){
      this.$router.push({ name: "project-details", params: { id: id } });
    },

    deleteProject(id){
      ProjectDataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayProject(project){
      return {
        id: project.id,
        sujet: project.sujet.length > 30 ? project.sujet.substr(0,30) + "..." : project.sujet,
        annee: project.annee,
        etat:project.etat ? "Archiver" : "Non Archiver",
      };
    },
  },
  mounted(){
    this.retrieveProjects();
  },
};
</script>

<style>
  .list {
    max-width: 750px;
    margin: auto;
  }
</style>
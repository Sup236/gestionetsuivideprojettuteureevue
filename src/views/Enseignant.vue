<template>
  <v-row align="center" class="list px-3 mx-auto">
    <v-col cols="12" md="8">
      <v-text-field v-model="search" label="Recherche" append-icon="mdi-magnify" single-line hide-details></v-text-field>
    </v-col>

    <v-col cols="12" sm="12">
      <v-data-table
          :headers="headers"
          :items="projects"
          :search="search"
          class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Projets Tuteurées</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="amber accent-3"
                   dark
                   class="mb-2 mr-8"
                   @click="archivePage"
            >
              Archive
            </v-btn>
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary"
                       dark
                       class="mb-2"
                       v-bind="attrs"
                       v-on="on"
                >
                  Nouveau projet
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            v-model="editedProject.sujet"
                            :rules="[(v) => !!v || 'Il faut un sujet']"
                            label="Sujet"
                            required
                        >
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            v-model="editedProject.annee"
                            :rules="[(v) => !!v || 'Il faut une année de production']"
                            type="date"
                            label="Année"
                            required
                        >
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                            v-model="editedProject.etudiants"
                            :rules="[(v) => !!v || 'Il faut au moins un utilisateur']"
                            :items="etudiants"
                            item-text="name"
                            outlined
                            dense
                            multiple
                            label="Etudiants"
                            return-object
                            required
                        >
                        </v-autocomplete>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                            v-model="editedProject.enseignants"
                            :rules="[(v) => !!v || 'Il faut au moins un utilisateur']"
                            :items="enseignants"
                            item-text="name"
                            outlined
                            dense
                            multiple
                            label="Enseignants"
                            return-object
                            required
                        >
                        </v-autocomplete>
                      </v-col>

                      <v-col cols="12" s="6" md="4">
                        <v-checkbox
                            v-model="editedProject.etat"
                            label="Archivage"
                            required
                        >
                        </v-checkbox>
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
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
              small
              class="mr-2"
              @click="editProject(item)"
              color="primary"
          >
            mdi-pencil
          </v-icon>

          <v-icon
              small
              color="red"
              class="mr-2"
              @click="deleteProject(item)"
          >
            mdi-delete
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
  name: "Enseignant",
  data() {
    return {
      search: '',
      dialog: false,
      projects: [],
      name: "",
      headers: [
        {text: "Sujets", align: "Start", value: "sujet"},
        {text: "Années", type: "date", value: "annee"},
        {text: "Etudiants", value: "etudiants"},
        {text: "Tuteures", value: "enseignants"},
        {text: "Actions", value: "actions", sortable: false}
      ],
      editedIndex: -1,
      editedProject: {
        id: null,
        sujet: "",
        annee: "",
        etudiants: [],
        enseignants: [],
        etat: false,
      },
      defaultProject: {
        id: null,
        sujet: "",
        annee: "",
        etudiants: [],
        enseignants: [],
        etat: false,
      },

      etudiants: [],
      enseignants: [],

    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nouveau Projet' : 'Modification'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  created() {
    this.initialize();
    this.initializeEtudiants();
    this.initializeEnseignant();
  },

  methods: {
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

    initialize() {
      ProjectDataService.getAll()
          .then((response) => {
            this.projects = response.data.map(this.getDisplayProject);
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
    },

    editProject(project) {
      this.editedIndex = this.projects.indexOf(project);
      this.editedProject = Object.assign({}, project);
      this.dialog = true;
    },

    deleteProject(project) {
      const index = this.projects.indexOf(project);
      if (confirm('êtes vous sur de vouloir suprimmer se projet ?') && this.projects.splice(index, 1))
        ProjectDataService.delete(project.id);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedProject = Object.assign({}, this.defaultProject);
        this.editedIndex = -1;
      })
      this.initialize();
      this.initializeEtudiants();
      this.initializeEnseignant();
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.projects[this.editedIndex], this.editedProject);
        if (this.editedProject.sujet !== this.projects[this.editedIndex].sujet ||
            this.editedProject.annee !== this.projects[this.editedIndex].annee ||
            this.projects[this.editedIndex].etat) {
          ProjectDataService.update(this.editedProject.id, this.editedProject).then((response) => {
            console.log("Update: " + response.data.message);
          })
        }
        if (this.editedProject.etudiants !== []) {
          console.log(this.editedProject.etudiants)

          this.editedProject.etudiants.forEach(user => {
            ProjectDataService.addUserInProject(user.id, this.editedProject.id)
          })
        }
        if (this.editedProject.enseignants !== []) {
          console.log(this.editedProject.enseignants)

          this.editedProject.enseignants.forEach(user => {
            console.log(user);
            ProjectDataService.addUserInProject(user.id, this.editedProject.id)
          })
        }
      } else {
        let etudiants = this.editedProject.etudiants
        let enseignants = this.editedProject.enseignants
        ProjectDataService.create(this.editedProject).then((response) => {
          this.editedProject.id = response.data.id;
          this.editedProject.etudiants = etudiants;
          this.editedProject.enseignants = enseignants;

          if (this.editedProject.etudiants !== []) {
            this.editedProject.etudiants.forEach(user => {
              ProjectDataService.addUserInProject(user.id, this.editedProject.id).then((response) => {
                console.log("add user in project: " + response.data.message);
              })
            })
          }
          if (this.editedProject.enseignants !== []) {
            this.editedProject.enseignants.forEach(user => {
              ProjectDataService.addUserInProject(user.id, this.editedProject.id).then((response) => {
                console.log("add user in project: " + response.data.message);
              })
            })
          }

        })
      }
      this.close();
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

    archivePage() {
      return this.$router.push('/enseignant/archive')
    }
  },

  mounted() {
    this.initialize();
  },
};
</script>

<style scoped>

</style>
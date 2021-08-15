<!--
  Cette page est la page des administrateurs
  On y retrouve les bouttons pour créer/modifier/supprimer un utilisateur
  On y retrouve également le formulaire de création et de modification
  Certain boutton son créer avec des icons (balise v-icon)
-->
<template>
  <v-row align="center" class="list px-3 mx-auto">
    <v-col clos="12" md="8">

    </v-col>

    <v-col cols="12" sm="12">
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        class="elevation-1"
        hide-default-footer
        >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Utilisateurs</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-text-field v-model="search" label="Recherche" append-icon="mdi-magnify" single-line hide-details></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary"
                       dark
                       class="mb-2"
                       v-bind="attrs"
                       v-on="on"
                >
                  Nouvel Utilisateur
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col clos="12" sm="6" md="4">
                        <v-text-field
                            v-model="editedUser.name"
                            :rules="[(v) => !!v || 'Il faut un nom']"
                            label="Nom"
                            required
                        >
                        </v-text-field>
                      </v-col>

                      <v-col clos="12" sm="6" md="4">
                        <v-text-field
                            v-model="editedUser.firstName"
                            :rules="[(v) => !!v || 'Il faut un prénom']"
                            label="Prénom"
                            required
                        >
                        </v-text-field>
                      </v-col>

                      <v-col clos="12" sm="6" md="4">
                        <v-text-field
                            v-model="editedUser.email"
                            :rules="rules"
                            label="Email"
                            required
                        >
                        </v-text-field>
                      </v-col>


                      <v-col clos="12" sm="6" md="4">
                        <v-autocomplete
                            v-model="editedUser.role"
                            :items="role"
                            outlined
                            dense
                            multiple
                            label="role"
                            required
                        >
                        </v-autocomplete>
                      </v-col>

                      <v-col clos="12" sm="6" md="4">
                        <v-text-field
                            v-model="editedUser.password"
                            :rules="[(v) => !!v || 'Il faut un mot de passe']"
                            label="Mot de passe"
                            type="password"
                            required
                        >
                        </v-text-field>
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
            color="primary"
            class="mr-2"
            @click="editUser(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            color="red"
            @click="deleteUser(item)"
            v-if="currentUser.name !== item.name"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
    </v-col>

    <v-col cols="12" md="5">
      <h4>Légende des Rôles</h4>
      <ul>
        <li>
          0 : Nouvelle utilisateur, en attente d'un rôle
        </li>
        <li>
          1 : Rôle Etudiant
        </li>
        <li>
          2 : Rôle Enseignant
        </li>
        <li>
          3 : Rôle Admin
        </li>
      </ul>
    </v-col>

  </v-row>
</template>

<script>
import UserDataService from "@/services/UserDataService";

/**
 * @vue-data {[], string, boolean, [object], [object], number, object, object, [number]}
 * rules - Contien les règles pour identifier une adresse mail
 * search - Permet la recherche dans v-data-table
 * dialog - Boolean permetant d'afficher ou non le formulaire de création/modification
 * users - Contien la liste des utilisateurs
 * headers - Contien la liste des différentes colonnes de v-data-table,
 * @param text: "Nom de la colonne"
 * @param align: "position particuliaire dans l'affichage de la table"
 * @param value: "nom de la valeur à afficher dans la colonne"
 * @param sortable: "boolean indiquant si l'on veut pouvoir trié ou non la colonne"
 * editedIndex - Valeur de l'index de l'utilisateur a modifier ou a créer (la valeur pour la création est de -1)
 * editedUser - Contien toutes les valeurs que l'on retrouve dans un utilisateur avec un rôle par défaut
 * defaultUser - Contien toutes les valeurs que l'on retrouve dans un utilisateur avec un rôle par défaut
 * role - Contien 4 chiffres, chaque chiffre correspond à un rôle (voir la légende des rôles)
 *
 * @vue-computed {string, object} formTitle - renvoie le titre qui correspond au formulaire choisi
 * currentUser - renvoie l'utilisateur courant
 *
 * @vue-watch {} dialog - Permet d'afficher ou non les formulaire
 *
 * @vue-event {} created - Vérifie si l'utilisateur courant est admin si ce n'est pas le cas redirige vers la page profile
 * @vue-event {} initialize - Récupère la liste des utilisateurs sur le serveur back end
 * @vue-event {} editUser - Ouvre la page de dialog pour modifier un utilisateur
 * @vue-event {windows.alert} deleteUser - Supprime l'utilisateur choisi
 * @vue-event {} close - Ferme une page de dialog et réinisialise la table
 * @vue-event {} save - Premet de sauvegarder les modifications d'un utilisateur ou de le créer dans la base de donnée
 * @vue-event {object} getDisplayUser - Permet l'affichage d'un utilisateur dans v-dat-table
 * @vue-event {} mounted - Réinitialize la page
 */
export default {
  name: "admin",
  data(){
    return {
      rules: [
        value => !!value || 'Required.',
        value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      ],
      search: '',
      dialog: false,
      users: [],
      headers: [
        { text: "Noms",align: "Start", value: "name" },
        { text: "Prenoms", value: "firstName" },
        { text: "Mails", value: "email" },
        { text: "Rôles", value: "role" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      editedIndex: -1,
      editedUser: {
        id: null,
        name: "",
        firstName: "",
        email: "",
        role: [0],
        password: ""
      },
      defaultUser: {
        id: null,
        name: "",
        firstName: "",
        email: "",
        role: [0],
        password: ""
      },
      role: [0,1,2,3],
    };
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nouvel utilisateur' : 'Modification'
    },
    currentUser() {
      return this.$store.state.auth.user;
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  created() {
    if (this.currentUser.role !== 3)
      this.$router.push('/profile');
    this.initialize()
  },

  methods: {
    initialize() {
      UserDataService.getAdmin()
      .then((res) => {
        this.users = res.data.map(this.getDisplayUser);
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
    },

    editUser (user) {
      this.editedIndex = this.users.indexOf(user);
      this.editedUser = Object.assign({}, user);
      this.dialog = true;
    },

    deleteUser (user) {
      const index = this.users.indexOf(user);
      if (confirm('êtes vous sur de vouloir suprimmer cette utilisateur ?') && this.users.splice(index, 1))
        UserDataService.delete(user.id);
    },

    close () {
      this.dialog = false;
      this.$nextTick(()=> {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      })
      this.initialize();
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedUser);
        UserDataService.editUser(this.editedUser.id, this.editedUser);
      }else {
        UserDataService.addUser(this.editedUser)
      }
      this.close();
    },

    getDisplayUser(user){
      return {
        id: user.id,
        name: user.name.length > 30 ? user.name.substr(0,30) + "..." : user.name,
        firstName: user.firstName.length > 30 ? user.firstName.substr(0,30)+"..." : user.firstName,
        email: user.email.length > 30 ? user.email.substr(0,30)+"..." : user.email,
        role: user.role,
      };
    },
  },

  mounted() {
    this.initialize();
  },
};
</script>

<style>
</style>
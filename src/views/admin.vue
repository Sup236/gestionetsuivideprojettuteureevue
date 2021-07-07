<template>
  <v-row align="center" class="list px-3 mx-auto">
    <v-col clos="12" md="8">
      <v-text-field v-model="search" label="Recherche" append-icon="mdi-magnify" single-line hide-details></v-text-field>
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
                            :rules="[(v) => !!v || 'Il faut une adresse mail']"
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
export default {
  name: "admin",
  data(){
    return {
      search: '',
      dialog: false,
      users: [],
      name: "",
      headers: [
        { text: "Noms",align: "Start", value: "name" },
        { text: "Prenoms", value: "firstName" },
        { text: "Mails", value: "email" },
        { text: "Roles", value: "role" },
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
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  created() {
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
      confirm('êtes vous dur de vouloir suprimmer cette utilisateur ?') && this.users.splice(index, 1);
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
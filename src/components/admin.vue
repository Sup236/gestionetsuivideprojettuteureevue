<template>
  <v-row align="center" class="list px-3 mx-auto">
    <v-col clos="12" md="8">
      <v-text-field v-model="name" label="Recheche par name"></v-text-field>
    </v-col>

    <v-col cols="12" md="4">
      <v-btn small @click="rechercheUser">
        Recherche
      </v-btn>
    </v-col>

    <v-col cols="12" sm="12">
      <v-card-title>Utilisateurs</v-card-title>

      <v-data-table
        :headers="headers"
        :items="users"
        disable-pagination
        :hide-default-footer="true">
        <template v-slot:[`item.action`="{ item }">
          <v-icon small class="mr-2" @click="editUser(item.id)">mdi-pencil</v-icon>
          <v-icon small class="mr-2" @click="deleteUser(item.id)">mdi-delete</v-icon>
          <!-- trouver un meilleur moyen pour la gestion des roles -->
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import UserDataService from "@/services/UserDataService";

export default {
  name: "admin",
  data(){
    return {
      users: [],
      name: "",
      headers: [
        { text: "Nom", align: "start", sortable: false, value: "name" },
        { text: "Prenom", value: "firstName", sortable: false },
        { text: "Mail", value: "email", sortable: false },
        { text: "Role", value: "role", sortable: false },
      ],
    };
  },

  methods: {
    retrieveUsers() {
      UserDataService.getAll()
      .then((res) => {
        this.users = res.data.map(this.getDisplayUser);
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
    },

    refreshUsersList(){
      this.retrieveUsers();
    },

    rechercheUser(){
      UserDataService.findByName(this.name)
      .then((res) => {
        this.users = res.data.map(this.DisplayUsers);
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
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
    this.retrieveUsers();
  },
};
</script>

<style>
  .list{
    max-width: 1000px;
    margin: auto;
  }
</style>
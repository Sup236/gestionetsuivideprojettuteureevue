<template>
  <v-col cols="12" md="4">
    <div v-if="currentUser.role === 2">
      <h5>Lien vers le Dépôt Moodle</h5>
      <v-text-field
          v-model="currentProject.depot"
          type="url"
          name="depotMoodle"
          label="Entrer le lien vers le dépôt moodle voulu"
      ></v-text-field>

      <v-btn @click="activerDepot">Activer</v-btn>
    </div>
    <v-btn @click="depot" v-if="currentProject.depot">Déposer le projet</v-btn>
  </v-col>
</template>

<script>
import ProjectDataService from "@/services/ProjectDataService";

export default {
  name: "DepotFinal",

  data() {
    return {
      currentProject: {
        depot: "",
      }
    }
  },

  created() {
    const currentURL = document.location.href;
    const projectId = currentURL.substring(currentURL.lastIndexOf(":") + 1);
    this.getProject(projectId);
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
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

    activerDepot() {
      let data = {
        depot: this.currentProject.depot,
      }

      ProjectDataService.update(this.currentProject.id, data).then((response) => {
        console.log("Update: " + response.data.message);
      })
    },

    depot() {
      window.location.href = this.currentProject.depot;
    }
  },
}
</script>

<style scoped>

</style>
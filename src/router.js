import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes:[
        {
          path: "/SignIn",
          alias: "/SignIn",
          name: "/SignIn",
          component: () => import("./components/SignIn")
        },
        {
          path: "/SignUp",
          alias: "/SignUp",
          name: "SignUp",
          component: () => import("./components/SignUp")
        },
        {
            path: "/projects",
            alias: "/projects",
            name: "projects",
            component: () => import("./components/ProjectList")
        },
        {
            path: "/projects/:id",
            name: "project-details",
            component: () => import("./components/Project")
        },
        {
            path: "/ajouter",
            name: "ajouter",
            component: () => import("./components/AddProject")
        },
        {
            path: "/admin",
            alias: "/admin",
            name: "/admin",
            component: () => import("./components/admin")
        }
    ]
});
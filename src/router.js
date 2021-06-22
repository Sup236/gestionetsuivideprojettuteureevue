import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

let router = new Router({
    mode: "history",
    routes:[
        {
          path: "/SignIn",
          name: "/SignIn",
          component: () => import("./views/SignIn"),
          // meta: {
          //   guest: true
          // }
        },
        {
          path: "/SignUp",
          name: "SignUp",
          component: () => import("./views/SignUp"),
            // meta: {
            //     guest: true
            // }
        },
        {
            path: "/projects",
            name: "projects",
            component: () => import("./components/ProjectList"),
            // meta: {
            //     requiresAuth: true
            // }
        },
        {
            path: "/projects/:id",
            name: "project-details",
            component: () => import("./views/Project"),
            // meta:{
            //     requiresAuth: true
            // }
        },
        {
            path: "/ajouter",
            name: "ajouter",
            component: () => import("./components/AddProject"),
            // meta: {
            //     requiresAuth: true
            // }
        },
        {
            path: "/admin",
            name: "/admin",
            component: () => import("./views/admin"),
            // meta: {
            //     requiresAuth: true,
            //     is_admin: true
            // }
        },
        {
            path: "/enseignant",
            name: "/enseignant",
            component: () => import("./views/Enseignant"),
        },
    ]
});

export default router;
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

let router = new Router({
    mode: "history",
    routes:[
        {
          path: "/SignIn",
          name: "SignIn",
          component: () => import("./views/SignIn"),
          meta: {
            guest: true
          }
        },
        {
          path: "/SignUp",
          name: "SignUp",
          component: () => import("./views/SignUp"),
            meta: {
                guest: true
            }
        },
        {
            path: "/enseignant/projects:id",
            name: "project-details",
            component: () => import("./views/Project"),
            meta:{
                requiresAuth: true
            }
        },
        {
            path: "/admin",
            name: "admin",
            component: () => import("./views/admin"),
            // meta: {
            //     requiresAuth: true,
            //     is_admin: true
            // }
        },
        {
            path: "/enseignant",
            name: "enseignant",
            component: () => import("./views/Enseignant"),
        },

        {
            path: "/enseignant/archive",
            name: "archive",
            component: () => import("./views/archive"),
        },
    ]
});

export default router;
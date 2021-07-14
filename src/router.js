import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

let router = new Router({
    mode: "history",
    routes:[
        {
          path: "/",
          name: "home",
        },
        {
          path: "/signIn",
          name: "SignIn",
          component: () => import("./views/SignIn"),
        },
        {
          path: "/signUp",
          name: "SignUp",
          component: () => import("./views/SignUp"),
        },
        {
            path: "/enseignant/projects:id",
            name: "enseignant-project-details",
            component: () => import("./views/Project"),
        },
        {
            path: "/admin",
            name: "admin",
            component: () => import("./views/admin"),
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

        {
          path: "/etudiant",
          name: "etudiant",
          component: () => import("./views/Etudiant"),
        },

        {
          path: "/etudiant/project:id",
          name: "etudiant-project-details",
          component: () => import("./views/Project"),
        },

        {
            path:"/profile",
            name:"profile",
            component: () => import("./views/profile"),
        }
    ]
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/signIn', '/signUp'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    if (authRequired && !loggedIn) {
        next('/signIn');
    }else {
        next();
    }
});

export default router;
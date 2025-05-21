import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
// import { Loading, QSpinnerGears } from "quasar";

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function({ store } /* { ssrContext } */) {
  const Router = new VueRouter({
    //TODO scroll is not happening on route change
    scrollBehavior: () => ({ x: 0, y: 0, behavior: "smooth" }),
    // scrollBehavior(to, from) {
    //   return { x: 0, y: 0 };
    // },

    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  Router.beforeEach((to, from, next) => {
    // console.log("to", to);
    // console.log("from", from);
    // console.log("next", next);
    // console.log("store", store);
    if (
      to.matched.some(record => record.meta.requireAuth) &&
      !store.getters["userCenter/isSignedIn"]
    ) {
      console.error("You need to be signed in");
      next({ path: "/" });
    } else {
      next();
    }
  });

  return Router;
}

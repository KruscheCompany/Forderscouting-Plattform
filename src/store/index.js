import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import errorDialog from "./errorDialog";
import userCenter from "./userCenter";
import project from "./project";
import general from "./general";
import category from "./category";
import tag from "./tag";
import municipality from "./municipality";
import funding from "./funding";
import implementationChecklist from "./implementationChecklist";

Vue.use(Vuex);
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      errorDialog,
      userCenter,
      project,
      general,
      category,
      tag,
      municipality,
      funding,
      implementationChecklist
    },
    plugins: [
      createPersistedState({
        key: "amt-viot",
        // TODO change this to session storage
        storage: window.sessionStorage
      })
    ],
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  // add this so that we export store

  return Store;
}

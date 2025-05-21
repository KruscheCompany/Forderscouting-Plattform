import Vue from "vue";
import { boot } from "quasar/wrappers";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_MAIN_URL
});
Vue.prototype.$axios = axios;
// ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
//       so you won't necessarily have to import axios in each vue file
Vue.prototype.$api = api;

// ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
//       so you can easily perform requests against your app's API
export default ({ app, store, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  api.interceptors.request.use(config => {
    var token =
      !!store.state.userCenter.user && store.state.userCenter.user.jwt;
    if (token) {
      // Checking if the url is not login because we should have Auth header there. Login witll not work
      if (config.url !== "/api/auth/local") {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        config.headers.Authorization = null;
      }
    }
    return config;
  });
};
export { api, axios };

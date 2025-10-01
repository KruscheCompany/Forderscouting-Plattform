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
  // Helper function to perform logout
  const performLogout = (reason) => {
    console.warn(reason);

    // Clear session storage
    sessionStorage.clear();

    // Redirect to home page
    router.push({ path: "/" });
  };

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

  // Response interceptor to handle authentication errors
  api.interceptors.response.use(
    response => {
      // Return successful responses as-is
      return response;
    },
    error => {
      // Handle response errors
      if (error.response) {
        const { status, data } = error.response;

        // Only handle auth errors if user is currently signed in to avoid infinite loops
        if (store.getters["userCenter/isSignedIn"]) {

          // Handle 401 Unauthorized responses
          if (status === 401) {
            // Check if it's a Strapi v4 error format
            if (data && data.error &&
                (data.error.name === "UnauthorizedError" ||
                 data.error.status === 401 ||
                 data.error.message === "Missing or invalid credentials")) {

              performLogout("Token expired or invalid, logging out user");
            }
          }

          // Handle 403 Forbidden responses (token might be valid but insufficient permissions)
          else if (status === 403) {
            if (data && data.error) {
              // For 403, only logout if it's clearly a token-related issue
              if (data.error.message &&
                  (data.error.message.toLowerCase().includes("token") ||
                   data.error.message.toLowerCase().includes("authentication") ||
                   data.error.message.toLowerCase().includes("jwt"))) {

                performLogout("Authentication token issue, logging out user");
              }
            }
          }
        }
      }

      return Promise.reject(error);
    }
  );
};
export { api, axios };

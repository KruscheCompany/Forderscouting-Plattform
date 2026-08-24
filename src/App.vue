<template>
  <div id="q-app">
    <router-view />
    <CookieConsent />
  </div>
</template>
<script>
import CookieConsent from "components/CookieConsent.vue";

export default {
  name: "App",
  components: {
    CookieConsent
  },
  created() {
    this.$store.watch(
      state => state.general.maintenanceEnabled,
      enabled => {
        this.$router.push(enabled ? "/maintenance" : "/").catch(() => {});
      }
    );
    this.$store.dispatch("general/fetchMaintenanceStatus");
  }
};
</script>

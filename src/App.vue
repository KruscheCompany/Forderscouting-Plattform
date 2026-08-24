<template>
  <div id="q-app">
    <router-view />
    <CookieConsent />
  </div>
</template>
<script>
import CookieConsent from "components/CookieConsent.vue";

const MAINTENANCE_POLL_INTERVAL_MS = 30000;

export default {
  name: "App",
  data() {
    return {
      maintenancePollTimer: null
    };
  },
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
    this.maintenancePollTimer = setInterval(() => {
      if (!this.$store.state.general.maintenanceEnabled) {
        this.$store.dispatch("general/fetchMaintenanceStatus");
      }
    }, MAINTENANCE_POLL_INTERVAL_MS);
  },
  beforeDestroy() {
    clearInterval(this.maintenancePollTimer);
  }
};
</script>

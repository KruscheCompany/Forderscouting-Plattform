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
  data() {
    return {};
  },
  components: {
    CookieConsent
  }
};
</script>

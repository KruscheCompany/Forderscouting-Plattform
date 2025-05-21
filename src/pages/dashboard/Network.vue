<template>
  <q-page class="q-mx-xl q-mt-lg ">
    <network />
  </q-page>
</template>

<script>
import network from "components/network/overview.vue";

export default {
  name: "networkPage",
  components: {
    network
  },
  data() {
    return {
      search: ""
    };
  }
};
</script>

<style lang="scss"></style>

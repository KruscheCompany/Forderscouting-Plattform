<template>
  <q-page class="q-mt-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <overview />
  </q-page>
</template>

<script>
import overview from "components/data/overview.vue";
export default {
  name: "myData",
  components: {
    overview,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss"></style>

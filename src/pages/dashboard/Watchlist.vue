<template>
  <q-page class="q-mt-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <overview />
  </q-page>
</template>

<script>
import overview from "components/watchlist/overview.vue";
export default {
  name: "watchlist",
  components: {
    overview,
  },
  data() {
    return {};
  },
};
</script>

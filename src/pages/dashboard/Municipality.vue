<template>
  <q-page class="q-my-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <municipality />
  </q-page>
</template>

<script>
import municipality from "components/Municipality/municipality.vue";

export default {
  name: "MunicipalityPage",
  components: {
    municipality,
  },
};
</script>

<template>
  <q-page class="q-mt-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <myCommunityData />
  </q-page>
</template>

<script>
import myCommunityData from "components/data/myCommunityData.vue";
export default {
  name: "CommunityData",
  components: {
    myCommunityData
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss"></style>

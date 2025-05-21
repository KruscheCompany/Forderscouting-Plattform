<template>
  <q-page
    class=" q-mt-lg bg-blue-1"
    :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'"
  >
    <FundingContent />
  </q-page>
</template>

<script>
import FundingContent from "components/funding/view/FundingContent.vue";
export default {
  name: "FundingView",
  components: {
    FundingContent
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss">
.carouselThumbnails .q-tabs__arrow--end {
  right: -70px;
  color: $blue;
}
.carouselThumbnails .q-tabs__arrow--start {
  left: -70px;
  color: $blue;
}
</style>

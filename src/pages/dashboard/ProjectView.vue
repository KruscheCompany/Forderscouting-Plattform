<template>
  <q-page class="q-mt-lg bg-blue-1" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <ProjectContent />
  </q-page>
</template>

<script>
import ProjectContent from "components/projects/view/ProjectContent.vue";
export default {
  name: "projectView",
  components: {
    ProjectContent,
  },
  data() {
    return {};
  },
  methods: {},
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

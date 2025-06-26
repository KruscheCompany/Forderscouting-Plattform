<template>
  <q-page class="q-mt-lg bg-blue-1" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <ChecklistContent />
  </q-page>
</template>

<script>
import ChecklistContent from "components/implementationChecklist/view/ChecklistContent.vue";
export default {
  name: "ChecklistView",
  components: {
    ChecklistContent,
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

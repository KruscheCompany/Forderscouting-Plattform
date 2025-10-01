<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.aptitude.title')"
      header-class="bg-white text-black" v-model="expandedAptitude">
      <q-card-section>
        <q-banner rounded class="bg-grey-3 font-16">
          <p class="q-my-sm text-block" v-html="text"></p>
        </q-banner>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectAptitude",
  props: {
    project: {
      type: Object,
      required: true
    },
    currentTab: {
      type: String,
      default: null,
      required: true
    }
  },
  data() {
    return {
      expandedAptitude: this.currentTab === "aptitude",
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'aptitude'
      this.expandedAptitude = newTab === "aptitude";
    }
  },
  computed: {
    // Get the text for the aptitude section
    text() {
      return this.project.details.aptitude || this.$t('projectComponents.aptitude.noRecommendation');
    }
  },
}
</script>

<style lang="scss" scoped></style>

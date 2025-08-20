<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.decision.title')"
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
  name: "ProjectDecision",
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
      expandedAptitude: this.currentTab === "decision",
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'decision'
      this.expandedAptitude = newTab === "decision";
    }
  },
  computed: {
    // Get the text for the decision section
    text() {
      return this.project.details.decision || this.$t('projectComponents.decision.noDecisionAvailable');
    }
  }
}
</script>

<style lang="scss" scoped></style>

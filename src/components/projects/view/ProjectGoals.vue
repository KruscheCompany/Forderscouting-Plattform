<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.goals.title')"
      header-class="bg-white text-black" v-model="expandedGoals">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.goals.description') }}
        </h4>
        <q-banner rounded class="bg-grey-3 font-16">
          <p class="q-my-sm text-block" v-html="goalsText"></p>
        </q-banner>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectGoalsView",
  props: {
    project: {
      type: Object,
      required: true
    },
    currentTab: {
      type: String,
      default: null,
      required: false
    }
  },
  data() {
    return {
      expandedGoals: this.currentTab === "goals",
    };
  },
  computed: {
    goalsText() {
      return this.project && this.project.details && this.project.details.projectDevelopmentGoals 
        ? this.project.details.projectDevelopmentGoals 
        : this.$t('projectComponents.goals.noContent');
    }
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'goals'
      this.expandedGoals = newTab === "goals";
    }
  }
}
</script>

<style lang="scss" scoped>
.text-block {
  white-space: pre-line;
}
</style>

<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20"
      :label="$t('projectComponents.goalsAndRequirements.title')" header-class="bg-white text-black"
      v-model="expandedGoalsAndRequirements">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.goalsAndRequirements.description') }}
        </h4>
        <div>
          <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6" v-model="goalsAndRequirements" />
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectGoalsAndRequirements",
  props: {
    projectData: {
      type: Object,
      required: true
    },
    currentTab: {
      type: String,
      default: null,
      required: true
    },
    createdProjectId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      expandedGoalsAndRequirements: this.currentTab === "goalsAndRequirements",
      goalsAndRequirements: this.projectData.details.goalsAndRequirements || "",
      resetSteps: [
        { name: 'taskPlan', title: 'task plan', icon: 'mdi-checkbox-multiple-marked', done: true },
        { name: 'siteVisit', title: 'site visit', icon: 'mdi-map-marker', done: true },
        { name: 'goalsAndRequirements', title: 'Goals and requirements', icon: 'mdi-target', done: false },
        { name: 'financingCheck', title: 'Financing Check', icon: 'mdi-cash-check', done: false }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      this.expandedGoalsAndRequirements = newTab === "goalsAndRequirements";
    }
  },
  methods: {
    getUpdatedSteps() {
      const currentSteps = this.projectData.projectDevelopmentSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'goalsAndRequirements') {
          return { ...step, done: true };
        }
        return { ...step };
      });
    },

    async submitGoalsAndRequirements() {
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          details: {
            id: this.projectData.details.id,
            goalsAndRequirements: this.goalsAndRequirements
          },
          projectDevelopmentSteps: this.getUpdatedSteps()
        }
      });
      this.$emit("goalsAndRequirements-submitted");
    }
  }
}
</script>

<style lang="scss" scoped></style>

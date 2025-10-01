<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.goals.title')"
      header-class="bg-white text-black" v-model="expandedGoals">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.goals.description') }}
        </h4>
        <div>
          <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6" v-model="goals" />
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectGoals",
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
      expandedGoals: this.currentTab === "goals",
      goals: this.projectData.details.projectDevelopmentGoals || "",
      resetSteps: [
        { name: 'taskPlan', title: 'task plan', icon: 'mdi-checkbox-multiple-marked', done: true },
        { name: 'siteVisit', title: 'site visit', icon: 'mdi-map-marker', done: true },
        { name: 'goals', title: 'goals', icon: 'mdi-target', done: false },
        { name: 'requirements', title: 'requirements', icon: 'mdi-file-document', done: false }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'goals'
      this.expandedGoals = newTab === "goals";
    }
  },
  methods: {
    // Get updated steps with goals marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.projectDevelopmentSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'goals') {
          // Mark goals as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    async submitGoals() {
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          details: {
            id: this.projectData.details.id,
            projectDevelopmentGoals: this.goals
          },
          projectDevelopmentSteps: this.getUpdatedSteps()
        }
      });
      this.$emit("goals-submitted");
    }
  }
}
</script>

<style lang="scss" scoped></style>

<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.decision.title')"
      header-class="bg-white text-black" v-model="expandedAptitude">
      <q-card-section>
        <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6" v-model="decision" />
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectDecision",
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
      expandedAptitude: this.currentTab === "decision",
      decision: this.projectData.details.decision || "",
      resetSteps: [
        { name: 'project', title: 'Project Description', icon: 'description', done: true },
        { name: 'fundingCheck', title: 'Funding Check', icon: 'monetization_on', done: true },
        { name: 'qAndA', title: 'Open Questions', icon: 'help_outline', done: true },
        { name: 'aptitude', title: 'Aptitude', icon: 'check_circle', done: true },
        { name: 'decision', title: 'Basic decision', icon: 'gavel', done: true }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'decision'
      this.expandedAptitude = newTab === "decision";
    }
  },
  methods: {
    // Get updated steps with decision marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.fundingCheckSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'decision') {
          // Mark decision as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    async submitDecision() {
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          details: {
            id: this.$store.state.project.createdProjectIdea.attributes.details.id,
            decision: this.decision
          },
          fundingCheckSteps: this.getUpdatedSteps()
        }
      });
      this.$emit("decision-submitted", this.decision);
    }
  }
}
</script>

<style lang="scss" scoped></style>

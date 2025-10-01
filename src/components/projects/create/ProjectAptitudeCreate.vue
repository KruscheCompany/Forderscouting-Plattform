<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.aptitude.title')"
      header-class="bg-white text-black" v-model="expandedAptitude">
      <q-card-section>
        <div>
          <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6" v-model="aptitude" />
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectAptitude",
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
      expandedAptitude: this.currentTab === "aptitude",
      aptitude: this.projectData.details.aptitude || "",
      resetSteps: [
        { name: 'project', title: 'Project Description', icon: 'description', done: true },
        { name: 'fundingCheck', title: 'Funding Check', icon: 'monetization_on', done: true },
        { name: 'qAndA', title: 'Open Questions', icon: 'help_outline', done: true },
        { name: 'aptitude', title: 'Aptitude', icon: 'check_circle', done: true },
        { name: 'decision', title: 'Basic decision', icon: 'gavel', done: false }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'aptitude'
      this.expandedAptitude = newTab === "aptitude";
    }
  },
  methods: {
    // Get updated steps with aptitude marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.fundingCheckSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'aptitude') {
          // Mark aptitude as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    async submitAptitude() {
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          details: {
            id: this.projectData.details.id,
            aptitude: this.aptitude
          },
          fundingCheckSteps: this.getUpdatedSteps()
        }
      });
      this.$emit("aptitude-submitted", this.aptitude);
    }
  }
}
</script>

<style lang="scss" scoped></style>

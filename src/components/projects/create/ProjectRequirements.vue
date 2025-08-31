<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.requirements.title')"
      header-class="bg-white text-black" v-model="expandedRequirements">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.requirements.description') }}
        </h4>
        <div>
          <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6" v-model="requirements" />
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectRequirements",
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
      expandedRequirements: this.currentTab === "requirements",
      requirements: this.projectData.details.requirements || "",
      resetSteps: [
        { name: 'taskPlan', title: 'task plan', icon: 'mdi-checkbox-multiple-marked', done: true },
        { name: 'siteVisit', title: 'site visit', icon: 'mdi-map-marker', done: true },
        { name: 'goals', title: 'goals', icon: 'mdi-target', done: true },
        { name: 'requirements', title: 'requirements', icon: 'mdi-file-document', done: false }
      ],
      tabs: [
        {
          done: false,
          name: "aiFundingCheck",
          title: "AI funding check"
        },
        {
          done: false,
          name: "projectDevelopment",
          title: "Project development"
        },
        {
          done: false,
          name: "application",
          title: "application"
        }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'requirements'
      this.expandedRequirements = newTab === "requirements";
    }
  },
  methods: {
    // Get updated steps with requirements marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.projectDevelopmentSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'requirements') {
          // Mark requirements as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },
    
    // Get updated tabs with projectDevelopment marked as done
    getUpdatedTabs() {
      // Use existing tabs from projectData if available, otherwise use default tabs
      const currentTabs = this.projectData.applicationProcessSteps || this.tabs;

      return currentTabs.map(tab => {
        if (tab.name === 'projectDevelopment') {
          return { ...tab, done: true };
        }
        // Keep all other tabs as they are
        return { ...tab };
      });
    },

    async submitRequirements() {
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          details: {
            id: this.projectData.details.id,
            requirements: this.requirements
          },
          projectDevelopmentSteps: this.getUpdatedSteps(),
          applicationProcessSteps: this.getUpdatedTabs()
        }
      });
      this.$emit("requirements-submitted", this.requirements);
    }
  }
}
</script>

<style lang="scss" scoped></style>

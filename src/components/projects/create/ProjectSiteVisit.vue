<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.siteVisit.title')"
      header-class="bg-white text-black" v-model="expandedSiteVisit">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.siteVisit.description') }}
        </h4>
        <div>
          <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6" v-model="siteVisit" />
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectSiteVisit",
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
      expandedSiteVisit: this.currentTab === "siteVisit",
      siteVisit: this.projectData.details.siteVisit || "",
      resetSteps: [
        { name: 'taskPlan', title: 'task plan', icon: 'mdi-checkbox-multiple-marked', done: true },
        { name: 'siteVisit', title: 'site visit', icon: 'mdi-map-marker', done: false },
        { name: 'goalsAndRequirements', title: 'Goals and requirements', icon: 'mdi-target', done: false },
        { name: 'financingCheck', title: 'Financing Check', icon: 'mdi-cash-check', done: false }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'siteVisit'
      this.expandedSiteVisit = newTab === "siteVisit";
    }
  },
  methods: {
    // Get updated steps with siteVisit marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.projectDevelopmentSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'siteVisit') {
          // Mark siteVisit as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    async submitSiteVisit() {
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          details: {
            id: this.projectData.details.id,
            siteVisit: this.siteVisit
          },
          projectDevelopmentSteps: this.getUpdatedSteps()
        }
      });
      this.$emit("siteVisit-submitted");
    }
  }
}
</script>

<style lang="scss" scoped></style>
